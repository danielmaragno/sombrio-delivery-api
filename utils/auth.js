var crypto = require('crypto');
var bcrypt = require('bcrypt');
var fs = require('fs');
var jwt = require('jsonwebtoken');



//
//	Password operations
//
exports.geraSalt = function() {
    var saltRounds = 14;
    var salt = bcrypt.genSaltSync(saltRounds);
    return salt;
};

exports.generatePasswordHash = function(password) {
    var salt = exports.geraSalt();
    var bcryptHash = bcrypt.hashSync(password, salt);
    return bcryptHash;
};

exports.comparePasswords = function(plainPw, hashPw) {
    var comparePw = bcrypt.compareSync(plainPw, hashPw);
    return comparePw;
};


//
//	Token operations
//


exports.generateToken = function(user) {
    // Read secret key
    var secret = readTokenSecret();
    // generate token by User userId and email
    var token = jwt.sign({ "_id": user._id, "scope": user.scope }, secret);

    return token;
};

exports.decodeToken = function(token, callback) {
    jwt.verify(token, readTokenSecret(), function(err, decoded) {
        if (err) callback(err)
        else callback(null, decoded);
    });
};