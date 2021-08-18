# Append a hash to upload filenames in Payload CMS, and optimize your CDN caching strategy

This plugin ensures safe filenames with PayloadCMS database.  
Resized images are properly supported.

## Install

`npm install payload-hash-upload`

## Get Started

### Enable plugin in Payload CMS config

```js
import { buildConfig } from 'payload/config';
import hashUpload from 'payload-hash-upload';

export default buildConfig({
  // ...
  plugins: [
      hashUpload,
  ],
});
```

### Configure your upload collections

```js
const Media = {
  slug: 'media',
  upload: {
    staticURL: '/assets',
    staticDir: 'assets',
    hash: {
      algorithm: 'md5', // any algo compatible with Node.js crypto.createHash
      truncate: 10, // optional, for shorter hashes
    },
  },
};

export default Media;
```

### Result 

```
chnux.png -> chnux.9cdfb439c7.png
```
