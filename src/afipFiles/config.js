require('dotenv').config({ path: process.env.ENV_PATH || '.env' });

const afipProduction = ['1', 'true'].includes(String(process.env.AFIP_PRODUCTION || '').toLowerCase());

module.exports = {
    cuit: Number(process.env.AFIP_CUIT || 20315422354),
    cert: process.env.AFIP_CERT || '/homo_wsass_20260309_201329.crt',
    key: process.env.AFIP_KEY || '/clave_wsass_homo_20260309_201329.key',
    production: afipProduction,
};
