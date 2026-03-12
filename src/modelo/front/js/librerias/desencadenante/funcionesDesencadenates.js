///tipoDesencadenante
function desencadenaDirecto(desencadenante, fileColeccion) {

    return desencadenante
}
function condicionSegunFuncion(desencadenante, response) {

    let desencadena = desencadenante?.opciones?.[desencadenante?.funcionCondicion?.[0](response, desencadenante?.funcionCondicion[1], desencadenante?.funcionCondicion[2])] || ""

    let objeFinal = false

    if (desencadena != "") {

        objeFinal = Object.assign({}, desencadena, desencadenante)

    }

    return objeFinal

}
///Determinacion Destino
function seleccionDesencadenanteMedioPago(response) {

    let tipoPago = response.tipoPago
    let tipoDesencadenante = ""

    let tipoPagoDefinitivo = consultaPestanas.tipoPago[tipoPago]

    if (tipoPagoDefinitivo.admBancos == "true" && tipoPagoDefinitivo.admCheque != "true") {
        tipoDesencadenante = "transferencia"

    } else if (tipoPagoDefinitivo.admBancos == "false" && tipoPagoDefinitivo.admCheque == "true") {
        tipoDesencadenante = "chequeDeTercero"

    } else if (tipoPagoDefinitivo.admCajas == "true") {
        tipoDesencadenante = "efectivo"

    } else if (tipoPagoDefinitivo.admBancos == "true" && tipoPagoDefinitivo.admCheque == "true") {
        tipoDesencadenante = "cheque"
    }
    else if (tipoPagoDefinitivo.admBancos == "false" && tipoPagoDefinitivo.admCheque == "false" && tipoPagoDefinitivo.admCajas == "false") {
        tipoDesencadenante = "cuentaCorriente"
    }
    return tipoDesencadenante
}
function desencadenanteSegunAtributo(response, atributoUno, atributoDos) {

    let tipoDesencadenante = ""

    if (response?.[atributoUno.atributo]?.length > 0) {
        tipoDesencadenante = atributoUno.destino
    }

    if (response?.[atributoDos.atributo]?.length > 0) {
        tipoDesencadenante = atributoDos.destino
    }

    return tipoDesencadenante
}
function facturaStock(response, propiedadStock) {
    let tipoDesencadenante = ""
    let empresaSel = $(`.empresaSelect`).html().trim()
    let empresaSelecta = Object.values(consultaPestanas.empresa).find(e => e.name == empresaSel);

    if (empresaSelecta[propiedadStock] == "Facturacion") {
        tipoDesencadenante = "facturacion"
    }
    if (empresaSelecta[propiedadStock] == "Remito") {
        tipoDesencadenante = "remito"
    }
    return tipoDesencadenante
}
function seleccionAnticipo(response) {

    let itemCompraPost = response.itemCompra

    let tipoDesencadenante = ""

    if ((consultaPestanas?.itemCompra[itemCompraPost])?.name?.toLowerCase() == "anticipo financiero")
        tipoDesencadenante = "anticipo"

    return tipoDesencadenante
}
function almenosUnCtaCtte(response) {

    let tipoPago = response.tipoPago
    let cuentaCorriente = false
    let index = 0

    while (index < tipoPago.length && cuentaCorriente == false) {

        let tipoPagoDefinitivo = consultaPestanas.tipoPago[tipoPago[index]]
        if (tipoPagoDefinitivo.admBancos != "true" && tipoPagoDefinitivo.admCheque != "true" && tipoPagoDefinitivo.admCajas != "true") {

            cuentaCorriente = "cuentaCorriente"
        }
        index++

    }

    return cuentaCorriente
}
function almenosUnFiscal(response, importe) {
    let desencadena = false
    let importeFiscalCobrar = response[importe]

    if (!Array.isArray(importeFiscalCobrar)) {
        importeFiscalCobrar = [importeFiscalCobrar]
    }

    let total = 0

    for (const value of importeFiscalCobrar) {
        total = total + (value || 0)
    }

    if (total > 0) {

        desencadena = desencadena
        desencadena = true
    }
    return desencadena


}
function identificadorDistintoVacio(data, ident) {

    let desencadenaDef = ""

    if (data[ident] != "") {
        desencadenaDef = 0
    }

    return desencadenaDef

}
function alMenosUnValor(data, atributos) {

    let desencadena = false
    const [atributo, ...valores] = atributos;

    if (valores.map(v => v.toLowerCase()).includes(String(data[atributo]).toLowerCase())) {
        desencadena = 0
    }

    return desencadena
}
//////funcioens Datos Desencadenateas
function fechaInicialHoyDesencadenante() {

    return dateNowAFechaddmmyyyy(Date.now(), `y-m-d`)
}
async function buscarIdPorAtributoUnico(datos, atributoUnico) {

    let numeroDeCheque = datos[atributoUnico]
    let detalleFiltroAtributos = { [atributoUnico]: numeroDeCheque }

    const filtros = `&filtros=${JSON.stringify(detalleFiltroAtributos)}`

    const response = await fetch(`/get?base=chequesTercero${filtros}`);
    if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
    const data = await response.json();

    return data[0]._id

}
function buscarAtributosParamentricos(datosEnviar, parametricaBuscada, datoOrigen) {

    let infoBuscada = consultaPestanas[datoOrigen.origen || datoOrigen][datosEnviar[datoOrigen.nombre || datoOrigen]][parametricaBuscada]

    return infoBuscada
}
function elegirDestino(datosEnviar, opcionA, opcionB) {
    let destino = ""

    if (datosEnviar[opcionA.valor].length > 0) {
        destino = consultaPestanas[opcionA?.origen][datosEnviar[opcionA?.valor]].name
    } else {
        destino = consultaPestanas[opcionB?.origen][datosEnviar[opcionB?.valor]].name
    }
    return destino

}
function imputaEstado(datos) {
    let datoFacturacion = datos.estadoFacturacion
    let estadoFacturacion = ""

    $.each(datoFacturacion, (indice, value) => {
        estadoFacturacion = value
    })
    return estadoFacturacion

}
function convertirDosAUnAtr(datos, atributos) {

    let datoAtributo = ""

    $.each(atributos, (indice, value) => {

        datoAtributo += `${datos[value]}  `
    })

    return datoAtributo.trim()
}
function pagoParcialString(datos, importeCobro, estados, atributoSaldo) {

    const saldo = atributoSaldo ? datos[atributoSaldo] : (datos.saldoComprobante || datos.disponibles || datos.disponiblesOrigen)
    const importe = datos[importeCobro]

    if (importe < saldo) return estados.parcial
    if (importe == saldo) return estados.cerrado

}

