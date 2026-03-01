class Numerador {
    constructor(caracteristica) {
        this.type = "numerador";
        this.numerador = true
        this.nombre = caracteristica.nombre || caracteristica;
        this.clase = caracteristica.clase || "";
        this.width = caracteristica.width || "cinco";
    }
}
const NS = new Proxy(Numerador, {
    // Interceptar la llamada a P(...)
    apply(target, thisArg, args) {
        // Devuelve una instancia automáticamente
        return new target(...args);
    }
})
class NumeradorCompuestoClase {
    constructor(caracteristica) {
        this.type = "numeradorCompuesto";
        this.numerador = true
        this.nombre = caracteristica.nombre || caracteristica;
        this.clase = caracteristica.clase || "";
        this.width = caracteristica.width || "cinco";
        this.filtro = caracteristica.filtro || [];
        this.funcion = caracteristica.funcion || "";
        this.valoresIniciales = caracteristica.valoresIniciales
        this.complemento = caracteristica.complemento /// no filtra y  no genera numerador nuevos 
        this.componentes = caracteristica.componentes /// si filtra y genera numerador nuevos 
        this.orden = caracteristica.orden || ""
    }
}
const NC = new Proxy(NumeradorCompuestoClase, {
    // Interceptar la llamada a P(...)
    apply(target, thisArg, args) {
        // Devuelve una instancia automáticamente
        return new target(...args);
    }
})
class NumeradorCompuestoTrigerClase {
    constructor(caracteristica) {
        this.type = "numeroCompuestoTrigger";
        this.numerador = true
        this.nombre = caracteristica.nombre || caracteristica;
        this.clase = caracteristica.clase || "";
        this.width = caracteristica.width || "siete";
        this.filtro = { ...caracteristica.trigger || [] };
        this.trigger = caracteristica.trigger || [];
        this.funcion = caracteristica.funcion || "";
        this.valoresIniciales = {
            ancla: caracteristica.valorInicialAncla || "",
            ...caracteristica.filtro || {}

        }
        this.componentes = {
            ancla: T("ancla")
        }

        this.orden = caracteristica.orden || ""
    }
}
const NCT = new Proxy(NumeradorCompuestoTrigerClase, {
    // Interceptar la llamada a P(...)
    apply(target, thisArg, args) {
        // Devuelve una instancia automáticamente
        return new target(...args);
    }
})

