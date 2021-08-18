const path = require('path');
const getFileHash = require('./get-file-hash');

module.exports = (filename, data, options) => {
    const hash = data instanceof Buffer ? getFileHash(data, options) : data;
    const ext = path.extname(filename);
    const basename = path.basename(filename, ext);
    return `${basename}.${hash}${ext}`;
};
