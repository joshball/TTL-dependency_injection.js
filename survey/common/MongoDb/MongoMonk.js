'use strict';

var MongoMonk = function (mongoDbConfig) {

    if(!mongoDbConfig.server || !mongoDbConfig.port || !mongoDbConfig.dbName){
        throw new Error('missing config (server/port/dbName)');
    }

    var getUrl = function(){
        var serverAndPort = mongoDbConfig.server + ':' + mongoDbConfig.port;
        var unpw = mongoDbConfig.user ? mongoDbConfig.user + ':' + mongoDbConfig.pass : '';
        var serverPart = ( unpw ? unpw + '@' : '' ) + serverAndPort;
        return serverPart + '/' + mongoDbConfig.dbName;
    };

    this.url = getUrl();
    console.log('MONGODB: ',this.url);
    this.db  = require('monk')(this.url);

};

module.exports = MongoMonk;