
function atributoReferencia(value, data) {

    let valor = data?.[value.nombre || value] || data

    let consultaPest = consultaPestanas[value.origen]
    let atributosRef = consultaPest?.[valor]?.name || ""

    return atributosRef

}
function atributoFecha(value, data) {

    let valor = data[value.nombre || value]
    let atributosRef = ""

    if (data[value.nombre || value]?.length > 0) {

        let fechaSinHora = valor?.split("T")?.[0] || ""
        let fechaArray = fechaSinHora?.split("-") || ""
        atributosRef = `${fechaArray[2]}-${fechaArray[1]}-${fechaArray[0]}`

    }

    return atributosRef

}
function atributoFechaHora(value, data) {

    let valor = data[value.nombre || value]
    let atributosRef = ""

    if (data[value.nombre || value]?.length > 0) {

        let fechaSinHora = valor?.split("T")?.[0] || ""
        let hora = valor?.split("T")?.[1].slice(0, 5)

        let fechaArray = fechaSinHora?.split("-") || ""
        atributosRef = `${fechaArray[2]}/${fechaArray[1]}/${fechaArray[0]} ${hora}`
    }

    return atributosRef
}
function atributoCompuesto(value, data) {

    let valor = ""

    $.each(value.componentes, (indice, value) => {

        valor += `${data?.[value.nombre || value]} `
    })

    let atributosRef = valor.trim()

    return atributosRef
}
function atributoimporte(value, data) {

    let valor = data?.[value.nombre || value]

    let atributosRef = numeroAString(valor || 0)
    return atributosRef || 0

}
function returnString(value, data) {

    let atributosRef = data?.[value.nombre || value] || ""
    return atributosRef
}
function returnStringLAUltimo(value, data) {

    let atributosRef = ""
    let array = Array.isArray(data?.[value.nombre || value])

    if (array) {

        atributosRef = data?.[value.nombre || value]?.[data?.[value.nombre || value].length - 1] || ""

    } else {
        atributosRef = data?.[value.nombre || value] || ""
    }

    if (value.subType == "date" && atributosRef != "") {

        atributosRef = dateNowAFechaddmmyyyy(atributosRef, `d-m-y`)
    }

    return atributosRef
}
function returnStringLATodos(value, data) {

    let atributosRef = ""
    let array = Array.isArray(data?.[value.nombre || value])

    if (array && data?.[value.nombre || value].length > 0) {

        atributosRef = data?.[value.nombre || value]
            ?.filter(c => c?.trim() !== "")
            .map(c => `<div class="item">${c}</div>`)
            .join("");

    } else {
        atributosRef = data?.[value.nombre || value] || ""
    }

    if (value.subType == "date" && atributosRef != "") {

        atributosRef = dateNowAFechaddmmyyyy(atributosRef, `d-m-y`)
    }

    return atributosRef
}
function atrubutoFuncion(value, data) {

    return value.funcion(data)
}
function triggerFuncionesDin(value, data) {

    if (data != undefined) {

        return value.funcion(data[value.data], ...value.atributos)
    } else {
        return ""
    }
}
function numeradorCompuestoTabla(value, data) {

    let atributo = `${data.numerador} ${data.ancla || ""}`

    return atributo.trim()
}
const objetoTabla = {

    parametrica: atributoReferencia,
    fecha: atributoFecha,
    fechaHora: atributoFechaHora,
    importe: atributoimporte,
    texto: returnString,
    atributoCompuesto,
    listaArray: returnStringLAUltimo,
    listaArrayTodos: returnStringLATodos,
    funcion: triggerFuncionesDin,
    numeradorCompuesto: numeradorCompuestoTabla,
    numero: atributoimporte,
    function: atrubutoFuncion
}
////Atributo en Reporte editable
function textoString(val, colum, valor) {

    let input = `<input class="rep ${val.nombre || val} ${val.claseReporte || ""} ${val.clase || ""} " name="${val.nombre || val}"  colum="${colum}" value="${valor || ""}" ${autoCompOff} />`

    return input
}
function numero(val, colum, valor) {

    let input = `<input type="numero" class="rep numero ${val.nombre || val} ${val.claseReporte || ""} ${val.clase || ""} " name="${val.nombre || val}"  colum="${colum}" value="${numeroAString(valor)}" ${autoCompOff}  />`

    return input
}
function fechaInput(val, colum, valor) {

    let input = `<input type="date" class="rep ${val.nombre || val} ${val.claseReporte || ""} ${val.clase || ""} " name="${val.nombre || val}"  colum="${colum}" value="${dateNowAFechaddmmyyyy(valor, `y-m-d`)}" />`

    return input

}
function selectListado(val, colum, valor) {

    let valorDef = valor || val.valorInicial
    return pestanaReportePreValor(val, valorDef)

}
const objetoReporteInput = {
    texto: textoString,
    numero: textoString,
    fecha: fechaInput,
    referenciaListado: selectListado,

}
////Atributos para poner en función
function porcentajeCalculo(data, atributo, atributoDos) {
    let resultado = ""
    //atributo Costo
    let numeroUno = parseFloat(data[atributo.nombre || atributo] || 0)
    let numeroDos = parseFloat(data[atributoDos.nombre || atributoDos] || 0)

    if (numeroUno > 0 && numeroDos > 0) {
        if (numeroUno < numeroDos) {
            resultado = (((numeroDos / numeroUno) - 1) * 100).toFixed(2)

        } else {
            let porcent = 1 - (numeroDos / numeroUno)
            resultado = ((porcent * -1) * 100).toFixed(2)
        }
    }

    return resultado
}
function multiplicaAtributos(data, atributo, atributoDos) {


    let resultado = ""
    let numeroUno = parseFloat(data?.[atributo.nombre || atributo] || 0)
    let numeroDos = parseFloat(data?.[atributoDos.nombre || atributoDos] || 0)

    resultado = (numeroUno * numeroDos).toFixed(2)
    return resultado
}

function diferenciaCalculo(data, atributo, atributoDos) {
    let resultado = ""
    //atributo Costo
    let numeroUno = parseFloat(data[atributo.nombre || atributo] || 0)
    let numeroDos = parseFloat(data[atributoDos.nombre || atributoDos] || 0)

    resultado = (numeroDos - numeroUno).toFixed(2)

    return resultado
}