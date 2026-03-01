function crearimpresion(objeto, numeroForm, data) {

    return new Promise((resolve, reject) => {
        let impresion = objeto?.formInd?.impresion || objeto?.impresion
        let objetoImpresion = new Object

        $.each(impresion?.bloques, (indice, value) => {

            objetoImpresion[indice] = `<div class="impresionRow ${value.clases} ${indice}">`

            $.each(value.componentes, (ind, val) => {

                objetoImpresion[indice] += `<div class="${val.class || ""}">`
                objetoImpresion[indice] += val.type[0](data, objeto, numeroForm, ...(val?.type?.[1] || []))
                objetoImpresion[indice] += `</div>`

            })
            objetoImpresion[indice] += `</div>`

            $(objetoImpresion[indice]).appendTo(`#documentoImpresion`)
        })

        let auditoria = `<div class="auditoriaImpresion">${dateNowAFechaddmmyyyy(Date.now(), "d/m/y-hh")} - Usuario: ${usu}</div>`

        $(auditoria).appendTo(`#documentoImpresion`)
        $(objetoImpresion.pie).appendTo(`#documentoImpresion`)

        $.each(impresion?.funciones, (indice, value) => {

            value[0](objeto, numeroForm, ...(value[1] || []))
        })

        resolve(`#documentoImpresion`)

    })
}
async function formularioIndividualImpresion(objeto, numeroForm, data) {

    let impresion = objeto?.formInd?.impresion || objeto?.impresion

    let imgs = `<div class="com" id="com${objeto.accion}${numeroForm}" objeto="${objeto.accion}">${iImprimir}${iOkEmail}${iOkDescargar}<div class="closeForm ${numeroForm}">+</div></div>
        <div id="documentoImpresion" class="${impresion?.fondo || ""}"></div>`;

    let imagenes = $(imgs);
    imagenes.appendTo('#impresionFormulario');
    $(`#com${objeto.accion}${numeroForm} div.barraForm`).removeClass("ocultoImpresion")

    crearimpresion(objeto, numeroForm, data)

    $(`#impresionFormulario`).addClass("show")

    $(`#com${objeto.accion}${numeroForm}`).on('click', ".closeForm", () => {

        $(`#impresionFormulario div`).remove();
        $(`#impresionFormulario`).removeClass("show");
    });
    $(`#com${objeto.accion}${numeroForm}:not(.reporte)`).on("click", `span.descargarFile`, async function (e) {

        mouseEnEsperaImpresionPrevia(objeto, numeroForm);

        const r = await fetch("/pdf", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ html: document.querySelector("#documentoImpresion").outerHTML, baseUrl: location.origin })
        });
        quitarEnEsperaImpresionPrevia(objeto, numeroForm)
        const blob = await r.blob();
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl);

    });
    $(`#com${objeto.accion}${numeroForm}.reporte`).on("click", `span.descargarFile`, async function (e) {

        $(`#documentoImpresion`).addClass("html2")

        const element = document.getElementById("documentoImpresion");
        const contentWidthPx = element.scrollWidth;
        const contentHeightPx = element.scrollHeight;

        const pxToMm = px => px * 0.264583;
        const pdfWidthMm = pxToMm(contentWidthPx);
        const pdfHeightMm = pxToMm(contentHeightPx);

        const opt = {
            margin: [0, 1, 0, 1],
            filename: 'reporte.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, scrollX: 0, scrollY: 0, width: contentWidthPx, height: contentHeightPx },
            jsPDF: { unit: 'mm', format: [pdfWidthMm, pdfHeightMm], orientation: pdfWidthMm > pdfHeightMm ? 'landscape' : 'portrait' }
        };

        html2pdf().set(opt).from(element).toPdf().get('pdf').then(function (pdf) {

            const blob = pdf.output('blob');
            const blobUrl = URL.createObjectURL(blob);
            window.open(blobUrl + '#zoom=100');
            $(`#documentoImpresion`).removeClass("html2")
        });

    });
    $(`#documentoImpresion`).on("click", `.cartelComplemento span.okBoton`, async function (e) {

        const objetoEnviar = new Object
        $(`#documentoImpresion`).addClass("html2")

        let logo = $(`#documentoImpresion img.logoRep`).attr('name')

        let emailsPara = [];
        let emailsCopia = [];
        let emailsCopiaOculta = [];
        let asunto = $(`#impresionFormulario div.asunto input`).val() || "Reporte Automatico";
        let direccion = "emailAdjunto"

        $('#impresionFormulario .para .email-chip').each(function () {

            const email = $(this).clone().children().remove().end().text().trim();
            emailsPara.push(email);
        });
        $('#impresionFormulario .copia .email-chip').each(function () {
            const email = $(this).clone().children().remove().end().text().trim();
            emailsCopia.push(email);
        });
        $('#impresionFormulario .copiaOculta .email-chip').each(function () {
            const email = $(this).clone().children().remove().end().text().trim();
            emailsCopiaOculta.push(email);
        });

        objetoEnviar.logo = logo
        objetoEnviar.para = emailsPara
        objetoEnviar.copia = emailsCopia
        objetoEnviar.copiaOculta = emailsCopiaOculta
        objetoEnviar.subject = asunto
        objetoEnviar.origen = objeto.pest
        $(`#documentoImpresion div.cartelComplemento`).remove();
        let htmlParaPdf = `${document.getElementById('documentoImpresion').outerHTML}`;

        objetoEnviar.texto = htmlParaPdf
        objetoEnviar.textoDescrip = $(`#impresionFormulario div.texto textarea`).val() || "Reporte Automatico";

        if (impresion.hoja == "custom") {

            let tabla = objeto.tablas[$(`#t${numeroForm} table`).attr("tablaRef")]
            filasExcell = consultaGet[numeroForm][$(`#t${numeroForm} table`).attr("tablaRef")].map(item => pasarDatosString(tabla.atributos, item));

            let titulosExcell = tabla.titulos

            objetoEnviar.excelData = { columns: titulosExcell, rows: filasExcell }

            const element = document.getElementById("documentoImpresion");
            element.classList.add("altoAutomatico");
            element.classList.add("html2");
            element.classList.add("reporte");
            objetoEnviar.format = {

                height: element.scrollHeight
            };
            direccion = objeto.enviar.type

        } else {

            objetoEnviar.format = { format: impresion.hoja || "A4", landscape: true };

        }

        mouseEnEsperImpresion();
        await new Promise(requestAnimationFrame);
        console.log(objetoEnviar)
        fetch(`/${direccion}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(objetoEnviar)
        })
            .then(response => response.json())
            .then(data => { })
            .catch(error => {
                console.error('Error:', error);
            });
        $(`#documentoImpresion`).removeClass("puppeteer-pdf").removeClass("altoAutomatico").removeClass("html2")

        quitarEsperaImpresionS();

    })
    $(`#com${objeto.accion}${numeroForm}`).on("click", "span.okEnviarEmail", function (e) {

        let cartel = cartelComplemento({}, "", { claseCartel: "widthCincoPorcen envioEmail", clasebloqueCabecera: "heigtDos" })

        let asunto = typeof objeto?.enviar?.subject?.[0] == "function" ? objeto?.enviar?.subject?.[0]?.(objeto?.enviar?.subject?.[1]) : objeto?.enviar?.subject
        let texto = typeof objeto?.enviar?.texto?.[0] == "function" ? objeto?.enviar?.texto?.[0]?.(objeto?.enviar?.texto?.[1]) : objeto?.enviar?.texto

        $(cartel).appendTo('#documentoImpresion')
        let inputs = `<div class="enviarEmail">`
        inputs += `<div class="para flex heightAuto email-container"><div class="widthDiezPorc">Para:</div><div class="widthCien"><input name="para" /></div></div>`
        inputs += `<div class="copia flex heightAuto email-container"><div class="widthDiezPorc">CC:</div><div class="widthCien"><input name="copia" /></div></div>`
        inputs += `<div class="copiaOculta flex heightAuto email-container"><div class="widthDiezPorc">CCO:</div><div class="widthCien"><input  name="copiaOculta" /></div></div>`
        inputs += `<div class="asunto flex heightAuto email-container"><div class="widthDiezPorc">Asunto:</div><div class="widthCien"><input  name="sujeto" value="${asunto || ""}" /></div></div>`

        inputs += `<div class="texto flex heighDiez email-container"><div class="widthDiezPorc">Texto:</div><div class="widthCien"><textarea class="heighDiez" name="textoEmail" />${texto || ""}</textarea></div></div>`
        inputs += `</div>`

        $(inputs).appendTo('#impresionFormulario .bloque0')
        $(`#documentoImpresion .cartelComplemento`).css("top", "5%");
        /*if (objeto?.enviar?.emailAtributo != undefined) {
    
            let id = $(`#t${numeroForm} .divSelectInput[name=${objeto?.enviar?.emailAtributo}]`).val()
            const filtros = `&filtros=${JSON.stringify({ _id: id })}`
    
            fetch(`/get?base=${objeto?.enviar.emailAtributo}${filtros}`)
                .then(response => response.json())
                .then(data => {
    
                    let info = data[0]
                    let emails = info.emailContacto
                    let entidad = info[`email${objeto.accion}`]
    
                    $.each(emails, (indice, value) => {
    
                        if (entidad[indice] == "true") {
    
                            $(`#impresionFormulario input[name=para]`).val(value).trigger("blur")
                        }
                    })
                })
                .catch(error => console.error('Error de red:', error));
        }*/

    })

}
function imprimirDirecto(objeto, numeroForm, data) {

    mouseEnEsperaImpresion(objeto, numeroForm)
    //let impresion = objeto?.formInd?.impresion || objeto?.impresion
    let documento = `<div id="documentoImpresion"></div>`;
    $(documento).appendTo('#impresionFormulario');

    crearimpresion(objeto, numeroForm, data).then(async (resultado) => {

        $(`#documentoImpresion`).addClass("puppeteer-pdf")

        const r = await fetch("/pdf", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ html: document.querySelector("#documentoImpresion").outerHTML, baseUrl: location.origin })
        });

        const blob = await r.blob();
        const blobUrl = URL.createObjectURL(blob);

        $("#visorPdf").removeClass("oculto");
        $("#visorPdf").html(`
                    <div class="pdfModal">
                    <div class="pdfModalInner">
                    <button class="cerrarPdf" type="button">✕</button>
                        <iframe class="pdfFrame" src="${blobUrl}#toolbar=1&navpanes=0&statusbar=0" frameborder="0"></iframe>
                    </div>
                    </div>
                `);

        // cerrar
        $("#visorPdf").off("click", ".cerrarPdf").on("click", ".cerrarPdf", () => {
            URL.revokeObjectURL(blobUrl);
            $("#visorPdf").empty();

            $('#impresionFormulario div').remove();
            $("#visorPdf").addClass("oculto");
            quitarEsperaImpresion(objeto, numeroForm)

        });

        // opcional: ESC para cerrar
        $(document).off("keydown.visorPdf").on("keydown.visorPdf", (e) => {
            if (e.key === "Escape") {
                URL.revokeObjectURL(blobUrl);
                $("#visorPdf").empty();
                $(document).off("keydown.visorPdf");
            }
        });
    });

}
function agregarfondoImpresion(objeto, numeroForm, atributo) {

    let img = `<img src="/img/fondoImpresion/fondoImpresionUno.jpg" alt="Fondo">`

    $(`#documentoImpresion`).append(img)
    $(`#documentoImpresion`).addClass(atributo);
}
//funciones creadas 
function ocultarTotalesYFilasVacios(objeto, numeroForm) {

    let totales = $(`#impresionFormulario .totalSeparado div.filasTotales`)
    $.each(totales, (indice, value) => {

        let total = $(`div.importeOchoCotizacion`, value).html()


        if (total.trim() == "") {

            $(value).addClass("ocultoFilas")
        }
    })

}
function agregarColores(objeto, numeroForm, atributos) {
    console.log(atributos)
    $(`#documentoImpresion`).css("--colorBorde", atributos.colorBorde)


}
$(`#impresionFormulario`).on("click", "span.okfImprimir", function (e) {

    printJS({
        printable: 'documentoImpresion',
        type: 'html',
        css: [`/css/style.css`,
            "https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap"
        ],
        style: 'body { background-color: white; background:white; }',
        scanStyles: false,
        maxWidth: 800,
    });
});

