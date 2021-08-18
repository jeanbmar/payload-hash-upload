const getHashedFilename = require('./get-hashed-filename');
const updateFilename = require('./update-filename');
const getFileHash = require('./get-file-hash');
const fileExists = require('./file-exists');
const incrementName = require('./increment-name');

module.exports = (incomingConfig) => {
    const { collections: incomingCollections } = incomingConfig;
    const collections = incomingCollections.map((incomingCollection) => {
        if (!incomingCollection.upload || !incomingCollection.upload.hash) {
            return incomingCollection;
        }
        const incomingCollectionHooks = incomingCollection.hooks ?? {};
        let beforeChangeCollectionHooks = incomingCollectionHooks.beforeChange ?? [];
        beforeChangeCollectionHooks = beforeChangeCollectionHooks.concat(async ({ data, req }) => {
            const reqFile = req.files && req.files.file ? req.files.file : req.file;
            const hashOptions = typeof incomingCollection.upload.hash !== 'boolean'
                ? incomingCollection.upload.hash
                : undefined;
            // ensure safe filenames
            const hash = getFileHash(reqFile.data, hashOptions);
            let modifiedFilename = reqFile.name;
            let hashedName = getHashedFilename(modifiedFilename, hash);
            while (await fileExists(req.payload, incomingCollection.slug, hashedName)) {
                modifiedFilename = incrementName(modifiedFilename);
                hashedName = getHashedFilename(modifiedFilename, hash);
            }
            // rename root filename everywhere
            updateFilename(data, data.filename, modifiedFilename);
            // append hashes
            data.filename = hashedName;
            if (data.sizes) {
                Object.entries(data.sizes).forEach(([key, resizedFileData]) => {
                    resizedFileData.filename = getHashedFilename(
                        resizedFileData.filename,
                        req.payloadUploadSizes[key],
                        hashOptions,
                    );
                });
            }
            return data;
        });
        // remove hash key to satisfy type checking
        const { hash: remove, ...clonedUpload } = incomingCollection.upload;
        return {
            ...incomingCollection,
            upload: {
                ...clonedUpload,
            },
            hooks: {
                ...incomingCollectionHooks,
                beforeChange: beforeChangeCollectionHooks,
            },
        };
    });
    return {
        ...incomingConfig,
        collections,
    };
};
