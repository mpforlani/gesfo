const fs = require('fs');
const path = require('path');
const soap = require('soap');
const forge = require('node-forge');
const config = require('../../../afipFiles/config');

const WSDL_WSAA_HOMO = 'https://wsaahomo.afip.gov.ar/ws/services/LoginCms?WSDL';
const WSDL_WSAA_PROD = 'https://wsaa.afip.gov.ar/ws/services/LoginCms?WSDL';
const WSDL_WSFE_HOMO = 'https://wswhomo.afip.gov.ar/wsfev1/service.asmx?WSDL';
const WSDL_WSFE_PROD = 'https://servicios1.afip.gov.ar/wsfev1/service.asmx?WSDL';

const afipFilesDir = path.resolve(__dirname, '../../../afipFiles');
const taCache = new Map();
let wsaaClientPromise = null;
let wsfeClientPromise = null;

function getTAFilePath(service) {
    return path.resolve(afipFilesDir, 'ta_' + service + '.json');
}

function readTAFromDisk(service) {
    try {
        const filePath = getTAFilePath(service);
        if (!fs.existsSync(filePath)) return null;
        const ta = JSON.parse(fs.readFileSync(filePath, { encoding: 'utf8' }));
        if (!ta || !ta.token || !ta.sign || !ta.expirationTime) return null;
        return ta;
    } catch (_error) {
        return null;
    }
}

function saveTAToDisk(service, ta) {
    try {
        if (!ta) return;
        fs.writeFileSync(getTAFilePath(service), JSON.stringify(ta), { encoding: 'utf8' });
    } catch (_error) {
        // Cache en archivo: mejor esfuerzo
    }
}
function createError(message, data = null, status = 400) {
    const err = new Error(message);
    err.status = status;
    err.data = data;
    return err;
}

function decodeEntities(value) {
    return String(value || '')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
        .replace(/&amp;/g, '&');
}

function extractTag(xml, tag) {
    const regex = new RegExp(`<(?:\\w+:)?${tag}>([\\s\\S]*?)<\\/(?:\\w+:)?${tag}>`);
    const match = String(xml || '').match(regex);
    return match ? match[1].trim() : null;
}

function readPem(value, label) {
    if (!value) {
        throw createError(`Config AFIP incompleta: falta ${label} en src/afipFiles/config.js`);
    }

    const raw = String(value).trim();

    if (
        raw.includes('BEGIN CERTIFICATE') ||
        raw.includes('BEGIN PRIVATE KEY') ||
        raw.includes('BEGIN RSA PRIVATE KEY') ||
        raw.includes('BEGIN EC PRIVATE KEY')
    ) {
        return raw;
    }

    const normalized = raw.replace(/^[/\\]+/, '');
    const candidates = [
        raw,
        path.resolve(afipFilesDir, raw),
        path.resolve(afipFilesDir, normalized),
        path.resolve(afipFilesDir, path.basename(raw))
    ];

    for (const candidate of candidates) {
        if (fs.existsSync(candidate)) {
            return fs.readFileSync(candidate, { encoding: 'utf8' });
        }
    }

    throw createError(`No se pudo encontrar ${label}: ${raw}`);
}

function toIsoNoMillis(date) {
    return new Date(date).toISOString().replace(/\.\d{3}Z$/, 'Z');
}

function buildTRA(service) {
    const now = Date.now();
    const generationTime = toIsoNoMillis(now - 10 * 60 * 1000);
    const expirationTime = toIsoNoMillis(now + 10 * 60 * 1000);
    const uniqueId = Math.floor(now / 1000);

    return `<?xml version="1.0" encoding="UTF-8"?>\n<loginTicketRequest version="1.0">\n  <header>\n    <uniqueId>${uniqueId}</uniqueId>\n    <generationTime>${generationTime}</generationTime>\n    <expirationTime>${expirationTime}</expirationTime>\n  </header>\n  <service>${service}</service>\n</loginTicketRequest>`;
}

