const jwt = require('jsonwebtoken');
const { secret } = require('../config')

exports.tokenSign = function name(data, done) {
    jwt.sign(
        { data }, secret, { expiresIn: '1h' },
        function (err, token) {
            done(err, token)
        });
}

exports.tokenVerify = function name(token, done) {
    jwt.verify(token, secret, function (err, decoded) {
        done(err, decoded)
    });
}