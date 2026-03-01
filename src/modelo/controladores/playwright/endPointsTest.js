const express = require('express');
const router = express.Router();
const { runActions } = require('./microRunner');
Object.assign(global, require('./funcionesTest'));
const { ensureTestingUp } = require('./testingInstance');
let baseDeDatos = require(`../baseDeDatos`);

function expandir(obj) {
    const out = {};
    for (const [key, value] of Object.entries(obj)) {
        if (key.includes('.')) {
            const [prefix, subKey] = key.split('.');
            (out[prefix] ||= {})[subKey] = value;
        } else out[key] = value;
    }
    const ordenDef = {};
    if (out.orden && typeof out.orden === 'object') {
        for (const [k, v] of Object.entries(out.orden)) (ordenDef[v] ||= []).push(k);
    }
    out.orden = ordenDef;
    return out;
}
const testing = {

    crear: (entidad, atributos) => {
        return [

            ...ingresarRegistros(entidad, atributos),
        ]
    },
    crearIndAbm: (entidad, atributos) => {
        return [

            ...ingresarRegistrosIndAbm(entidad, atributos),
        ]
    }
}

router.post('/testingIngresar', async (req, res) => {

    const headed = String(req.query.visible ?? req.body?.visible ?? 'false') === 'true';
    const slowMo = parseInt(req.query.slowmo ?? req.body?.slowmo ?? '0', 10) || 0;
    const timeout = parseInt(req.query.timeout ?? req.body?.timeout ?? '30000', 10) || 30000;

    // 1) Levantar instancia testing si no existe y esperar health
    const ok = await ensureTestingUp({
        spawn: {           // cómo spawnear
            script: require('path').resolve('src/index.js'),
            port: process.env.PORTTEST,
            dbName: process.env.DB_NAMETEST,
            envPath: '.env.testing',
            inheritLogs: true,
        },
        health: {          // cómo verificar salud
            baseURL: `http://localhost:${process.env.PORTTEST}`,
            pathCheck: '/',  // podés cambiar si querés un /health
            tries: 30,
            intervalMs: 500,
        }
    });


    if (!ok) {
        return res.status(500).json({
            ok: false,
            error: `No se pudo levantar/alcanzar la instancia de testing en :${process.env.PORTTEST}`,
            hint: 'Revisá logs del servidor y que src/index.js levante con ENV_PATH=.env.testing',
        });
    }
    // Reset seguro en el HIJO (ajustá colecciones keep a tus nombres reales)
    const cfg = req.body.__reset ?? {};

    const resp = await fetch(`http://localhost:${process.env.PORTTEST}/__resetdb`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
            mode: cfg.mode ?? 'truncate',
            keep: cfg.keep ?? ['usuarios', 'roles', 'permisos', 'seguridad', 'sessions', 'migrations', 'config'],
            only: cfg.only ?? []
        })
    });
    const jr = await resp.json();
    if (!jr.ok) return res.status(500).json({ ok: false, error: `resetdb falló: ${jr.error || 'desconocido'}` });

    let actions = [...loginAction()]
    const body = expandir(req.body);

    for (const [indice, entidades] of Object.entries(body.orden)) {

        for (const entidad of entidades) {

            if (body.crearIndAbm[entidad] == "true") {
                let registros = []
                const casosTesting = await baseDeDatos.CasosTesting.find({ entidad });

                for (const caso of casosTesting) {

                    const atributos = caso?.atributos || [];
                    registros.push(atributos)

                }
                actions.push(...testing.crearIndAbm(entidad, registros));
            }
        }
    }

    actions.push(...finalizarTesting());

    try {
        const result = await runActions({ actions, headed, slowMo, timeout, captureAllConsole: true });

        if (result.ok == false) {

            console.log(result.error);
        } else {

            console.log(result.mensaje);
        }

        return res.json({ ok: true, result });


    } catch (err) {
        console.error('[testingIngresar] ERROR:');
        return res.status(500).json({ ok: false, error: String(err?.message || err) });
    }
});

module.exports = router;