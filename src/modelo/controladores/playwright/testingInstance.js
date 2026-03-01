const { spawn } = require('child_process');
const path = require('path');
const http = require('http');
const https = require('https'); // 👈 para soportar HTTPS en healthcheck

let child = null; // proceso de la instancia testing

function isRunning() {
    return !!(child && !child.killed);
}

function ping(url, timeoutMs = 1500) {
    return new Promise((resolve) => {
        try {
            const isHttps = url.startsWith('https://');
            const agent = isHttps ? https : http;
            const opts = isHttps ? { rejectUnauthorized: false } : undefined; // ignora certificados en testing

            const req = agent.get(url, opts, (res) => {
                res.resume(); // descartar body
                resolve(true);
            });

            req.setTimeout(timeoutMs, () => { req.destroy(); resolve(false); });
            req.on('error', () => resolve(false));
        } catch {
            resolve(false);
        }
    });
}

/**
 * Espera a que la instancia responda en la URL indicada
 */
async function waitUntilHealthy({
    baseURL = `http://localhost:${process.env.PORTTEST}`,
    pathCheck = '/',
    tries = 20,
    intervalMs = 500,
} = {}) {
    const url = new URL(pathCheck, baseURL).toString();
    for (let i = 0; i < tries; i++) {
        const ok = await ping(url);
        if (ok) return true;
        await new Promise(r => setTimeout(r, intervalMs));
    }
    return false;
}

/**
 * Arranca la instancia de testing*/
function startTestingInstance({
    script = path.resolve('src/index.js'),
    port = process.env.PORTTEST,
    dbName = process.env.DB_NAMETEST,
    envPath = '.env.testing',
    inheritLogs = true,
} = {}) {
    if (isRunning()) return child;

    const env = {
        ...process.env,
        PORT: port,
        DB_NAME: dbName,
        ENV_PATH: envPath,
        NODE_ENV: process.env.NODE_ENV || 'development',
    };

    const nodeExec = process.execPath;
    child = spawn(nodeExec, [script], {
        env,
        stdio: inheritLogs ? 'inherit' : 'pipe',
        windowsHide: true,
    });

    child.on('exit', (code, signal) => {
        console.log(`[testingInstance] proceso finalizado (code=${code}, signal=${signal})`);
        child = null;
    });

    child.on('error', (err) => {
        console.error('[testingInstance] error al spawn:', err.message);
    });

    console.log(`[testingInstance] lanzado: PORT=${port} DB_NAME=${dbName} ENV_PATH=${envPath}`);
    return child;
}

function stopTestingInstance({ graceMs = 2000 } = {}) {
    if (!child) return;
    const proc = child;
    child = null;

    try { proc.kill(); } catch { }

    setTimeout(() => {
        if (proc.killed) return;
        try { proc.kill('SIGKILL'); } catch { }
    }, graceMs);
}

async function ensureTestingUp(opts = {}) {
    const baseURL = (opts.health && opts.health.baseURL) || `http://localhost:${process.env.PORTTEST}`;

    if (isRunning()) {
        const up = await waitUntilHealthy({ baseURL, ...opts.health });
        if (up) return true;
    }

    startTestingInstance(opts.spawn);
    return await waitUntilHealthy({ baseURL, ...opts.health });
}

module.exports = {
    // startTestingInstance,
    // stopTestingInstance,
    ensureTestingUp,
    // waitUntilHealthy,
    //isRunning,
};
