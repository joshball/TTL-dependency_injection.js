'use strict';
var path = require('path');
var fs = require('fs');
var Q = require('q');

var createDatabase = function(){
    var configPath = path.join('..', 'config');
    console.log('configPath', path.resolve(configPath));

//fs.readdir(configPath, function(err, files){
//    console.log('err', err);
//    console.log('result', files);
//    return -1;
//});
    process.env.NODE_CONFIG_DIR = path.resolve(configPath);

    var config = require('config');

//console.log('NODE_ENV: ' + config.util.getEnv('NODE_ENV'));
//console.log('CONFIG_DIR: ' + config.util.getEnv('CONFIG_DIR'));
//console.log('NODE_CONFIG: ' + config.util.getEnv('NODE_CONFIG'));
//console.log('config.util', config.util);

    var mongoDbConfig = config.get('MongoDb');
    console.log('mongoDbConfig', mongoDbConfig);

    var MongoMonk = require('../common/MongoDb/MongoMonk');
    var mongoMonk = new MongoMonk(mongoDbConfig);

    var seedUsers = [
        {id: 1, name: 'Abby', email: 'abby@gmail.com' },
        {id: 2, name: 'Bill', email: 'bill@gmail.com' },
        {id: 3, name: 'Cate', email: 'cate@gmail.com' },
        {id: 4, name: 'Dave', email: 'dave@gmail.com' },
        {id: 5, name: 'Eva', email: 'eva@gmail.com' },
    ];

    var users = mongoMonk.db.get('users');


    users.find({}, function (err, docs) {
        if (err) {
            console.log('ERROR:', err);
            process.exit(-1);
        }
        console.log('Found %d users in db', docs.length);
    });

    var promises = [];
    seedUsers.forEach(function (seedUser) {
            var promise = users.update({ name: seedUser.name }, seedUser, { upsert: true });
            promises.push(promise);
        }
    );

    Q.all(promises)
        .then(function(r){
            console.log('r', r);
            console.log('Upserts are done');
            return users.count();
        })
        .then(function(count){
            console.log('There are %d users', count);
            process.exit(0);
        });

//users.insert(seedUsers)
//    .then(function (result) {
//        console.log('Inserted users:', result);
//        process.exit(0);
//    })
};
module.exports = createDatabase;

