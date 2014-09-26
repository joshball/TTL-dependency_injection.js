'use strict';

var parser = require('nomnom');
var ManualDiServer = require('./01_ManualDI/server');
var SonyaDiServer = require('./03_Sonya/server');

// we have to setup configuration paths for the server...
var path = require('path');
var configPath = path.join('.', 'config');
//console.log('configPath', path.resolve(configPath));
process.env.NODE_CONFIG_DIR = path.resolve(configPath);


parser.command('setup')
    .callback(function (opts) {
        var createDb = require('./00_Setup/createDb');
        createDb(opts);
    })
    .help('Setup the DB for first time use');

parser.command('run')
    .options({
        di: {
            abbr: 'd',
            full: 'di',
            required: true,
            choices: ['manual', 'sonya'],
            help: 'The DI Module to use'
        },
        env: {
            abbr: 'e',
            full: 'env',
            default: 'development',
            choices: ['development', 'test', 'production'],
            help: 'The environment to run the server in'
        },
        useMocks: {
            abbr: 'm',
            full: 'use-mocks',
            flag: true,
            help: 'Have the DI system use mocks instead of real modules'
        }
    })
    .callback(function (opts) {
        process.env.NODE_ENV = opts.env;

        var Server = ManualDiServer;

        switch(opts.di){
            case 'manual':
                Server = ManualDiServer;
                break;
            case 'sonya':
                Server = SonyaDiServer;
                break;
        }
        if(opts.useMocks){
            console.log('USING MOCKS');
        } else {
            console.log('USING REAL MODULES');
        }
        var server = new Server(opts.useMocks);

        server.init()
            .then(function () {
                return server.start();
            })
            .then(function () {
                return server.test();
            })
            .then(function () {
                process.exit(0);
            });
    })
    .help('Run a test with the chosen DI system');

parser.parse();