/////////////////////////////////////////////////////
function numeradorDato(objeto, numeroForm) {

    let numerador = objeto.numerador
    let detalleFiltro = {
        name: objeto.accion,
    }
    let detalleComplemento = {}

    for (const [indice, elementos] of Object.entries(objeto?.numerador?.componentes || [])) {

        detalleFiltro[indice] = objeto.numerador.valoresIniciales[indice][0](objeto.numerador.valoresIniciales[indice][1] || "")
    }
    for (const [indice, elementos] of Object.entries(objeto?.numerador?.complemento || [])) {

        detalleComplemento[indice] = objeto.numerador.valoresIniciales[indice][0](objeto.numerador.valoresIniciales[indice][1] || "")
    }

    $.each(objeto?.numerador?.filtro, (indice, value) => {
        detalleFiltro[value] = $(`#t${numeroForm} input.${value}`).val()
    })

    detalleFiltroAtributos = Object.assign(detalleFiltro, empresaFiltro)

    const filtros = `&filtros=${JSON.stringify(detalleFiltro)}`
    let resultado = new Object
    let filtroComplemento = Object.assign(detalleComplemento || {}, detalleFiltro || {})

    $.ajax({
        type: "GET",
        url: `/get?base=numerador${filtros}&limite=1&sort=numerador:-1`,
        async: false, // Hace la solicitud síncrona
        success: function (response) {

            resultado = filtroComplemento
            resultado.numerador = (parseFloat(response?.[response.length - 1]?.numerador || 0) + 1)

        },
        error: function (error) {
            console.log(error);
        },
    });

    $.each(numerador?.funcion, (indice, value) => {

        value[0](resultado, value[1])

    })

    return resultado
}
//Form
async function insertarNumeradorForm(objeto, numeroForm) {

    let numeradorObjeto = {};
    numeradorObjeto.name = objeto.accion
    //numeradorObjeto.empresa = empresaSeleccionada?._id
    let detalleComplemento = {}

    for (const [indice, elementos] of Object.entries(objeto.numerador.componentes || [])) {

        numeradorObjeto[indice] = objeto.numerador.valoresIniciales[indice][0](objeto.numerador.valoresIniciales[indice][1] || "")
    }

    for (const [indice, elementos] of Object.entries(objeto.numerador.complemento || [])) {

        detalleComplemento[indice] = objeto.numerador.valoresIniciales[indice][0](objeto.numerador.valoresIniciales[indice][1] || "")
    }
    $.each(objeto.numerador.filtro, (indice, value) => {
        numeradorObjeto[value] = $(`#t${numeroForm} input.${value}`).val()
    })

    numeradorObjeto = Object.assign(numeradorObjeto, empresaFiltro || {})

    try {
        const response = await fetch('/numerador', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(numeradorObjeto)
        });

        const data = await response.json();
        let num = data.actualizado
        $.each(objeto.numerador.funcion, (indice, value) => {

            value[0](num, value[1])

        })

        let valorString = `${data.actualizado.numerador}  `
        $(`#t${numeroForm} input.numerador`).val(data.actualizado.numerador)

        $.each(objeto.numerador.componentes, (indice, value) => {
            valorString += `${data.actualizado?.[indice]}`
            $(`#t${numeroForm} input.${indice}`).val(data.actualizado?.[indice])
        })
        $.each(objeto.numerador.complemento, (indice, value) => {
            valorString += `${detalleComplemento[indice]}`
            $(`#t${numeroForm} input.${indice}`).val(detalleComplemento[indice])
        })

    } catch (error) {
        console.log(error);
        throw error; // ✔ sube y lo registra
    }
}
async function decrementarNumeradorForm(objeto, numeroForm) {

    let numeradorActual = numeradorDato(objeto, numeroForm)
    let detalleComplemento = {}
    if ((numeradorActual.numerador - 1) == $(`#t${numeroForm} input.numerador`).val()) {

        let numeradorObjeto = {};
        numeradorObjeto.name = objeto.accion
        numeradorObjeto.empresa = empresaSeleccionada?._id

        for (const [indice, elementos] of Object.entries(objeto.numerador.componentes || [])) {

            numeradorObjeto[indice] = objeto.numerador.valoresIniciales[indice][0](objeto.numerador.valoresIniciales[indice][1] || "")
        }
        for (const [indice, elementos] of Object.entries(objeto.numerador.complemento || [])) {

            detalleComplemento[indice] = objeto.numerador.valoresIniciales[indice][0](objeto.numerador.valoresIniciales[indice][1] || "")
        }
        $.each(objeto.numerador.filtro, (indice, value) => {
            numeradorObjeto[value] = $(`#t${numeroForm} input.${value}`).val()
        })

        try {
            const response = await fetch('/decNumerador', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(numeradorObjeto)
            });

            const data = await response.json();

            let num = data.actualizado
            $.each(objeto.numerador.funcion, (indice, value) => {

                value[0](num, value[1])

            })

            let valorString = `${data.actualizado.numerador}  `
            $(`#t${numeroForm} input.numerador`).val(data.actualizado.numerador)

            $.each(objeto.numerador.componentes, (indice, value) => {
                valorString += `${data.actualizado?.[indice]}`
                $(`#t${numeroForm} input.${indice}`).val(data.actualizado?.[indice])
            })

            $.each(objeto.numerador.complemento, (indice, value) => {
                valorString += `${detalleComplemento[indice]}`
                $(`#t${numeroForm} input.${indice}`).val(detalleComplemento[indice])
            })

        } catch (error) {
            console.log(error);
            throw error; // ✔ sube y lo registra
        }
    }
}
function numeradorActualizarForm(objeto, numeroForm) {

    let numerador = objeto.numerador

    if (numerador.type != "numeroCompuestoTrigger") {

        let consultaNum = numeradorDato(objeto, numeroForm)
        let valorString = `${consultaNum.numerador} `

        $(`#t${numeroForm} input[name="numerador"]`).val(consultaNum.numerador)

        $.each(numerador.componentes, (indice, value) => {

            valorString += `${consultaNum[value.nombre]}`
            $(`#t${numeroForm} input.${value.nombre}`).val(consultaNum[value.nombre])

        })
        $.each(numerador.complemento, (indice, value) => {

            valorString += `${consultaNum[value.nombre]}`
            $(`#t${numeroForm} input.${value.nombre}`).val(consultaNum[value.nombre])

        })

        if (objeto.numerador.orden == "reves") {

            let partes = valorString.split(" ");
            $(`#t${numeroForm} div.fo.numerador p`).html(`${partes[1]} ${partes[0]}`)

            $(`#t${numeroForm} div.fo.numeradorCompuesto p`).html(`${partes[1]} ${partes[0]}`)
        } else {
            $(`#t${numeroForm} div.fo.numerador p`).html(valorString.trim())
            $(`#t${numeroForm} div.fo.numeradorCompuesto  p`).html(valorString.trim())
        }
    } else {

        $(`#t${numeroForm} div.fo.numerador p`).html("")
        $(`#t${numeroForm} div.fo.numerador input`).val("")
    }
}
function numeradorActualizarFormTrigger(objeto, numeroForm) {

    let numerador = objeto.numerador
    let consultaNum = numeradorDato(objeto, numeroForm)

    let valorString = `${consultaNum.numerador} `

    $(`#t${numeroForm} input[name="numerador"]`).val(consultaNum.numerador)

    $.each(numerador.componentes, (indice, value) => {

        valorString += `${consultaNum[value.nombre]}`
        $(`#t${numeroForm} input.${value.nombre}`).val(consultaNum[value.nombre])

    })
    $.each(numerador.complemento, (indice, value) => {

        valorString += `${consultaNum[value.nombre]}`
        $(`#t${numeroForm} input.${value.nombre}`).val(consultaNum[value.nombre])

    })

    if (objeto.numerador.orden == "reves") {

        let partes = valorString.split(" ");
        $(`#t${numeroForm} div.fo.numerador p`).html(`${partes[1]} ${partes[0]}`)

        $(`#t${numeroForm} div.fo.numeradorCompuesto p`).html(`${partes[1]} ${partes[0]}`)
    } else {
        $(`#t${numeroForm} div.fo.numerador p`).html(valorString.trim())
        $(`#t${numeroForm} div.fo.numeradorCompuesto  p`).html(valorString.trim())
    }
}
//Abm
async function insertarNumeradorAbm(objeto, numeroForm) {

    let numeradorObjeto = {};
    numeradorObjeto.name = objeto.accion
    numeradorObjeto.empresa = empresaSeleccionada?._id
    let detalleComplemento = {}

    for (const elementos of Object.values(objeto.numerador.componentes || [])) {

        numeradorObjeto[elementos.nombre] = $(`#t${numeroForm} input.${elementos.nombre}`).val()
    }
    for (const elementos of Object.values(objeto.numerador.complemento || [])) {

        detalleComplemento[elementos.nombre] = $(`#t${numeroForm} input.${elementos.nombre}`).val()
    }

    try {
        const response = await fetch('/numerador', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(numeradorObjeto)
        });

        const data = await response.json();

        $(`#t${numeroForm} input.numerador`).val(data.actualizado.numerador)
        $.each(objeto.numerador.componentes, (indice, value) => {

            $(`#t${numeroForm} input.${value.nombre || value}`).val(data.actualizado[value.nombre || value])
        })
        $.each(objeto.numerador.complemento, (indice, value) => {

            $(`#t${numeroForm} input.${value.nombre || value}`).val(detalleComplemento[value.nombre || value])
        })


    } catch (error) {
        console.log(error);
        throw error; // ✔ sube y lo registra
    }
}
function numeradorActualizarAbm(objeto, numeroForm) {

    return new Promise((resolve, reject) => {

        let num = numeradorDato(objeto, numeroForm)

        $(`#t${numeroForm} .tr.input input.inputR.numerador`).val(num.numerador).prop("readonly", true).addClass("transparente").addClass("textoCentrado");

        resolve("ok")
    })
}
//Desencadenante 
async function insertarNumeradorDesencadenante(objeto, numeroForm) {

    let numerador = objeto.numerador
    let numeradorObjeto = {};
    numeradorObjeto.name = objeto.accion
    numeradorObjeto.empresa = empresaSeleccionada?._id

    for (const [indice, elementos] of Object.entries(objeto.numerador.componentes || [])) {

        numeradorObjeto[indice] = objeto.numerador.valoresIniciales[indice][0](objeto.numerador.valoresIniciales[indice][1] || "")
    }

    try {
        const response = await fetch('/numerador', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(numeradorObjeto)
        });

        const data = await response.json();

        let numeradorObjetoEnv = new Object
        numeradorObjetoEnv.numerador = data.actualizado.numerador

        $.each(objeto.numerador.componentes, (indice, value) => {
            numeradorObjetoEnv[value.nombre] = data.actualizado[value.nombre]

        })

        $.each(objeto.numerador.complemento, (indice, value) => {
            numeradorObjetoEnv[value.nombre] = data.actualizado[value.nombre]

        })
        $.each(numerador.funcion, (indice, value) => {

            value[0](numeradorObjetoEnv, value[1])

        })

        return numeradorObjetoEnv

    } catch (error) {
        console.log(error);
        throw error;
    }

}
function formatoDigitosExtra(num, digitos) {

    num.numerador = num.numerador.toString().padStart(digitos, "0")

}
function valorFijoNum(num) {

    return num

}
