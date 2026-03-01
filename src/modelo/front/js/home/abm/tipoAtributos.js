
function atributoinputLogico(objeto, numeroForm, value, indice) {


    let atributo = `<div class="td inputTd des ${value.nombre}" id="inputTd${value.nombre}${numeroForm}" style="order:${indice}" ${widthObject[value.width] || ""} ${ocultoOject[value.oculto] || ""}>
    <input type="hidden" class="inputR ${value.nombre}" name="${value.nombre}" form="f${objeto.accion}${numeroForm}" value=false>
    <input type="checkbox" class="inputR ${value.nombre}" id="in${value.nombre}${numeroForm}" valid=${value.validacion}></div>`;

    return atributo

}
function atributoImporteAbm(objeto, numeroForm, value, indice) {

    let atributo = `<div class="td inputTd des ${value.nombre}" id="inputTd${value.nombre}${numeroForm}" cont=${numeroForm}  style="order:${indice}" ${widthObject[value.width] || ""}>
    <input type="importe" class="inputR monedaFormulario ${value.nombre} ${value.clase || ""}" id="in${value.nombre}${numeroForm}" readonly name="${value.nombre}" form="f${objeto.accion}${numeroForm}" ${autoCompOff} valid=${value.validacion}>
    <input type="importe" class="inputR monedaBase ocultoSiempre ${value.nombre}mb" id="in${value.nombre}${numeroForm}" readonly name="${value.nombre}mb" form="f${objeto.accion}${numeroForm}"  valid=${value.validacion}>
    <input type="importe" class="inputR monedaAlternativa ocultoSiempre ${value.nombre}ma" id="in${value.nombre}${numeroForm}" readonly name="${value.nombre}ma" form="f${objeto.accion}${numeroForm}"  valid=${value.validacion}>
    </div>`;

    return atributo
}
function atributoFechaAbm(objeto, numeroForm, value, indice) {

    let valorPre = value.valorInicial?.()
    let valorInicialFech = valorPre != undefined ? `valueInicial=${valorPre}` : ""

    let atributo = `<div class="td inputTd des ${value.nombre}" id="inputTd${value.nombre}${numeroForm}" style="order:${indice}" ${valorInicialFech} ${widthObject[value.width] || ""} ${autoCompOff} ${ocultoOject[value.oculto] || ""}>
              <input type="${value.type}" class="inputR ${value.nombre} ${value.clase || ``}" ${autoCompOff} id="in${value.nombre}${numeroForm}" readonly name="${value.nombre}" form="f${objeto.accion}${numeroForm}" valid=${value.validacion} ></div>`;

    return atributo

}
function atributoAdjuntoAbm(objeto, numeroForm, value, indice) {

    let atributo = `<div class="td inputTd des ${value.nombre}" id="inputTd${value.nombre}${numeroForm}" ${autoCompOff} style="order:${indice}" ${widthObject[value.width] || ""}>
            <div class="botonDescriptivo oculto">Adjunto</div></div>`;

    return atributo

}
const tipoInputObj = {
    checkbox: atributoinputLogico,
    importe: atributoImporteAbm,
    fecha: atributoFechaAbm,
    adjunto: atributoAdjuntoAbm
}
function atributoCeldaParametrica(objeto, numeroForm, value, indice, consulta) {

    let valorPar = consultaPestanas?.[value.origen]?.[consulta[value.nombre]]?.[value.referencia || "name"] || ""
    let atributo = `<div class="celda ${value.nombre} valor" idRegistro="${consulta[value.nombre]}" style="order:${indice}" ${widthObject[value?.width] || `width="veinte"`} ${ocultoOject[value?.oculto] || ""}> ${valorPar}</div>`;

    return atributo

}
function atributoCeldaParametricaMixta(objeto, numeroForm, value, indice, consulta) {

    let valorPar = consultaPestanas?.[value.origen]?.[consulta[value.nombre]]?.[value.referencia || "name"] || consulta[value.nombre] || ""
    let atributo = `<div class="celda ${value.nombre} valor" idRegistro="${consulta[value.nombre]}" style="order:${indice}" ${widthObject[value?.width] || `width="veinte"`} ${ocultoOject[value?.oculto] || ""}> ${valorPar}</div>`;
    return atributo

}
function atributoCeldaParametricaPreEstablecidaForm(objeto, numeroForm, value, indice, consulta) {

    let valorPar = consulta[value.nombre] || ""
    let atributo = `<div class="celda ${value.nombre} valor" style="order:${indice}" ${widthObject[value?.width] || `width="veinte"`} ${ocultoOject[value?.oculto] || ""}> ${valorPar}</div>`;
    return atributo

}
function listaArrayParametrica(objeto, numeroForm, value, indice, consulta) {

    let valorPar = consultaPestanas?.[value.origen]?.[consulta?.[value.nombre]?.[0] || consulta?.[value.nombre]]?.[value.referencia || "name"] || ""
    let atributo = `<div class="celda ${value.nombre} valor" idRegistro="${consulta[value.nombre]}" style="order:${indice}" ${widthObject[value?.width] || `width="veinte"`} ${ocultoOject[value?.oculto] || ""}> ${valorPar}</div>`;
    return atributo


}
function atributoCeldaLogico(objeto, numeroForm, value, indice, consulta) {

    let atributo = ""
    let checked = {
        true: "checked",
        false: ""
    }

    atributo += `<div class="celda ${value.nombre}"  style="order:${indice}" ${widthObject[value.width] || ""} ${ocultoOject[value.oculto] || ""}>
    <input type="checkbox" class="edit ${value.nombre}" ${checked[consulta[value.nombre] || ""]} valid=${value.validacion} disabled="disabled"> </div>`;

    return atributo
}
function atributoCeldaTexto(objeto, numeroForm, value, indice, consulta) {

    let texto = consulta[value.nombre] ?? value.valorInicial ?? "";

    let atributo = `<div class="celda ${value.nombre}"  style="order:${indice}" ${widthObject[value.width] || ""} ${ocultoOject[value.oculto] || ""}> ${texto}</div>`;

    return atributo

}
function atributoCeldaFecha(objeto, numeroForm, value, indice, consulta) {

    let fecha = consulta[value.nombre] != undefined ? dateNowAFechaddmmyyyy(consulta[value.nombre], `d-m-y`) : "";
    let atributo = `<div class="celda ${value.nombre}"  style="order:${indice}" ${widthObject[value.width] || ""} ${ocultoOject[value.oculto] || ""}> ${fecha}</div>`;
    return atributo

}
function atributoCeldaFechaHora(objeto, numeroForm, value, indice, consulta) {
    console.log(consulta)
    console.log(value.nombre)
    let fecha = consulta[value.nombre] != undefined ? dateNowAFechaddmmyyyy(consulta[value.nombre], `d/m/y-hh`) : "";
    let atributo = `<div class="celda ${value.nombre}"  style="order:${indice}" ${widthObject[value.width] || ""} ${ocultoOject[value.oculto] || ""}> ${fecha}</div>`;
    return atributo

}
function atributoCeldaDate(objeto, numeroForm, value, indice, consulta) {

    let atributo = `<div class="celda ${value.nombre}"  style="order:${indice}" ${widthObject[value.width] || ""} ${ocultoOject[value.oculto] || ""}> ${mongoAGesfin(consulta[value.nombre], `d/m/yH`)}</div>`;
    return atributo
}
function atributoCeldaImporte(objeto, numeroForm, value, indice, consulta) {

    let moneda = {
        base: consultaPestanas.moneda?.[consulta[objeto.atributos?.moneda?.name]]?.name

    }

    let atributo = `<div class="celda ${value.nombre}" moneda="${moneda[value.moneda] || value.moneda}" style="order:${indice}" ${widthObject[value.width] || ""} ${ocultoOject[value.oculto] || ""}> ${numeroAString(consulta[value.nombre] || "")}</div>`;

    return atributo
}
function atriutoCeldaNumero(objeto, numeroForm, value, indice, consulta) {

    let numero = numeroAString(consulta[value.nombre] || "");
    let atributo = `<div class="celda ${value.nombre}"  style="order:${indice}" ${widthObject[value.width] || ""} ${ocultoOject[value.oculto] || ""}> ${numero}</div>`;
    return atributo
}
function atriutoCeldaNumerador(objeto, numeroForm, value, indice, consulta) {


    let atributo = `<div class="celda ${value.nombre}"  style="order:${indice}" ${widthObject[value.width] || ""} ${ocultoOject[value.oculto] || ""}> ${consulta[value.nombre]}</div>`;
    return atributo
}
function atributoCeldaNumeradorCompuesto(objeto, numeroForm, value, indice, consulta) {

    let valorString = ""
    valorString += `${consulta.numerador} `

    $.each(value.componentes, (indice, val) => {

        valorString += `${consulta[val.nombre]}`

    })
    $.each(value.complemento, (indice, val) => {

        valorString += `${consulta[val.nombre]}`

    })
    if (objeto.numerador.orden == "reves") {

        let partes = valorString.split(" ");
        valorString = `${partes[1]} ${partes[0]}`;
    }

    let atributo = `<div class="celda ${value.nombre}" style="order:${indice}" ${widthObject[value.width] || ""} ${ocultoOject[value.oculto] || ""}>${valorString}</div>`;

    return atributo
}
function atriutoCeldaTextArea(objeto, numeroForm, value, indice, consulta) {

    let atributo = `<div class="celda ${value.nombre}"  style="order:${indice}" ${widthObject[value.width] || ""} ${ocultoOject[value.oculto] || ""}>${consulta[value.nombre] || ""}</div>`;

    return atributo
}
function atriutoCeldaPassword(objeto, numeroForm, value, indice, consulta) {
    let atributo = `<div class="celda ${value.nombre}"  style="order:${indice}" ${widthObject[value.width] || ""} ${ocultoOject[value.oculto] || ""}>******</div>`;
    return atributo
}
function atriutoCeldaAdjunto(objeto, numeroForm, value, indice, consulta) {

    let atributo = ""
    let largoArchivos = consulta?.path?.length || 0
    if (largoArchivos == 1 && consulta?.path[0] == "") {

        largoArchivos = 0

    }
    const adj = {
        0: "Sin Adjuntos",
        1: "archivo adjunto",
        2: "archivos adjuntos",
    }
    const NumALet = {
        1: (largoArchivos) => { return primeraLetraMayusculaString(NumeroALetras("", largoArchivos, "")) },
        0: (largoArchivos) => { return "" }
    }
    let fila = 0
    const lengthClass = {
        1: "abrir"
    }
    let qAdj = adj[Math.min(largoArchivos, 2)]


    atributo += `<div class="celda ${value.nombre} centrado valor"  style="order:${indice}" ${widthObject[value.width] || ""}>`;
    atributo += `${NumALet[Math.min(largoArchivos, 1)](largoArchivos)} ${qAdj}`;
    atributo += `</div>`

    return atributo
}
function atributoCeldaEmpresa(objeto, numeroForm, value, indice, consulta) {

    let valorEmpresa = consultaPestanas.empresa?.[consulta[value.nombre]]?.[value.referencia] || ""

    let atributo = `<div class="celda ${value.nombre} valor" idRegistro="${consulta[value.nombre]}"  style="order:${indice}" ${widthObject[value.width] || ""} ${ocultoOject[value.oculto] || ""}>${valorEmpresa}</div>`;
    return atributo
}
function atributoCeldaColeccionSimple(objeto, numeroForm, value, indice, consulta) {
    let atributo = ""
    $.each(value.componentes, function (ind, val) {

        let valorColec = [];
        valorColec = consulta[val.nombre];

        switch (val.type) {
            case `numero`:
            case "importe":

                atributo += `<div class="celda colec ${value.nombre} ${ind}" moneda="${consulta.moneda}" style="order:${indice}" ${orden[indice] || indice} " ${widthObject[val.width] || ""} ${ocultoOject[val.oculto] || ""}>${valorColec}</div>`;
                break;
            case "referencia":
            case "parametrica":

                let valueRef = consultaPestanas?.[val.origen || val.nombre]?.[consulta[val.nombre]] || ""
                let valor = valueRef?.[val.pestRef] || ""

                atributo += `<div class="celda ${value.nombre} ${ind}" idregistro="${valueRef._id}" style="order:${indice}" ${widthObject[val.width] || ""} ${ocultoOject[val.oculto] || ""}>${valor}</div>`;
                break;
            case `texto`:

                atributo += `<div class="celda ${value.nombre} ${ind}"  ${widthObject[val.width] || ""} style="order:${indice}" ${ocultoOject[val.oculto] || ""}>${valorColec}</div>`;
                break;
        }
    })
    return atributo
}
function atributoCeldaColeccionListaArray(objeto, numeroForm, value, indice, consulta) {

    let valorDef = "";

    if (value.subType == "date" && consulta?.[value.nombre]?.[0]?.length > 0) {

        valorDef = dateNowAFechaddmmyyyy(consulta?.[value.nombre]?.[0] || "", `y-m-d`)

    } else {
        valorDef = consulta?.[value.nombre]?.[0] || ""
    }


    let atributo = `<div class="celda ${value.nombre}"  style="order:${indice}" ${widthObject[value.width] || ""} ${ocultoOject[value.oculto] || ""} length=${Math.min(2, (consulta?.[value.nombre]?.length || 0))}>${valorDef}</div>`;

    return atributo


}
function atriutoCeldaColeccionIndividual(objeto, numeroForm, value, indice, consulta) {
    let colec = `<div></div>`

    $.each(objeto.atributos?.abmCompuesto?.[value.nombre]?.atributos, (ind, val) => {

        let atr = objeto.atributos.compuesto[value.nombre].componentes[val]
        let celdita = ""

        celdita += tipoCeldatObj?.[atr.type]?.(objeto, numeroForm, atr, indice, consulta) || tipoCeldatObj.default(objeto, numeroForm, atr, indice, consulta);
        colec += celdita
    })

    return colec

}
function atriutoCeldaDefault(objeto, numeroForm, value, indice, consulta) {

    return `<div class="celda ${value.nombre}"  style="order:${indice}" ${widthObject[value.width] || ""} ${ocultoOject[value.oculto] || ""}>${consulta[value.nombre]}</div>`;
}
function vacio(objeto, numeroForm, value, indice, consulta) {



}
const tipoCeldatObj = {
    //Logico - 1
    checkbox: atributoCeldaLogico,
    logico: atributoCeldaLogico,
    //Pestana - 1
    parametrica: atributoCeldaParametrica,
    parametricaMixta: atributoCeldaParametricaMixta,
    parametricaPreEstablecida: atributoCeldaParametricaPreEstablecidaForm,
    listaArrayParametrica: listaArrayParametrica,
    //Fecha - 2
    fecha: atributoCeldaFecha,
    fechaHora: atributoCeldaFechaHora,
    date: atributoCeldaDate,
    //Numerador - 3
    numerador: atriutoCeldaNumerador,
    numeradorCompuesto: atributoCeldaNumeradorCompuesto,
    numeroCompuestoTrigger: atributoCeldaNumeradorCompuesto,//3
    //Numero - Importe - 2
    numero: atriutoCeldaNumero,
    importe: atributoCeldaImporte,
    //Texto - 3
    texto: atributoCeldaTexto,
    textarea: atriutoCeldaTextArea,
    textareafullrenglon: atriutoCeldaTextArea,
    //Colecciones - 3
    coleccionSimple: atributoCeldaColeccionSimple,
    coleccionInd: atriutoCeldaColeccionIndividual,
    listaArray: atributoCeldaColeccionListaArray,
    //Otros - 4
    textoDiv: vacio,
    password: atriutoCeldaPassword,
    adjunto: atriutoCeldaAdjunto,
    empresa: atributoCeldaEmpresa,
    default: atriutoCeldaDefault

}
