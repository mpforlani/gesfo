//Titulos
function cabeceraStandar(data, objeto, numeroForm, titulo) {

    let cabecera = `<div class="cabeceraImpresion"><h1>${titulo || ""}</h1></div>`

    return cabecera
}
function cabeceraDelgadaLogo(data, objeto, numeroForm, titulo, imagen, clases) {

    let cabecera = `<div><div class="cabeceraImpresionDelgada">
    <div class="tituloCab mayuscula margin-top-medio" width="80porc"><h1>${titulo || ""}</h1></div>`
    if (imagen != undefined) {

        cabecera += `<div class="imgDiv ${clases?.tamanoImg || "cuatroRem"}" width="15porc"><img class="logoRep" src="${imagen}" ></div>`
    } else {
        cabecera += `<div class="imgDiv" width="15porc"></div>`
    }

    cabecera += `</div>`

    return cabecera
}
function pieStandar(data, objeto, numeroForm) {

    let pie = `<div></div>`
    return pie
}
function soloLogoEmpresa(data, objeto, numeroForm, imagen, rem) {

    const nombre = imagen.split('/').pop()
    return `<div class="imgDiv ${rem || "cuatroRem"}"><img class="logoRep" src="${imagen}" name="${nombre}"></div>`
}
function IdentificaciónEmpresaTexto(data, objeto, numeroForm, cabecera, sub) {

    let atributoBuscado = Object.values(cabecera)[0].nombre || Object.values(cabecera)[0]
    let infoAtributo = data[atributoBuscado]
    let infoFinal = consultaPestanas[atributoBuscado][infoAtributo].name
    let cabecer = `<div class="cabeceraTexto"><h1>${Object.keys(cabecera)[0]} ${infoFinal}</h1><h3>${sub}</h3></div>`

    return cabecer
}
//Fecha
function numFecha(data, objeto, numeroForm, titulo, atributosInfo, clases) { //Este se usa ejemplo en cotizaciones y retorna Titulo numero y fecha pero sus titulos indviduales

    let date = pasarFechaATextoSinDia(dateNowAFechaddmmyyyy(data[atributosInfo.fecha.nombre || atributosInfo.fecha], `y-m-d`))
    let num = ""
    $.each(atributosInfo.numero, (indice, value) => {

        num += `${data[value.nombre || value]} `
    })

    return `<div class="numFecha">
            <div class="fecha"><p class="${clases?.date || ""}">${date}</p></div>
            <div class="div unRenglon">
            <p class="negrita ${clases?.numero || ""}">${titulo}: &nbsp</p><p class="negrita ${clases?.numero || ""}">${num}</p></div>
            </div>`

}
function numFechaTituloMediano(data, objeto, numeroForm, titulo, atributosInfo) {

    let date = pasarFechaATextoSinDia(dateNowAFechaddmmyyyy(data[atributosInfo.fecha.nombre], `y-m-d`))
    let num = ""
    let comprobante = data.comprobante
    $.each(atributosInfo.numero, (indice, value) => {

        num += `${data[value.nombre || value]} `
    })

    return `<div class="div unRenglon"><h3 class="negrita fontSizeUnoPtoUno">${comprobante}</h3></div>
    <div class="div unRenglon"><h3 class="negrita fontSizeUnoPtoUno">${titulo}: &nbsp</h3> <h3 class="negrita fontSizePtoNueve">${num}</h3></div>
    <div class="fecha"><p class="mayuscula">${date}</p></div>`

}
function numFechaMediano(data, objeto, numeroForm, titulo, atributosInfo) {

    let date = pasarFechaATextoSinDia(dateNowAFechaddmmyyyy(data[atributosInfo.fecha.nombre], `y-m-d`))
    let num = ""
    $.each(atributosInfo.numero, (indice, value) => {

        num += `${data[value.nombre || value]} `
    })

    return `<div class="div unRenglon"><h3 class="negrita fontSizePtoNueve">${titulo}: &nbsp</h3> <h3 class="negrita fontSizePtoNueve">${num}</h3></div>
        <div class="fecha"><p class="mayuscula">${date}</p></div>`

}
function titulosNumFecha(data, objeto, numeroForm, titulo, atributosInfo) { //Este se usa ejemplo en Recibo y retorna Titulo numero y fecha pero con titulos indviduales

    let date = dateNowAFechaddmmyyyy(data[atributosInfo.fecha.nombre], `y-m-d`)

    let dateArr = date.split("-")
    let num = ""
    $.each(atributosInfo.numero, (indice, value) => {

        num += `${data[value.nombre]} `
    })

    return `<div class="tituloNumFecha">
            <div class="tituloRecibo"><h3>${titulo}</h3></div>
            <div class="num"><p>Número: &nbsp</p> <h4>${num}</h4></div>
            <div>Fecha: ${dateArr[2]}/${dateArr[1]}/${dateArr[0]}</div>
            </div>`

}
function fechaLetraNum(data, objeto, numeroForm, atributosInfo) { //Este se usa ejemplo en Recibo y retorna Titulo numero y fecha pero con titulos indviduales

    const date = pasarFechaATextoSinDia(dateNowAFechaddmmyyyy(data[atributosInfo.fecha], `y-m-d`))

    const letra = data.tipoComprobante.trim()
    const letraDef = letra.slice(-1)
    const comprobate = data.comprobante

    const ancla = data.ancla
    const numerador = data.numerador

    return `<div class="fechaLetraNum flex  column">
            <div class="unRenglon margin-bot-ceroTres"><p class="fechaLetraNum fsUno">${date}</p></div>
            <div class="unRenglon margin-bot-ceroTres"><p class="bold mayuscula fechaLetraNum fsUno">${comprobate} ${letraDef}</p></div>
            <div class="unRenglon margin-bot-ceroTres"><p class="bold mayuscula fontSizePtoSeis fsUno">N°: ${ancla} ${numerador}</p></div>
            </div>`

}
//return Atributos
function returnUnAtributo(data, objeto, numeroForm, atributo, clase) {

    let atributoDevo = data[atributo.nombre || atributo]?.replace(/\n/g, "<br>")
    return `<p class="${clase || ""}">${atributoDevo}</p>`
}
function returnUnAtributoArray(data, objeto, numeroForm, atributo, clase) {

    let atributoDevo = data[atributo.nombre || atributo][0]?.replace(/\n/g, "<br>")
    return `<p class="${clase || ""}">${atributoDevo}</p>`
}
function returnUnAtributoSelectMayuscula(data, objeto, numeroForm, objeto) {

    let atributoDevo = data[objeto.atributo.nombre || objeto.atributo]
    let atributoDef = consultaPestanas[objeto.atributo.nombre || objeto.atributo]?.[atributoDevo]?.[objeto.atributo.pestRef || "name"]

    return `<div class="unRenglon mayuscula"><p>${objeto.titulo}: &nbsp</p><p class="mayuscula">${atributoDef || ""}</p></div>`
}
function returnUnAtributoSelectColec(data, objeto, numeroForm, objeto, clase) {

    let atributoDevo = data[objeto.atributo.nombre || objeto.atributo][0]
    let atributoDef = consultaPestanas[objeto.atributo.nombre || objeto.atributo]?.[atributoDevo]?.[objeto.atributo.pestRef || "name"]

    return `<div class="unRenglon mayuscula"><p class="bold ${clase?.titulo || ""}">${objeto.titulo}: &nbsp</p><p class="${clase?.info || ""}>${atributoDef || ""}</p></div>`
}
function returnUnAtributoTitulo(data, objeto, numeroForm, atributo, clase) {

    let atributoDevo = data[atributo.nombre]
    return `<p class="${clase?.titulo}">${atributo.titulo}:  </p><p class="${clase?.info}">${atributoDevo}</p>`

}
function returnUnAtributoTituloArray(data, objeto, numeroForm, atributo, clase) {

    let atributoDevo = data[atributo.nombre][0]
    return `<div class="unRenglon"><p class="${clase.titulo || ""}">${atributo.titulo}: &nbsp</p> <p class="${clase.info || ""}">${atributoDevo}</p></div>`

}
function returnUnAtributoFechaTitulo(data, objeto, numeroForm, atributo, clase) {


    let date = ``
    if (data[atributo.atributo] != undefined) {
        date = dateNowAFechaddmmyyyy(data[atributo.atributo], `d-m-y`)
    }

    return `<p class="${clase?.titulo}">${atributo.titulo}:</p><p class="${clase?.info}">&nbsp ${date}</p>`

}
function returnUnAtributoTituloMayuscula(data, objeto, numeroForm, atributo) {

    let atributoDevo = data[atributo.nombre]
    return `<p class="mayuscula">${atributo.titulo}:  ${atributoDevo}</p>`

}
function returnUnAtributoTituloNumero(data, objeto, numeroForm, atributo) {

    let atributoDevo = numeroAString(data[atributo.nombre])
    return `<p>${atributo.titulo}:  ${atributoDevo}</p>`
}
function returnTextoMasAtributo(data, objeto, numeroForm, atributo, texto, replacement) {

    let textoReturn = "<div class=textoDesc>"
    let atributos = new Object

    $.each(atributo, (indice, value) => {
        textoReturn += `<div class="elementoDesc">`

        atributos[indice] = data[value.nombre]

        textoReturn += `<h5>${texto[indice]}</h5>  <p>${atributos[indice] || replacement}</p>`
        textoReturn += "</div>"

    })
    textoReturn += "</div>"


    return textoReturn
}
function retunrTextoDeParametro(data, objeto, numeroForm, texto) {

    let text = ""

    $.each(texto, (indice, val) => {

        text += val
    })

    return text
}
function returnUnaPalabraDiv(data, objeto, numeroForm, texto, elemento, clase) {

    let div = `<div class="unaPalabra ${clase}"><${elemento}>${texto}</p></${elemento}>`

    return div
}
function datoDiv(data, objeto, numeroForm, atributo, clase) {

    let datoDiv = $(`#t${numeroForm} div.fo.textoDiv.${atributo} p`).text()
    let div = `<div class="dato"><p class="${clase}">${datoDiv}</p></div>`
    return div
}
function datoDosDiv(data, objeto, numeroForm, atributo, clase, width, claseElemento) {

    let div = ""
    let datoDiv = $(`#t${numeroForm} div.fo.textoDiv.${atributo} div`)

    $.each(datoDiv, (indice, value) => {

        div += `<div class="dato ${clase}" width="${width[indice]}"><p class="${claseElemento[indice] || ""}">${$(value).text()}</p></div>`

    })

    return div
}
/// return parametricas
function infoReferencia(data, objeto, numeroForm, tercero, info, encabezado, clase) {

    let terceroFind = data[tercero?.nombre || tercero]
    let terceroInfo = consultaPestanas[tercero.nombre || tercero][terceroFind]

    let returnDatos = ""

    $.each(info, (indice, value) => {

        if (terceroInfo?.[value.nombre || value] != undefined) {

            switch (value.type) {
                case "fecha":

                    returnDatos += `<div class="unRenglon margin-bot-ceroDos"><p class="${clase?.titulo || ""}">${encabezado?.[indice]}: &nbsp</p><p class="${clase?.info || ""}">${dateNowAFechaddmmyyyy(terceroInfo?.[value.nombre || value], `d-m-y`)}</p></div>`

                    break;
                default:
                    returnDatos += `<div class="unRenglon margin-bot-ceroDos"><p class="${clase?.titulo || ""}">${encabezado?.[indice]}: &nbsp</p><p class="${clase?.info || ""}">${terceroInfo?.[value] || ""}</p></div>`

                    break;

            }
        }
    })

    return returnDatos
}
function infoReferenciaMayuscula(data, objeto, numeroForm, tercero, info, encabezado) {

    let terceroFind = data[tercero?.nombre]
    let terceroInfo = consultaPestanas[tercero.origen || tercero.nombre][terceroFind]

    let returnDatos = ""

    $.each(info, (indice, value) => {

        if (terceroInfo?.[value] != undefined) {

            returnDatos += `<div class="unRenglon mayuscula"><p>${encabezado?.[indice]}: &nbsp${terceroInfo?.[value.nombre || value] || ""}</p></div>`
        }
    })

    return returnDatos
}