function pagoParcialImporte(datos, importeCobro, saldoComprobante) {

    const saldoInicial = datos[saldoComprobante]
    const importe = datos[importeCobro]
    let total = 0
    if (importe <= saldoInicial) {
        total = saldoInicial - importe
        return total
    }
    return total
}

function reversoImporte(datos, atributo) {
    const saldoFinal = datos[atributo]
    return saldoFinal
}
function reversoEstado(datos) {

    let estadoAnterior = ""
    if (datos.importePendiente - datos.saldoComprobante == 0) {
        estadoAnterior = "Pendiente"
    } else {
        estadoAnterior = "Pago parcial"
    }
    return estadoAnterior
}
function reversoEstadoStock(datos) {
    console.log(datos)
    let estadoAnterior = ""
    const saldo = datos.disponiblesOrigen || datos.disponibles || 0
    const cantidad = datos.cantidadOrigen || datos.cantidad || 0

    if (cantidad - saldo == 0) {
        estadoAnterior = "Ingresado"
    } else {
        estadoAnterior = "Salida parcial"
    }
    return estadoAnterior
}
function reversoString(datos, atributo) {
    const atributoOrigen = {
        almacen: "almacenOrigen",
        ubicaciones: "ubicacionOrigen",
    }[atributo] || `${atributo || ""}Origen`

    if (!atributo) {
        return datos.almacenOrigen || datos.ubicacionOrigen || ""
    }

    return datos[atributoOrigen] ?? datos[atributo] ?? ""
}
function saldoComprobanteFact(datos) {

    let tipoPago = datos.tipoPago
    const total = Number(datos.importeTotal) || 0

    if (!Array.isArray(tipoPago)) {
        tipoPago = tipoPago ? [tipoPago] : []
    }

    let saldoComprobante = total

    $.each(tipoPago, (indice, value) => {

        let tipoPagoActual = consultaPestanas?.tipoPago?.[value]

        if (!tipoPagoActual) {
            tipoPagoActual = Object.values(consultaPestanas?.tipoPago || {})
                .find(e => String(e?.name || "").toLowerCase().trim() == String(value || "").toLowerCase().trim())
        }

        if (!tipoPagoActual) return;

        let nombreTipoPago = normalizarTextoSelectForm(tipoPagoActual?.name)

        let esCuentaCorriente = nombreTipoPago == "cuenta corriente"

        if (!esCuentaCorriente) {
            let importe = Number(datos.importeTipoPago?.[indice]) || 0
            let tipoCambio = Number(datos.tipoCambioTipoPago?.[indice]) || 1

            saldoComprobante = saldoComprobante - (importe * tipoCambio)

        }
    })

    return saldoComprobante
}
function crearREfEnviar(datos, type, atributos) {

    let ref = ""

    switch (type) {

        case "string":
            ref = ""
            $.each(atributos, (indice, value) => {
                ref += `${datos[value]}  `
            })

            break;
    }
    return ref.trim()

}
function consultaAtributo(datos, atributo) {

    let idproducto = datos.producto
    let productos = consultaPestanas.producto;
    let itemVentas = []
    $.each(idproducto, (indice, value) => {
        let prod = productos[value];
        let idItemVentas = prod.itemVenta
        itemVentas.push(consultaPestanas.itemVenta[idItemVentas]._id)
    })

    return itemVentas
}
function importeParcial(datos, atributo) {

    let importe = datos[atributo]
    let total = 0

    for (const value of importe) {

        total = total + (value || 0)
    }


    return (total * -1)

}
function completarCabeceraCert(objeto) {
    let texto = "En nuestro carácter de Agente Transportista, declaramos bajo juramento que el flete de importación abonado por la firma consignada es el de referencia."

    return texto
}
function completarFirma() {
    let pluraSing = {
        1: "al",
        2: "a los"

    }

    let texto = `Se extiende esta certificación ${pluraSing[Math.min(2, parseFloat(new Date().getDate()))]} ${pasarFechaATexto()} para ser presentada ante quien corresponda`

    return texto

}
function redondearImporteMayorDesen(data, atributo) {

    if (Array.isArray(data[atributo])) {

        let array = []
        $.each(data[atributo], (ind, val) => {

            array.push(Math.ceil(val))
        })
        console.log(array)
        return array

    } else {

        return Math.ceil(data[atributo]);
    }
}
function tipoOperacion(response) {

    let tipoOperacion = (response.operacionStock).toLowerCase()

    return tipoOperacion
}
