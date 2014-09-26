'use strict';

var Logger = function (loggerConfig) {

    var levels = {
        debug: 4,
        info: 3,
        warn: 2,
        error: 1,
        abort: 0
    };
    console.log('config:', loggerConfig);

    var currentLevel = levels[loggerConfig.level] || 2;

    this.debug = function(msg){
        if(currentLevel >= levels.debug){
            console.log('[debug]: ', msg);
        }
    };
    this.info = function(msg){
        if(currentLevel >= levels.info){
            console.log('[info]: ', msg);
        }
    };
    this.warn = function(msg){
        if(currentLevel >= levels.warn){
            console.log('[*warn*]: ', msg);
        }
    };
    this.error = function(msg){
        if(currentLevel >= levels.error){
            console.log('[**error**]: ', msg);
        }
    };
};

module.exports = Logger;