function signTRA(traXml, certPem, keyPem) {
    try {
        const cert = forge.pki.certificateFromPem(certPem);
        const privateKey = forge.pki.privateKeyFromPem(keyPem);

        const p7 = forge.pkcs7.createSignedData();
        p7.content = forge.util.createBuffer(traXml, 'utf8');
        p7.addCertificate(cert);
        p7.addSigner({
            key: privateKey,
            certificate: cert,
            digestAlgorithm: forge.pki.oids.sha256,
            authenticatedAttributes: [
                { type: forge.pki.oids.contentType, value: forge.pki.oids.data },
                { type: forge.pki.oids.messageDigest },
                { type: forge.pki.oids.signingTime, value: new Date() },
            ],
        });

        p7.sign({ detached: false });
        const der = forge.asn1.toDer(p7.toAsn1()).getBytes();
        return forge.util.encode64(der);
    } catch (error) {
        throw createError(`No se pudo firmar TRA (WSAA): ${error.message}`);
    }
}

function parseLoginTicketResponse(xmlValue) {
    const xml = decodeEntities(xmlValue);

    const token = extractTag(xml, 'token');
    const sign = extractTag(xml, 'sign');
    const expirationTime = extractTag(xml, 'expirationTime');

    if (!token || !sign || !expirationTime) {
        throw createError('Respuesta WSAA inválida: no se pudo leer token/sign');
    }

    return { token, sign, expirationTime };
}

function isTAValid(ta) {
    if (!ta || !ta.expirationTime) return false;
    const exp = Date.parse(ta.expirationTime);
    if (Number.isNaN(exp)) return false;
    return exp - 60 * 1000 > Date.now();
}

function toNumber(value, field) {
    const num = Number(value);
    if (!Number.isFinite(num)) {
        throw createError(`Campo inválido: ${field}`);
    }
    return num;
}

function firstNode(value) {
    return Array.isArray(value) ? value[0] : value;
}

function errorsToDetail(errorsNode) {
    const errors = firstNode(errorsNode);
    if (!errors) return null;

    const rawErr = firstNode(errors.Err || errors.err || errors);
    if (!rawErr) return errors;

    const code = rawErr.Code || rawErr.code || 'ErrorAFIP';
    const msg = rawErr.Msg || rawErr.msg || JSON.stringify(rawErr);

    return { code, message: msg, raw: errors };
}

function formatAfipDate(dateValue) {
    const str = String(dateValue || '');
    if (!/^\d{8}$/.test(str)) return str || null;
    return `${str.slice(0, 4)}-${str.slice(4, 6)}-${str.slice(6, 8)}`;
}

function normalizeOptionalCollection(detail, field, child) {
    if (!detail[field]) return;

    if (Array.isArray(detail[field])) {
        detail[field] = { [child]: detail[field] };
        return;
    }

    if (!detail[field][child]) {
        detail[field] = { [child]: detail[field] };
    }
}

function buildVoucherRequest(data, auth) {
    const ptoVta = toNumber(data.PtoVta, 'PtoVta');
    const cbteTipo = toNumber(data.CbteTipo, 'CbteTipo');
    const cbteDesde = toNumber(data.CbteDesde, 'CbteDesde');
    const cbteHasta = toNumber(data.CbteHasta, 'CbteHasta');

    const detail = { ...data };
    delete detail.CantReg;
    delete detail.PtoVta;
    delete detail.CbteTipo;

    normalizeOptionalCollection(detail, 'Tributos', 'Tributo');
    normalizeOptionalCollection(detail, 'Iva', 'AlicIva');
    normalizeOptionalCollection(detail, 'CbtesAsoc', 'CbteAsoc');
    normalizeOptionalCollection(detail, 'Compradores', 'Comprador');
    normalizeOptionalCollection(detail, 'Opcionales', 'Opcional');

    return {
        Auth: auth,
        FeCAEReq: {
            FeCabReq: {
                CantReg: cbteHasta - cbteDesde + 1,
                PtoVta: ptoVta,
                CbteTipo: cbteTipo,
            },
            FeDetReq: {
                FECAEDetRequest: detail,
            },
        },
    };
}

async function getWsaaClient() {
    if (!wsaaClientPromise) {
        const wsdl = config.production ? WSDL_WSAA_PROD : WSDL_WSAA_HOMO;
        wsaaClientPromise = soap.createClientAsync(wsdl, { disableCache: true });
    }

    return wsaaClientPromise;
}

async function getWsfeClient() {
    if (!wsfeClientPromise) {
        const wsdl = config.production ? WSDL_WSFE_PROD : WSDL_WSFE_HOMO;
        wsfeClientPromise = soap.createClientAsync(wsdl, { disableCache: true });
    }

    return wsfeClientPromise;
}

