const fs = require('fs');
const path = require('path')

module.exports.validateManifest = (file, manifest) => {
    const validMimeTypes = manifest.mimeTypes || [];
    const maxSize = manifest.maxSize || Infinity;
    const validFileNames = manifest.fileNames || [];

    if (!validMimeTypes.includes(file.mimetype)) {
        return false;
    }
    if (file.size > maxSize) {
        return false;
    }
    if (!validFileNames.includes(file.originalname)) {
        return false;
    }
    return true;
}

module.exports.getMimeType = (filename) => {
    const ext = path.extname(filename).toLowerCase();
    const mimeTypes = {
        '.json': 'application/json',
    };
    return mimeTypes[ext] || 'application/octet-stream';
}