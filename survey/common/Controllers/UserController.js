'use strict';

var UserController = function (userControllerConfig, userService, logger) {

    this.getUsers = function(request, response){
        logger.info('UserController:getUsers');
        userService.getAllUsers()
            .then(function(users){
                logger.info(users);
                response.json(users);
            });
    };
};

module.exports = UserController;