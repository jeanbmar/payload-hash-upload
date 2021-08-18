const crypto = require('crypto');

module.exports = (buffer, options = {}) => {
    const {
        algorithm = 'md5',
        truncate = 0,
    } = options;
    const hash = crypto.createHash(algorithm).update(buffer).digest('hex');
    if (truncate > 0) {
        return hash.substring(0, truncate);
    }
    return hash;
};
