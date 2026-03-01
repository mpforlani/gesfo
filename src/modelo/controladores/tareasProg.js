const cron = require('node-cron');
const baseDeDatos = require(`./baseDeDatos`);

async function iniciarTareasCron() {
    cron.schedule('00 00 * * *', async () => {//Todos los días a las 00:00hschat

        const dia = new Intl.DateTimeFormat('es-AR', { weekday: 'long' }).format(new Date());
        let registrosDias = await baseDeDatos.TareasProgramadas.find({ [dia]: "true" })

        for (let registro of registrosDias) {

            for (let usuarios of registro.userAsignado) {

                await baseDeDatos.User.updateOne({ _id: usuarios }, {
                    $addToSet: { tareasProgramadas: registro.funcionTarea }
                })
            }

        }
    })
}

module.exports = iniciarTareasCron;