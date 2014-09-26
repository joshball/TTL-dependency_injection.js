'use strict';
var express = require('express');
var util = require('util');
var Q = require('q');
var config = require('config');

//console.log('CONFIG_DIR: ' + config.util.getEnv('CONFIG_DIR'));
//console.log('NODE_CONFIG: ' + config.util.getEnv('NODE_CONFIG'));

var mongoDbConfig = config.get('MongoDb');
var loggerConfig = config.get('Logger');
var serverConfig = config.get('Server');
var userControllerConfig = {};
var userServiceConfig = {};

var sonya = require('sonya');


var Server = function(){

    var self = this;

    this.expressApp = undefined;

    this.init = function(){
        var deferred = Q.defer();

        self.expressApp = express();

        var Logger = require('../common/Logger/ConsoleLogger');
        var MongoMonk = require('../common/MongoDb/MongoMonk');
        var UserService = require('../common/Services/UserService');
        var MockUserService = require('../common/Services/MockUserService');
        var UserController = require('../common/Controllers/UserController');

        sonya.Provide

            .value('loggerConfig', loggerConfig)
            .value('mongoDbConfig', mongoDbConfig)
            .value('serverConfig', serverConfig)
            .value('userControllerConfig', userControllerConfig)
            .value('userServiceConfig', userServiceConfig)

            .service('logger', Logger)
            .service('mongoMonk', MongoMonk)
            .service('userService', UserService)
            .service('userService', MockUserService)
            .service('userController', UserController)
        ;

        sonya.Injector.invoke(function(userController){
            self.expressApp.get('/users', userController.getUsers);
            deferred.resolve(self);
        });

        return deferred.promise;
    };


    this.start = function(){
        var deferred = Q.defer();
        var server = self.expressApp.listen(serverConfig.port, function(){
            console.log('Listening on port %d', server.address().port);
            deferred.resolve(server);
        });
        return deferred.promise;
    };

    this.test = function(){
        var deferred = Q.defer();
        var restler = require('restler');
        var url = util.format('http://%s:%d/users', serverConfig.host, serverConfig.port);
        restler.get(url).on('complete', function(users) {
            console.log('CLIENT: %s returned %d users', url, users.length);
            deferred.resolve(users);
        });
        return deferred.promise;
    };
};

module.exports = Server;