
function pestanaAnidada(father, atributo, agrupador) {//Nose donde se usa

    let valor = Object.values(consultaPestanas[atributo.nombre || atributo])
    let options = new Object

    let pestanaColect = ""
    pestanaColect += `<div class="opcionesSelect oculto"><div class="opciones" value=""></div>`;

    $.each(valor, (indice, value) => {
        options[value[agrupador.nombre || agrupador]] = options[value[agrupador.nombre || agrupador]] || []
        options[value[agrupador.nombre || agrupador]].push(value)

    })
    $.each(options, (indice, value) => {

        pestanaColect += `<div class="opcionesAgrupador"><p>${consultaPestanas?.[agrupador.nombre || agrupador]?.[indice]?.name || indice}<span class="material-symbols-outlined">
                    expand_more</span></p>`

        $.each(value, (ind, val) => {

            if (val.habilitado == "true" && val.desplegable != false) {

                let show = ""
                $.each(atributo.key, (ind, v) => {

                    show += `${val[v]} `
                })

                pestanaColect += `<div class="opciones oculto" agrupa="${consultaPestanas?.[agrupador.nombre || agrupador]?.[indice]?.name || indice}" valueString="${show.slice(0, -1)}" value="${val._id}">${show.slice(0, -1)}</div>`;
            }
        })

        pestanaColect += `</div>`

    })

    pestanaColect += `</div>`

    let ps = $(pestanaColect)

    soloLecturaSelectInput(`#${father}`, `select.${atributo.nombre || atributo}`)

    $(`#${father} select.${atributo.nombre || atributo} option`)
    $(`#${father} select.${atributo.nombre || atributo}`).parents("td").addClass("anidado")

    return ps
}
async function cargarPestanasCabecera(objeto, atributo) {

    let pest = ""

    let opcionesHabilitadas = consultaPestanasConOrden[atributo.origen] || (await consultasPestanaIndividual(atributo.origen)).orden

    $.each(atributo.ocultCond, (indice, condicion) => {

        opcionesHabilitadas = opcionesHabilitadas.filter(e => e[condicion.atributo] == condicion.valor)
    })

    let valorInicial = opcionesHabilitadas?.find(e => e[atributo.pestRef] == atributo.valorInicial) || ""
    let valorDefPar = valorInicial?.[atributo.pestRef] || ""

    pest += `<div class="selectCont ${atributo.nombre || atributo}" name="${atributo.nombre || atributo}">`

    pest += `<div class="selecSimulado"><div class="selectInput"><input type="parametrica" class="inputSelect ${atributo.clase || ""} ${atributo.nombre || atributo}" name="${atributo.nombre}" origen="${atributo.origen || ""}"  value="${valorDefPar}" autocomplete="new-password" /><div class="spanFlechaAbajo"><span class="material-symbols-outlined abajo">stat_minus_1</span></div></div></div>`

    pest += `<div class="opcionesSelectDiv oculto ${lengthDesplegable?.[Math.min(10, Object?.values(opcionesHabilitadas)?.length)] || ""}">
    <div class="opciones primeroVacio" valueString="" value=""><p></p></div>`


    $.each(opcionesHabilitadas, (ind, val) => {

        pest += `<div class="opciones" valueString="${val[atributo.pestRef]}" value="${val._id}"><p>${val[atributo.pestRef]}</p></div>`

    })

    pest += `</div>`//Cerrar opcionesSelectDiv

    pest += `<div class="divInput oculto"><input class="divSelectInput" name="${atributo.nombre}" value="${valorInicial._id || ""}" /></div>`
    pest += `<div class="agrandarLista"> +</div>`
    pest += `</div>`;//Cerrar selectCont


    return pest

}
function cargarPreEstablecidaCabecera(objeto, atributo) {

    let pest = ""

    pest += `<div class="selectCont ${atributo.nombre || atributo}" name="${atributo.nombre || atributo}">`

    pest += `<div class="selecSimulado"><div class="selectInput"><input type="parametrica" class="inputSelect ${atributo.clase || ""} ${atributo.nombre || atributo}" name="${atributo.nombre}" origen="${atributo.origen || ""}"  autocomplete="new-password" /><div class="spanFlechaAbajo"><span class="material-symbols-outlined abajo">stat_minus_1</span></div></div></div>`

    pest += `<div class="opcionesSelectDiv oculto">
    <div class="opciones primeroVacio" valueString="" value=""><p></p></div>`

    $.each(atributo.opciones, (ind, val) => {

        pest += `<div class="opciones" value="${val}"><p>${val}</p></div>`

    })

    pest += `</div>`//Cerrar opcionesSelectDiv
    pest += `</div>`;//Cerrar selectCont

    return pest

}
function cargarPreEstablecidaTesting(objeto, numeroForm, valor) {

    let pest = ""

    pest += `<div class="selectCont testing" name="testing">`

    pest += `<div class="selecSimulado"><div class="selectInput"><input type="parametricaTesting" class="inputSelect testingCabecera requerido" name="testing" value="${variablesModelo[valor]?.pest || ""}" autocomplete="new-password" /><div class="spanFlechaAbajo"><span class="material-symbols-outlined abajo">stat_minus_1</span></div></div></div>`

    pest += `<div class="opcionesSelectDiv scroll oculto">`

    let valorDefPar = valor

    $.each(modulosLocales, (indice, value) => {

        // pest += `<div class="agrupador cerrado"><div><h5>${value.titulo}</h5></div>`

        $.each(value.componentes, (ind, val) => {

            if (ind.endsWith("Ind") || val.type == "aprobar" || val.type == "desarrollo" || val.type == "aprobarColección") return;

            pest += `<div class="opciones" value="${val.accion}" valueString="${val.pest}"><p>${val.pest}</p></div>`
        })
        //  pest += `</div>`
    })
    pest += `</div>`//Cerrar opcionesSelectDiv
    pest += `<div class="divInput oculto"><input class="divSelectInputTest" name="entidad" form="test${numeroForm}" value="${valorDefPar}" /></div>`
    pest += `</div>`;//Cerrar selectCont

    return pest

}
function pestanaCabeceraInformePrevalores(objeto, numeroForm, atributo, clase) {//Este se usa ene cabeera de reporte para filtrar, puede ser ejemplo detalle importacinoes sbc

    let pestana = ""

    pestana += `<div class="selectCont ${atributo.nombre} ${clase?.select || ""}" name="${atributo.nombre}">
    <div class="selecSimulado preEstablecido"><div class="selectInput preEstablecido"><input type="parametrica" class="inputSelect ${atributo.nombre}" name="${atributo.nombre}" value="${atributo?.select?.inicio?.titulo}" autocomplete="new-password" />
    </div><div class="spanFlechaAbajo"><span class="material-symbols-outlined abajo">stat_minus_1</span></div></div>`

    pestana += `<div class="opcionesSelectDiv oculto">`

    $.each(atributo.select.opciones.titulos, (ind, val) => {

        pestana += `<div class="opciones" valueString="${val}" value="${atributo?.select?.opciones?.valores?.[ind] || ""}"><p>${val}<p></div>`

    })

    pestana += `</div>`//Cerrar opcionesSelectDiv
    pestana += `<div class="divInput oculto"><input class="divSelectInput" name="${atributo.nombre}" value="${atributo.select.inicio.valores}" /></div>`
    pestana += `</div>`;//Cerrar selectCont
    pestana += `</div>`//Cerrar selecAtributo

    return pestana

}
function pestanaReportePreValor(atributo, valor) {//Cuerpo de reporte para guardar datos propio del reporte ejemplo detalle importaciones

    let pestana = `<div class="selectCont" ${atributo.nombre || atributo}" name="${atributo.nombre || atributo}">
    <div class="selecSimulado"><div class="selectInput"><input class="inputSelect rep" value="${valor || ""}"  autocomplete="new-password"/>
    </div><div class="spanFlechaAbajo"><span class="material-symbols-outlined abajo">stat_minus_1</span></div></div>`

    pestana += `<div class="opcionesSelectDiv oculto">
             <div class="opciones primeroVacio" valueString="" value=""><p></p></div>`

    $.each(atributo.lista, (ind, val) => {

        pestana += `<div class="opciones" valueString="${val}" value="${ind}"><p>${val}</p></div>`

    })
    pestana += `</div>`//Cerrar opcionesSelectDiv
    pestana += `<div class="divInput oculto"><input class="divSelectInput ${atributo.claseReporte || ""}" name="${atributo.nombre}" value="${valor || ""}" /></div>`
    pestana += `</div>`;//Cerrar selectCont

    return pestana
}
//Consultas menu inicio parametrica
async function consultasPestanaIndividual(entidad) {

    let pest = variablesModelo?.[entidad] || variablesIniciales[entidad];

    let detalleFiltroAtributos = {};
    let sort = `&sort=name:1`;

    let pes = pest || "";

    if (caracteristicaEmpresa.empresa === true && pes.empresa === true && empresa !== "Todos") {
        detalleFiltroAtributos.empresa = empresa;
    }
    detalleFiltroAtributos.habilitado = true;

    $.each(pes.sort, (indice, value) => {
        sort = `&sort=${indice}:${value}`;
    });

    if (caracteristicaEmpresa.empresa === true && variablesModelo[pest.origen || pest.nombre]?.empresa != false) {
        detalleFiltroAtributos = Object.assign(detalleFiltroAtributos, empresaFiltro)
    }

    const filtros = `&filtros=${JSON.stringify(detalleFiltroAtributos)}`;

    try {
        const data = await $.ajax({
            type: "get",
            url: `/get?base=${entidad}${filtros}${sort}`,
        });

        consultaPestanas[entidad] = {};

        $.each(data, (indice, value) => {
            consultaPestanas[entidad][value._id] = value;
        });

        consultaPestanasConOrden[entidad] = data;

        return {
            orden: consultaPestanasConOrden[entidad],
            pestana: consultaPestanas[entidad]
        }

    } catch (error) {
        console.log(error);
        throw error;
    }
}
////Pestanas div
const requerido = {//Requerido para usar en
    true: "requerido",
    false: ""
}
const lengthDesplegable = {
    10: "scroll",
}
function prestanaFormIndividual(objeto, numeroForm, atributo, valorPar, indice, elementos) {

    let pest = ""
    let opcionesHabilitadas = consultaPestanasConOrden[atributo.origen]

    $.each(atributo.ocultCond, (indice, condicion) => {

        opcionesHabilitadas = opcionesHabilitadas.filter(e => e[condicion.atributo] == condicion.valor)
    })

    let valorInicial = Object.values(opcionesHabilitadas)?.find(e => e[atributo.pestRef] == atributo.valorInicial) || ""
    let valorDefPar = consultaPestanas[atributo.origen]?.[valorPar]?.[atributo.pestRef] || valorPar || valorInicial?.[atributo.pestRef] || ""

    pest += `<div class="selectCont ${atributo.nombre || atributo}" name="${atributo.nombre || atributo}">`

    pest += `<div class="selecSimulado"><div class="selectInput"><input type="parametrica" class="inputSelect ${elementos?.clase || ""} ${atributo?.clase || ""} ${atributo?.nombre || atributo} ${requerido[objeto?.validaciones?.includes(atributo.nombre)] || ""}" name="${atributo.nombre}" origen="${atributo.origen || ""}"  value="${valorDefPar}" tabindex="${indice}" ${elementos?.disabled || ""} ${autoCompOff} /><div class="spanFlechaAbajo"><span class="material-symbols-outlined abajo">stat_minus_1</span></div></div></div>`

    pest += `<div class="opcionesSelectDiv oculto ${lengthDesplegable?.[Math.min(10, Object?.values(opcionesHabilitadas)?.length)] || ""}">
    <div class="opciones primeroVacio" valueString="" value=""><p></p></div>`


    $.each(opcionesHabilitadas, (ind, val) => {

        pest += `<div class="opciones" valueString="${val[atributo.pestRef]}" value="${val._id}"><p>${val[atributo.pestRef]}</p></div>`

    })

    pest += `</div>`//Cerrar opcionesSelectDiv

    pest += `<div class="divInput oculto"><input class="divSelectInput" name="${atributo.nombre}" form="f${objeto.accion}${numeroForm}" ${elementos?.disabled || ""} value="${valorPar || valorInicial._id || ""}" /></div>`
    pest += `<div class="agrandarLista"> +</div>`
    pest += `</div>`;//Cerrar selectCont

    return pest
}
function prestanaFormIndividualPreEstablecida(objeto, numeroForm, atributo, valorPar, indice, elementos) {

    let pest = ""
    let valorDefPar = valorPar || atributo.valorInicial || ""

    pest += `<div class="selectCont ${atributo.nombre || atributo}" name="${atributo.nombre || atributo}">`

    pest += `<div class="selecSimulado"><div class="selectInput"><input type="parametricaPreEstablecida" class="inputSelect ${elementos.clase || ""} ${atributo.clase || ""} ${atributo.nombre || atributo}" name="${atributo.nombre}" value="${valorDefPar}" tabindex="${indice}" ${elementos.disabled || ""} form="f${objeto.accion}${numeroForm}" autocomplete="new-password" /><div class="spanFlechaAbajo"><span class="material-symbols-outlined abajo">stat_minus_1</span></div></div></div>`

    pest += `<div class="opcionesSelectDiv oculto">
    <div class="opciones primeroVacio" valueString="" value=""><p></p></div>`

    $.each(atributo.opciones, (ind, val) => {

        pest += `<div class="opciones" value="${val}"><p>${val}</p></div>`
    })

    pest += `</div>`//Cerrar opcionesSelectDiv
    pest += `</div>`;//Cerrar selectCont

    return pest

}
function pasarDatosString(atributos, data) {

    let dataDef = []

    $.each(atributos, (ind, val) => {

        switch (val.type) {
            case "parametrica":

                dataDef.push(consultaPestanas[val.origen || val.nombre][data[val.nombre]].name)

                break;
            case "coleccionInd":

                $.each(val.componentes, (indice, value) => {

                    switch (value.type) {
                        case "parametrica":
                            dataDef.push(consultaPestanas?.[value?.origen || value?.nombre][data?.[value?.nombre]?.[0] || data?.[value.nombre]?.[0]]?.name || "")
                            break;
                        default:

                            dataDef.push(data?.[value.nombre || value]?.[0] || data?.[value.nombre || value])
                            break;

                    }
                })
                break;
            case "listaArrayTodos":

                let valorArray = " "

                $.each(data?.[val.nombre || val], (indice, value) => {


                    valorArray += data?.[val.nombre || val]?.[indice] + "," + " "

                })

                dataDef.push(valorArray.trim().slice(0, -1))

                break;
            case "listaArray":

                if (val.subType != "date") {
                    if (Array.isArray(data?.[val.nombre])) {

                        dataDef.push(data?.[val.nombre]?.[0] || "")
                    } else {

                        dataDef.push(data?.[val.nombre || val] || "")
                    }
                } else {

                    if (Array.isArray(data?.[val.nombre])) {

                        let valor = data?.[val.nombre]?.[0] || ""

                        if (valor != "") {
                            dataDef.push(dateNowAFechaddmmyyyy(valor, `d/m/y`))

                        } else {
                            dataDef.push("")
                        }

                    } else {

                        let valor = data?.[val.nombre] || ""
                        if (valor != "") {
                            dataDef.push(dateNowAFechaddmmyyyy(valor, `d/m/y`))

                        } else {
                            dataDef.push("")
                        }
                    }

                }

                break;
            case "fecha":

                let valor = data?.[val.nombre] || ""
                if (valor != "") {
                    dataDef.push(dateNowAFechaddmmyyyy(valor, `d/m/y`))

                } else {
                    dataDef.push("")
                }

                break;
            case "numeradorCompuesto":

                let num = data.numerador
                $.each(val.componentes, (i, v) => {

                    num = `${num} ${data?.[v.nombre || v]}`

                })
                dataDef.push(num)
                break;
            default:
                dataDef.push(data[val.nombre || val] || "")
                break;
        }
    })

    return dataDef
}
//Todo
$(document).on(`click`, `.selecSimulado`, (e) => {

    let father = $(e.currentTarget).parents(".selectCont")

    $(`input.inputSelect`, e.currentTarget).on("focus");
    $(`.opciones`, father).removeClass("hoverFlecha")
})
$(document).on(`pointerdown`, `.selectCont .opcionesSelectDiv .opciones`, (e) => {

    let father = $(e.target).parents(".selectCont")
    $(`.inputSelect`, father).removeClass("filtrandoType")
    $(`.inputSelect`, father).addClass("selectClick")//ESto es un bloqueo que solo funciona cuando se tipea para reducir opcioenes y luego se clickea, evito el change del cuando dejo el input para clicker (el pointer down es más rápido que el blur)
    let valorHtml = $("p", e.currentTarget).text()

    $(e.currentTarget).addClass("seleccionado")
    $(e.currentTarget).siblings().removeClass("seleccionado")

    setTimeout(() => {
        $(`.inputSelect`, father).removeClass("selectClick")//Aca lo desbloqueo justo antes de tirar el change, porque el blur ya se ejecuto
        $(`input.inputSelect`, father).val(valorHtml).trigger("change");
    }, 0);
})
let typeParametrica = {
    parametrica: "valuestring",
    parametricaPreEstablecida: "value",
    listaArrayParametrica: "value",

}
$(document).on(`blur`, `input.inputSelect:not([readonly])`, (e) => {

    setTimeout(() => {

        let father = $(e.target).parents('div.selectCont');
        let name = $(`input.divSelectInput`, father).attr("name")

        $('div.opcionesSelectDiv', father).addClass('oculto')
        $(`div.opcionesSelectDiv.absolute[name=${name}]`).remove();
        $('div.opciones', father).removeClass('oculto')

    }, 100);

    $(e.target).parents(`.selectCont`).removeClass(`active`)
})
$(document).on(`blur`, `input.inputSelect.filtrandoType`, (e) => {

    let fahter = $(e.currentTarget).parents(`.selectCont`)
    $(e.currentTarget).removeClass(`filtrandoType`)
    $(`.divSelectInput`, fahter).trigger(`change`)//Ver esto

})
$(document).on(`keyup`, `.tabs_contents_item:not([tabla="abm"]) .selectCont .inputSelect, inputSelect.testingCabecera, .comandos .inputSelect`, (e) => {

    let selectdCont = e.target.closest(".selectCont");

    let elemento = ""
    let elementoASelect = ""

    switch (e.key) {
        case `ArrowDown`:

            elemento = $$$(`.opciones.hoverFlecha`, selectdCont) || $(`.opciones`, selectdCont)[0];
            elementoASelect = $(elemento).nextAll().not(`[class*="oculto"]`)[0] || $(`.opciones`, selectdCont)[0];
            valorElemento = $(elementoASelect).attr("value")
            valorOption = $(`p`, elementoASelect).html()?.trim()

            $(elementoASelect).addClass(`hoverFlecha`)[0]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            $(elementoASelect).siblings().removeClass(`hoverFlecha`)

            break;
        case `ArrowUp`:

            elemento = $$$(`.opciones.hoverFlecha`, selectdCont) || $(`.opciones`, selectdCont)[0];

            elementoASelect = $(elemento).prevAll().not(`[class*="oculto"]`)[0] || $(`.opciones:not([class*="oculto"])`, selectdCont)[$(`.opciones:not([class*="oculto"])`, selectdCont).length - 1];
            valorElemento = $(elementoASelect).attr("value")
            valorOption = $(`p`, elementoASelect).html().trim()

            $(elementoASelect).addClass(`hoverFlecha`)[0].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            $(elementoASelect).siblings().removeClass(`hoverFlecha`)

            break;
        case `Enter`:
            $(e.currentTarget).removeClass(`filtrandoType`)
            let seleccionado = $(`.opciones.hoverFlecha:not([class*="oculto"]) p`, selectdCont).html()

            $(`.opciones`, selectdCont).removeClass("seleccionado")
            $(`.opciones.hoverFlecha:not([class*="oculto"])`, selectdCont).addClass("seleccionado").removeClass("hoverFlecha")
            $(`.inputSelect`, selectdCont).val(seleccionado || "").trigger("change")

            $(`div.opcionesSelectDiv`, selectdCont).addClass("oculto")

            break;
        case "ArrowRight":
        case "ArrowLeft":


            break;
        case `Tab`:
        case "Shift":

            $(`div.opcionesSelectDiv`, selectdCont).removeClass("oculto")

            break;
        default:

            let type = e.target.getAttribute("type")
            let valorBuscado = $(e.target).val().toLowerCase().trim();

            if (valorBuscado.length > 0) {

                let valoresOptionsHtml = new Object()

                let valoresOptions = $(`div.opciones:not(.primeroVacio)`, selectdCont)

                valoresOptions.removeClass("oculto")
                $.each(valoresOptions, (indice, value) => {

                    valoresOptionsHtml[$(value).attr(typeParametrica[type])?.toLowerCase()] = $(value).attr("value")

                    if (!($(`p`, value).html().trim().toLowerCase().startsWith(valorBuscado))) {

                        $(value).addClass("oculto")

                    }
                })

                if ($(`.opciones:not(.oculto)`, selectdCont).length < 9) {

                    $(`div.opcionesSelectDiv`, selectdCont).addClass("anulaScroll")

                } else {

                    $(`div.opcionesSelectDiv`, selectdCont).removeClass("anulaScroll")
                }

                $(`.opciones.seleccionado`, selectdCont).removeClass("seleccionado")

                if (Object.keys(valoresOptionsHtml).includes(valorBuscado)) {

                    $(e.target).addClass("validado")

                    $(`input.divSelectInput`, selectdCont).val(valoresOptionsHtml[valorBuscado])

                } else {

                    $(e.target).removeClass("validado")
                    $(`input.divSelectInput`, selectdCont).val("")

                }

            } else {

                $(`div.opcionesSelectDiv`, selectdCont).removeClass("anulaScroll")
                $(`.opciones`, selectdCont).removeClass("oculto").removeClass("seleccionado")

                // $(`.inputSelect`, selectdCont).trigger("change")
                $(e.target).removeClass("validado")

            }

            break;
    }

    $(e.currentTarget).addClass("filtrandoType")
})
$(document).on("focus", ".inputSelect:not([readonly])", (e) => {

    let father = e.target.closest(".selectCont")

    $(`div.opcionesSelectDiv`, father).removeClass("oculto")
})
$(document).on("focus", `td .selecSimulado:not(.ubicado)`, (e) => {

    const el = e.target.closest("td .selecSimulado:not(.ubicado)");
    $(e.target).parents(".tableCol").addClass("ubicadoSelect");
    el.classList.add("ubicado");

    const form = el.closest(".tabs_contents_item.active");
    const selectCont = el.closest(".selectCont");

    const opciones = selectCont.querySelector("div.opcionesSelectDiv");

    const contRect = form.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();

    const scrollTop = form.scrollTop;
    const scrollLeft = form.scrollLeft;
    const height = el.offsetHeight;
    const width = el.offsetWidth;

    const top = (elRect.top - contRect.top) + scrollTop + height;
    const left = (elRect.left - contRect.left) + scrollLeft;

    opciones.style.top = `${top}px`;
    opciones.style.left = `${left}px`;
    opciones.style.width = `${width}px`;
});
$(document).on(`change`, `.inputSelect:not(.filtrandoType):not(.selectClick)`, (e) => {//Completar id

    let valorTexto = e.target.value
    let father = $(e.target).parents(`.selectCont`)
    let valorId = $(`.opciones[valuestring="${valorTexto}"]`, father).attr("value")

    $(`input.divSelectInput`, father).val(valorId).trigger("change")
    $(e.target).removeClass(`filtrandoType`)

})
$(document).on(`change`, `.divSelectInput`, (e) => {//Completar valorTexto

    let valorId = e.target.value
    let father = $(e.target).parents(`.selectCont`)
    let valorTexto = $(`.opciones[value="${valorId}"]`, father).attr("valuestring")
    $(`input.inputSelect`, father).val(valorTexto)

})//Coleccion
$(document).on(`pointerdown`, `.opcionesSelectDiv.absolute .opciones`, (e) => {

    const name = $(e.currentTarget).parent().attr("name")
    const form = $(e.currentTarget).parents(".tabs_contents_item")
    let valorValue = $(e.currentTarget).attr("value")
    $(e.currentTarget).addClass("seleccionado")
    $(e.currentTarget).siblings().removeClass("seleccionado")

    $(`.selectCont.${name} .opciones[value="${valorValue}"]`, form).trigger("click")
})
$(document).on(`pointerdown`, `.selectCont.coleccion .opcionesSelectDiv .opciones`, (e) => {

    let father = $(e.target).parents("td.comp")
    let valorHtml = $("p", e.currentTarget).html()

    $(e.currentTarget).addClass("seleccionado")
    $(e.currentTarget).siblings().removeClass("seleccionado")

    $(`input.inputSelect`, father).val(valorHtml).trigger("change")

})
//Pestana Abm
$(document).on("focus", `.tabs_contents_item:not(.tablaReporte) .inputTd .selecSimulado:not(.ubicado)`, (e) => {

    let fatherTot = $(e.currentTarget).parents(".selectCont")
    let dimensiones = new Object
    let contenedorAbsoluto = ""
    let posicionTop = ""
    const tabsItem = $(".tabs_contents_item.active");
    let ubicacionRelativa = new Object

    tabsItem.removeClass("pestanaActive petArriba");
    let borderTabla = tabsItem[0].getBoundingClientRect();

    let alturaPantalla = window.innerHeight
    let divUbi = $(`div.selecSimulado`, fatherTot).outerHeight()

    let espacioDispobile = borderTabla.bottom + divUbi + 20 > alturaPantalla

    if (tabsItem.scrollTop() > 0 || espacioDispobile) {

        let divUbi = $(`div.selecSimulado`, fatherTot)
        const ubicacionAbsoluta = divUbi.offset();
        dimensiones.width = divUbi.outerWidth()
        dimensiones.height = divUbi.outerHeight()
        contenedorAbsoluto = tabsItem.offset();

        const scrollOffsets = {
            top: $(".tabs_contents_item.active").scrollTop(),
            left: $(".tabs_contents_item.active").scrollLeft(),
        };

        $(`div.opcionesSelectDiv`, fatherTot).addClass(`opuesto`)
        const opcionesAltura = $(`div.opcionesSelectDiv`, fatherTot).outerHeight();
        ubicacionRelativa.left = ubicacionAbsoluta.left - contenedorAbsoluto.left + scrollOffsets.left
        // posicionTop = `${Number(ubicacionAbsoluta.top) - opcionesAltura - 2}px`
        ubicacionRelativa.top = ubicacionAbsoluta.top - contenedorAbsoluto.top + scrollOffsets.top;

        // 🔑 Colocar encima del select
        posicionTop = `${ubicacionRelativa.top - opcionesAltura}px`;

        let registros = $(`div.opcionesSelectDiv .opciones`, fatherTot)


        registros.sort((a, b) => {
            let valor1 = $(a).children(`p`).html().toLowerCase();
            let valor2 = $(b).children(`p`).html().toLowerCase();

            if (valor1 < valor2) {
                return 1;
            }
            if (valor1 > valor2) {
                return -1;
            }
            return 0;
        });

        $.each(registros, (indice, value) => {
            $(`div.opcionesSelectDiv`, fatherTot).append(value);
        });

    } else {

        $(".tabs_contents_item.active").addClass("pestanaActive").removeClass(`.petArriba`)

        let divUbi = $(`div.selecSimulado`, fatherTot)
        const ubicacionAbsoluta = divUbi.offset();
        dimensiones.width = divUbi.outerWidth()
        dimensiones.height = divUbi.outerHeight()
        let formularioFather = $(e.currentTarget).parents("#tablas")
        contenedorAbsoluto = formularioFather.offset();

        ubicacionRelativa.top = ubicacionAbsoluta.top - contenedorAbsoluto.top

        ubicacionRelativa.left = ubicacionAbsoluta.left - contenedorAbsoluto.left
        posicionTop = `${Number(ubicacionRelativa.top) + Number(dimensiones.height)}px`

    }

    $(`div.opcionesSelectDiv`, fatherTot).css(
        {
            "top": posicionTop,
            "left": `${ubicacionRelativa.left}px`,
            "width": `${dimensiones.width}px`,
        }
    )
})
$(document).on("focus", `.tabs_contents_item.petArriba .inputTd .selecSimulado`, (e) => {

    let fatherTot = $(e.currentTarget).parents(".selectCont")
    $(`div.opcionesSelectDiv`, fatherTot).addClass(`opuesto`)
    let divUbi = $(`div.selecSimulado`, fatherTot)
    const ubicacionAbsoluta = divUbi.offset();

    let dimensiones = {
        width: divUbi.outerWidth(),
        height: divUbi.outerHeight()
    }

    contenedorAbsoluto = $(".tabs_contents_item.active").offset();

    const scrollOffsets = {
        top: $(".tabs_contents_item.active").scrollTop(),
        left: $(".tabs_contents_item.active").scrollLeft(),
    };

    const ubicacionRelativa = {
        left: ubicacionAbsoluta.left - contenedorAbsoluto.left + scrollOffsets.left,
        top: `${Number(ubicacionAbsoluta.top) - dimensiones.height - 2}`
    }

    let registros = $(`div.opcionesSelectDiv .opciones`, fatherTot)

    registros.sort((a, b) => {
        let valor1 = $(a).children(`p`).html().toLowerCase();
        let valor2 = $(b).children(`p`).html().toLowerCase();

        if (valor1 < valor2) {
            return 1;
        }
        if (valor1 > valor2) {
            return -1;
        }
        return 0;
    });

    $.each(registros, (indice, value) => {
        $(`div.opcionesSelectDiv`, fatherTot).append(value);
    });

    $(`div.opcionesSelectDiv`, fatherTot).css(
        {
            "top": `${ubicacionRelativa.top}px`,
            "left": `${ubicacionRelativa.left}px`,
            "width": `${dimensiones.width}px`,
        }
    )


})
$(document).on(`keyup`, `div.inputTd .selectCont .inputSelect, div.celda .selectCont .inputSelect`, (e) => {

    let selectdCont = e.target.closest(".selectCont");

    let elemento = ""
    let elementoASelect = ""

    switch (e.key) {
        case `ArrowDown`:

            elemento = $$$(`.opciones.hoverFlecha`, selectdCont) || $$$(`.opciones.primeroVacio`, selectdCont);
            elementoASelect = $(elemento).nextAll().not(`[class*="oculto"]`)[0] || $(`.opciones.primeroVacio`, selectdCont);
            valorElemento = $(elementoASelect).attr("value")
            valorOption = $(`p`, elementoASelect).html().trim()

            $(elementoASelect).addClass(`hoverFlecha`)[0].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            $(elementoASelect).siblings().removeClass(`hoverFlecha`)


            break;
        case `ArrowUp`:

            elemento = $$$(`.opciones.hoverFlecha`, selectdCont) || $$$(`.opciones.primeroVacio`, selectdCont);
            elementoASelect = $(elemento).prevAll().not(`[class*="oculto"]`)[0] || $(`.opciones:not([class*="oculto"])`, selectdCont)[$(`.opciones:not([class*="oculto"])`, selectdCont).length - 1];

            valorElemento = $(elementoASelect).attr("value")
            valorOption = $(`p`, elementoASelect).html().trim()

            $(elementoASelect).addClass(`hoverFlecha`)[0].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            $(elementoASelect).siblings().removeClass(`hoverFlecha`)

            break;
        case `Enter`:

            let seleccionado = $(`.opciones.hoverFlecha:not([class*="oculto"]) p`, selectdCont).html()

            $(`.opciones`, selectdCont).removeClass("seleccionado")
            $(`.opciones.hoverFlecha:not([class*="oculto"])`, selectdCont).addClass("seleccionado").removeClass("hoverFlecha")
            $(`.inputSelect`, selectdCont).val(seleccionado || "").trigger("change")

            $(`div.opcionesSelectDiv`, selectdCont).addClass("oculto")

            break;
        case "ArrowRight":
        case "ArrowLeft":

            break;
        case `Tab`:
        case "Shift":

            $(`div.opcionesSelectDiv`, selectdCont).removeClass("oculto")

            break;
        default:

            let valorBuscado = $(e.target).val().toLowerCase().trim();

            if (valorBuscado.length > 0) {

                let valoresOptions = $(`.opciones:not(.primeroVacio)`, selectdCont)
                valoresOptions.removeClass("oculto")
                $.each(valoresOptions, (indice, value) => {

                    if (!($(`p`, value).html().trim().toLowerCase().startsWith(valorBuscado))) {

                        $(value).addClass("oculto")

                    }
                })

                if ($(`.opciones:not(.oculto)`, selectdCont).length < 9) {

                    $(`div.opcionesSelectDiv`, selectdCont).addClass("anulaScroll")

                } else {

                    $(`div.opcionesSelectDiv`, selectdCont).removeClass("anulaScroll")
                }

                $(`.opciones.seleccionado`, selectdCont).removeClass("seleccionado")

                $(e.target).removeClass("validado")

            } else {
                $(`div.opcionesSelectDiv`, selectdCont).removeClass("anulaScroll")
                $(`.opciones`, selectdCont).removeClass("oculto").removeClass("seleccionado")

            }

            if ($(`.opcionesSelectDiv`, selectdCont).hasClass("opuesto")) {

                const tabsItem = $(".tabs_contents_item.active");
                contenedorAbsoluto = tabsItem.offset();
                let divUbi = $(`div.selecSimulado`, selectdCont);
                const ubicacionAbsoluta = divUbi.offset();
                const opcionesAltura = $(`div.opcionesSelectDiv`, selectdCont).outerHeight();

                const scrollOffsets = {
                    top: tabsItem.scrollTop(),
                    left: tabsItem.scrollLeft(),
                };

                let posicionTop = `${ubicacionAbsoluta.top - contenedorAbsoluto.top - opcionesAltura + scrollOffsets.top}px`;
                $(`div.opcionesSelectDiv`, selectdCont).css({
                    "top": posicionTop,

                });
            }
            break;

    }
    $(e.currentTarget).addClass("filtrandoType")
})
$(document).on("focus", `.celda .selecSimulado:not(.ubicado)`, (e) => {

    let dimensiones = {};
    let contenedorAbsoluto = "";
    let posicionTop = "";
    const tabsItem = $('.tabs_contents_item.active');
    let eventoFirstTarget = e

    let actualizarPosicion = (e) => {

        let fatherTot = $(e.currentTarget).parents('.selectCont')

        let ubicacionRelativa = {};
        let divUbi = $(`div.selecSimulado`, fatherTot);
        const ubicacionAbsoluta = divUbi.offset();
        dimensiones.width = divUbi.outerWidth();
        dimensiones.height = divUbi.outerHeight();
        contenedorAbsoluto = tabsItem.offset();

        const ubicacionAbsolutaLim = divUbi[0].getBoundingClientRect();
        const contenedorAbsolutoLim = tabsItem[0].getBoundingClientRect();

        const scrollOffsets = {
            top: tabsItem.scrollTop(),
            left: tabsItem.scrollLeft(),
        };

        ubicacionRelativa.left = ubicacionAbsoluta.left - contenedorAbsoluto.left + scrollOffsets.left;
        const opcionesAltura = $(`div.opcionesSelectDiv`, fatherTot).outerHeight();

        if (ubicacionAbsolutaLim.bottom + opcionesAltura >= contenedorAbsolutoLim.bottom) {

            $(".tabs_contents_item.active").removeClass("pestanaActive").css("overflow", "visible");
            $(`div.selecSimulado`, fatherTot).parents(".celda").css("z-index", "901");
            let registros = $(`div.opcionesSelectDiv .opciones`, fatherTot);

            $(`div.opcionesSelectDiv`, fatherTot).addClass(`opuesto`);

            registros.sort((a, b) => {
                let valor1 = $(a).children(`p`).html().toLowerCase();
                let valor2 = $(b).children(`p`).html().toLowerCase();
                return valor1 < valor2 ? 1 : valor1 > valor2 ? -1 : 0;
            });

            $.each(registros, (ind, value) => {
                $(`div.opcionesSelectDiv`, fatherTot).append(value);
            });

            posicionTop = `${ubicacionAbsoluta.top - contenedorAbsoluto.top - opcionesAltura + scrollOffsets.top}px`;

            const contenedor = $(`div.opcionesSelectDiv`, fatherTot)
            contenedor.animate({ scrollTop: contenedor[0].scrollHeight }, 'slow');

        } else {

            $(".tabs_contents_item.active").addClass("pestanaActive").removeClass("petArriba");

            let contenedorAbsolutoA = $("#tablas").offset();

            ubicacionRelativa.top = ubicacionAbsolutaLim.bottom - contenedorAbsolutoA.top;
            ubicacionRelativa.left = ubicacionAbsoluta.left - contenedorAbsolutoA.left;

            posicionTop = `${ubicacionRelativa.top}px`;

        }

        $(`div.opcionesSelectDiv`, fatherTot).css({
            "top": posicionTop,
            "left": `${ubicacionRelativa.left}px`,
            "width": `${dimensiones.width}px`,
        });
    }

    actualizarPosicion(e);


    // Recalcular la posición cuando se haga scroll
    tabsItem.on("scroll", () => {

        if (estaVisibleEnPantalla($(`input.inputSelect`, e.currentTarget)[0], tabsItem[0])) {
            actualizarPosicion(eventoFirstTarget)
        } else {
            $(`input.inputSelect`, e.currentTarget).trigger("blur")

        }
    });

    // Limpiar el evento de scroll cuando se cierre el desplegable
    $(`input.inputSelect`, e.currentTarget).on("blur", () => {

        tabsItem.off("scroll", () => {
            eventoFirstTarget(eventoFirstTarget)
        });
    });
});
//Pestana Reporte
function esUltimaFila(filas, tr) {// esta funcion comprueba si es la ultima cinco fila del reporte
    const totalFilas = filas.length;
    const indice = filas.index($(tr));
    return indice >= totalFilas - 5;
}
$(document).on("change", `input.rep`, (e) => {

    $(e.target).parents(`.tr.items`).addClass("modificado")
    $(e.target).parents(`.td`).addClass("modificado").removeClass("grabado")

})
$(document).on("focus", `.tabs_contents_item.tablaReporte .selecSimulado`, (e) => {

    let filas = $(`.tr`, $(e.target).parents(`.table`))
    let tr = $(e.target).parents(`.tr`)

    if (esUltimaFila(filas, tr)) {

        let formularioFather = $(e.target).parents(".tabs_contents_item.active")
        const contenedorAbsoluto = formularioFather.offset();

        let alturaDoc = $(document).height()

        let contenedorSelect = $(e.target).parents(`.selectCont`)

        $(contenedorSelect).css({ "position": `static` })
        let ubicacionRelativa = new Object

        let divUbi = $(`div.selecSimulado`, contenedorSelect)
        const ubicacionAbsoluta = divUbi.offset();
        const dimensiones = {
            width: divUbi.outerWidth(),
            height: divUbi.outerHeight()
        }

        const scrollOffsets = {
            top: formularioFather.scrollTop(),
            left: formularioFather.scrollLeft(),
        };

        ubicacionRelativa.top = ubicacionAbsoluta.top - contenedorAbsoluto.top + scrollOffsets.top + dimensiones.height
        ubicacionRelativa.left = ubicacionAbsoluta.left - contenedorAbsoluto.left + scrollOffsets.left

        $(`div.opcionesSelectDiv`, contenedorSelect).css(
            {
                "top": `${ubicacionRelativa.top}px`,
                "left": `${ubicacionRelativa.left}px`,
                "width": `${dimensiones.width}px`,
            }
        )

        $(e.currentTarget).addClass("abosuluteSelect")
    } else {

        $(e.currentTarget).addClass("ubicado")
    }
})