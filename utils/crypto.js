const crypto = require('crypto');
const config = require('../config/secrets');

const algorithm = config.crypto.algorithm;
const password = config.crypto.password;

exports.encrypt = function (text) {
    const cipher = crypto.createCipher(algorithm, password);
    let crypted = cipher.update(String(text), 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
};


exports.decrypt = function (encrypted) {
    if (typeof encrypted !== 'undefined' && encrypted !== 'null') {
        const decipher = crypto.createDecipher(algorithm, password);
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } else {
        return encrypted;
    }
};