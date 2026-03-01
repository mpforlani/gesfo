let baseDeDatos = require(`./baseDeDatos`)
let baseDeDatosApp = require(`../../controladores/baseDeDatosApp`)
const fsp = require('fs/promises');
const uuid = require("uuid").v4;
const path = require("path");
const sharp = require("sharp");//Esto para comprimir imagenes
const { exec } = require("child_process");
const os = require("os");
const axios = require("axios")
const cheerio = require("cheerio")

const pLimitModule = require('p-limit');
const pLimit = pLimitModule.default || pLimitModule;
const concurrency = Math.max(2, Math.min(6, (os.cpus()?.length || 2) - 1));
////////////////////////
const limit = pLimit(concurrency);
const asArr = (x) => Array.isArray(x) ? x : (x ? [x] : []);


const getGhostscriptCommand = () => {
    if (os.platform() === "win32") {
        // Ruta absoluta para Windows (ajustá si tenés otra versión)
        return `"C:\\Program Files\\gs\\gs10.05.1\\bin\\gswin64c.exe"`;
    } else {
        // Linux/macOS: Ghostscript está en el PATH como "gs"
        return "gs";
    }
};
// Ruta para Windows
const libreOfficeWindowsPath = `"C:\\Program Files\\LibreOffice\\program\\soffice.exe"`;
// Ruta por defecto en Linux
const libreOfficeLinuxCmd = "libreoffice";
// Detectar el comando correcto según el sistema
const getLibreOfficeCommand = () => {
    const plataforma = os.platform();
    return plataforma === "win32" ? libreOfficeWindowsPath : libreOfficeLinuxCmd;
};
const capitalize = function (word) {
    return word[0].toUpperCase() + word.slice(1);
}
const construirHistoria = (newUpdate) => {

    return {
        descripción: newUpdate.descripcionEnvio,
        fecha: newUpdate.date || new Date(Date.now()),
        user: newUpdate.username,
        modificaciones: JSON.parse(newUpdate.modificaciones || "{}")
    }
}
const version = {
    no: (newUpdate) => { },
    si: construirHistoria
}
const makeObjects = async (keys, body, user, baseDat, files) => {
    delete keys._id;

    let dataBase = baseDeDatos[baseDat] || baseDeDatosApp[baseDat];
    let newPost = new dataBase({ ...body });

    newPost.version = 0;
    newPost.username = user._id;

    const adj = asArr(files?.adjunto);
    if (adj.length) {
        const resultados = await Promise.all(adj.map(f => limit(() => guardAdjunto(f))));
        const pathAdjunto = resultados.filter(Boolean).map(n => '/uploads/' + n);
        const originalNameAdjunto = adj.map(f => f.originalname);
        if (pathAdjunto.length) {
            newPost.path = pathAdjunto;
            newPost.originalname = originalNameAdjunto;
        }
    }

    const colec = asArr(files?.adjuntoColec);
    if (colec.length) {
        newPost.pathColec = colec.map(f => '/uploads/' + f.filename);
        newPost.originalnameColec = colec.map(f => f.originalname);
    }

    const imgs = asArr(files?.imgAdj);
    if (imgs.length) {
        const results = await Promise.all(imgs.map(f => limit(() => guardAdjunto(f))));
        const ultimo = results.filter(Boolean).at(-1);
        if (ultimo) {
            newPost.pathImg = '/uploads/' + ultimo;            // mantengo tu esquema (string)
            newPost.originalnameImg = imgs.at(-1).originalname; // si querés array, te lo cambio
        }
    }

    newPost.historia = [{ descripción: "Creación", fecha: newPost.date, user: newPost.username }];
    return newPost;
};
const updateObjects = async (body, user, files) => {
    body.username = user._id;

    // Normalizo lo existente a arrays
    let pathAdjunto = asArr(body.path).filter(Boolean);
    let originalNameAdjunto = asArr(body.originalname).filter(Boolean);

    // Procesar adjuntos nuevos en paralelo (si hay)
    const nuevosAdj = asArr(files?.adjunto);
    if (nuevosAdj.length) {
        const guardados = await Promise.all(nuevosAdj.map(f => limit(() => guardAdjunto(f))));
        const guardadosOk = guardados.filter(Boolean);

        // Append al final (sin pisar índices anteriores)
        pathAdjunto = pathAdjunto.concat(guardadosOk.map(n => `/uploads/${n}`));               // <-- sin espacio
        originalNameAdjunto = originalNameAdjunto.concat(nuevosAdj.map(f => f.originalname));

        body.path = pathAdjunto;
        body.originalname = originalNameAdjunto;
    }

    // Imagen principal: mantengo tu lógica (toma la última)
    const nuevasImgs = asArr(files?.imgAdj);
    if (nuevasImgs.length) {
        const results = await Promise.all(nuevasImgs.map(f => limit(() => guardAdjunto(f))));
        const ultimo = results.filter(Boolean).at(-1);
        if (ultimo) {
            body.pathImg = '/uploads/' + ultimo;
            body.originalnameImg = nuevasImgs.at(-1).originalname;
        }
    }

    // Aplano body.referencias -> body['referencias.x.y'] = valor
    for (const [indice, valores] of Object.entries(body.referencias || {})) {
        for (const [k, v] of Object.entries(valores || {})) {
            body[`referencias.${indice}.${k}`] = v;
        }
    }
    delete body.referencias;
    delete body.modificaciones;

    return body;
};
const sortObject = (sort) => {

    let sortObjeto = new Object

    if (sort != undefined) {

        let sortSplit = sort.split(`:`)

        sortObjeto[sortSplit[0]] = Number(sortSplit[1])
    } else {
        sortObjeto = undefined

    }

    return sortObjeto
}
const plancharObjeto = (coleccion, key) => {//Lo que hace esta funcion es si el unWind del elemento,pone todos los valores de la coleccion
    //para ese unwind, es decir, si tengo itemVenta: [Flete, Seguro], valor [100,200] el comportamiento natural de un wind es:
    //itemVenta: Flete, valor [100, 200], con esta funcion logro: Flete, valor [100]

    let index = coleccion?.indexOf(key)
    delete coleccion[index]

    let objeto = new Object

    for (let x = 0; x < coleccion.length; x++) {

        objeto[coleccion[x]] = [{ $arrayElemAt: [`$${coleccion[x]}`, `$_idColeccionUnWind`] }]
    }

    return objeto
}
sharp.cache(true);          // usa cache interna
sharp.concurrency(0);       // deja que sharp use núcleos disponibles

