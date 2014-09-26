'use strict';
var path = require('path');
var configPath = path.join('.', 'config');
//console.log('configPath', path.resolve(configPath));
//process.env.NODE_ENV = 'production';
process.env.NODE_CONFIG_DIR = path.resolve(configPath);


var ManualDiServer = require('./01_ManualDI/server');
var SonyaDiServer = require('./03_Sonya/server');
//var ScatterServer = require('./02_Scatter/server');

//var server = new ManualDiServer();
var server = new SonyaDiServer();

server.init()
    .then(function(){
        return server.start();
    })
    .then(function(){
        return server.test();
    })
    .then(function(){
        process.exit(0);
    });