function infoReferenciaMayusculaCuit(data, objeto, numeroForm, tercero) {

    let terceroFind = data[tercero?.nombre]
    let terceroInfo = consultaPestanas[tercero.nombre][terceroFind]
    let returnDatos = ""

    if (terceroInfo?.documento != undefined) {

        returnDatos += `<div class="unRenglon mayuscula"><p>${terceroInfo?.DocTipo}: &nbsp</p><p class="mayuscula">${terceroInfo?.documento || ""}</p></div>`
    }

    return returnDatos
}
function infoReferenciaMayusculacuentaEmpresa(data, objeto, numeroForm, tercero) {

    let empresa = $(`.empresaSelect`).html().trim()
    let empresaObjeto = Object.values(consultaPestanas.empresa).find(e => e.name == empresa)
    let cuenta = empresaObjeto.cuentasBancarias

    let returnDatos = `<div class="unRenglon mayuscula">
    <p class="bold fsUno">CBU:</p><p class="fsUno"> &nbsp${consultaPestanas.cuentasBancarias[cuenta].textoDos} &nbsp &nbsp &nbsp</p>
    <p class="bold fsUno">ALIAS:</p><p class="fsUno"> &nbsp${consultaPestanas.cuentasBancarias[cuenta].textoTres}</p>
    </div>`

    return returnDatos
}
function infoReferenciaColec(data, objeto, numeroForm, tercero, info, encabezado, clase) {

    let terceroFind = data[tercero?.nombre || tercero]
    let terceroInfo = consultaPestanas[tercero.nombre || tercero][terceroFind]
    let returnDatos = ""
    returnDatos += `<div class="unRenglon"><p class="${clase?.titulo || ""}">${encabezado}: &nbsp</p>`

    $.each(info, (indice, value) => {

        if (value.type == "parametrica") {

            returnDatos += `<p class="${clase?.info || ""}">${consultaPestanas?.[value.nombre || value]?.[terceroInfo?.[value.nombre || value][0]]?.name || ""}&nbsp</p>`

        } else {

            returnDatos += `<p class="${clase?.info || ""}">${terceroInfo?.[value.nombre || value][0] || ""}&nbsp</p>`
        }
    })

    returnDatos += `</div>`

    return returnDatos

}
function infoReferenciaColecMayuscula(data, objeto, numeroForm, tercero, info, encabezado) {

    let terceroFind = data[tercero?.nombre]
    let terceroInfo = consultaPestanas[tercero.nombre][terceroFind]
    let returnDatos = ""
    returnDatos += `<div class="mayuscula"><p>${encabezado}: &nbsp`
    $.each(info, (indice, value) => {

        if (value.type == "parametrica") {

            returnDatos += `${consultaPestanas?.[value.origen || value.nombre]?.[terceroInfo?.[value.nombre][0]]?.name || ""}&nbsp</p>`

        } else {

            returnDatos += `${terceroInfo?.[value.nombre || value][0] || ""}&nbsp`
        }
    })
    returnDatos += `</p>`
    returnDatos += `</div>`

    return returnDatos

}
function infoReferenciaMoneda(data, objeto, numeroForm) {

    let monedaFind = data.moneda

    let monedaInfo = consultaPestanas.moneda[monedaFind]

    let returnDatos = ""

    if (monedaInfo.name == "Pesos") {

        returnDatos += `<div class="unRenglon"><p>Moneda: &nbsp</p><p>${monedaInfo?.name}</p></div>`

    } else {

        returnDatos += `<div class="unRenglon"><p>Moneda: &nbsp</p><p>${monedaInfo?.name}</p>&nbsp &nbsp<p>TC: &nbsp</p><p>${data.tipoCambio}</p></div>`

    }

    return returnDatos
}
///Cuerpo
//Items Comprobantes
function itemsComprobantes(data, objeto, numeroForm, atributos, tabla, clases, atributoCondicion) {

    let tableItems = `<table class="table tableItems ${tabla.nombre}">`
    tableItems += `<tr class="titulosTable">`
    $.each(atributos, (indice, value) => {

        tableItems += `<th class="${value.nombre || value}" width="${value.width || ""}">${value.titulo || $(`#t${numeroForm} table.${tabla.nombre} th.${value.nombre || value}`).html()}</th>`
    })

    tableItems += `</tr>`

    $.each(data[`position${tabla.nombre}`], (indice, value) => {

        if (atributoCondicion == undefined || data?.[atributoCondicion]?.[indice] > 0) {

            tableItems += `<tr class=" filasRegistros ${clases?.filas || ""}">`
            $.each(atributos, (ind, val) => {

                let valor = data[val.nombre || val][indice]
                switch (tabla.componentes[val.nombre || val].type) {

                    case "parametrica":

                        valor = consultaPestanas?.[val.origen || val.nombre]?.[data?.[val.nombre || val]?.[indice]]?.name

                        break;
                    case "importe":
                        valor = numeroAStringCom(valor || "")

                        break;
                    case "numero":

                        valor = numeroAString(valor || "")

                        break;
                }

                tableItems += `<td class="${val.nombre || val} ${val.clase} ${clases?.celda || ""}" width="${val.width || ""}">${valor || ""}</td>`

            })
            tableItems += `</tr>`

        }
    })

    tableItems += `</table>`

    return tableItems
}
function itemsComprobantesDiv(data, objeto, numeroForm, atributos, tabla, clases, atributoCondicion) {

    let tableItems = `<div class="table tableItems ${tabla.nombre}">`//table
    tableItems += `<div class="tr titulosTable">`//tr
    $.each(atributos, (indice, value) => {

        tableItems += `<div class="th ${value.nombre || value} ${clases?.titulo || ""}" width="${value.width || ""}">${value.titulo || $(`#t${numeroForm} table.${tabla.nombre} th.${value.nombre || value}`).html()}</div>`
    })

    tableItems += `</div>`//tr

    $.each(data[`position${tabla.nombre}`], (indice, value) => {

        if (atributoCondicion == undefined || data?.[atributoCondicion]?.[indice] > 0) {

            tableItems += `<div class="tr filasRegistros ${clases?.filas || ""}">`
            $.each(atributos, (ind, val) => {

                let valor = data[val.nombre || val][indice]
                switch (tabla.componentes[val.nombre || val].type) {

                    case "parametrica":

                        valor = consultaPestanas?.[val.origen || val.nombre]?.[data?.[val.nombre || val]?.[indice]]?.name

                        break;
                    case "importe":
                        valor = numeroAStringCom(valor || "")

                        break;
                    case "numero":

                        valor = numeroAString(valor || "")

                        break;
                }

                tableItems += `<div class="td ${val.nombre || val} ${val.clase} ${clases?.celda || ""}" width="${val.width || ""}">${valor || ""}</div>`

            })
            tableItems += `</div>`//tr

        }
    })

    tableItems += `</div>`//table

    return tableItems
}
function itemsComprobantesMayuscula(data, objeto, numeroForm, atributos, tabla, atributoCondicion) {

    let tableItems = `<table class="table tableItems ${tabla.nombre}">`
    tableItems += `<tr class="titulosTable">`
    $.each(atributos, (indice, value) => {

        tableItems += `<th class="${value.nombre || value} mayuscula" width="${value.width || ""}">${value.titulo || $(`#t${numeroForm} table.${tabla.nombre} th.${value.nombre || value}`).html()}</th>`
    })

    tableItems += `</tr>`

    $.each(data[`position${tabla.nombre}`], (indice, value) => {

        if (atributoCondicion == undefined || data?.[atributoCondicion]?.[indice] > 0) {

            tableItems += `<tr class=" filasRegistros">`
            $.each(atributos, (ind, val) => {

                let valor = data[val.nombre || val][indice]
                switch (tabla.componentes[val.nombre || val].type) {

                    case "parametrica":

                        valor = consultaPestanas?.[val.origen || val.nombre]?.[data?.[val.nombre || val]?.[indice]]?.name

                        break;
                    case "importe":
                        valor = numeroAStringCom(valor || "")

                        break;
                    case "numero":

                        valor = numeroAString(valor || "")

                        break;
                }

                tableItems += `<td class="${val.nombre || val} ${val.clase} mayuscula" width="${val.width || ""}">${valor || ""}</td>`

            })
            tableItems += `</tr>`

        }
    })

    tableItems += `</table>`

    return tableItems
}
function totalitemsPorTasa(data, objeto, numeroForm, atribut, clases) {
    let tasas = data.porcentaje

    let netos = new Object
    let bases = new Object
    let iva = new Object
    let otrosImpuestos = 0

    $.each(tasas, (indice, value) => {

        if (value == 0 || value == "" || value == undefined) {

            bases.noGravado = (bases.noGravado || 0) + data[atribut.base.atr][indice];
        } else {
            bases.gravado = (bases.gravado || 0) + data[atribut.base.atr][indice];
        }

        iva[value] = (iva[value] || 0) + data[atribut.impuesto.atr][indice];
        otrosImpuestos = (otrosImpuestos || 0) + data[atribut.otroImpuesto.atr][indice]

    })

    let tabla = "<table class='totales'>"

    if (bases.noGravado != undefined) {

        tabla += `<tr class="fila">
        <th class="primeraFila celdaTotal ${clases?.titulo}">Neto No Gravado</th>`
        tabla += `<td class="celdaTotal ${clases?.celda}"> ${numeroAString(bases.noGravado)}</td>`
        tabla += `</tr>`
    }

    if (bases.gravado != undefined) {

        tabla += `<tr class="fila">
        <th class="primeraFila celdaTotal ${clases?.titulo}">Neto Gravado</th>`
        tabla += `<td class="celdaTotal ${clases?.celda}"> ${numeroAString(bases.gravado)}</td>`
        tabla += `</tr>`
    }


    $.each(iva, (indice, value) => {
        tabla += `<tr class="fila"><th class="primeraFila celdaTotal ${clases?.titulo}">${atribut.impuesto.titulo}&nbsp(${indice})</th>`
        tabla += `<td class="celdaTotal ${clases.celda}"> ${numeroAString(value)}</td>`
        tabla += `</tr>`
    })

    tabla += `<tr class="fila"><th class="primeraFila celdaTotal ${clases?.titulo}">${atribut.otroImpuesto.titulo}</th>`
    tabla += `<td class="celdaTotal ${clases.celda}"> ${numeroAString(otrosImpuestos)}</td>`
    tabla += `</tr>`


    tabla += `<tr class="fila"><th class="primeraFila celdaTotal ${clases?.titulo}">Total</th>`
    tabla += `<td class="celdaTotal bold ${clases.celda}"> ${numeroAString(data[atribut.total.atr])}</td>`
    tabla += `</tr>`

    return tabla
}
function totalitemsporMon(data, objeto, numeroForm, atribut, clase) {

    let objetoTabla = new Object()
    let moneda = atribut.moneda
    objetoTabla.moneda = [...new Set(data[moneda].filter(v => v !== ""))];

    let atributos = atribut.atributos

    let tabla = "<table class='totales'>"

    $.each(atributos, (indice, value) => {
        tabla += `<tr class="fila"><th class="primeraFila celdaTotal ${clase?.titulo || ""}">${value.titulo}</th>`
        let totalObjeto = new Object

        $.each(data[moneda], (ind, val) => {

            totalObjeto[val] = (totalObjeto[val] || 0) + data[value.atr][ind]
        })

        $.each(objetoTabla.moneda, (i, v) => {

            tabla += `<td class="celdaTotal ${value.atr} ${clase?.celda || ""}" moneda="${consultaPestanas?.moneda?.[v]?.name.toLowerCase()}"> ${numeroAStringCom(totalObjeto[v])}</td>`
        })

        tabla += `</tr>`

    })

    tabla += "</table>"
    return tabla
}
function totalitemsporTipoPago(data, objeto, numeroForm, atribut) {

    let objetoTabla = new Object()
    let tipoPago = atribut.tipoPago
    objetoTabla.tipoPago = [...new Set(data[tipoPago])]

    let atributos = atribut.atributos

    let tabla = "<table class='totales'>"

    $.each(atributos, (indice, value) => {
        tabla += `<p class="fila"><th class="primeraFila">${value.titulo}</p>`
        let totalObjeto = new Object

        $.each(data[tipoPago], (ind, val) => {

            totalObjeto[val] = (totalObjeto[val] || 0) + data[value.atr][ind]

        })

        $.each(objetoTabla.tipoPago, (i, v) => {
            tabla += `<p class="celdaTotal" tipoPago="${consultaPestanas.tipoPago[v].name}">${consultaPestanas.tipoPago[v].name}: ${numeroAString(totalObjeto[v])}</p>`

        })

        tabla += `</tr>`

    })

    tabla += "</table>"
    return tabla
}
function enumeracionItems(data, objeto, numeroForm, atributo, clase) {

    let item = data[atributo.nombre]
    let div = `<div>`

    $.each(item, (indice, val) => {

        div += `<div><p class="${clase?.titulo || ""}"></p><p class="${clase?.info || ""}">${val}</p></div>`

    })
    div += `</div>`

    return div

}
function elegirCompuesto(data, objeto, numeroForm, tabla1, tabla2) {

    if (data.cantidad != 0) {

        let tabla = tabla1
        let tableItems = `<table class="table tableItems ${tabla.nombre}">`
        tableItems += `<tr class="titulosTable">`
        let atributos = []
        if (tabla1.nombre == "compuestoReciboCobros") {
            atributos = [
                N({ nombre: "cantidad", clase: "textoCentrado", width: "cinco" }),
                P({ nombre: "itemVenta", width: "trece" }),
                I({ nombre: "importeBruto", clase: "textoCentrado", width: "siete" }),
                N({ nombre: "impuesto", clase: "textoCentrado", width: "cinco" }),
                I({ nombre: "subTotal", clase: "textoCentrado", width: "siete" }),
            ]
        } else if (tabla1.nombre == "itemsPagosSinFactura") {
            atributos = [
                N({ nombre: "cantidad", clase: "textoCentrado", width: "cinco" }),
                P({ nombre: "itemCompra", width: "ocho" }),
                I({ nombre: "precioUnitario", clase: "textoCentrado", width: "siete" }),
                I({ nombre: "iva", clase: "textoCentrado", width: "cinco" }),
                I({ nombre: "otrosImpuestos", clase: "textoCentrado", width: "cinco" }),
                I({ nombre: "subTotal", clase: "textoCentrado", width: "siete" }),
            ]
        }

        $.each(atributos, (indice, value) => {

            tableItems += `<th class="${value.nombre || value}" width="${value.width || ""}">${value.titulo || $(`#t${numeroForm} table.${tabla.nombre} th.${value.nombre || value}`).html()}</th>`
        })

        tableItems += `</tr>`

        $.each(data[`position${tabla.nombre}`], (indice, value) => {

            tableItems += `<tr class=" filasRegistros">`
            $.each(atributos, (ind, val) => {

                let valor = data[val.nombre || val][indice]
                switch (tabla.componentes[val.nombre || val].type) {

                    case "parametrica":

                        valor = consultaPestanas?.[val.origen || val.nombre]?.[data?.[val.nombre || val]?.[indice]]?.name
                        break;
                    case "fecha":

                        valor = dateNowAFechaddmmyyyy(data[val.nombre || val][indice], `y-m-d`)
                        break;
                    case "importe":
                    case "numero":

                        valor = numeroAString(valor || "")

                        break;
                }
                tableItems += `<td class="${val.nombre || val} ${val.clase}" width="${val.width || ""}">${valor || ""}</td>`

            })
            tableItems += `</tr>`
        })
        tableItems += `</table>`
        return tableItems

    } else {

        let tabla = tabla2
        let tableItems = `<table class="table tableItems ${tabla.nombre}">`
        tableItems += `<tr class="titulosTable">`
        let atributos = []
        if (tabla2.nombre == "cobrosCtaCte") {
            atributos = [
                F({ nombre: "fechaComprobante", width: "siete" }),
                T({ nombre: "tipoComprobante", width: "dos" }),
                T({ nombre: "numComprobante", width: "ocho" }),
                I({ nombre: "importePendiente", width: "siete" }),
                I({ nombre: "saldoComprobante", width: "siete" }),
                I({ nombre: "importeaCobrar", width: "siete" }),
            ]
        } else if (tabla2.nombre == "pagosCtaCte") {
            atributos = [
                F({ nombre: "fechaComprobante", width: "siete" }),
                T({ nombre: "tipoComprobante", width: "dos" }),
                T({ nombre: "numComprobante", width: "siete" }),
                I({ nombre: "importePendiente", width: "siete" }),
                I({ nombre: "saldoComprobante", width: "siete" }),
                I({ nombre: "importeaPagar", width: "siete" }),
            ]
        }
        $.each(atributos, (indice, value) => {

            tableItems += `<th class="${value.nombre || value}" width="${value.width || ""}">${value.titulo || $(`#t${numeroForm} table.${tabla.nombre} th.${value.nombre || value}`).html()}</th>`
        })

        tableItems += `</tr>`

        $.each(data[`position${tabla.nombre}`], (indice, value) => {

            tableItems += `<tr class=" filasRegistros">`
            $.each(atributos, (ind, val) => {

                let valor = data[val.nombre || val][indice]
                switch (tabla.componentes[val.nombre || val].type) {

                    case "parametrica":

                        valor = consultaPestanas?.[val.origen || val.nombre]?.[data?.[val.nombre || val]?.[indice]]?.name

                        break;
                    case "fecha":
                        valor = dateNowAFechaddmmyyyy(data[val.nombre || val][indice], `y-m-d`)

                        break;
                    case "texto":
                        if (atributos[ind].nombre == "tipoComprobante") {
                            let texto = data[val.nombre || val][indice] || "";
                            valor = texto.trim().slice(-1);
                        }
                        break;
                    case "importe":
                    case "numero":

                        valor = numeroAString(valor || "")

                        break;
                }

                tableItems += `<td class="${val.nombre || val} ${val.clase}" width="${val.width || ""}">${valor || ""}</td>`

            })
            tableItems += `</tr>`
        })

        tableItems += `</table>`

        return tableItems
    }
}
//Esto para escribir importes con letras
function numeroALetrasMasTexto(data, objeto, numeroForm, mon, impor, string) {

    let moneda = data[mon.nombre || mon]
    let monedaDef = consultaPestanas.moneda[moneda].name
    let importe = data[impor.nombre || impor]

    let texto = `<div class="letras"><h5>${string} :</h5><p>${NumeroALetras(monedaDef, stringANumero(importe))}</p></div>`

    return texto

}
function numeroALetrasImporte(data, objeto, numeroForm, mon, impor, clases) {

    let moneda = data[mon.nombre || mon]
    let monedaDef = consultaPestanas.moneda[moneda].name
    let importe = data[impor.nombre || impor]

    let monedaPlural = {
        dolar: "dolares",
        euro: "euros",
        pesos: "pesos"
    }

    let texto = `<div class="letrasImporte"><p class="${clases}">Son: ${NumeroALetras(monedaPlural[monedaDef.toLowerCase()], stringANumero(importe)).toLowerCase()}</p></div>`

    return texto

}
function numeroALetrasImporteSegunMoneda(data, objeto, numeroForm, impor, clases) {

    let totales = $(`#impresionFormulario td.celdaTotal.${impor.nombre || impor}`)
    let texto = ""

    let monedaPlural = {
        dolar: "dolares",
        euro: "euros",
        pesos: "pesos"
    }

    $.each(totales, (indice, value) => {

        let moneda = $(value).attr("moneda")
        let importe = $(value).text()
        texto += `<div class="letrasImporte"><p class="${clases}">Son: ${NumeroALetras(monedaPlural[moneda.toLowerCase()], stringANumero(importe)).toLowerCase()}</p></div>`
    })

    return texto
}
//Facturación exclusivo
function letraComprobanteFiscal(data, objeto, numeroForm) {

    let impues = data.tipoComprobante
    letra = tiposComprobante[impues.replace(/\s+/g, '')?.toLowerCase()].letra
    let texto = `<div class="letra">${letra}</div>`
    return texto


}
function dataFiscal(data, objeto, numeroForm) {

    let empresa = $(`.empresaSelect`).html().trim()
    let empresaObjeto = Object.values(consultaPestanas.empresa).find(e => e.name == empresa)
    let indice = empresaObjeto.tipoDomicilio.findIndex(e => e.toLowerCase() === "comercial") || 0;

    let ciudad = consultaPestanas.ciudad[empresaObjeto.ciudadDir[indice]]

    let provincia = consultaPestanas.provincia[ciudad.provincia].name
    let domicilioComercial = `${empresaObjeto.calle[indice]} ${empresaObjeto.numero[indice]} ${empresaObjeto.piso[indice] || ""} ${empresaObjeto.depto[indice] || ""} ${ciudad.name} ${provincia}`

    return `<div class="info">
    <div class="titDiv"><p class="bold">RAZON SOCIAL:&nbsp &nbsp </p><p>${empresa}</p></div>
    <div class="titDiv"><p class="bold">DOMICILIO COMERCIAL:&nbsp &nbsp </p><p>${domicilioComercial}</p></div>
    <div class="titDiv"><p class="bold">CONDICION IVA:&nbsp &nbsp </p><p>${empresaObjeto.condicionImpositiva}</p></div>
    </div>`
}
function dataFiscalDos(data, objeto, numeroForm,) {

    const empresa = $(`.empresaSelect`).html().trim()
    const empresaObjeto = Object.values(consultaPestanas.empresa).find(e => e.name == empresa)

    let dataDef = `<div>
         <div class="flex"><p class="mayuscula"><p class="bold">CUIT:&nbsp &nbsp </p><p>${empresaObjeto.documento}</p></div>
         <div class="flex"><p class="mayuscula"><p class="bold">IIBB:&nbsp &nbsp </p><p>${empresaObjeto.iibb}</p></div>
         <div class="flex"><p class="mayuscula"><p class="bold">FECHA INICIO ACTIVIDADES:&nbsp &nbsp </p><p>${dateNowAFechaddmmyyyy(empresaObjeto.fechaInicio, `y-m-d`)}</p></div>
         </div>`

    return dataDef

}
function caeVencimiento(data, objeto, numeroForm) {
    let cae = `<div class="cae"><p>CAE: ${data.CAE}</p></div>
               <div class="vencimientoCae"><p>Vencimiento: ${dateNowAFechaddmmyyyy(data.vtocae, `d/m/y`)}</p></div> `

    return cae

}
//Logistico Exclusivo
function refOperacionLogisticaPrim(data) {//Solo impresion de logistica, porque es demasiada especifica, tenia que pasar infinidad de parametros

    let tipoCarga = data.tipoCarga
    let tipoCargaDef = consultaPestanas?.tipoCarga?.[tipoCarga]?.name || "LCL"
    const type = {
        Marítimo: "- LCL"

    }

    let texto = ""
    let tipoOperacion = consultaPestanas?.tipoOperacion?.[data?.tipoOperacion]?.name
    let tipoTransporte = consultaPestanas?.tipoTransporte?.[data?.tipoTransporte]?.name

    if (tipoCargaDef == "FCL") {

        texto += `<div class="unRenglon"><p class="bold fsUno">${tipoOperacion} - ${tipoTransporte} - FCL</p></div>`

    } else if ((tipoCargaDef == "LCL")) {


        texto += `<div class="unRenglon"><p class="bold fsUno">${tipoOperacion} - ${tipoTransporte} ${type[tipoTransporte] || ""}</p></div>`
    }

    return texto
}
//Reportes datos completo
function reporteCompletoTabla(data, objeto, numeroForm) {

    let tabla = document.querySelector(`#t${numeroForm} table`).outerHTML;

    return tabla

}
function reporteCabecera(data, objeto, numeroForm) {

    let cabeceraCont = document.querySelector(`#bf${numeroForm} cabeceraCont`).outerHTML


    return cabeceraCont
}
function textoFechaHoy(texto) {

    let subject = `${texto} ${dateNowAFechaddmmyyyy(Date.now(), `d-m-y`)}`

    return subject

}
function textoSimple(texto) {

    return texto

}
function paddingDocumento() {

    $(`#documentoImpresion`).addClass(`paddingLeft paddingRight`)

}
function agregarAsterisco(data) {

    let texto = $(`#documentoImpresion .asterisco`)

    $.each(texto, (indice, value) => {

        let textoPart = $(value).text()
        let textoFull = `* ${textoPart}`
        $(value).text(textoFull)

    })
}   
