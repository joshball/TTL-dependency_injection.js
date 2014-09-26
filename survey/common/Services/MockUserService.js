'use strict';
var Q = require('q');

var UserService = function (userServiceConfig, mongoMonk, logger) {

    var mockUsers = [
        {id: 1, name: 'Mock Abby', email: 'abby@mockmail.com' },
        {id: 2, name: 'Mock Bill', email: 'bill@mockmail.com' },
        {id: 3, name: 'Mock Cate', email: 'cate@mockmail.com' },
        {id: 4, name: 'Mock Dave', email: 'dave@mockmail.com' },
        {id: 5, name: 'Mock Eva', email: 'eva@mockmail.com' },
    ];

    this.getAllUsers = function(){
        var deferred = Q.defer();
        logger.info('UserService.getAllUsers');
        deferred.resolve(mockUsers);
        return deferred.promise;
    };
};

module.exports = UserService;