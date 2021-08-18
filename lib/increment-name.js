const sanitize = require('sanitize-filename');

module.exports = (name) => {
    const extension = name.split('.').pop();
    const baseFilename = sanitize(name.substr(0, name.lastIndexOf('.')) || name);
    let incrementedName = baseFilename;
    const regex = /(.*)-(\d)$/;
    const found = baseFilename.match(regex);
    if (found === null) {
        incrementedName += '-1';
    } else {
        const matchedName = found[1];
        const matchedNumber = found[2];
        const incremented = Number(matchedNumber) + 1;
        incrementedName = `${matchedName}-${incremented}`;
    }
    return `${incrementedName}.${extension}`;
};
