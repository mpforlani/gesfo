const tipoDeTabla = {
    agrupSubgrupMesAno: agrupadorSubAgrupadorMeses,
    infoEntidadMasEditTable,
    agrupadoMes,
    tipoExtracto,
    cotizacionMonedaExtranjera
}
/*const tablaDetalle = {
    getGroup: "get",
    unWinGroup: "getUnWind"
}
*/
const tablaSoporte = {
    restaTablas: tableCalculada,
    promedioIntra: tablaPromedio

}
async function crearCuerpoReporte(objeto, numeroForm) {

    $(`#t${numeroForm}`).remove()
    $(`.tabs_contents_item.active`).removeClass("active")
    let tabla = `<div class="tabs_contents_item tablaReporte construyendo active ${objeto.consultable || ""}" id="t${numeroForm}"  tabla="reporte" nombre="${objeto.nombre || objeto.accion}" accion="${objeto.accion}"></div>`;
    $(tabla).appendTo(`#tabs_contents`);
    progressBarHeight(objeto, numeroForm)
    const tablas = Object.entries(objeto.tablas);
    consultaGet[numeroForm] = {}

    await Promise.all(

        tablas.map(async ([indice, objetoTab]) => {

            let entidadOrigen = variablesModelo[objetoTab.entidad]
            let get = objetoTab.datos || "get"
            let detalleFiltroAtributos = { cabecera: {}, coleccion: {} }
            let sort = ""

            const parametricas = (objetoTab?.atributos?.filter(item => item instanceof Parametrica) || []).concat(objetoTab.pestanas || []);

            await Promise.all(parametricas.map(async (value) => {

                if (!consultaPestanas[value.origen || value.nombre]) {
                    await consultasPestanaIndividual(value.origen || value.nombre);
                }
            }));

            if (objeto.empresa != false) {
                detalleFiltroAtributos.cabecera = Object.assign(detalleFiltroAtributos.cabecera, empresaFiltro)
            }

            $.each(objetoTab.filtros, (indice, value) => {

                detalleFiltroAtributos[indice] = detalleFiltroAtributos[indice] || {}
                for (const [ind, val] of Object.entries(value)) {

                    detalleFiltroAtributos[indice][ind] = val[0](objeto, numeroForm, val[1], val[2], val[3])
                }
            })
            $.each(objetoTab.filtrosCondicional, (indice, value) => {

                detalleFiltroAtributos[indice] = detalleFiltroAtributos[indice] || {}

                for (const [ind, val] of Object.entries(value)) {

                    let valor = $(`#bf${numeroForm} .inputSelect.${ind}`).val()

                    for (const [i, v] of Object.entries(val[valor] || {})) {

                        detalleFiltroAtributos[indice][i] = v[0](objeto, numeroForm, v[1], v[2], v[3])

                    }
                }
            })
            let plancha = ""
            if (objetoTab.coleccionPlancha != undefined) {
                plancha += `&componentes=${JSON.stringify(Object.keys(objetoTab.coleccionPlancha.coleccion.componentes))}&key=${objetoTab.coleccionPlancha.key}`
            }
            $.each(objetoTab.arrayPlancha, (indice, value) => {

                sort += `&key=${value.nombre || value}`
            })
            $.each(objetoTab.orden, (indice, value) => {

                sort += `&sort=${indice}:${value}`
            })
            if (objeto.anteriores != true) {

                $.each($(`#bf${numeroForm} .mesesPicker:not(.oculto)`), (indice, value) => {

                    let desdeIni = $(`input.MesReporteDesde`, value).val()
                    let hastaIni = $(`input.MesReporteHasta`, value).val()

                    if (objetoTab.entidad != "acumulador") {

                        let desde = `${desdeIni}-01`
                        let hastaInc = `${hastaIni}`
                        let arrayHasta = hastaInc.split(`-`)
                        let dia = getLastDayOfMonth(arrayHasta[0], arrayHasta[1])
                        let hasta = `${hastaInc}-${dia}`

                        detalleFiltroAtributos.cabecera.fecha = { desde: desde, hasta: hasta }

                    } else {
                        $.each(objetoTab.acumulador, (indice, value) => {

                            detalleFiltroAtributos[indice] = detalleFiltroAtributos[indice] || {}
                            for (const [ind, val] of Object.entries(value)) {

                                detalleFiltroAtributos[indice][ind] = val[0](objeto, numeroForm, val[1], val[2], val[3])
                            }
                        })
                        detalleFiltroAtributos.cabecera.periodo = { $gte: Number(desdeIni.replace("-", "")), $lte: Number(hastaIni.replace("-", "")) }

                    }
                })
                $.each($(`#bf${numeroForm} .fechaTablaReporte:not(.oculto, .chau)`), (indice, value) => {

                    let fechaDesdeModif = $(`#bf${numeroForm} input.fechaTextoDeReporte`).val()
                    let fechaHastaModif = $(`#bf${numeroForm} input.fechaTextoHastaReporte`).val()

                    detalleFiltroAtributos.cabecera[objeto?.cabeceraCont?.fecha[3] || "fecha"] = {
                        desde: fechaDesdeModif, hasta: fechaHastaModif
                    }

                })
            }
            $.each($(`#bf${numeroForm} .selecAtributo:not(.todos):not(.function) .selectCont`), (indice, value) => {

                let valor = $(`.divSelectInput`, value).val()
                let nombre = $(`.divSelectInput`, value).attr("name")
                let type = $(value).parents(".selecAtributo").attr("type") || "cabecera"
                detalleFiltroAtributos[type || "cabecera"] = detalleFiltroAtributos[type || "cabecera"] || {}
                if (valor != "") {

                    detalleFiltroAtributos[type || "cabecera"][nombre] = valor
                }
            })
            let detalleFiltroAtributosFuncion = { cabecera: {}, coleccion: {} }
            $.each($(`#bf${numeroForm} .selecAtributo.function:not(.todos)`), (indice, value) => {

                let name = $(`.selectCont`, value).attr("name")
                let type = $(value).parents(".selecAtributo").attr("type") || "cabecera"

                detalleFiltroAtributosFuncion[type || "cabecera"] = detalleFiltroAtributosFuncion[type || "cabecera"] || {}
                detalleFiltroAtributosFuncion[type || "cabecera"] = objeto.cabeceraCont?.parametricaDef?.[name]?.function[0](objeto, numeroForm, ...objeto.cabeceraCont?.parametricaDef?.[name]?.function[1])


            })

            if (get == "get") {

                $.each(detalleFiltroAtributos, (indice, value) => {

                    $.each(value, (ind, val) => {

                        detalleFiltroAtributos[ind] = val

                    })
                    delete detalleFiltroAtributos[indice]
                })

                if ($(`#bf${numeroForm} .fechaTablaReporte:not(.oculto, .chau)`).length > 0) {

                    let fechaDesdeEntidad = $(`#bf${numeroForm} input.fechaTextoDeReporte`).val()
                    let fechaHastaEntidad = $(`#bf${numeroForm} input.fechaTextoHastaReporte`).val()
                    detalleFiltroAtributos[objeto?.cabeceraCont?.fecha[3] || "fecha"] = { $gte: fechaDesdeEntidad, $lte: fechaHastaEntidad }

                }
            }

            let objetoGr = objetoTab.group

            Object.assign(detalleFiltroAtributos.cabecera || {}, detalleFiltroAtributosFuncion.cabecera || {})
            Object.assign(detalleFiltroAtributos.coleccion || {}, detalleFiltroAtributosFuncion.coleccion || {})
            //ESto lo hago para dalr atributo libre y poder usar funciones en funcion
            const filtros = `&filtros=${JSON.stringify(detalleFiltroAtributos)}`
            const objetoBusqueda = `&objetoGroup=${JSON.stringify(objetoGr || {})}`
            const totales = `&totales=${JSON.stringify(objetoTab.totales || {})}`
            const addField = `&addField=${JSON.stringify(objetoTab.addField || {})}`

            try {
                const res = await fetch(
                    `/${get}?base=${entidadOrigen?.accion}${filtros}${objetoBusqueda}${totales}${sort}${plancha}${addField}`,
                    { method: "GET" });

                if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
                let data = await res.json();
                console.log(data);

                $.each(objetoTab.crearCampoFront, (indice, value) => {

                    data = value[0](objeto, numeroForm, data, ...value[1])
                })

                for (const [atributos, funciones] of Object.entries(objetoTab?.datosCalculados || {})) {

                    await funciones[0](data)
                }

                consultaGet[numeroForm][indice] = data;

                active(numeroForm);
                await tipoDeTabla[objetoTab.type](objetoTab, numeroForm, indice, objeto);
                removeProgressBarHeight(objeto, numeroForm)
                $.each(objetoTab?.funcionesPropias?.tabla, (indice, value) => {

                    value[0](objeto, numeroForm, value[1]);
                });
                $.each(objetoTab?.clases, (indice, value) => {

                    switch (indice) {

                        case "table":
                            $.each(value, (ind, val) => {
                                $(`#t${numeroForm} table`).addClass(val)

                            })
                            break;
                    }
                });

            } catch (err) {
                console.error("Error en fetch:", err);
                throw err;
            }
        })
    );
    for (const [indice, objetoTabCal] of Object.entries(objeto.tablasCalculada || {})) {

        tablaSoporte[objetoTabCal.type](objetoTabCal, numeroForm, objeto, indice)

    }

    $(`#t${numeroForm}.consultable`).on("dblclick", `tr.items, tr.itemsTabla, tr.fila`, (e) => {

        let tablaRef = $(e.target).parents("table").attr("tablaref")
        let entidad = objeto.tablas[tablaRef].entidad
        let _id = $(`input._idRefencia`, e.currentTarget).val()

        let detalleFiltroAtributos = { _id }
        const filtros = `&filtros=${JSON.stringify(detalleFiltroAtributos)}`

        $.ajax({
            type: "get",
            async: false,
            url: `/get?base=${entidad}${filtros}`,
            success: function (data) {
                console.log(data)

                let obje = variablesModelo[entidad]

                clickFormularioIndividualPestana(obje, numeroForm, data[0])
            },
            error: function (error) {

                console.log(error);
            }
        })
        $(e.currentTarget).addClass("seleccionado")
    })
    $(`#t${numeroForm}.consultable`).on("click", `tr.items, tr.itemsTabla, tr.fila`, (e) => {

        $(e.currentTarget).toggleClass("seleccionado")
    })
    $(`#t${numeroForm}`).on("dblclick", `td[tablaComplemento=true]:not(.agrupador)`, (e) => {

        let tablaOrigen = $(e.target).parents("table").attr("tablaRef")
        let objetoRef = objeto.tablas[tablaOrigen]

        let mesano = $(e.currentTarget).attr("mesano")
        let ano = mesano.slice(0, 4)
        let mes = mesano.slice(4)
        if (mes.length == 1) mes = "0" + mes

        let tablaUnWind = objetoRef?.coleccionPlancha?.coleccion

        let detalleFiltroAtributos = { cabecera: {}, coleccion: {} }
        $.each(objetoRef.filtros, (indice, value) => {

            detalleFiltroAtributos[indice] = detalleFiltroAtributos[indice] || {}
            for (const [ind, val] of Object.entries(value)) {

                detalleFiltroAtributos[indice][ind] = val[0](objeto, numeroForm, val[1], val[2], val[3])
            }
        })

        if (objetoRef?.tablaComplemento?.datos == "get") {

            detalleFiltroAtributos.fecha = { $gte: new Date(`${ano}-${mes}-01`), $lte: new Date(`${ano}-${mes}-${getLastDayOfMonth(ano, mes)}`) }

            for (const atributo of objetoRef.atributos) {

                let agrupador = $(`td.${atributo.nombre}`, $(e.currentTarget).parents(`tr`)).text().trim()

                let valorSubId = Object.values(consultaPestanas[atributo.origen || atributo.nombre] || {}).find(e => e.name.trim() == agrupador) || agrupador;


                detalleFiltroAtributos[atributo.nombre] = valorSubId._id || valorSubId;

                $.each(detalleFiltroAtributos.cabecera, (ind, val) => {
                    detalleFiltroAtributos[ind] = [val]
                })
                delete detalleFiltroAtributos.cabecera

                $.each(detalleFiltroAtributos.coleccion, (ind, val) => {
                    detalleFiltroAtributos[ind] = [val]
                })
                delete detalleFiltroAtributos.coleccion
            }
        } else {
            detalleFiltroAtributos.cabecera.fecha = { desde: `${ano}-${mes}-01`, hasta: `${ano}-${mes}-${getLastDayOfMonth(ano, mes)}` }
            for (const atributo of objetoRef.atributos) {

                let agrupador = $(`td.${atributo.nombre}`, $(e.currentTarget).parents(`tr`)).text().trim()

                let valorSubId = Object.values(consultaPestanas[atributo.origen || atributo.nombre] || {}).find(e => e.name.trim() == agrupador) || agrupador;

                if (variablesModelo[objetoRef.tablaComplemento.entidad || objetoRef.entidad].atributos.names.some(n => n.nombre === atributo.nombre)) {
                    detalleFiltroAtributos.cabecera[atributo.nombre] = valorSubId._id || valorSubId;
                } else {
                    detalleFiltroAtributos.coleccion[atributo.nombre] = valorSubId._id || valorSubId;
                }
            }
        }

        const filtros = `&filtros=${JSON.stringify(detalleFiltroAtributos)}`
        let planchar = `&componentes=${JSON.stringify(Object.keys(tablaUnWind?.componentes || {}))}&key=${objetoRef?.coleccionPlancha?.key || []}`

        $.ajax({
            type: "get",
            async: false,
            url: `/${objetoRef?.tablaComplemento?.datos || `getUnWind`}?base=${objetoRef?.tablaComplemento?.entidad || objetoRef?.entidad}${filtros}${planchar}`,
            beforeSend: function (data) {

                mouseEnEsperaForm(objeto, numeroForm)
            },
            success: async function (data) {
                console.log(data)
                cartelComplementoConCortina(objeto, numeroForm, { claseCartel: "infoRegistro", botonConfirmar: "oculto" })
                let table = await tableDetalleEnumeracion(objetoRef, numeroForm, data)
                $(table).appendTo(`#t${numeroForm} .bloque0`)

                quitarEsperaForm(objeto, numeroForm);
            }
        });
    })
    administrarAtributoTabla(objeto, numeroForm);
    $(`#t${numeroForm}`).on("change", "input", function (e) {

        $(e.currentTarget).parents("tr").addClass("modificado")

    })
}
async function creacionReportes(e) {

    const idObj = e.target.id
    const numeroForm = contador
    contador++

    let objeto = variablesModelo[idObj] || variablesIniciales?.locales?.[idObj]

    await Promise.all(
        (objeto?.pestanas ?? [])
            .map(p => p.origen ?? p.nombre)
            .map(k => (consultaPestanas[k] ??= consultasPestanaIndividual(k)))
    );

    pestanaIndividual(objeto, numeroForm)
    await cabeceraReporte(objeto, numeroForm)
    let fueTipeado = false;
    $(`#bf${numeroForm}`).on("change", `input[type=month]`, () => {

        crearCuerpoReporte(objeto, numeroForm)
    })
    $(`#bf${numeroForm}`).on("keydown", `input[type=date]`, (e) => {

        fueTipeado = true;
    })
    $(`#bf${numeroForm}`).on("change", `input[type=date]`, (e) => {

        if (!fueTipeado) {
            crearCuerpoReporte(objeto, numeroForm)
        }
        fueTipeado = false
    })
    $(`#bf${numeroForm}`).on("blur", `input[type=date]`, (e) => {

        if (fueTipeado) {
            crearCuerpoReporte(objeto, numeroForm)
            fueTipeado = false
        }
    })
    $(`#bf${numeroForm}`).on("click", `span.save`, (e) => {

        salvarinfoReportes(objeto, numeroForm)
    })
    $(`#bf${numeroForm}`).on("click", `span.envioEmail:not(.particular)`, (e) => {

        cartelEnviarReporte(objeto, numeroForm)
    })
    $(`#bf${numeroForm} `).on("click", `.okfLupa:not(enEspera)`, (e) => {

        formularioIndividualImpresion(objeto, numeroForm, consultaGet[numeroForm]);

        $(`#documentoImpresion,
            .com`).addClass("reporte");
    });
    $(`#bf${numeroForm}`).on("change", `.divSelectInput`, (e) => {

        crearCuerpoReporte(objeto, numeroForm)
    })

    await crearCuerpoReporte(objeto, numeroForm)

}
$('body').on('click ', `.nav-vert:not(.enEspera) p.menuReportes`, creacionReportes)