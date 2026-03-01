const Afip = require('@afipsdk/afip.js'); // ✅ nombre correcto
const config = require('../../../afipFiles/config');
const fs = require('fs');
const afip = new Afip({
    CUIT: config.cuit,
    cert: config.cert,
    key: config.key,
    production: config.production
});

module.exports = afip;