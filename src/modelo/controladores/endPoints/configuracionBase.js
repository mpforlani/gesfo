const express = require('express');
const router = express.Router();
const { db, resetDb } = require('../../../dbConfig');
//Direcciones
const Acumulador = require(`../../models/Acumulador`)
const Numerador = require(`../../models/Numerador`);

const { generarFechasCotis, obtenerBNAporFecha, monedasCotis } = require(`../funcionesBack`)

//Acumuladores
router.get('/acumulador', async (req, res) => {

    let filtros = JSON.parse(req.query.filtros)
    let periodoHasta = filtros.periodo

    delete filtros.periodo
    let objetoGroup = JSON.parse(req.query.objetoGroup)

    const saldoTotal = await Acumulador.aggregate([
        {
            $match: {
                ...filtros,
                periodo: { $lte: periodoHasta }

            }
        },

        ...objetoGroup
    ])

    res.json(saldoTotal);
})
router.put('/putAcumulador', async (req, res) => {
    try {

        let enviar = req.body;
        console.log(enviar)
        delete enviar._id;

        // Encuentra y actualiza el documento usando el modelo "Usuario"
        let update = {
            $inc: Object.assign(enviar.atributosNoRequeridos || {}, enviar.atributosTotales || {}),
            // Incrementa el saldo en 800 si el registro existe0
            $setOnInsert: enviar.agrupadores, // Establece los atributos y el saldo si el registro no existe
            $set: {
                username: req.user._id,
                date: enviar.date,
            },
        };

        let options = { upsert: true }; // Opción "upsert" establecida en true para crear el registro si no existe
        let filter = enviar.agrupadores; // Filtro de búsqueda por los atributos nombre, mes y ano

        let updt = await Acumulador.updateOne(filter, update, options);

        if (updt.upsertedCount > 0 && Object.values(enviar?.atributosTotales || {}).length > 0) {

            let filtroAnt = { ...filter }
            delete filtroAnt.periodo

            //  const nuevoId = updt.upsertedId;
            const anterior = await Acumulador.findOne({
                ...filtroAnt,
                periodo: { $lt: enviar.agrupadores.periodo }
            })
                .sort({ periodo: -1 })
                .lean();

            let atributosAct = new Object
            for (const [atributo, value] of Object.entries(enviar.atributosTotales)) {

                atributosAct[atributo] = anterior?.[atributo] || 0
            }

            let updateUpd = {

                $inc: atributosAct, // Incrementa el saldo en 800 si el registro existe
                $set: {
                    username: req.user._id,
                    date: enviar.date,
                },
            };

            let updtAnt = await Acumulador.updateOne(filter, updateUpd);

        }


        res.json({
            mensaje: `El item fue actualizado con éxito`,
            posteo: enviar,
            actualizado: updt,

        });
    } catch (error) {
        const ahora = new Date();
        const fechaHora = ahora.toLocaleString('es-AR', {
            timeZone: 'America/Argentina/Cordoba'
        });
        console.log(fechaHora)
        console.log("Acumulador")
        console.log(req?.query)
        console.log(req?.user?.name)
        console.log(error)
        console.log("Stack")
        console.log(error.stack)
        res.json(error.stack);
    }
});
router.put('/actualizaTotalesAcum', async (req, res) => {
    try {

        let enviar = req.body;
        console.log(enviar)
        let filtro = { ...enviar.agrupadores };
        delete filtro.periodo;
        delete filtro.cantidadTotal
        //filtro.nombre
        filtro.periodo = { $gt: enviar.agrupadores.periodo };
        const resultado = await Acumulador.updateMany(
            filtro,
            {

                $inc: enviar.atributosTotales,
                $set: {
                    username: req.user._id,
                    date: enviar.date
                }
            }
        );
        res.json({
            mensaje: 'Acumuladores mayores incrementados correctamente',
            incrementos: enviar.atributosTotales,
            modificados: resultado.modifiedCount

        });

    } catch (error) {
        const ahora = new Date();
        const fechaHora = ahora.toLocaleString('es-AR', {
            timeZone: 'America/Argentina/Cordoba'
        });
        console.log(fechaHora)
        console.log("AcumuladorTotales")
        console.log(req?.query)
        console.log(req?.user?.name)
        console.log(error)
        console.log("Stack")
        console.log(error.stack)
        res.json(error.stack);
    }
});
//Numerador 
router.put('/numerador', async (req, res) => {
    try {
        const name = req.body.name
        let enviar = req.body;
        const username = req.user._id;
        delete enviar.name

        const filter = {
            name,
            empresa: enviar.empresa
        };

        for (const [indice, value] of Object.entries(enviar)) {

            filter[indice] = value
        }

        // Encuentra y actualiza el documento usando el modelo "Usuario"
        let update = {
            $inc: { numerador: 1 }, // Incrementa el numerdor y el ancla, en caso que sea pasado
            $setOnInsert: { name }, // Establece los atributos y el saldo si el registro no existe
            $set: {
                username,
                ...enviar
            },
        };

        let options = { upsert: true, new: true }; // Opción "upsert" establecida en true para crear el registro si no existe
        let updt = await Numerador.findOneAndUpdate(filter, update, options);

        res.json({
            mensaje: `El item fue actualizado con éxito`,
            posteo: enviar,
            actualizado: updt,

        });
    } catch (error) {
        const ahora = new Date();
        const fechaHora = ahora.toLocaleString('es-AR', {
            timeZone: 'America/Argentina/Cordoba'
        });
        console.log(fechaHora)
        console.log("Numerador")
        console.log(req?.query)
        console.log(req?.user?.name)
        console.log(error)
        console.log("Stack")
        console.log(error.stack)
        res.json(error.stack);
    }
});
router.put('/decNumerador', async (req, res) => {
    try {
        const name = req.body.name
        let enviar = req.body;
        const username = req.user._id;
        delete enviar.name

        const filter = {
            name
        };

        for (const [indice, value] of Object.entries(enviar)) {

            filter[indice] = value
        }

        // Encuentra y actualiza el documento usando el modelo "Usuario"
        let update = {
            $inc: { numerador: -1 }, // Incrementa el numerdor y el ancla, en caso que sea pasado
            $setOnInsert: { name }, // Establece los atributos y el saldo si el registro no existe
            $set: {
                username,
                ...enviar
            },
        };

        let options = { upsert: true, new: true }; // Opción "upsert" establecida en true para crear el registro si no existe

        let updt = await Numerador.findOneAndUpdate(filter, update, options);

        res.json({
            mensaje: `El item fue actualizado con éxito`,
            posteo: enviar,
            actualizado: updt,

        });
    } catch (error) {
        const ahora = new Date();
        const fechaHora = ahora.toLocaleString('es-AR', {
            timeZone: 'America/Argentina/Cordoba'
        });
        console.log(fechaHora)
        console.log("decNumerador")
        console.log(req?.query)
        console.log(req?.user?.name)
        console.log(error)
        console.log("Stack")
        console.log(error.stack)
        res.json(error.stack);
    }
});
router.put('/numeradorAbosoluto', async (req, res) => {//Lo uso para poner numeros absolutos forzados como ejemplo en factura electronica
    try {
        const name = req.body.name
        let enviar = req.body;
        let numerador = req.body.numerador
        const username = req.user._id;
        delete enviar.name
        delete enviar.numerador

        const filter = {
            name
        };

        for (const [indice, value] of Object.entries(enviar)) {

            filter[indice] = value
        }

        // Encuentra y actualiza el documento usando el modelo "Usuario"
        let update = {
            $setOnInsert: { name }, // Establece los atributos y el saldo si el registro no existe
            $set: {
                username,
                numerador,
                ...enviar
            },
        };

        let options = { upsert: true, new: true }; // Opción "upsert" establecida en true para crear el registro si no existe

        let updt = await Numerador.findOneAndUpdate(filter, update, options);

        res.json({
            mensaje: `El item fue actualizado con éxito`,
            posteo: enviar,
            actualizado: updt,

        });
    } catch (error) {
        const ahora = new Date();
        const fechaHora = ahora.toLocaleString('es-AR', {
            timeZone: 'America/Argentina/Cordoba'
        });
        console.log(fechaHora)
        console.log("Numerador Absoluto")
        console.log(req?.query)
        console.log(req?.user?.name)
        console.log(error)
        console.log("Stack")
        console.log(error.stack)
        res.json(error.stack);
    }
});
router.get('/dbinfo', (req, res) => {
    res.json({ database: db });
});
router.post('/__resetdb', express.json(), async (req, res) => {
    try {
        if (process.env.DB_NAME !== process.env.DB_NAMETEST) {
            return res.status(400).json({ ok: false, error: `Protección: DB_NAME=${process.env.DB_NAME} (no es ${process.env.DB_NAMETEST})` });
        }
        const { mode = 'drop', keep = [], only = [] } = req.body || {};
        await resetDb({ mode, keep, only });
        res.json({ ok: true });
    } catch (e) {
        res.status(500).json({ ok: false, error: String(e.message || e) });
    }
});
router.post('/log-frontend-error', (req, res) => {
    try {
        const { tipo, mensaje, archivo, linea, columna, stack } = req.body;
        const userName = req.user?.usernameUser || 'anon';

        const ahora = new Date();
        const fechaHora = ahora.toLocaleString('es-AR', {
            timeZone: 'America/Argentina/Cordoba'
        });
        console.log(fechaHora)
        console.log(userName)
        console.error(
            `[${fechaHora}][FRONT][USER:${userName}] ${tipo}, el error es ${archivo} en linea:${linea} columna:${columna}, STACK → ${stack || mensaje}`
        );

        res.json({ ok: true });

    } catch (error) {


        const ahora = new Date();
        const fechaHora = ahora.toLocaleString('es-AR', {
            timeZone: 'America/Argentina/Cordoba'
        });

        const userName = req.user?.usernameUser || 'anon';
        console.error(
            `[${fechaHora}] [BACK][USER:${userName}] STACK → ${error.stack}`
        );
        res.json(error.stack);

    }
});
//Cotizacions
router.get('/cotizaciones', async (req, res) => {
    try {

        let filtros = JSON.parse(req.query?.filtros)
        const fechas = generarFechasCotis(req.query.desde || filtros?.cabecera?.fecha?.desde, req.query.hasta || filtros?.cabecera?.fecha?.hasta);
        const monedas = monedasCotis(req.query.moneda || filtros?.cabecera?.moneda);
        const historico = await obtenerBNAporFecha(fechas, monedas);

        let objetoHisto = historico.reduce((acc, item) => {
            if (!acc[item.moneda]) acc[item.moneda] = [];
            acc[item.moneda].push({
                fecha: item.fecha,
                compra: item.compra,
                venta: item.venta
            });
            return acc;
        }, {});

        res.json(objetoHisto);

    } catch (error) {
        const ahora = new Date();
        const fechaHora = ahora.toLocaleString('es-AR', {
            timeZone: 'America/Argentina/Cordoba'
        });
        console.log(fechaHora)
        console.log("cotizaciones")
        console.log(req?.query)
        console.log(req?.user?.name)
        console.log(error)
        //   console.error(`[${fechaHora}][BACK][USER:${req.user?.usernameUser || 'anon'}] STACK → ${error.stack}`);
        res.json(error.stack);
    }

});

module.exports = router;