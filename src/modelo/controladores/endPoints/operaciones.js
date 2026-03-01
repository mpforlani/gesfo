const express = require('express');
const router = express.Router();
const fs = require('fs');
//Direcciones
const { capitalize, makeObjects, updateObjects, sortObject, plancharObjeto, guardAdjunto, totalesReportes, unwind, version } = require(`../funcionesBack`)
const path = require("path");

function addField(campo) {

    if (Object.keys(campo).length == 0) { return null }

    return campo
}
let baseDeDatos = require(`../baseDeDatos`);
const crearFechaUTC = (str) => {
    const [y, m, d] = str.split('-').map(Number);

    // Asegurar dos dígitos para mes y día
    const mm = m.toString().padStart(2, '0');
    const dd = d.toString().padStart(2, '0');

    return new Date(`${y}-${mm}-${dd}T00:00:00.000Z`);
};
router.get('/marketp', (req, res) => {
    res.render('inicio/market');
});
//Tablas doble
router.post('/postDoble', async (req, res) => {
    try {
        delete req.body._id

        let dataBase = baseDeDatos[capitalize(req.query.base)] || baseDeDatosApp[capitalize(req.query.base)]
        let keys = Object.keys(req.body);

        let enviar = { ...req.body }

        let newPost = new dataBase(enviar)

        for (let x = 0; x < keys.length; x++) {

            let nameSplit = keys[x].split(" ");

            if (nameSplit.length > 1) {

                newPost[nameSplit[0]] = newPost[nameSplit[0]] || new Object
                newPost[nameSplit[0]][nameSplit[1]] = req.body[keys[x]]

            } else {

                newPost[keys[x]] = req.body[keys[x]]
            }
        }
        newPost.username = req.user._id;
        newPost.habilitado = true;

        let newDateDoble = await newPost.save();

        res.json({
            mensaje: `El grupo de seguridad fue registrado con exito`,
            posteo: newDateDoble
        });

    } catch (error) {
        const ahora = new Date();
        const fechaHora = ahora.toLocaleString('es-AR', {
            timeZone: 'America/Argentina/Cordoba'
        });
        console.log(fechaHora)
        console.log(req?.query)
        console.log(req?.user?.name)
        console.log(error)
        console.error(`[BACK][USER:${req.user?.usernameUser || 'anon'}] STACK → ${error.stack}`);
        res.json(error.stack);
    }
})
router.put('/putDoble', async (req, res) => {
    try {
        let { _id } = req.body

        let dataBase = baseDeDatos[capitalize(req.query.base)] || baseDeDatosApp[capitalize(req.query.base)]
        let keys = Object.keys(req.body);

        let grupoDeSeguridad = new Object

        for (let x = 0; x < keys.length; x++) {

            let nameSplit = keys[x].split(" ");

            if (nameSplit.length > 1) {

                grupoDeSeguridad[nameSplit[0]] = grupoDeSeguridad[nameSplit[0]] || new Object
                grupoDeSeguridad[nameSplit[0]][nameSplit[1]] = req.body[keys[x]]

            } else {

                grupoDeSeguridad[keys[x]] = req.body[keys[x]]
            }
        }
        grupoDeSeguridad.username = req.user._id

        let groupAct = await dataBase.findByIdAndUpdate(_id,
            { $set: grupoDeSeguridad });


        res.json({
            mensaje: `El grupo de seguridad fue actualizado con exito`,
            posteo: groupAct
        });

    } catch (error) {
        const ahora = new Date();
        const fechaHora = ahora.toLocaleString('es-AR', {
            timeZone: 'America/Argentina/Cordoba'
        });
        console.log(fechaHora)
        console.log(req?.query)
        console.log(req?.user?.name)
        console.log(error)
        console.error(`[BACK][USER:${req.user?.usernameUser || 'anon'}] STACK → ${error.stack}`);
        res.json(error.stack);
    }
})
//getss
router.get('/get', async (req, res) => {
    try {

        let filtro = JSON.parse(req.query.filtros || `{}`)
        filtro.eliminado = { $ne: true };

        let sortt = sortObject(req.query.sort)
        let dataBase = baseDeDatos[capitalize(req.query.base)]
        let data = await dataBase.find(filtro).limit(parseFloat(req.query.limite) || "").sort(sortt)

        res.json(data);

    } catch (error) {
        const ahora = new Date();
        const fechaHora = ahora.toLocaleString('es-AR', {
            timeZone: 'America/Argentina/Cordoba'
        });
        console.log(fechaHora)
        console.log(req?.query)
        console.log(req?.user?.name)
        console.log(error)
        //   console.error(`[${fechaHora}][BACK][USER:${req.user?.usernameUser || 'anon'}] STACK → ${error.stack}`);
        res.json(error.stack);
    }

});
router.get('/getUnWind', async (req, res) => {
    try {

        let coleccionPlanchar = JSON.parse(req?.query?.componentes || "[]")

        let con = req.query.key
        let objetoAdd = plancharObjeto(coleccionPlanchar, con)

        let filtros = JSON.parse(req.query?.filtros || `{}`)

        let filtroColeccion = filtros?.coleccion
        let filtroCabecera = filtros?.cabecera
        filtroCabecera.eliminado = { $ne: true };
        let sortt = sortObject(req.query.sort)

        let dataBase = baseDeDatos[capitalize(req.query.base)]

        let fechaObj = {};

        if (filtroCabecera?.fecha?.desde !== undefined) {
            fechaObj = {
                fecha: {
                    $gte: crearFechaUTC(filtroCabecera.fecha.desde),
                    $lte: crearFechaUTC(filtroCabecera.fecha.hasta),
                }
            };
            delete filtroCabecera.fecha;
        } else if (filtroCabecera?.fecha !== undefined) {
            fechaObj = {
                fecha: {
                    $gte: crearFechaUTC(filtroCabecera.fecha.$gte),
                    $lte: crearFechaUTC(filtroCabecera.fecha.$lte),
                }
            };
            delete filtroCabecera.fecha;
        }

        let unWind = unwind(con, objetoAdd)

        let totales = totalesReportes(JSON.parse(req.query?.totales || "{}"))

        let dataUnWind = await dataBase.aggregate([
            {
                $match: {
                    ...fechaObj,//FEcha siempre esta en cabecera
                    ...filtroCabecera,

                }
            },
            ...unWind,
            {
                $match: {

                    ...filtroColeccion
                }
            },
            {
                $sort: sortt || { _id: 1 }
            },
            ...totales
        ].filter(Boolean))

        res.json(dataUnWind);

    } catch (error) {
        const ahora = new Date();
        const fechaHora = ahora.toLocaleString('es-AR', {
            timeZone: 'America/Argentina/Cordoba'
        });
        console.log(fechaHora)
        console.log(req?.query)
        console.log(req?.user?.name)
        console.log(error)
        // console.error(`[BACK][USER:${req.user?.usernameUser || 'anon'}] STACK → ${error.stack}`);
        res.json(error.stack);
    }
});
router.get('/getUnWindGroup', async (req, res) => {
    try {

        let coleccionPlanchar = JSON.parse(req.query.componentes)
        let con = req.query.key
        let objetoAdd = plancharObjeto(coleccionPlanchar, con)
        let filtros = JSON.parse(req.query?.filtros || `{}`)
        let fechaObj = {};
        let filtroColeccion = filtros?.coleccion
        let filtroCabecera = filtros?.cabecera
        filtroCabecera.eliminado = { $ne: true };

        let dataBase = baseDeDatos[capitalize(req.query.base)]
        let objetoGroup = JSON.parse(req.query.objetoGroup)

        if (filtroCabecera?.fecha?.desde !== undefined) {
            fechaObj = {
                fecha: {
                    $gte: crearFechaUTC(filtroCabecera.fecha.desde),
                    $lte: crearFechaUTC(filtroCabecera.fecha.hasta),
                }
            };
            delete filtroCabecera.fecha;
        } else if (filtroCabecera?.fecha !== undefined) {
            fechaObj = {
                fecha: {
                    $gte: crearFechaUTC(filtroCabecera.fecha.$gte),
                    $lte: crearFechaUTC(filtroCabecera.fecha.$lte),
                }
            };
            delete filtroCabecera.fecha;
        }

        let totales = totalesReportes(JSON.parse(req.query?.totales || "{}"))
        let addFieldFront = addField(JSON.parse(req.query?.addField || "{}"))

        let dataUnWind = await dataBase.aggregate([
            {
                $match: {
                    ...fechaObj,//FEcha siempre esta en cabecera
                    ...filtroCabecera

                }
            },
            { $unwind: { path: `$${con}`, includeArrayIndex: `_idColeccionUnWind` } },
            {
                $addFields: objetoAdd
            },
            addFieldFront,
            {
                $match: {

                    ...filtroColeccion//Filtro colecciontengo
                }
            },
            ...objetoGroup,
            ...totales,

        ].filter(Boolean))

        res.json(dataUnWind);

    } catch (error) {

        const ahora = new Date();
        const fechaHora = ahora.toLocaleString('es-AR', {
            timeZone: 'America/Argentina/Cordoba'
        });
        console.log(fechaHora)
        console.log(req?.query)
        console.log(req?.user?.name)
        console.log(error)
        //  console.error(`[BACK][USER:${req.user?.usernameUser || 'anon'}] STACK → ${error.stack}`);
        res.json(error.stack);
    }
});
router.get('/getGroup', async (req, res) => {
    try {

        let filtros = JSON.parse(req.query?.filtros || `{}`)
        let filtroColeccion = filtros?.coleccion
        let filtroCabecera = filtros?.cabecera
        filtroCabecera.eliminado = { $ne: true };
        let fechaObj = {};
        let dataBase = baseDeDatos[capitalize(req.query.base)]
        let objetoGroup = JSON.parse(req.query.objetoGroup)

        if (filtroCabecera?.fecha?.desde !== undefined) {
            fechaObj = {
                fecha: {
                    $gte: crearFechaUTC(filtroCabecera.fecha.desde),
                    $lte: crearFechaUTC(filtroCabecera.fecha.hasta),
                }
            };
            delete filtroCabecera.fecha;
        } else if (filtroCabecera?.fecha !== undefined) {
            fechaObj = {
                fecha: {
                    $gte: crearFechaUTC(filtroCabecera.fecha.$gte),
                    $lte: crearFechaUTC(filtroCabecera.fecha.$lte),
                }
            };
            delete filtroCabecera.fecha;
        }

        let totales = totalesReportes(JSON.parse(req.query?.totales || "{}"))
        let addFieldFront = addField(JSON.parse(req.query?.addField || "{}"))

        let dataUnWind = await dataBase.aggregate([
            {
                $match: {

                    ...filtroColeccion//Filtro coleccion
                }
            },
            {
                $match: {
                    ...fechaObj,//FEcha siempre esta en cabecera
                    ...filtroCabecera

                }
            },
            addFieldFront,
            ...objetoGroup,
            ...totales
        ].filter(Boolean))

        res.json(dataUnWind);

    } catch (error) {
        const ahora = new Date();
        const fechaHora = ahora.toLocaleString('es-AR', {
            timeZone: 'America/Argentina/Cordoba'
        });
        console.log(fechaHora)
        console.log(req?.query)
        console.log(req?.user?.name)
        console.log(error)
        // console.error(`[BACK][USER:${req.user?.usernameUser || 'anon'}] STACK → ${error.stack}`);
        res.json(error.stack);
    }
});
router.get('/getLast', async (req, res) => {//Este lo utilizo para obtener el último de cada tipo según atributo, ejemplo en tipo de cambio cuando quiero saber el actual
    try {

        let dataBase = baseDeDatos[capitalize(req.query.base)]
        let idRegistro = req.query.identificador

        let dataLast = await dataBase.aggregate([
            {
                $match: {
                    eliminado: { $ne: true }
                }
            },
            {
                $sort: {
                    [req.query.group]: 1,
                    [req.query.ord]: -1
                }
            },
            {
                $group: {
                    _id: `$${idRegistro}`,
                    registro: { $first: "$$ROOT" }
                }
            }
        ]);

        res.json(dataLast)

    } catch (error) {
        const ahora = new Date();
        const fechaHora = ahora.toLocaleString('es-AR', {
            timeZone: 'America/Argentina/Cordoba'
        });
        console.log(fechaHora)
        console.log(req?.query)
        console.log(req?.user?.name)
        console.log(error)
        res.json(error.stack);
    }
});
//post y put
router.post('/post', async (req, res) => {
    try {
        let enviar = req.body
        delete enviar._id

        let key = req.body[req.body.key] || ""
        let mostrar = req.body.mostrar || ""

        let newP = await makeObjects(Object.keys(enviar), enviar, req.user, capitalize(req.query.base), req.files || {})
        let newPost = await newP.save();

        res.json({
            mensaje: `El item ${key} ${mostrar} fue creado con exito`,
            posteo: newPost
        });

    } catch (error) {

        if (error.code === 11000) {
            return res.status(200).json({
                tipo: 'duplicate_key',
                mensaje: `Ya existe un registro con ${req.body.key}: ${req.body[req.body.key]}`
            });
        } else {
            const ahora = new Date();
            const fechaHora = ahora.toLocaleString('es-AR', {
                timeZone: 'America/Argentina/Cordoba'
            });
            console.log(fechaHora)
            console.log(req?.body)
            console.log(req?.user?.name)
            console.log(error)
            res.json(error.stack);

            return res.status(200).json({
                tipo: 'default',
                mensaje: 'No se grabó el registro'
            });
        }
    }
});
router.put('/put', async (req, res) => {
    try {
        let { _id } = req.body

        let unsetear = JSON.parse(req?.body?.unset || "{}")
        let enviar = { ...req.body }

        delete enviar.unset

        let mostrar = req.body.mostrar || ""

        req.body.username = req.user._id
        delete enviar._id

        let dataBase = baseDeDatos[capitalize(req.query.base)]
        let anterior = await dataBase.findById(_id);
        let update = await updateObjects(enviar, req.user, req.files)
        let elementoPush = version[req.query.vers || "si"](req.body)

        let updt = await dataBase.findByIdAndUpdate(_id, {
            $inc: { "version": 1 },
            $push: { "historia": elementoPush },
            $set: update,
            $unset: unsetear,

        }, { new: true });

        let posteAct = { ...update }

        posteAct.historia = updt?.historia || []
        posteAct.historia.push(elementoPush)

        let key = updt?.[req.body.key] || ""

        let ant = anterior?.path || ""
        let act = updt?.path || ""
        if (ant !== act) {

            for (const value of anterior.path) {

                if (!updt.path.includes(value)) {

                    let archivo = path.join(__dirname, `/../../../front/${value}`)

                    fs.unlink(archivo, (err) => {
                        if (err) {
                            console.error(`Error al eliminar el archivo: ${err} `);
                        }
                    });
                }
            }
        }

        res.json({
            mensaje: `El item ${key} ${mostrar} fue actualizado con exito`,
            posteo: updt,
            anterior,//este es actualizado Anterior
            _id
        });


    } catch (error) {

        const ahora = new Date();
        const fechaHora = ahora.toLocaleString('es-AR', {
            timeZone: 'America/Argentina/Cordoba'
        });
        console.log(fechaHora)
        console.log(req?.body)
        console.log(req?.user?.name)
        console.log(error)
        res.json(error.stack);
    }
});
router.put('/putValoresArray', async (req, res) => {
    try {
        let { _id } = req.body
        let enviar = req.body

        delete enviar._id
        let dataBase = baseDeDatos[capitalize(req.query.base)] || baseDeDatosApp[capitalize(req.query.base)]
        let objetoData = new Object


        for (let y = 0; y < Object.values(enviar.array || []).length; y++) {

            for (let x = 0; x < Object.values(enviar.atributosArray || []).length; x++) {

                objetoData[Object.keys(enviar.atributosArray)[x] + "." + enviar.array[y]] = Object.values(enviar.atributosArray)?.[x]?.[y] || Object.values(enviar.atributosArray)?.[x]?.[0]// Esto es porque muchas veces se pasan un valor para todos los array ejemplo en lo que es aprobación y rechazo desde aprobar
            }
        }
        for (let a = 0; a < Object.values(enviar.arrays || []).length; a++) {
            for (let y = 0; y < Object.values(enviar.arrays[a].arrayCompuesto || []).length; y++) {//Este solo lo uso para guardar lo acumulado en el origen, cuando envio un formulario
                for (let x = 0; x < Object.values(enviar.arrays[a].atributosArrayCompuesto).length; x++) {

                    objetoData[Object.keys(enviar.arrays[a].atributosArrayCompuesto)[x] + "." + enviar.arrays[a].arrayCompuesto[y]] = Object.values(enviar.arrays[a].atributosArrayCompuesto)[x][y]
                }
            }
        }
        for (let x = 0; x < Object.values(enviar.atributosCabecera || []).length; x++) {

            objetoData[Object.keys(enviar.atributosCabecera)[x]] = Object.values(enviar.atributosCabecera)[x]
        }
        for (let x = 0; x < Object.values(enviar.referencias || []).length; x++) {

            let indice = Object.keys(enviar.referencias)[x]
            let valores = Object.values(enviar.referencias)[x]

            for (let y = 0; y < Object.values(valores).length; y++) {

                objetoData[`referencias.${indice}.${Object.keys(valores)[y]}`] = Object.values(valores)[y]
            }
        }

        let updt = await dataBase.findByIdAndUpdate(_id, {

            $set: objetoData,
        });

        res.json({
            mensaje: `El item fue actualizado con exito`,
            posteo: objetoData,
            actualizado: updt,
            _id
        });

    } catch (error) {
        const ahora = new Date();
        const fechaHora = ahora.toLocaleString('es-AR', {
            timeZone: 'America/Argentina/Cordoba'
        });
        console.log(fechaHora)
        console.log(req?.body)
        console.log(req?.user?.name)
        console.log(error)
        res.json(error.stack);
    }
})///
router.put('/putDeleteOrigen', async (req, res) => {
    try {

        let { _id } = req.body

        let dataBase = baseDeDatos[capitalize(req.query.base)]

        let registroEliminar = new Object
        registroEliminar[req.body.unset] = 1

        let updt = await dataBase.findByIdAndUpdate(_id, {
            $unset: registroEliminar,
        });

        res.json({
            mensaje: `El item fue actualizado con exito`,
            actualizado: updt,//este es actualizado Anterior
            _id
        });

    } catch (error) {
        const ahora = new Date();
        const fechaHora = ahora.toLocaleString('es-AR', {
            timeZone: 'America/Argentina/Cordoba'
        });
        console.log(fechaHora)
        console.log(req?.query)
        console.log(req?.user?.name)
        console.log(error)
        res.json(error.stack);
    }
});
router.put('/putTareas', async (req, res) => {
    try {
        let { _id, tareaAEliminar } = req.body;

        let enviar = { ...req.body };
        delete enviar._id;
        delete enviar.tareaAEliminar;

        let dataBase = baseDeDatos.User;

        // 1) Elimino cualquier tareaPendiente con la misma funcion (evito duplicados)
        await dataBase.findByIdAndUpdate(
            _id,
            {
                $pull: {
                    tareasPendientes: { funcion: enviar.funcion }
                }
            }
        );

        // 2) Agrego la nueva tarea y limito a las últimas 10
        const updt = await dataBase.findByIdAndUpdate(
            _id,
            {
                $push: {
                    tareasPendientes: {
                        $each: [enviar],
                        $position: 0,   // 👈 INSERTA AL PRINCIPIO
                        $slice: -10     // 👈 mantiene solo los últimos 10 (contando desde adelante)
                    }
                },
                ...(tareaAEliminar ? {
                    $pull: {
                        tareasProgramadas: tareaAEliminar
                    }
                } : {})
            },
            { new: true }
        );

        res.json({
            mensaje: `El item fue actualizado con exito`,
            posteo: updt,
            _id
        });

    } catch (error) {
        const ahora = new Date();
        const fechaHora = ahora.toLocaleString('es-AR', {
            timeZone: 'America/Argentina/Cordoba'
        });
        console.log(fechaHora)
        console.log(error);
        res.json(error.stack);
    }
});
router.put('/cambiarEstadoTareas', async (req, res) => {
    try {
        const { _id, funcion, estado } = req.body;

        const dataBase = baseDeDatos.User;

        const updt = await dataBase.findOneAndUpdate(
            {
                _id,
                "tareasPendientes.funcion": funcion   // 👈 busca el objeto dentro del array
            },
            {
                $set: {
                    "tareasPendientes.$.estado": estado // 👈 solo cambia el atributo estado de ese objeto
                }
            },
            { new: true }
        );

        res.json({
            mensaje: `El item fue actualizado con exito`,
            posteo: updt,
            _id
        });

    } catch (error) {
        console.log(error);
        res.json(error.stack);
    }
});
router.delete('/deshabilitar', async (req, res) => {

    let { id, habilitado } = req.body;

    const newPaisHab = ({
        habilitado
    });

    let desh = await baseDeDatos[capitalize(req.query.base)].findByIdAndUpdate(id, newPaisHab);

    res.json({ desh });
})
router.delete('/delete', async (req, res) => {
    try {
        let { _id } = req.body;

        let dataBase = baseDeDatos[capitalize(req.query.base)]

        let updt = await dataBase.findByIdAndUpdate(_id, {
            eliminado: true,
            date: Date.now(),
            username: req.user.usernameUser

        }, { new: true });

        res.json({
            updt
        });
    } catch (error) {

        const ahora = new Date();
        const fechaHora = ahora.toLocaleString('es-AR', {
            timeZone: 'America/Argentina/Cordoba'
        });
        console.log(fechaHora)
        console.log(req?.query)
        console.log(req?.user?.name)
        console.log(error)
        res.json(error.stack);
    }
});
router.delete('/deleteSoloAdjunto', async (req, res) => {
    try {
        let { pathAdj } = req.body;

        for (let x = 0; x < path?.length; x++) {

            let archivo = path.join(__dirname, `/../../../front/${pathAdj[x]}`)

            if (pathAdj[x] != "") {
                fs.unlink(archivo, (err) => {
                    if (err) {
                        console.error(`Error al eliminar el archivo: ${err} `);
                    }
                });
            }
        }

        res.json({
            pathAdj
        });
    } catch (error) {


        const ahora = new Date();
        const fechaHora = ahora.toLocaleString('es-AR', {
            timeZone: 'America/Argentina/Cordoba'
        });
        console.log(fechaHora)
        console.log(req?.query)
        console.log(req?.user?.name)
        console.log(error)
        res.json(error.stack);
    }
});
////Reportes
router.put('/putReporte', async (req, res) => {
    try {
        let { _id } = req.body
        let enviar = { ...req.body }

        delete enviar._id

        let dataBase = baseDeDatos[capitalize(req.query.base)]
        let update = updateObjects(enviar.info, req.user, req.files)

        let updt = await dataBase.findByIdAndUpdate(_id, {
            $set: {
                [`infoReportes.${req.query.reporte}`]: enviar.reporte,
                ...enviar.unwindo,
                ...update
            }
        });

        let posteAct = { ...update }

        let key = updt[req.body.key] || ""
        res.json({
            mensaje: `El reporte fue actualizado con exito`,
            posteo: posteAct,//aca va todo lo que postie efectivamente
            actualizado: updt,//este es actualizado Anterior

            _id
        });
    } catch (error) {


        const ahora = new Date();
        const fechaHora = ahora.toLocaleString('es-AR', {
            timeZone: 'America/Argentina/Cordoba'
        });
        console.log(fechaHora)
        console.log(req?.query)
        console.log(req?.user?.name)
        console.log(error)
        res.json(error.stack);
    }
});

module.exports = router;