var express = require('express')
    , User = require('../lib/user')
    , Photo = require('../lib/photo');

exports.auth = express.basicAuth(User.authenticate);
//exports.auth = function(req, res, next) {
//    var auth;
//
//    // check whether an autorization header was send
//    if (req.headers.authorization) {
//        // only accepting basic auth, so:
//        // * cut the starting "Basic " from the header
//        // * decode the base64 encoded username:password
//        // * split the string at the colon
//        // -> should result in an array
//        auth = new Buffer(req.headers.authorization.substring(6), 'base64').toString().split(':');
//    }
//
//    // checks if:
//    // * auth array exists
//    // * first value matches the expected user
//    // * second value the expected password
//    if (!auth || auth[0] !== 'testuser' || auth[1] !== 'testpassword') {
//        // any of the tests failed
//        // send an Basic Auth request (HTTP Code: 401 Unauthorized)
//        res.statusCode = 401;
//        // MyRealmName can be changed to anything, will be prompted to the user
//        res.setHeader('WWW-Authenticate', 'Basic realm="MyRealmName"');
//        // this will displayed in the browser when authorization is cancelled
//        res.end('Unauthorized');
//    } else {
//        // continue with processing, user was authenticated
//        next();
//    }
//};


exports.user = function(req, res, next) {
    User.get(req.params.id, function(err, user) {
        if (err) return next(err);
        if (!user.id) return res.send(404);
        res.send(user);
    });
};

exports.photos = function(req, res, next) {
    var page = req.page;
    Photo.getRange(page.from, page.to, function(err, photos) {
        if (err) return next(err);
        res.format({
            json: function() {
                res.send(photos);
            },

            xml: function() {
                res.render('photos/xml.ejs', { photos: photos });
            }
        })
    });
};

exports.photo = function(req, res, next) {
    Photo.get(req.params.id, function(err, photo) {
        if (err) return next(err);
        if (!photo.id) return res.send(404);
        res.send(photo);
    });
};