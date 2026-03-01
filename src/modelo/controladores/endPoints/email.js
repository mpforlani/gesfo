const express = require('express');
const router = express.Router();
const User = require("../../models/marketPlace/01 - usuarioSeguridad/User");
const nodemailer = require('nodemailer');//Envio mails
const crypto = require('crypto');//hace direcciones de recupero de emails raras
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const sizeOf = require('image-size');
let baseDeDatos = require(`../baseDeDatos`);
const ExcelJS = require('exceljs');
const { chromium } = require('playwright');
/////Cola Email
const emailQueue = [];
let processingEmailQueue = false;
const emailQueueMulti = [];
let processingEmailQueueMulti = false;
const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false, // true para puerto 465, false para 587
    auth: {
        user: process.env.USERBR,
        pass: process.env.BREVOACCESS
    }
});

async function enviarEmailAdjPdfCustomMult(payload, reqUser) {
    try {
        const { logo, para, copia, copiaOculta, subject, textoDescrip, texto, origen, firma } = payload;

        const css = fs.readFileSync(
            path.join(__dirname, "../../front/css/style.css"),
            "utf-8"
        );

        let adjuntos = [];
        let totalSizeBytes = 0; // 👈 para sumar el tamaño de todos los PDFs

        const browser = await puppeteer.launch({
            executablePath: process.env.NODE_ENV != "development"
                ? (process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium')
                : undefined,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        try {
            const logoBase64 = fs.readFileSync(
                path.join(__dirname, `../../../front/img/${logo}`),
                "base64"
            );

            for (let x = 0; x < texto.length; x++) {

                const htmlParaPdf = `
                <!DOCTYPE html>
                <html>
                <head>
                    <link rel="preconnect" href="https://fonts.gstatic.com">
                    <link href="https://fonts.googleapis.com/css2?family=Raleway&display=swap" rel="stylesheet">
                    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP&display=swap" rel="stylesheet">
                    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Khojki&display=swap" rel="stylesheet">
                    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP&display=swap" rel="stylesheet">
                    <link rel="stylesheet"
                        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0" />
                    <meta charset="utf-8"/>
                    <style>${css}</style>
                </head>
                <body>${texto[x]}</body>
                </html>`;

                const page = await browser.newPage();
                await page.setContent(htmlParaPdf, { waitUntil: 'domcontentloaded' });

                await page.evaluate(async () => { await document.fonts.ready; });
                await page.emulateMediaType('screen');

                // Reemplazo del logo por base64
                await page.evaluate((logoBase64, logo) => {
                    const imgs = document.querySelectorAll('img');
                    imgs.forEach(img => {
                        if (img.src.includes(logo)) {
                            img.src = `data:image/png;base64,${logoBase64}`;
                        }
                    });
                }, logoBase64, logo);

                await page.addScriptTag({
                    url: "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"
                });

                // 👇 devolvemos un array de bytes serializable
                const pdfBytes = await page.evaluate(async () => {
                    const element = document.getElementById("documentoImpresion");
                    element.classList.add("altoAutomatico", "reporte", "html2");

                    const BLEED_PX = 8;
                    const contentWidthPx = element.scrollWidth + BLEED_PX;
                    const contentHeightPx = element.scrollHeight;

                    const opt = {
                        margin: [0, 0, 0, 0],
                        filename: 'reporte.pdf',
                        image: { type: 'jpeg', quality: 0.98 },
                        html2canvas: {
                            scale: 2,
                            scrollX: 0,
                            scrollY: 0,
                            width: contentWidthPx,
                            height: contentHeightPx
                        },
                        jsPDF: {
                            unit: 'mm',
                            format: [contentWidthPx, contentHeightPx],
                            orientation: contentWidthPx > contentHeightPx ? 'landscape' : 'portrait'
                        }
                    };

                    const worker = html2pdf().set(opt).from(element).toPdf();
                    const pdf = await worker.get('pdf');
                    const arrayBuffer = pdf.output('arraybuffer');

                    // 👈 Array de números (bytes) que sí se puede devolver a Node
                    return Array.from(new Uint8Array(arrayBuffer));
                });

                // 👇 acá en Node lo convertís a Buffer
                const pdfBuffer = Buffer.from(pdfBytes);
                totalSizeBytes += pdfBuffer.length; // 👈 acumulás tamaño

                await page.close();

                adjuntos.push({
                    filename: `reporteSemanalCargas_${x + 1}.pdf`,
                    content: pdfBuffer,
                });
            }
        } finally {
            await browser.close();
        }

        let htmlEmail = `
        <div style="font-family:Arial,Helvetica,sans-serif; line-height:1.35;">
        ${textoDescrip || ''}`;

        if (firma?.nombre?.length > 0) {
            htmlEmail += `<br>`;
            htmlEmail += `<div><img src="cid:${firma?.nombre}" width="400"/></div>`;
            adjuntos.push({
                filename: `${firma?.nombre}.${firma?.type}`,
                path: path.join(__dirname, `../../../front/img/${firma?.nombre}.${firma?.type}`),
                cid: firma?.nombre,
                contentDisposition: "inline",
                contentType: `image/${firma?.type}`
            });
        }

        htmlEmail += `</div>`;

        /*const hoy = new Date().toLocaleDateString("sv-SE", { timeZone: "America/Argentina/Buenos_Aires" }); // YYYY-MM-DD
        const paraKey = (Array.isArray(para) ? para : [para])
            .filter(Boolean)
            .map(s => String(s).trim().toLowerCase())
            .sort()
            .join(",");

        const yaEnviadoHoy = await baseDeDatos.LogEmails.exists({
            estado: "enviado",
            username: reqUser?._id,
            origen,
            asunto: subject,
            date: { $regex: `^${hoy}` },
            paraKey
        });

        if (yaEnviadoHoy) {
            console.log(`[EMAIL][SKIP] ya enviado hoy → origen:${origen} asunto:${subject}`);
            return { ok: true, skipped: true };
        }*/

        await transporter.sendMail({
            from: 'Reportes Sbc <no-reply@gesfin.com.ar>',
            to: para,
            cc: copia,
            bcc: copiaOculta,
            subject: `${subject || "Reporte automático"}`,
            html: htmlEmail,
            attachments: adjuntos
        });

        console.log(`[EMAIL][USER:${reqUser?.usernameUser || 'anon'}] enviado a: ${Array.isArray(para) ? para.join(", ") : para}`);
        const fechaLocal = new Date().toLocaleString("sv-SE", {
            timeZone: "America/Argentina/Buenos_Aires",
            hour12: false
        }).replace(" ", "T");

        await baseDeDatos.LogEmails.create({
            fecha: fechaLocal,
            para,
            copia,
            copiaOculta,
            asunto: subject,
            // paraKey, // 👈 agregá esto
            estado: "enviado",
            origen,
            date: fechaLocal,
            username: reqUser._id
        });

        return {
            ok: true,
            receptor: para,
            copia,
            copiaOculta,
            sizeBytes: totalSizeBytes
        };

    } catch (err) {
        console.error(
            err.stack
        );
        throw err;
    }
}
async function enviarEmailAdjPdfCustom(payload, reqUser) {

    let subject; // 👈 definido fuera
    try {
        const {
            logo, para, copia, copiaOculta,
            subject: subjectPayload, // 👈 renombrás
            textoDescrip, texto, origen,
            firma, excelData, indice
        } = payload;
        subject = subjectPayload;
        const css = fs.readFileSync(
            path.join(__dirname, "../../front/css/style.css"),
            "utf-8"
        );

        const htmlParaPdf = `
        <!DOCTYPE html>
        <html>
        <head>
         <link rel="preconnect" href="https://fonts.gstatic.com">
        <link href="https://fonts.googleapis.com/css2?family=Raleway&display=swap" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP&display=swap" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Khojki&display=swap" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP&display=swap" rel="stylesheet">
        <link rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0" />
            <meta charset="utf-8"/><style>${css}</style>
            </head>
        <body>${texto}</body>
        </html>`;

        // ────────────────────────────────────────────────
        //  PUPPETEER (PDF PURO SIN html2pdf/jsPDF)
        // ────────────────────────────────────────────────
        const browser = await puppeteer.launch({
            executablePath: process.env.NODE_ENV != "development"
                ? (process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium')
                : undefined,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        await page.setContent(htmlParaPdf, { waitUntil: 'networkidle0' });

        const logoBase64 = fs.readFileSync(
            path.join(__dirname, `../../../front/img/${logo}`),
            "base64"
        );

        await page.evaluate(async () => { await document.fonts.ready; });
        await page.emulateMediaType('screen');

        await page.evaluate((logoBase64, logo) => {
            const imgs = document.querySelectorAll('img');
            imgs.forEach(img => {
                if (img.src.includes(logo)) {
                    img.src = `data:image/png;base64,${logoBase64}`;
                }
            });
        }, logoBase64, logo);

        // ────────────────────────────────────────────────
        //  CALCULAR TAMAÑO REAL DEL DIV SIN A4
        // ────────────────────────────────────────────────
        const { width, height } = await page.evaluate(() => {
            const BLEED_PX = 8;
            const element = document.getElementById("documentoImpresion");

            element.classList.add("altoAutomatico");
            element.classList.add("reporte");
            element.classList.add("html2");

            // ancho/alto REAL (con scroll)
            const fullWidth = element.scrollWidth;
            const fullHeight = element.scrollHeight;

            // 👉 le agregamos margen extra a la derecha
            const EXTRA_RIGHT = 800; // probá 400, si falta un poquito más, subilo a 500

            return {
                width: Math.ceil(fullWidth + EXTRA_RIGHT) + BLEED_PX,
                height: Math.ceil(fullHeight) + BLEED_PX
            };
        });

        await page.setViewport({
            width: Math.max(800, Math.ceil(width)),
            height: Math.max(600, Math.ceil(height))
        });

        const pdfBuffer = await page.pdf({
            printBackground: true,
            margin: { top: 0, right: 0, bottom: 0, left: 0 },
            pageRanges: "1",
            width: `${width}px`,
            height: `${height}px`
        });

        await browser.close();

        // ────────────────────────────────────────────────
        //  EXCEL (IGUAL QUE TENÍAS)
        // ────────────────────────────────────────────────
        let excelBuffer = null;

        if (excelData && Array.isArray(excelData.rows) && excelData.rows.length > 0) {

            const workbook = new ExcelJS.Workbook();
            const sheet = workbook.addWorksheet('Reporte', {
                properties: { defaultRowHeight: 18 }
            });

            sheet.addRow([]);
            sheet.addRow([]);

            let headerRow;

            if (Array.isArray(excelData.columns) && excelData.columns.length > 0) {
                const headers = ["", ...excelData.columns];
                headerRow = sheet.addRow(headers);
            }

            excelData.rows.forEach(row => {
                const rowShifted = ["", ...row];
                sheet.addRow(rowShifted);
            });

            const totalCols = (excelData.columns?.length || 0) + 1;
            sheet.columns = Array.from({ length: totalCols }, (_, i) => ({
                width: i === 0 ? 3 : 18
            }));

            if (headerRow) {
                headerRow.eachCell((cell, colNumber) => {
                    if (colNumber === 1) return;

                    cell.font = {
                        bold: true,
                        color: { argb: 'FFFFFFFF' }
                    };
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FF1F4E78' }
                    };
                    cell.alignment = { vertical: 'middle', horizontal: 'center' };
                    cell.border = {
                        top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
                        bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
                        left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
                        right: { style: 'thin', color: { argb: 'FFCCCCCC' } }
                    };
                });
            }

            const firstDataRowIndex = (headerRow ? headerRow.number + 1 : 4);

            for (let rowIndex = firstDataRowIndex; rowIndex <= sheet.rowCount; rowIndex++) {
                const row = sheet.getRow(rowIndex);
                const isEven = (rowIndex - firstDataRowIndex + 1) % 2 === 0;

                row.eachCell((cell, colNumber) => {
                    if (colNumber === 1) return;

                    if (isEven) {
                        cell.fill = {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: { argb: 'FFF5F5F5' }
                        };
                    }

                    cell.border = {
                        top: { style: 'thin', color: { argb: 'FFE0E0E0' } },
                        bottom: { style: 'thin', color: { argb: 'FFE0E0E0' } },
                        left: { style: 'thin', color: { argb: 'FFE0E0E0' } },
                        right: { style: 'thin', color: { argb: 'FFE0E0E0' } }
                    };

                    // 👉 CENTRAR TODAS LAS CELDAS
                    cell.alignment = { horizontal: 'center', vertical: 'middle' };

                    // 👉 SI ES NÚMERO (mantener formato)
                    if (typeof cell.value === 'number') {
                        cell.numFmt = '#,##0.00';
                    }
                });

            }

            sheet.columns.forEach(column => {
                let maxLength = 10;
                column.eachCell({ includeEmpty: true }, cell => {
                    let valor = cell.value;

                    if (valor == null) valor = "";
                    if (typeof valor !== "string") valor = String(valor);

                    const length = valor.length;
                    if (length > maxLength) maxLength = length;
                });

                column.width = maxLength + 2;
            });

            excelBuffer = await workbook.xlsx.writeBuffer();
        }

        // ────────────────────────────────────────────────
        //  EMAIL FINAL — IGUAL QUE TENÍAS
        // ────────────────────────────────────────────────
        let htmlEmail = `
        <div style="font-family:Arial,Helvetica,sans-serif; line-height:1.35;">
        ${textoDescrip || ''}`;

        let adjuntos = [{
            filename: "reporteSemanalCargas.pdf",
            content: pdfBuffer,
        }];

        if (excelBuffer) {
            adjuntos.push({
                filename: "reporteSemanalCargas.xlsx",
                content: excelBuffer,
                contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            });
        }

        if (firma?.nombre?.length > 0) {
            htmlEmail += `<br>`;
            htmlEmail += `<div><img src="cid:${firma?.nombre}" width="400"/></div>`;
            adjuntos.push({
                filename: `${firma?.nombre}.${firma?.type}`,
                path: path.join(__dirname, `../../../front/img/${firma?.nombre}.${firma?.type}`),
                cid: firma?.nombre,
                contentDisposition: "inline",
                contentType: `image/${firma?.type}`
            });
        }

        htmlEmail += `</div>`;

        await transporter.sendMail({
            from: 'Reportes Sbc <no-reply@gesfin.com.ar>',
            to: para,
            cc: copia,
            bcc: copiaOculta,
            subject: `${subject || "Reporte automático"}`,
            html: htmlEmail,
            attachments: adjuntos
        });

        console.log(`[EMAIL][USER:${reqUser?.usernameUser || 'anon'} indice:${indice}] enviado a: ${Array.isArray(para) ? para.join(", ") : para}`);
        const fechaLocal = new Date().toLocaleString("sv-SE", {
            timeZone: "America/Argentina/Buenos_Aires",
            hour12: false
        }).replace(" ", "T");

        await baseDeDatos.LogEmails.create({
            fecha: fechaLocal,
            para: para,
            copia: copia,
            copiaOculta: copiaOculta,
            asunto: subject,
            estado: "enviado",
            origen,
            date: fechaLocal,
            username: reqUser._id
        });

        return {
            ok: true,
            receptor: para,
            copia,
            copiaOculta,
            sizeBytes: pdfBuffer.length
        };

    } catch (err) {
        console.error(
            `[EMAIL][USER:${reqUser?.usernameUser || 'anon'}][asunto:${subject}] STACK → ${err.stack}`
        );
        throw err;
    }
}
/*async function enviarEmailAdjPdfCustom(payload, reqUser) {
    try {
        const { logo, para, copia, copiaOculta, subject, textoDescrip, texto, origen, firma, excelData } = payload;   // 👈 sumo excelData

        const css = fs.readFileSync(
            path.join(__dirname, "../../front/css/style.css"),
            "utf-8"
        );

        const htmlParaPdf = `
        <!DOCTYPE html>
        <html>
        <head>
         <link rel="preconnect" href="https://fonts.gstatic.com">
        <lin href="https://fonts.googleapis.com/css2?family=Raleway&display=swap" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP&display=swap" rel="stylesheet">
        <!--letra Form Individual-->
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Khojki&display=swap" rel="stylesheet">
        <!--letra Menu izquierda-->
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP&display=swap" rel="stylesheet">
        <!--GOOGLE ICONs-->
        <link rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0" />
            <meta charset="utf-8"/><style>${css}</style>
            </head>
        <body>${texto}</body>
        </html>`;

        const browser = await puppeteer.launch({
            executablePath: process.env.NODE_ENV != "development"
                ? (process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium')
                : undefined,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        await page.setContent(htmlParaPdf, { waitUntil: 'domcontentloaded' });

        const logoBase64 = fs.readFileSync(
            path.join(__dirname, `../../../front/img/${logo}`),
            "base64"
        );

        await page.evaluate(async () => { await document.fonts.ready; });
        await page.emulateMediaType('screen');

        await page.evaluate((logoBase64, logo) => {
            const imgs = document.querySelectorAll('img');
            imgs.forEach(img => {
                if (img.src.includes(logo)) {
                    img.src = `data:image/png;base64,${logoBase64}`;
                }
            });
        }, logoBase64, logo);

        await page.addScriptTag({
            url: "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"
        });

        const pdfBase64 = await page.evaluate(async () => {
            const element = document.getElementById("documentoImpresion");
            element.classList.add("altoAutomatico");
            element.classList.add("reporte");
            element.classList.add("html2");

            const BLEED_PX = 8;

            const contentWidthPx = element.scrollWidth + BLEED_PX;
            const contentHeightPx = element.scrollHeight;

            const opt = {
                margin: [0, 0, 0, 0],
                filename: 'reporte.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: {
                    scale: 2,
                    scrollX: 0,
                    scrollY: 0,
                    width: contentWidthPx,
                    height: contentHeightPx
                },
                jsPDF: {
                    unit: 'mm',
                    format: [contentWidthPx, contentHeightPx],
                    orientation: contentWidthPx > contentHeightPx ? 'landscape' : 'portrait'
                }
            };

            const worker = html2pdf().set(opt).from(element).toPdf();
            const pdf = await worker.get('pdf');
            const arrayBuffer = pdf.output('arraybuffer');
            const uint8 = new Uint8Array(arrayBuffer);
            let binary = "";
            for (let i = 0; i < uint8.length; i++) {
                binary += String.fromCharCode(uint8[i]);
            }
            return btoa(binary);
        });

        const pdfBuffer = Buffer.from(pdfBase64, 'base64');

        // 🔹 Generar Excel (opcional, solo si viene excelData)
        let excelBuffer = null;
        if (excelData && Array.isArray(excelData.rows) && excelData.rows.length > 0) {
            const workbook = new ExcelJS.Workbook();
            const sheet = workbook.addWorksheet('Reporte', {
                properties: { defaultRowHeight: 18 }
            });

            // 👉 2 filas de margen
            sheet.addRow([]);
            sheet.addRow([]);

            let headerRow;

            // 👉 columna de margen + encabezados
            if (Array.isArray(excelData.columns) && excelData.columns.length > 0) {
                const headers = ["", ...excelData.columns]; // deja col A libre
                headerRow = sheet.addRow(headers);
            }

            // 👉 columna de margen + filas de datos
            excelData.rows.forEach(row => {
                const rowShifted = ["", ...row]; // col A vacía
                sheet.addRow(rowShifted);
            });

            // 👉 anchos de columnas (A chiquita como margen)
            const totalCols = (excelData.columns?.length || 0) + 1;
            sheet.columns = Array.from({ length: totalCols }, (_, i) => ({
                width: i === 0 ? 3 : 18
            }));

            // 👉 estilo header (fila 3)
            if (headerRow) {
                headerRow.eachCell((cell, colNumber) => {
                    if (colNumber === 1) return; // margen sin estilo

                    cell.font = {
                        bold: true,
                        color: { argb: 'FFFFFFFF' }
                    };
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FF1F4E78' } // azul oscuro
                    };
                    cell.alignment = { vertical: 'middle', horizontal: 'center' };
                    cell.border = {
                        top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
                        bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
                        left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
                        right: { style: 'thin', color: { argb: 'FFCCCCCC' } }
                    };
                });
            }

            // 👉 zebra + formato numérico
            const firstDataRowIndex = (headerRow ? headerRow.number + 1 : 4);

            for (let rowIndex = firstDataRowIndex; rowIndex <= sheet.rowCount; rowIndex++) {
                const row = sheet.getRow(rowIndex);
                const isEven = (rowIndex - firstDataRowIndex + 1) % 2 === 0; // zebra

                row.eachCell((cell, colNumber) => {
                    if (colNumber === 1) return; // margen

                    // zebra: solo relleno suave en filas pares
                    if (isEven) {
                        cell.fill = {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: { argb: 'FFF5F5F5' } // gris muy claro
                        };
                    }

                    // borde fino alrededor
                    cell.border = {
                        top: { style: 'thin', color: { argb: 'FFE0E0E0' } },
                        bottom: { style: 'thin', color: { argb: 'FFE0E0E0' } },
                        left: { style: 'thin', color: { argb: 'FFE0E0E0' } },
                        right: { style: 'thin', color: { argb: 'FFE0E0E0' } }
                    };

                    // formato numérico profesional para números
                    if (typeof cell.value === 'number') {
                        cell.numFmt = '#,##0.00';
                        cell.alignment = { horizontal: 'right', vertical: 'middle' };
                    }
                });
            }
            // 🔹 Auto-ajustar el ancho de columnas según contenido
            sheet.columns.forEach(column => {
                let maxLength = 10; // ancho mínimo
                column.eachCell({ includeEmpty: true }, cell => {
                    let valor = cell.value;

                    if (valor == null) valor = "";
                    if (typeof valor !== "string") valor = String(valor);

                    // medir texto (no exacto a px, pero muy bueno para Excel)
                    const length = valor.length;
                    if (length > maxLength) maxLength = length;
                });

                // Ajuste final: un poco más ancho para que no quede apretado
                column.width = maxLength + 2;
            });

            excelBuffer = await workbook.xlsx.writeBuffer();
        }


        await browser.close();

        let htmlEmail = `
        <div style="font-family:Arial,Helvetica,sans-serif; line-height:1.35;">
        ${textoDescrip || ''}`;

        let adjuntos = [{
            filename: "reporteSemanalCargas.pdf",
            content: pdfBuffer,
        }];

        // 🔹 Adjuntar Excel si existe
        if (excelBuffer) {
            adjuntos.push({
                filename: "reporteSemanalCargas.xlsx",
                content: excelBuffer,
                contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            });
        }

        if (firma?.nombre?.length > 0) {
            htmlEmail += `<br>`;
            htmlEmail += `<div><img src="cid:${firma?.nombre}" width="400"/></div>`;
            adjuntos.push({
                filename: `${firma?.nombre}.${firma?.type}`,
                path: path.join(__dirname, `../../../front/img/${firma?.nombre}.${firma?.type}`),
                cid: firma?.nombre,
                contentDisposition: "inline",
                contentType: `image/${firma?.type}`
            });
        }

        htmlEmail += `</div>`;

        await transporter.sendMail({
            from: 'Reportes Sbc <no-reply@gesfin.com.ar>',
            to: para,
            cc: copia,
            bcc: copiaOculta,
            subject: `${subject || "Reporte automático"}`,
            html: htmlEmail,
            attachments: adjuntos
        });

        console.log(`[EMAIL][USER:${reqUser?.usernameUser || 'anon'}] enviado a: ${Array.isArray(para) ? para.join(", ") : para}`);
        const fechaLocal = new Date().toLocaleString("sv-SE", {
            timeZone: "America/Argentina/Buenos_Aires",
            hour12: false
        }).replace(" ", "T");

        await baseDeDatos.LogEmails.create({
            fecha: fechaLocal,
            para: para,
            copia: copia,
            copiaOculta: copiaOculta,
            asunto: subject,
            estado: "enviado",
            origen,
            date: fechaLocal,
            username: reqUser._id
        });

        return {
            ok: true,
            receptor: para,
            copia,
            copiaOculta,
            sizeBytes: pdfBuffer.length
        };

    } catch (err) {
        console.error(
            `[EMAIL][USER:${reqUser?.usernameUser || 'anon'}] STACK → ${err.stack}`
        );
        throw err;
    }
}*/
async function processNextEmailJob() {
    if (processingEmailQueue) return;
    processingEmailQueue = true;

    try {
        while (emailQueue.length > 0) {
            const job = emailQueue.shift();

            console.log(`[QUEUE] start indice:${job?.payload?.indice} to:${job?.payload?.para}`);

            try {
                await enviarEmailAdjPdfCustom(job.payload, job.reqUser);
                console.log(`[QUEUE] ok indice:${job?.payload?.indice}`);
            } catch (err) {
                console.error(`[QUEUE] fail indice:${job?.payload?.indice} → ${err?.stack || err}`);
                // 👇 NO rethrow, así sigue con el próximo
            }
        }
    } finally {
        processingEmailQueue = false;
    }
}
async function processNextEmailJobMulti() {
    if (processingEmailQueueMulti) return;

    const job = emailQueueMulti.shift();
    if (!job) return;

    processingEmailQueueMulti = true;

    try {
        await enviarEmailAdjPdfCustomMult(job.payload, job.reqUser);
    } catch (err) {
        console.error(
            //  `[QUEUE][USER:${job.reqUser?.usernameUser || 'anon'}] STACK → ${err.stack}`
            err.stack
        );
    } finally {
        processingEmailQueueMulti = false;
        setImmediate(processNextEmailJobMulti);

    }
}
function enqueueEmailJob(payload, reqUser) {
    emailQueue.push({ payload, reqUser });
    processNextEmailJob();
}
function enqueueEmailJobMulti(payload, reqUser) {
    emailQueueMulti.push({ payload, reqUser });
    processNextEmailJobMulti();
}
router.put('/emailAdjPdfCustomCola', (req, res) => {
    try {
        console.log("email Pedido:" + req.body.indice)
        // acá decidís qué entra al payload → hoy solo usás req.body, así que alcanza
        enqueueEmailJob(req.body, req.user);

        res.json({
            ok: true,
            queued: true,
            mensaje: "Reporte encolado para envío"
        });

    } catch (err) {
        console.error(
            `[BACK][USER:${req.user?.usernameUser || 'anon'}] STACK → ${err.stack}`
        );
        res.status(500).json({ ok: false, error: err.message });
    }
});
router.put('/emailAdjPdfCustomColaMulti', (req, res) => {
    try {
        // acá decidís qué entra al payload → hoy solo usás req.body, así que alcanza

        enqueueEmailJobMulti(req.body, req.user);


        res.json({
            ok: true,
            queued: true,
            mensaje: "Reporte encolado para envío"
        });

    } catch (err) {
        console.error(
            `[BACK][USER:${req.user?.usernameUser || 'anon'}] STACK → ${err.stack}`
        );
        res.status(500).json({ ok: false, error: err.message });
    }
});
router.put('/recuperarContrasena', async (req, res) => {
    try {

        const { usernameUser, email } = req.body;
        const userRecuperar = await User.findOne({ usernameUser, email });

        if (userRecuperar) {

            const token = crypto.randomBytes(32).toString('hex');
            const link = `${process.env.BASE_URL}/recuperar/${token}`; // fallback local}${token}`;

            // guardás el token en la base junto al usuario y una expiración

            const offset = new Date().getTimezoneOffset() * 60000
            await User.updateOne(
                { _id: userRecuperar._id },
                { $set: { resetToken: token, resetExpires: new Date(Date.now() + (1000 * 60 * 30) - offset) } } // 30 minutos
            );

            const info = await transporter.sendMail({
                from: 'Soporte <no-reply@gesfin.com.ar>',
                to: `${email}`,
                subject: 'Solicitud de recuperacion de contraseña',
                html: `<p> Hola ${userRecuperar.name},  🎉</p>
                     <p>Recibimos una solicitud para restablecer tu contraseña.</p>
                     <p>Haz clic en el siguiente enlace para continuar:</p>
                     <p><a href="${link}">Recuperar contraseña</a></p>
                     <p>Este enlace es válido por 10 minutos.</p>`
            });

            res.json(`ok`);

        } else {
            res.json("No se encontró ningún usuario con los datos ingresados");
        }

    } catch (error) {
        console.log("Recuperar contrasena")
        console.log(error)
        res.json(error);
    }
})
router.put('/emailAdjunto', async (req, res) => {
    try {
        const { format, logo, para, copia, copiaOculta, subject, textoDescrip, texto, origen, firma } = req.body;

        const css = fs.readFileSync(
            path.join(__dirname, "../../front/css/style.css"),
            "utf-8"
        );

        const htmlParaPdf = `
        <!DOCTYPE html><html><head>
         <link rel="preconnect" href="https://fonts.gstatic.com">
        <link href="https://fonts.googleapis.com/css2?family=Raleway&display=swap" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP&display=swap" rel="stylesheet">
        <!--letra Form Individual-->
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Khojki&display=swap" rel="stylesheet">
        <!--letra Menu izquierda-->
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP&display=swap" rel="stylesheet">
        <!--letra Pestana-->
        <!--GOOGLE ICONs-->
        <link rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0" />
        <meta charset="utf-8"/><style>${css}</style></head>
        <body>${texto}</body>
        </html>`;

        const browser = await puppeteer.launch({
            executablePath: process.env.NODE_ENV != "development"
                ? (process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium')
                : undefined, // en local, Puppeteer usa su Chrome bundle
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();

        await page.setContent(htmlParaPdf, { waitUntil: 'domcontentloaded' });

        const logoBase64 = fs.readFileSync(
            path.join(__dirname, `../../../front/img/${logo}`),
            "base64"
        );

        await page.evaluate((logoBase64, logo) => {
            const imgs = document.querySelectorAll('img');
            imgs.forEach(img => {
                if (img.src.includes(logo)) {
                    img.src = `data:image/png;base64,${logoBase64}`;
                }
            });
        }, logoBase64, logo);

        await page.addScriptTag({
            url: "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"
        });

        const pdfBuffer = await page.pdf({
            ...format,           // { width:'xxxmm', height:'yyymm' } ó { format:'A4', landscape:true }
            printBackground: true,
            margin: {
                top: '0mm',
                bottom: '0mm',
                left: '0mm',
                right: '0mm'
            }
        });

        await browser.close();

        // enviar por email adjunto
        const info = await transporter.sendMail({
            from: 'Reporte Sbc <no-reply@gesfin.com.ar>',
            to: para,
            cc: copia,
            bcc: copiaOculta,
            subject: `${subject || "Reporte automático"}`,
            html: textoDescrip,
            attachments: [
                {
                    filename: "reporte.pdf",
                    content: pdfBuffer
                }
            ]
        });

        const fechaLocal = new Date().toLocaleString("sv-SE", {
            timeZone: "America/Argentina/Buenos_Aires",
            hour12: false
        }).replace(" ", "T");

        await baseDeDatos.LogEmails.create({
            fecha: fechaLocal,
            para: para,
            copia: copia,
            copiaOculta: copiaOculta,
            asunto: subject,
            estado: "enviado",
            origen,
            date: fechaLocal,
            username: req.user._id
        });

        res.json("ok");

    } catch (error) {
        console.log(req?.query)
        console.log(req?.user?.name)
        console.log(error)
        console.log("Stack")
        console.log(error.stack)
        res.json(error.stack);
    }
});
router.put('/emailAdjPdfCustom', async (req, res) => {
    try {
        const { logo, para, copia, copiaOculta, subject, textoDescrip, texto, origen, firma, excelData } = req.body;

        const css = fs.readFileSync(
            path.join(__dirname, "../../front/css/style.css"),
            "utf-8"
        );

        const htmlParaPdf = `
        <!DOCTYPE html>
        <html>
        <head>
         <link rel="preconnect" href="https://fonts.gstatic.com">
        <link href="https://fonts.googleapis.com/css2?family=Raleway&display=swap" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP&display=swap" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Khojki&display=swap" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP&display=swap" rel="stylesheet">
        <link rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0" />
            <meta charset="utf-8"/><style>${css}</style>
            </head>
        <body>${texto}</body>
        </html>`;

        // ────────────────────────────────────────────────
        //  PUPPETEER (PDF PURO SIN html2pdf/jsPDF)
        // ────────────────────────────────────────────────
        const browser = await puppeteer.launch({
            executablePath: process.env.NODE_ENV != "development"
                ? (process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium')
                : undefined,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        await page.setContent(htmlParaPdf, { waitUntil: 'networkidle0' });

        const logoBase64 = fs.readFileSync(
            path.join(__dirname, `../../../front/img/${logo}`),
            "base64"
        );

        await page.evaluate(async () => { await document.fonts.ready; });
        await page.emulateMediaType('screen');

        await page.evaluate((logoBase64, logo) => {
            const imgs = document.querySelectorAll('img');
            imgs.forEach(img => {
                if (img.src.includes(logo)) {
                    img.src = `data:image/png;base64,${logoBase64}`;
                }
            });
        }, logoBase64, logo);

        // ────────────────────────────────────────────────
        //  CALCULAR TAMAÑO REAL DEL DIV SIN A4
        // ────────────────────────────────────────────────
        const { width, height } = await page.evaluate(() => {
            const BLEED_PX = 8;
            const element = document.getElementById("documentoImpresion");

            element.classList.add("altoAutomatico");
            element.classList.add("reporte");
            element.classList.add("html2");

            // ancho/alto REAL (con scroll)
            const fullWidth = element.scrollWidth;
            const fullHeight = element.scrollHeight;

            // margen extra a la derecha para evitar recorte
            const EXTRA_RIGHT = 800;

            return {
                width: Math.ceil(fullWidth + EXTRA_RIGHT) + BLEED_PX,
                height: Math.ceil(fullHeight) + BLEED_PX
            };
        });

        await page.setViewport({
            width: Math.max(800, Math.ceil(width)),
            height: Math.max(600, Math.ceil(height))
        });

        const pdfBuffer = await page.pdf({
            printBackground: true,
            margin: { top: 0, right: 0, bottom: 0, left: 0 },
            pageRanges: "1",
            width: `${width}px`,
            height: `${height}px`
        });

        await browser.close();

        // ────────────────────────────────────────────────
        //  EXCEL (MISMO QUE EN LA FUNCIÓN CON COLA)
        // ────────────────────────────────────────────────
        let excelBuffer = null;

        if (excelData && Array.isArray(excelData.rows) && excelData.rows.length > 0) {

            const workbook = new ExcelJS.Workbook();
            const sheet = workbook.addWorksheet('Reporte', {
                properties: { defaultRowHeight: 18 }
            });

            // 2 filas vacías arriba
            sheet.addRow([]);
            sheet.addRow([]);

            let headerRow;

            if (Array.isArray(excelData.columns) && excelData.columns.length > 0) {
                const headers = ["", ...excelData.columns]; // deja col A libre
                headerRow = sheet.addRow(headers);
            }

            excelData.rows.forEach(row => {
                const rowShifted = ["", ...row]; // col A vacía
                sheet.addRow(rowShifted);
            });

            const totalCols = (excelData.columns?.length || 0) + 1;
            sheet.columns = Array.from({ length: totalCols }, (_, i) => ({
                width: i === 0 ? 3 : 18
            }));

            if (headerRow) {
                headerRow.eachCell((cell, colNumber) => {
                    if (colNumber === 1) return;

                    cell.font = {
                        bold: true,
                        color: { argb: 'FFFFFFFF' }
                    };
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FF1F4E78' }
                    };
                    cell.alignment = { vertical: 'middle', horizontal: 'center' };
                    cell.border = {
                        top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
                        bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
                        left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
                        right: { style: 'thin', color: { argb: 'FFCCCCCC' } }
                    };
                });
            }

            const firstDataRowIndex = (headerRow ? headerRow.number + 1 : 4);

            for (let rowIndex = firstDataRowIndex; rowIndex <= sheet.rowCount; rowIndex++) {
                const row = sheet.getRow(rowIndex);
                const isEven = (rowIndex - firstDataRowIndex + 1) % 2 === 0;
                row.eachCell((cell, colNumber) => {
                    if (colNumber === 1) return;

                    if (isEven) {
                        cell.fill = {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: { argb: 'FFF5F5F5' }
                        };
                    }

                    cell.border = {
                        top: { style: 'thin', color: { argb: 'FFE0E0E0' } },
                        bottom: { style: 'thin', color: { argb: 'FFE0E0E0' } },
                        left: { style: 'thin', color: { argb: 'FFE0E0E0' } },
                        right: { style: 'thin', color: { argb: 'FFE0E0E0' } }
                    };

                    // 👉 CENTRAR TODAS LAS CELDAS
                    cell.alignment = { horizontal: 'center', vertical: 'middle' };

                    // 👉 SI ES NÚMERO (mantener formato)
                    if (typeof cell.value === 'number') {
                        cell.numFmt = '#,##0.00';
                    }
                });

            }

            sheet.columns.forEach(column => {
                let maxLength = 10;
                column.eachCell({ includeEmpty: true }, cell => {
                    let valor = cell.value;

                    if (valor == null) valor = "";
                    if (typeof valor !== "string") valor = String(valor);

                    const length = valor.length;
                    if (length > maxLength) maxLength = length;
                });

                column.width = maxLength + 2;
            });

            excelBuffer = await workbook.xlsx.writeBuffer();
        }

        // ────────────────────────────────────────────────
        //  EMAIL FINAL
        // ────────────────────────────────────────────────
        let htmlEmail = `
        <div style="font-family:Arial,Helvetica,sans-serif; line-height:1.35;">
        ${textoDescrip || ''}`;

        let adjuntos = [{
            filename: "reporteSemanalCargas.pdf",
            content: pdfBuffer,
        }];

        if (excelBuffer) {
            adjuntos.push({
                filename: "reporteSemanalCargas.xlsx",
                content: excelBuffer,
                contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            });
        }

        if (firma?.nombre?.length > 0) {
            htmlEmail += `<br>`;
            htmlEmail += `<div><img src="cid:${firma?.nombre}" width="400"/></div>`;
            adjuntos.push({
                filename: `${firma?.nombre}.${firma?.type}`,
                path: path.join(__dirname, `../../../front/img/${firma?.nombre}.${firma?.type}`),
                cid: firma?.nombre,
                contentDisposition: "inline",
                contentType: `image/${firma?.type}`
            });
        }

        htmlEmail += `</div>`;

        await transporter.sendMail({
            from: 'Reportes Sbc <no-reply@gesfin.com.ar>',
            to: para,
            cc: copia,
            bcc: copiaOculta,
            subject: `${subject || "Reporte automático"}`,
            html: htmlEmail,
            attachments: adjuntos
        });

        console.log(
            `[EMAIL][USER:${req.user?.usernameUser || 'anon'}] enviado a: ${Array.isArray(para) ? para.join(", ") : para}`
        );

        const fechaLocal = new Date().toLocaleString("sv-SE", {
            timeZone: "America/Argentina/Buenos_Aires",
            hour12: false
        }).replace(" ", "T");

        await baseDeDatos.LogEmails.create({
            fecha: fechaLocal,
            para: para,
            copia: copia,
            copiaOculta: copiaOculta,
            asunto: subject,
            estado: "enviado",
            origen,
            date: fechaLocal,
            username: req.user._id
        });

        res.json({
            ok: true,
            mensaje: "Reporte enviado",
            receptor: para,
            copia,
            copiaOculta,
            sizeBytes: pdfBuffer.length
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, error: err.message });
    }
});
router.post("/pdf", async (req, res) => {
    const { html, baseUrl } = req.body;

    let browser, page;

    try {

        const launchOptions = {
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
            headless: true
        };

        if (process.env.NODE_ENV !== "development") {
            launchOptions.executablePath = process.env.PLAYWRIGHT_CHROMIUM_PATH || "/usr/bin/chromium";
        }

        browser = await chromium.launch(launchOptions);
        page = await browser.newPage();

        page.on("requestfailed", (r) => console.log("FAILED", r.url(), r.failure()?.errorText));
        page.on("response", (r) => { if (r.status() >= 400) console.log("HTTP", r.status(), r.url()); });

        const css = fs.readFileSync(path.join(__dirname, "../../front/css/style.css"), "utf-8");

        const htmlParaPdf = `
      <!DOCTYPE html>
      <html>
        <head>
          ${baseUrl ? `<base href="${baseUrl.endsWith("/") ? baseUrl : baseUrl + "/"}">` : ""}
          <meta charset="utf-8"/>
          <style>${css}</style>
        </head>
        <body>${html}</body>
      </html>`;

        await page.setContent(htmlParaPdf, { waitUntil: "domcontentloaded" });
        await page.waitForLoadState("networkidle");

        await page.evaluate(() => {
            const el = document.getElementById("documentoImpresion");
            if (el) el.classList.add("puppeteer-pdf");
        });

        await page.emulateMedia({ media: "screen" });

        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,
            preferCSSPageSize: true,
            margin: { top: "0mm", right: "1mm", bottom: "0mm", left: "1mm" }
        });

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", 'inline; filename="reporte.pdf"');
        res.end(pdfBuffer);

    } catch (e) {
        console.error("PDF ERROR", e);
        res.status(500).json({ error: String(e?.message || e) });
    } finally {
        await page?.close().catch(() => { });
        await browser?.close().catch(() => { });
    }
});
router.put('/emailAdjPdfCustomImgInsert', async (req, res) => {
    try {
        const { format, logo, para, copia, copiaOculta, subject, textoDescrip, texto, origen, firma } = req.body;

        const css = fs.readFileSync(
            path.join(__dirname, "../../front/css/style.css"),
            "utf-8"
        );

        const htmlParaPdf = `
        <!DOCTYPE html>
        <html>
        <head>
         <link rel="preconnect" href="https://fonts.gstatic.com">
        <link href="https://fonts.googleapis.com/css2?family=Raleway&display=swap" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP&display=swap" rel="stylesheet">
        <!--letra Form Individual-->
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Khojki&display=swap" rel="stylesheet">
        <!--letra Menu izquierda-->
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP&display=swap" rel="stylesheet">
        <!--letra Pestana-->
        <!--GOOGLE ICONs-->
        <link rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0" />
            <meta charset="utf-8"/><style>${css}</style>
            </head>
        <body>${texto}</body>
        </html>`;

        const browser = await puppeteer.launch({
            executablePath: process.env.NODE_ENV != "development"
                ? (process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium')
                : undefined,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        await page.setContent(htmlParaPdf, { waitUntil: 'domcontentloaded' });

        const logoBase64 = fs.readFileSync(
            path.join(__dirname, `../../../front/img/${logo}`),
            "base64"
        );
        await page.evaluate(async () => { await document.fonts.ready; });
        await page.emulateMediaType('screen');
        await page.evaluate((logoBase64, logo) => {
            const imgs = document.querySelectorAll('img');
            imgs.forEach(img => {
                if (img.src.includes(logo)) {
                    img.src = `data:image/png;base64,${logoBase64}`;
                }
            });
        }, logoBase64, logo);

        await page.addScriptTag({
            url: "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"

        });

        const pdfBase64 = await page.evaluate(async () => {

            const element = document.getElementById("documentoImpresion");
            element.classList.add("altoAutomatico");
            element.classList.add("reporte");
            element.classList.add("html2");

            const BLEED_PX = 8;

            const contentWidthPx = element.scrollWidth + BLEED_PX;
            const contentHeightPx = element.scrollHeight;

            const opt = {
                margin: [0, 0, 0, 0], // ❗evitá restar ancho con márgenes
                filename: 'reporte.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, scrollX: 0, scrollY: 0, width: contentWidthPx, height: contentHeightPx },
                jsPDF: { unit: 'mm', format: [contentWidthPx, contentHeightPx], orientation: contentWidthPx > contentHeightPx ? 'landscape' : 'portrait' }
            };

            const worker = html2pdf().set(opt).from(element).toPdf();
            const pdf = await worker.get('pdf');
            const arrayBuffer = pdf.output('arraybuffer');
            const uint8 = new Uint8Array(arrayBuffer);
            let binary = "";
            for (let i = 0; i < uint8.length; i++) {
                binary += String.fromCharCode(uint8[i]);
            }
            return btoa(binary);
        });

        const el = await page.$('#documentoImpresion');
        const pdfBuffer = Buffer.from(pdfBase64, 'base64');
        const viewport = await page.viewport(); // obtener ancho actual

        await page.setViewport({
            width: viewport.width,   // ✅ mantiene 100% ancho de pantalla
            height: format.height, // ✅ recorta solo hasta donde termina
            deviceScaleFactor: 1
        });

        const pngBuffer = await el.screenshot({
            type: 'png',
            captureBeyondViewport: true
        });
        await browser.close();

        let imgW, imgH;
        try {
            const dim = sizeOf(pngBuffer);
            imgW = dim.width;
        } catch (_) {
            imgW = undefined;
        }

        let htmlEmail = `<div style="font-family:Arial,Helvetica,sans-serif; line-height:1.35;">${textoDescrip || ''}
        <div style="overflow-x:auto; -webkit-overflow-scrolling:touch;">
        <img src="cid:reporteInline" ${imgW ? `width="${imgW}"` : ''}
            style="display:block; height:auto; max-width:none; border:0; outline:0; text-decoration:none; vertical-align:top;"
            alt="reporte" />
         </div>`;


        let adjuntos = [{ filename: "reporteSemanalCargas.pdf", content: pdfBuffer }, {
            filename: "reporteInline.png", content: pngBuffer, cid: "reporteInline", contentType: "image/png", contentDisposition: "inline"
        }]

        if (firma?.nombre?.length > 0) {

            htmlEmail += `<br>`
            htmlEmail += `<div><img src="cid:${firma?.nombre}" width="400"/></div>`
            adjuntos.push({ filename: `${firma?.nombre}.${firma?.type}`, path: path.join(__dirname, `../../../front/img/${firma?.nombre}.${firma?.type}`), cid: firma?.nombre, contentDisposition: "inline", contentType: `image/${firma?.type}` })
        }

        htmlEmail += `</div>`;

        await transporter.sendMail({
            from: 'Reportes Sbc <no-reply@gesfin.com.ar>',
            to: para,
            cc: copia,
            bcc: copiaOculta,
            subject: `${subject || "Reporte automático"}`,
            html: htmlEmail,
            attachments: adjuntos
        });

        const fechaLocal = new Date().toLocaleString("sv-SE", {
            timeZone: "America/Argentina/Buenos_Aires", hour12: false
        }).replace(" ", "T");

        await baseDeDatos.LogEmails.create({
            fecha: fechaLocal,
            para: para,
            copia: copia,
            copiaOculta: copiaOculta,
            asunto: subject,
            estado: "enviado",
            origen,
            date: fechaLocal,
            username: req.user._id
        });

        res.json({
            ok: true,
            mensaje: "Reporte enviado",
            receptor: para,
            copia,
            copiaOculta,
            sizeBytes: pdfBuffer.length
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, error: err.message });
    }
});


module.exports = router;