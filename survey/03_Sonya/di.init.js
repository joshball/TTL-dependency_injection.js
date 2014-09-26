'use strict';

var sonya = require('sonya');

var config = require('config');


var mongoDbConfig = config.get('MongoDb');
var loggerConfig = config.get('Logger');
var serverConfig = config.get('Server');
var userControllerConfig = {};
var userServiceConfig = {};


var Logger = require('../common/Logger/ConsoleLogger');
var MongoMonk = require('../common/MongoDb/MongoMonk');
var UserService = require('../common/Services/UserService');
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
    .service('userController', UserController)
;