const UPLOADS_DIR = path.join(__dirname, '../../front/uploads');
const guardAdjunto = async (archivo) => {
    try {
        const ext = (path.extname(archivo.originalname || '') || '').toLowerCase();
        const nombreFinal = uuid();

        await fsp.mkdir(UPLOADS_DIR, { recursive: true });

        // Tomar input para sharp: buffer (multer memory) o path (multer disk)
        const hasBuffer = !!archivo.buffer;
        const input = hasBuffer ? archivo.buffer : archivo.path;

        // 🖼️ Imágenes → WEBP optimizado
        if ([".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
            const destino = path.join(UPLOADS_DIR, `${nombreFinal}.webp`);
            // rotate() lee metadata EXIF, fit:'inside' conserva proporción sin estirar
            await sharp(input)
                .rotate()
                .resize({ width: 1200, fit: 'inside', withoutEnlargement: true })
                .webp({ quality: 72, effort: 4 }) // effort 4 equilibra CPU/ratio
                .toFile(destino);
            return `${nombreFinal}.webp`;
        }

        // 📄 PDF → (si ya lo tenés comprimido, solo guardar; si no, comprimir)
        if (ext === ".pdf") {
            const pdfBuffer = hasBuffer ? input : await fsp.readFile(input);
            const nombreComprimido = await comprimirPDF(pdfBuffer, {
                outDir: UPLOADS_DIR,
                baseName: nombreFinal
            });
            return nombreComprimido; // e.g. `${nombreFinal}.pdf`
        }

        // 📝 Office → PDF → comprimir
        if ([".doc", ".docx", ".xls", ".xlsx"].includes(ext)) {
            const tempEntrada = path.join(UPLOADS_DIR, `${nombreFinal}${ext}`);
            if (hasBuffer) {
                await fsp.writeFile(tempEntrada, input);
            } else {
                await fsp.copyFile(input, tempEntrada);
            }

            const nombrePDF = await convertirOfficeAPdf(tempEntrada, UPLOADS_DIR); // retorna `${nombreFinal}.pdf` o similar
            await fsp.unlink(tempEntrada).catch(() => { });

            const rutaPDF = path.join(UPLOADS_DIR, nombrePDF);
            const bufferPDF = await fsp.readFile(rutaPDF);
            const nombreComprimido = await comprimirPDF(bufferPDF, {
                outDir: UPLOADS_DIR,
                baseName: path.parse(nombrePDF).name
            });

            await fsp.unlink(rutaPDF).catch(() => { });
            return nombreComprimido;
        }

        // 📦 Otros: guardar tal cual (no sync)
        const destino = path.join(UPLOADS_DIR, `${nombreFinal}${ext || ''}`);
        if (hasBuffer) {
            await fsp.writeFile(destino, input);
        } else {
            await fsp.copyFile(input, destino);
        }
        return `${nombreFinal}${ext || ''}`;
    } catch (err) {
        console.error("Error al guardar archivo:", err);
        return null;
    }
};
async function comprimirPDF(inputBuffer, opts = {}) {
    const carpeta = path.join(__dirname, "../../front/uploads");
    await fsp.mkdir(carpeta, { recursive: true });

    const base = opts.baseName || uuid();
    const nombreEntrada = `${base}.pdf`;
    const nombreSalida = `${uuid()}-compressed.pdf`;
    const rutaEntrada = path.join(carpeta, nombreEntrada);
    const rutaSalida = path.join(carpeta, nombreSalida);

    await fsp.writeFile(rutaEntrada, inputBuffer);

    const gs = getGhostscriptCommand();
    const comando = `${gs} -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/screen -dNOPAUSE -dQUIET -dBATCH -sOutputFile="${rutaSalida}" "${rutaEntrada}"`;

    return new Promise((resolve, reject) => {
        exec(comando, async (error) => {
            try {
                await fsp.unlink(rutaEntrada).catch(() => { });
            } catch (_) { }

            if (error) {
                console.error("❌ Error al comprimir PDF:", error);
                return reject(error);
            }
            return resolve(nombreSalida); // solo nombre
        });
    });
}
const convertirOfficeAPdf = async (entradaPath, salidaDir) => {
    return new Promise((resolve, reject) => {
        const comandoLibreOffice = getLibreOfficeCommand();
        const comando = `${comandoLibreOffice} --headless --convert-to pdf --outdir "${salidaDir}" "${entradaPath}"`;

        exec(comando, (err, stdout, stderr) => {
            if (err) {
                console.error("❌ Error al convertir con LibreOffice:", stderr);
                return reject(err);
            }
            const nombrePDF = path.basename(entradaPath, path.extname(entradaPath)) + ".pdf";
            resolve(nombrePDF);
        });
    });
};
function totalesReportes(totales) {

    return Object.values(totales).map(totalAtr => ({

        $setWindowFields: {
            partitionBy: totalAtr.partition || {},
            output: totalAtr.output || {},
        }
    }));
}
function unwind(con, objetoAdd) {

    if (con == "undefined") return null
    return [
        { $unwind: { path: `$${con}`, includeArrayIndex: `_idColeccionUnWind` } },
        { $addFields: objetoAdd },
        { $addFields: { [con]: [`$${con}`] } }
    ];

}
function generarFechasCotis(desde, hasta) {

    const fechas = [];

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (!desde && !hasta) {
        const ayer = new Date(hoy);
        ayer.setDate(hoy.getDate() - 1);
        desde = ayer;
        hasta = ayer;
    }

    else if (!desde && hasta) {
        desde = new Date(hasta);
        hasta = new Date(hasta);
    }

    let actual = new Date(desde);
    const fin = new Date(hasta);

    while (actual <= fin) {
        const diaSemana = actual.getDay(); // 0 domingo - 6 sábado

        if (diaSemana >= 1 && diaSemana <= 5) {
            const d = String(actual.getDate()).padStart(2, "0");
            const m = String(actual.getMonth() + 1).padStart(2, "0");
            const y = actual.getFullYear();
            fechas.push([d, m, y]);
        }
        actual.setDate(actual.getDate() + 1);
    }

    return fechas;
}

function monedasCotis(monedas) {

    let monedasReturn = ""

    if (monedas) {

        for (const moneda of monedas) {

            monedasReturn += `&filtro${moneda}=1`
        }
    } else {

        monedasReturn += `&filtroDolar=1&filtroEuro=1&filtroReal=1`

    }

    return monedasReturn;

}
async function obtenerBNAporFecha(fechas, monedas) {

    let historicos = []
    let fechasBuscadas = []
    const vistos = new Set();
    for (const fecha of fechas) {

        if (!fechasBuscadas.includes(`${fecha[0]}/${fecha[1]}/${fecha[2]}`)) {

            const url = `https://www.bna.com.ar/Cotizador/HistoricoPrincipales?id=billetes&fecha=${fecha[0]}%2F${fecha[1]}%2F${fecha[2]}${monedas}`;

            const { data } = await axios.get(url);
            const $ = cheerio.load(data);

            $("table tbody").each((indice, table) => {
                const trs = $(table).find("tr");

                if (trs.length > 0) {
                    trs.each((i, tr) => {
                        let tds = $(tr).find("td");

                        let moneda = $(tds[0]).text().trim();
                        let compra = parseFloat($(tds[1]).text().trim().replace(",", "."));
                        let venta = parseFloat($(tds[2]).text().trim().replace(",", "."));
                        let fecha = $(tds[3]).text().trim();

                        if (moneda.includes("(*)")) {
                            moneda = moneda.replace("(*)", "").trim();
                            compra /= 100;
                            venta /= 100;
                        }

                        const key = `${fecha}-${moneda}`;
                        if (!vistos.has(key)) {
                            vistos.add(key);
                            historicos.push({ fecha, moneda, compra, venta });
                            fechasBuscadas.push(fecha);
                        }
                    });
                } else {
                    // “Sin cotizaciones” -> no hago nada
                    return;
                }
            });
            fechasBuscadas.push(`${fecha[0]}-${fecha[1]}-${fecha[2]}`);

        }
    }

    return historicos;
}


module.exports = { capitalize, makeObjects, updateObjects, sortObject, plancharObjeto, guardAdjunto, comprimirPDF, totalesReportes, unwind, generarFechasCotis, obtenerBNAporFecha, monedasCotis, version }