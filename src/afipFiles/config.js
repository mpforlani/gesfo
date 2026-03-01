
const fs = require('fs');
const path = require('path');

// Ruta absoluta de los archivos
const certPath = fs.readFileSync(path.join(__dirname, 'holog-prueba.crt'), { encoding: 'utf8' });
const keyPath = fs.readFileSync(path.join(__dirname, 'clave.key'), { encoding: 'utf8' });

// Exportar config
module.exports = {
    cuit: 20315422354, // Reemplazar por tu CUIT
    cert: certPath,
    key: keyPath,
    production: false // true si querés usar entorno real
};