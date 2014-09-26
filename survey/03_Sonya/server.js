'use strict';
var express = require('express');
var util = require('util');
var Q = require('q');

//console.log('CONFIG_DIR: ' + config.util.getEnv('CONFIG_DIR'));
//console.log('NODE_CONFIG: ' + config.util.getEnv('NODE_CONFIG'));

var sonya = require('sonya');

var Server = function(useMocks){

    var self = this;

    this.serverConfig = undefined;
    this.expressApp = undefined;

    require('./di.init');
    if(useMocks){
        require('./di.init.mocks');
    }

    this.init = function(){
        var deferred = Q.defer();

        self.expressApp = express();

        sonya.Injector.invoke(function(userController, serverConfig){
            self.serverConfig = serverConfig;
            self.expressApp.get('/users', userController.getUsers);
            deferred.resolve(self);
        });

        return deferred.promise;
    };

    this.start = function(){
        var deferred = Q.defer();
        var server = self.expressApp.listen(self.serverConfig.port, function(){
            console.log('Listening on port %d', server.address().port);
            deferred.resolve(server);
        });
        return deferred.promise;
    };

    this.test = function(){
        var deferred = Q.defer();
        var restler = require('restler');
        var url = util.format('http://%s:%d/users', self.serverConfig.host, self.serverConfig.port);
        restler.get(url).on('complete', function(users) {
            console.log('CLIENT: %s returned %d users', url, users.length);
            deferred.resolve(users);
        });
        return deferred.promise;
    };
};

module.exports = Server;