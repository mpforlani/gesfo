
let variablesIniciales = {


}

let entidadesFiltrosEmail = Object.values(variablesIniciales?.locales || {}).filter(e => e?.enviar?.emailAtributo != undefined)
$.each(entidadesFiltrosEmail, (indice, value) => {

    $.each(value?.enviar?.emailAtributo, (ind, val) => {

        entidadesEmail[val] = entidadesEmail[val] || []
        entidadesEmail[val].push(value.accion)

    })
})