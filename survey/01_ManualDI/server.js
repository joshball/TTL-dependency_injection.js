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

var Server = function(){

    var self = this;

    this.expressApp = undefined;

    this.init = function(){
        var deferred = Q.defer();

        self.expressApp = express();

        var Logger = require('../common/Logger/ConsoleLogger');
        var logger = new Logger(loggerConfig);

        var MongoMonk = require('../common/MongoDb/MongoMonk');
        var mongoMonk = new MongoMonk(mongoDbConfig);

        var UserService = require('../common/Services/UserService');
        var userService = new UserService({}, mongoMonk, logger);

        var UserController = require('../common/Controllers/UserController');
        var userController = new UserController({}, userService, logger);

        self.expressApp.get('/users', userController.getUsers);

        deferred.resolve(self);

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