async function getServiceTA(service = 'wsfe') {
    const cached = taCache.get(service);
    if (isTAValid(cached)) return cached;

    const diskTA = readTAFromDisk(service);
    if (isTAValid(diskTA)) {
        taCache.set(service, diskTA);
        return diskTA;
    }

    const certPem = readPem(config.cert, 'cert');
    const keyPem = readPem(config.key, 'key');

    const tra = buildTRA(service);
    const cms = signTRA(tra, certPem, keyPem);

    try {
        const wsaa = await getWsaaClient();
        const [response] = await wsaa.loginCmsAsync({ in0: cms });
        const ta = parseLoginTicketResponse(response && response.loginCmsReturn);
        taCache.set(service, ta);
        saveTAToDisk(service, ta);
        return ta;
    } catch (error) {
        const detail = error?.root || error?.response || error?.body || error?.message;
        const detailText = typeof detail === 'string' ? detail : JSON.stringify(detail || '');
        if (detailText.includes('coe.alreadyAuthenticated')) {
            const diskTAFallback = readTAFromDisk(service);
            if (isTAValid(diskTAFallback)) {
                taCache.set(service, diskTAFallback);
                return diskTAFallback;
            }
            throw createError('WSAA devolvio coe.alreadyAuthenticated y no hay TA local vigente. Evita reiniciar el backend o espera el vencimiento del TA actual.', detail, 409);
        }
        throw createError('WSAA loginCms falló: ' + error.message, detail, 401);
    }
}
async function buildAuth() {
    const ta = await getServiceTA('wsfe');

    return {
        Token: ta.token,
        Sign: ta.sign,
        Cuit: toNumber(config.cuit, 'cuit'),
    };
}

function unwrapResult(response, resultField) {
    if (!response) return null;
    return response[resultField] || response;
}

function throwIfAfipErrors(result) {
    if (!result) {
        throw createError('Respuesta vacía de AFIP');
    }

    if (result.Errors) {
        const detail = errorsToDetail(result.Errors);
        const message = detail?.message || 'AFIP devolvió errores';
        throw createError(message, detail, 400);
    }
}

async function getLastVoucher(PtoVta, CbteTipo) {
    try {
        const wsfe = await getWsfeClient();
        const auth = await buildAuth();

        const request = {
            Auth: auth,
            PtoVta: toNumber(PtoVta, 'PtoVta'),
            CbteTipo: toNumber(CbteTipo, 'CbteTipo'),
        };

        const [response] = await wsfe.FECompUltimoAutorizadoAsync(request);
        const result = unwrapResult(response, 'FECompUltimoAutorizadoResult');

        throwIfAfipErrors(result);

        return toNumber(result.CbteNro, 'CbteNro');
    } catch (error) {
        if (error.status) throw error;
        const detail = error?.root || error?.response || error?.body || error?.message;
        throw createError(`Error en FECompUltimoAutorizado: ${error.message}`, detail, 400);
    }
}

async function createVoucher(data) {
    try {
        const wsfe = await getWsfeClient();
        const auth = await buildAuth();

        const request = buildVoucherRequest(data, auth);
        const [response] = await wsfe.FECAESolicitarAsync(request);

        const result = unwrapResult(response, 'FECAESolicitarResult');
        throwIfAfipErrors(result);

        const feDetResp = firstNode(result?.FeDetResp?.FECAEDetResponse);
        if (!feDetResp) {
            throw createError('AFIP no devolvió FECAEDetResponse', result, 400);
        }

        if (feDetResp.Observaciones && feDetResp.Resultado !== 'A') {
            const obs = firstNode(feDetResp.Observaciones.Obs || feDetResp.Observaciones);
            const obsMsg = obs?.Msg || JSON.stringify(obs);
            throw createError(`AFIP rechazó el comprobante: ${obsMsg}`, obs, 400);
        }

        return {
            CAE: feDetResp.CAE,
            CAEFchVto: formatAfipDate(feDetResp.CAEFchVto),
            Resultado: feDetResp.Resultado,
            Observaciones: feDetResp.Observaciones || null,
        };
    } catch (error) {
        if (error.status) throw error;
        const detail = error?.root || error?.response || error?.body || error?.message;
        throw createError(`Error en FECAESolicitar: ${error.message}`, detail, 400);
    }
}

module.exports = {
    ElectronicBilling: {
        getLastVoucher,
        createVoucher,
    },
};


