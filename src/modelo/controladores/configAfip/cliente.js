const Afip = require('@afipsdk/afip.js');
const fs = require('fs');
const path = require('path');
const config = require('../../../afipFiles/config');

const afipFilesDir = path.resolve(__dirname, '../../../afipFiles');

function readPem(value) {
    if (!value) return undefined;

    const raw = String(value).trim();

    if (
        raw.includes('BEGIN CERTIFICATE') ||
        raw.includes('BEGIN PRIVATE KEY') ||
        raw.includes('BEGIN RSA PRIVATE KEY') ||
        raw.includes('BEGIN EC PRIVATE KEY')
    ) {
        return raw;
    }

    const normalized = raw.replace(/^[/\\]+/, '');
    const candidates = [
        raw,
        path.resolve(afipFilesDir, raw),
        path.resolve(afipFilesDir, normalized),
        path.resolve(afipFilesDir, path.basename(raw))
    ];

    for (const candidate of candidates) {
        if (fs.existsSync(candidate)) {
            return fs.readFileSync(candidate, { encoding: 'utf8' });
        }
    }

    return raw;
}

const accessToken = String(config.access_token || process.env.AFIPSDK_ACCESS_TOKEN || '').trim();

const options = {
    CUIT: config.cuit,
    cert: readPem(config.cert),
    key: readPem(config.key),
    production: config.production
};

if (accessToken) {
    options.access_token = accessToken;
}

const afip = new Afip(options);

module.exports = afip;
