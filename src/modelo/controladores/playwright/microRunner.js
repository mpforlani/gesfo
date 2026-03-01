// src/modelo/controladores/playwright/microRunner.js
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

function ensureDir(p) { fs.mkdirSync(p, { recursive: true }); }
const KEEP_FILES = parseInt(process.env.TEST_KEEP_FILES || '5', 10);
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function cleanupOldFilesAsync(dir, prefix, ext, keep = KEEP_FILES) {
    try {
        const files = fs.readdirSync(dir)
            .filter(f => f.startsWith(prefix) && f.endsWith(ext))
            .map(f => {
                const p = path.join(dir, f);
                const st = fs.statSync(p);
                return { f, p, t: st.mtimeMs, s: st.size };
            })
            .sort((a, b) => b.t - a.t);

        const toDelete = files.slice(keep);

        for (const it of toDelete) {
            try {
                fs.unlinkSync(it.p);

            } catch (e) {
                if (e.code === 'EPERM' || e.code === 'EBUSY') {
                    await sleep(150);
                    try { fs.unlinkSync(it.p); }
                    catch (e2) { console.warn(`[cleanup] no pude borrar ${it.f}: ${e2.message}`); }
                } else {
                    console.warn(`[cleanup] no pude borrar ${it.f}: ${e.message}`);
                }
            }
        }
    } catch (e) {
        console.warn('[cleanup] error:', e.message);
    }
}

