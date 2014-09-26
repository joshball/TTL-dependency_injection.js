'use strict';
var sonya = require('sonya');
var MockUserService = require('../common/Services/MockUserService');
sonya.Provide.service('userService', MockUserService);

