const cron = require('node-cron');
const baseDeDatos = require(`./baseDeDatos`);



function confSocket(io) {
    //io.on('connection', (socket) => { });

    // Todos los viernes a las 15:00hs
    // cron.schedule('00 00 * * *', () => {
    //     console.log('Generando reporte de viernes...');
    // io.emit('generar-reporte-viernes');
    //});
}

module.exports = confSocket