async function runActions({
    actions = [],
    headed = false,
    slowMo = 0,
    timeout = 30000,
    captureAllConsole = true,
    captureErrorBodies = true,
    errorBodyLimit = 2000,
    recordHar = true,
    autoClose, // si no viene, por defecto !headed
    cortarErrorFront = true,
    cortarErrorBack = true,
    networkSettleMs = 400,
} = {}) {
    const outDir = path.resolve('tmp/automation');
    ensureDir(outDir);

    const ts = Date.now();
    const harPath = path.join(outDir, `run-${ts}.har`);

    const shouldAutoClose = typeof autoClose === 'boolean' ? autoClose : !headed;
    const effectiveRecordHar = shouldAutoClose ? recordHar : false;

    // Flags para fail-fast
    let hasConsoleError = false;
    let hasBackendError = false;

    const args = [];
    if (process.env.PW_NO_SANDBOX === '1') args.push('--no-sandbox');
    args.push('--disable-dev-shm-usage');

    const browser = await chromium.launch({ headless: !headed, slowMo, args });
    const contextOpts = effectiveRecordHar
        ? { recordHar: { path: harPath, content: 'embed' } }
        : {};
    const context = await browser.newContext(contextOpts);
    const page = await context.newPage();

    // Tracing ON
    await context.tracing.start({ screenshots: true, snapshots: true, sources: true });

    // Evitar ruido de favicon
    await page.route('**/favicon.ico', r => r.fulfill({ status: 204, body: '' }));

    const pageErrors = [];
    const consoleErrors = [];
    const consoleAll = [];
    const netFailures = [];
    const badResponses = [];

    // Logs del browser a tu terminal + arrays
    page.on('pageerror', err => {
        pageErrors.push(String(err));
        console.error('[pageerror]', err);
    });
    page.on('console', msg => {
        const type = msg.type();
        const text = msg.text();

        if (type === 'error') {
            consoleErrors.push(text);
            hasConsoleError = true; // fail-fast por consola
        }
        if (captureAllConsole) consoleAll.push({ type, text });
    });

    page.on('requestfailed', req => netFailures.push({
        url: req.url(),
        method: req.method(),
        failure: req.failure()?.errorText || null,
        type: req.resourceType()
    }));

    page.on('response', async res => {
        const s = res.status();
        if (s >= 400) {
            const item = {
                url: res.url(),
                status: s,
                statusText: res.statusText(),
                headers: res.headers(),
                request: {
                    method: res.request().method(),
                    postData: res.request().postData() || null
                }
            };
            if (captureErrorBodies) {
                try {
                    let body = await res.text();
                    if (body && body.length > errorBodyLimit) body = body.slice(0, errorBodyLimit) + '…';
                    item.body = body;
                } catch { item.body = null; }
            }
            badResponses.push(item);
            hasBackendError = true; // fail-fast por backend
        }
    });

    page.setDefaultTimeout(timeout);

    const steps = [];
    let ok = true, error = null, screenshot = null;
    let harFile = effectiveRecordHar ? harPath : null;
    let traceFile = null;
    let stoppedBy = null; // 'console' | 'backend' | null

    // helper para chequear si hay que abortar
    async function cortarPorError() {
        if (networkSettleMs > 0) {
            await page.waitForTimeout(networkSettleMs);
            await page.waitForLoadState('networkidle', { timeout: 1 }).catch(() => { });
        }
        if (cortarErrorFront && hasConsoleError) {
            stoppedBy = 'console';
            throw new Error(`Detenido el test por consola frontend: ${consoleErrors[0] || 'error uncierto de consola detectado'}`);
        }
        if (cortarErrorBack && hasBackendError) {
            const b = badResponses[0];
            stoppedBy = 'backend';
            const msg = b ? `Detenido por error de consola ${b.status} ${b.statusText} en ${b.url}` : 'Detenido por error de consola backend uncierto';
            throw new Error(msg);
        }
    }

    try {
        let coleccion = {}

        for (let i = 0; i < actions.length; i++) {
            const a = actions[i];
            const label = a.label || `${a.action} ${a.selector || a.url || ''}`.trim();

            switch (a.action) {
                case 'goto':
                    await page.goto(a.url);
                    break;
                case 'fill':
                    await page.fill(a.selector, String(a.value ?? ''));
                    break;
                case 'click':

                    await page.click(a.selector);
                    await page.mouse.move(0, 0);
                    await page.waitForTimeout(30);

                    break;
                case 'hover': {

                    const loc = page.locator(a.selector);
                    await loc.waitFor({ state: 'visible', timeout: a.timeout || 10_000 });
                    await loc.scrollIntoViewIfNeeded();
                    await loc.hover({ force: true });
                    break;
                }
                case 'waitForURL':
                    await page.waitForURL(a.urlPattern || a.url || '**/*', { timeout: a.timeout || timeout });
                    break;
                case 'waitForSelector':
                    await page.waitForSelector(a.selector, { state: a.state || 'visible', timeout: a.timeout || timeout });
                    break;
                case 'sleep':
                    await page.waitForTimeout(a.ms || 300);
                    break;
                case 'clickClosestDesplegable': {

                    const sel = a.selector; // ej: '.menuFormulario#operacionesLogistica'
                    const timeout = a.timeout || 10_000;
                    const base = page.locator(sel).first();
                    const itemMenu = base.locator(
                        'xpath=ancestor::*[contains(concat(" ", normalize-space(@class), " "), " itemMenu ")]'
                    ).first();

                    const h4 = itemMenu.locator('h4').first(); // o 'h4.desplegableAbm'

                    await h4.waitFor({ state: 'visible', timeout });
                    await h4.click({ force: !!a.force });
                    break;
                }
                case 'clickIndAbm': {

                    const sel = a.selector;
                    const base = page.locator(sel);
                    const indice = await base.getAttribute('indice');
                    const navVert = page.locator('.nav-vert').first();

                    const baseView = await base.getAttribute('view');
                    const navView = await navVert.getAttribute('view');

                    if (baseView != navView) {

                        const loc = page.locator(".navegacionSupHomeLog div.nav");
                        await loc.scrollIntoViewIfNeeded();
                        await loc.hover({ force: true });
                        await page.click(`.menuPest#${baseView}`);

                    }

                    await navVert.hover({ force: true });
                    const h4 = page.locator(`.itemMenu.${indice} h4`).first(); // o 'h4.desplegableAbm'

                    await h4.waitFor({ state: 'visible', timeout });

                    if (! await base.isVisible()) {

                        await h4.click({ force: !!a.force });
                    }

                    await page.click(sel);
                    await page.click(".comand.active span.crearBotonInd");
                    break;
                }
                case 'completarAtributo': {

                    if (Array.isArray(a.value)) {

                        const sel = `.tabs_contents_item.active td.${a.name}`;
                        const loc = page.locator(sel).first();
                        const set = await loc.getAttribute('set')
                        const table = page.locator(`.tabs_contents_item.active table#${set}`).first();
                        const nombreTabla = await table.getAttribute('compuesto');

                        coleccion[nombreTabla] = coleccion[nombreTabla] || {};
                        coleccion[nombreTabla][a.name] = a.value;


                    } else {

                        const sel = `.tabs_contents_item.active .form.${a.name}`;
                        const loc = page.locator(sel).first();

                        await loc.waitFor({ state: 'attached', timeout: 2000 });
                        if (await loc.isVisible()) {

                            const type = await loc.getAttribute('type')

                            const valueAttr = await loc.inputValue()

                            if (type == "parametrica" && valueAttr == "") {

                                await loc.click();
                                const selOpt = `.tabs_contents_item.active .selectCont.${a.name} .opciones[valuestring="${a.value}"]`;

                                try {
                                    await page.waitForSelector(selOpt, { state: 'visible', timeout: 2000 });
                                } catch {
                                    throw new Error(`Opción no encontrada o no visible: ${selOpt}`);
                                }

                                const opt = page.locator(selOpt);
                                await opt.scrollIntoViewIfNeeded();
                                await opt.hover({ force: true });
                                await opt.click();

                                await loc.dispatchEvent('change');


                            } else if (type == "hidden") {

                                const selBra = `.tabs_contents_item.active input.${a.name}[type="checkbox"]`;
                                const selBraDef = page.locator(selBra)

                                if (a.value == "true" || a.value == true) {

                                    await selBraDef.check()

                                } else {
                                    await selBraDef.uncheck()
                                }
                                await selBraDef.dispatchEvent('change');
                            } else if (type == "parametricaPreEstablecida" && valueAttr == "") {

                                await loc.click();
                                await page.click(`.inputSelect.${a.name}`);

                                const selOpt = `.tabs_contents_item.active .opciones[value="${a.value}"]`;

                                try {
                                    await page.waitForSelector(selOpt, { state: 'visible', timeout: 2000 });
                                } catch {
                                    throw new Error(`Opción no encontrada o no visible: ${selOpt}`);
                                }

                                const opt = page.locator(selOpt);
                                await opt.scrollIntoViewIfNeeded();
                                await opt.hover({ force: true });
                                await opt.click();

                                await loc.dispatchEvent('change');


                            } else {

                                if (valueAttr == "") {

                                    await loc.fill(a.value ?? '');
                                    await loc.dispatchEvent('input');
                                    await loc.dispatchEvent('change');
                                }
                            }
                        }
                    }

                    break;
                }

                case 'completarColecciones': {

                    for (const [indice, value] of Object.entries(coleccion)) {

                        const sel = `.tabs_contents_item.active a.${indice}`;
                        await page.locator(sel).click();

                        const position = Object.keys(value).find(k => k.startsWith('position'));
                        const longitud = value[position].length
                        let dblClick = longitud - 1

                        delete value[position]

                        for (let n = 0; n < longitud; n++) {
                            const table = `.tabs_contents_item.active div.tableCol`;
                            const tableCol = page.locator(table);

                            await tableCol.evaluate(el => {
                                // forzá al inicio horizontal
                                el.scrollLeft = 0;
                                // notificar por si hay listeners
                                el.dispatchEvent(new Event('scroll', { bubbles: true }));
                            });

                            for (const [ind, val] of Object.entries(value)) {

                                const sel = `.tabs_contents_item.active tr[q="${n}"] .formColec.${ind}`;
                                const loc = page.locator(sel).first();
                                await loc.waitFor({ state: 'attached', timeout: 2000 });

                                if (await loc.isVisible()) {

                                    const type = await loc.getAttribute('type')
                                    const valueAttr = await loc.inputValue()

                                    if (type == "parametrica" && valueAttr == "") {

                                        await loc.click();
                                        const selOpt = `.tabs_contents_item.active tr[q="${n}"] .selectCont.${ind} .opciones[valuestring="${val[n]}"]`;

                                        try {
                                            await page.waitForSelector(selOpt, { state: 'visible', timeout: 2000 });
                                        } catch {
                                            throw new Error(`Opción no encontrada o no visible: ${selOpt}`);
                                        }

                                        const opt = page.locator(selOpt);
                                        await opt.scrollIntoViewIfNeeded();
                                        await opt.hover({ force: true });
                                        await opt.click();

                                        await loc.dispatchEvent('change');


                                    } else if (type == "hidden") {

                                        const selBra = `.tabs_contents_item.active tr[q="${n}"] input.${ind}[type="checkbox"]`;
                                        const selBraDef = page.locator(selBra)

                                        if (val[n] == "true" || val[n] == true) {

                                            let valor = val[n]
                                            const current = await selBraDef.isChecked();
                                            if (current !== val[n]) {
                                                // 1) intenta la vía oficial (reintenta internamente y usa label si aplica)
                                                try {
                                                    await selBraDef.setChecked(val[n]);
                                                } catch (e) {
                                                    // 2) fallback por si hay handlers que cancelan el click
                                                    await selBraDef.evaluate((el, valor) => {
                                                        el.checked = valor;
                                                        el.dispatchEvent(new Event('input', { bubbles: true }));
                                                        el.dispatchEvent(new Event('change', { bubbles: true }));
                                                    }, valor);
                                                }
                                            }

                                        } else {

                                            await selBraDef.uncheck()
                                        }
                                        await selBraDef.dispatchEvent('change');
                                    } else if (type == "parametricaPreEstablecida" && valueAttr == "") {

                                        await loc.click();

                                        const selOpt = `.tabs_contents_item.active tr[q="${n}"].opciones[value="${val[n]}"]`;

                                        try {
                                            await page.waitForSelector(selOpt, { state: 'visible', timeout: 2000 });
                                        } catch {
                                            throw new Error(`Opción no encontrada o no visible: ${selOpt}`);
                                        }

                                        const opt = page.locator(selOpt);
                                        await opt.scrollIntoViewIfNeeded();
                                        await opt.hover({ force: true });
                                        await opt.click();

                                        await loc.dispatchEvent('change');


                                    } else {

                                        if (valueAttr == "") {

                                            await loc.fill(val[n] ?? '');
                                            await loc.dispatchEvent('input');
                                            await loc.dispatchEvent('change');
                                        }
                                    }
                                }
                            }

                            if (dblClick > 0) {

                                const sel = `.tabs_contents_item.active table.${indice} tr:last-child`;
                                await page.locator(sel).dblclick();

                                dblClick--
                            }
                        }
                    }

                    coleccion = {}

                    break;
                }
                case "closeOrigen": {

                    let tabla = page.locator(".tabs_contents_item.active");
                    let prefaTher = await tabla.getAttribute('prefather');
                    let preDef = prefaTher.slice(1)

                    await page.click(`#p${preDef} .close`);

                    break;
                }
                case 'endOk': {

                    return { status: "ok", mensaje: a.mensaje };
                }
                default:
                    throw new Error(`Acción no soportada: ${a.action}`);
            }
            await cortarPorError();
            steps.push({ i, label, status: 'ok' });
        }

    } catch (e) {
        ok = false;
        error = String(e?.message || e);
        console.error('[runActions] FAIL:', e?.stack || e);

        // Screenshot
        try {
            screenshot = path.join(outDir, `error-${ts}.png`);
            await page.screenshot({ path: screenshot, fullPage: true });
            cleanupOldFilesAsync(outDir, 'error-', '.png');     // ⬅️ limpiar PNG
        } catch { }

        // JSON de depuración
        try {
            const debugPath = path.join(outDir, `debug-${ts}.json`);
            const debug = {
                error,
                stack: e?.stack || null,
                stoppedBy,
                lastStep: steps.at(-1) || null,
                steps,
                url: (() => { try { return page.url(); } catch { return null; } })(),
                frontErrors: { pageErrors, consoleErrors, consoleAll },
                network: { failures: netFailures, badResponses }
            };
            fs.writeFileSync(debugPath, JSON.stringify(debug, null, 2));

            cleanupOldFilesAsync(outDir, 'debug-', '.json');
        } catch { }
    } finally {
        // Guardar trace
        try {
            traceFile = path.join(outDir, `trace-${ts}.zip`);
            await context.tracing.stop({ path: traceFile });

            // esperar un toque para que Windows libere el handle
            await sleep(100);

            await cleanupOldFilesAsync(outDir, 'trace-', '.zip');
        } catch { }

        if (shouldAutoClose) {
            try { await context.close(); } catch { }
            try { await browser.close(); } catch { }
        }
        if (!effectiveRecordHar) harFile = null;
        if (harFile) cleanupOldFilesAsync(outDir, 'run-', '.har');
    }

    return {
        ok,
        error,
        stoppedBy,
        steps,
        screenshot,
        artifacts: { har: harFile, trace: traceFile },
        frontErrors: { pageErrors, consoleErrors, consoleAll },
        network: { failures: netFailures, badResponses }
    };
}


module.exports = { runActions };
