'use strict';

var UserService = function (userServiceConfig, mongoMonk, logger) {

    this.getAllUsers = function(){
        logger.info('UserService.getAllUsers');
        var users = mongoMonk.db.get('users');
        return users.find({},{limit:20});
    };
};

module.exports = UserService;