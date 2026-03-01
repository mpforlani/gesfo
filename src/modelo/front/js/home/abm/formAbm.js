/////////////////Crear tabla que va insertadada en el abm, esta función se llama desde craerABM 
function crearTabla(numeroForm, objeto, consulta) {//Dicionario

    objeto.funcionesPropias = objeto?.funcionesPropias || {}

    let names = [...objeto.atributos.names]
    let titulos = [...objeto.atributos.titulos]
    let saldoInicial = parseFloat(stringANumero($(`#bf${numeroForm} input.SaldoInicial`).val() || 0))
    let tabla = "";

    tabla += `<div class="table">`;

    for (let i = -1; i <= consulta.length; i++) {
        // definicion de cabecera de la tabla
        if (i < 0) {

            let filtro = [];
            let titulosTables = []
            let widthTitlesD = []
            let indec = 0

            $.each(names, (indice, value) => {

                switch (value.type) {
                    case "coleccionAbm":
                    case "coleccionAbmInd":
                        // eslint-disable-next-line no-case-declarations
                        let indiceColec = 0

                        $.each(value.componentes, (ind, val) => {

                            widthTitlesD.push(val)
                            filtro.push(ind);
                            titulosTables.push(objeto.formInd?.titulosCompuesto?.[value.nombre]?.[indiceColec] || value?.titulosComponentes?.[indiceColec])
                            indiceColec++
                        })
                        indec++

                        break;
                    case "coleccionInd":

                        (objeto.atributos.compuesto ??= {});
                        objeto.atributos.compuesto[value.nombre] = value;

                        $.each(objeto.atributos?.abmCompuesto?.[value.nombre]?.atributos, (ind, val) => {

                            titulosTables.push(objeto.atributos.abmCompuesto[value.nombre].titulos[ind])
                            filtro.push(val.nombre || val);
                            widthTitlesD.push(objeto.atributos.compuesto[value.nombre].componentes[val.nombre || val])

                        })

                        indec++
                        break;
                    case "coleccionSimple":

                        $.each(value.componentes, (ind, val) => {

                            filtro.push(ind);
                            titulosTables.push(titulos[indec])
                            widthTitlesD.push(val)

                            indec++
                        });

                        break;
                    default:

                        titulosTables.push(titulos[indec])
                        filtro.push(value.nombre);
                        widthTitlesD.push(value)

                        indec++
                        break;
                }
            });
            tabla += `<div class="tr tituloTablas">`;

            $.each(titulosTables, (indice, value) => {

                tabla += `<div class="th tituloTablas ${widthTitlesD[indice]?.nombre} ${filtro[indice]}" type=${widthTitlesD[indice].type} filtro="${filtro[indice]}" style="order:${indice}" ${widthObject[widthTitlesD[indice]?.width] || ""} ${ocultoOject[widthTitlesD[indice]?.oculto] || ""}><div class="th-contenido"><span class="tit">${[value]}</span><div class="iconos">${flechasOrden}${filtroIcon}</div></div></div>`;
            });

            tabla += `<div class="th tituloTablas date" type="date" filtro="date" style="order:9998" width="doce"><div class="th-contenido"><span class="tit">Auditoria</span><div class="iconos">${flechasOrden}${filtroIcon}</div></div></div>`;
            tabla += `<div class="th tituloTablas username" type="texto" filtro=username style="order:9999" width="doce"><div class="th-contenido"><span class="tit">Autor</span><div class="iconos">${flechasOrden}${filtroIcon}</div></div></div>`;

            tabla += `</div>`;
            tabla += `<div class="tr filtro">`;

            $.each(filtro, function (indice, value) {
                tabla += `<div class="td filtro oculto ${value}" type=${widthTitlesD[indice].type} filtro="${value}" numeroFila="${indice}" style="order:${indice}" ${widthObject[widthTitlesD[indice]?.width] || ""} ${ocultoOject[widthTitlesD[indice]?.oculto] || ""}>
                          <div class="filtroClass"><input class="busqueda" ${autoCompOff} ><p class="closeFiltro">+</p></div></div>`;
            });

            tabla += `<div class="td filtro oculto date" filtro="date" type="date" numeroFila="9998" style="order:9998" width="doce">
                          <div class="filtroClass"><input class="busqueda date" ${autoCompOff}><p class="closeFiltro">+</p></div></div>`;
            tabla += `<div class="td filtro oculto username" filtro="username" type="date" numeroFila="9998" style="order:9998" width="doce">
                          <div class="filtroClass"><input class="busqueda username" ${autoCompOff}><p class="closeFiltro">+</p></div></div>`;

        } else if (i > -1 && i < consulta.length) {

            //definicion de fomato de cada celda
            let tab = tipoAtributo(consulta[i], objeto, numeroForm, saldoInicial, names);
            tabla += `<div class="tr fila ${i} ${tab.clase}">`;
            tabla += tab.celdas;
            saldoInicial = parseFloat(tab.saldoInicial)

        } else {
            //Creaciòn de campos input
            if (permisObject[empresaSeleccionada?._id]?.crear?.[objeto.accion] == "true" || usu == "master") {

                tabla += tipoInput(objeto, numeroForm, names)
            }
        }
        tabla += "</div>";
    }
    tabla += `</div>`;
    tabla += `</div>`;
    tt = $(tabla);

    tt.appendTo(`#t${numeroForm}`);
    removeProgressBarHeightDiv(objeto, numeroForm)
    let alto = $(`#t${numeroForm} .tr.tituloTablas`).height()
    $(`#t${numeroForm} .tr.filtro`).css({ "top": `${alto}px` })

    $.each(objeto.ocultroAtributosSeguridad, (indice, value) => {

        $(`#t${numeroForm} div.${value.nombre || value}`).addClass("ocultoSeguridad");
    });

    $(`#t${numeroForm} input[type^="date"]`).removeAttr("type").addClass("typeDate")
    adjuntoCeldaAbm(objeto, numeroForm)

    setTimeout(() => {
        $(`#t${numeroForm}`).removeClass("creado")
    }, 1000);

    const elemento = document.getElementById(`t${numeroForm}`)
    setTimeout(() => {
        $(`#t${numeroForm}`).css(`max-height`, heightTabla(numeroForm))
        elemento.scrollTop = elemento.scrollHeight;


    }, 200)


};
function reCrearTabla(numeroForm, objeto) {//Dicionario

    let filtroActivo = $(`#t${numeroForm} .td.filtro:not(.oculto)`)
    let filtroObj = new Object
    $.each(filtroActivo, (indice, value) => {
        let valor = $(`input`, value).val()
        if (valor) {
            filtroObj[$(value).attr("filtro")] = valor
        }
    })

    $(`#t${numeroForm}`).remove()
    let names = [...objeto.atributos.names]
    let titulos = [...objeto.atributos.titulos]

    let detalleFiltroAtributos = new Object
    let sort = ""
    let fechaDesdeModif = $(`#bf${numeroForm} input.fechaTextoDeAbm`).val()
    let fechaHastaModif = $(`#bf${numeroForm} input.fechaTextoHastaAbm`).val()
    let saldoInicial = parseFloat(stringANumero($(`#bf${numeroForm} input.SaldoInicial`).val() || 0))
    let lineaContenedor = $(`#bf${numeroForm}`).attr("linea") || ""

    let getElement = {
        unWind: "getUnWind",
    }

    if (permisObject[empresaSeleccionada?._id]?.crear?.[objeto.accion] == "false" && usu != "master") {

        $(`#bf${numeroForm} span.crearBotonInd`).attr(`segAtributo`, `none`)
    }
    if (permisObject[empresaSeleccionada?._id]?.eliminar?.[objeto.accion] == "false" && usu != "master") {
        $(`#bf${numeroForm} span.deleteBoton`).attr(`segAtributo`, `none`)
        $(`#bf${numeroForm} span.desHabilitarBoton`).attr(`segAtributo`, `none`)
    }
    if (permisObject[empresaSeleccionada?._id]?.editar?.[objeto.accion] == "false" && usu != "master") {
        $(`#bf${numeroForm} span.editBoton`).attr(`segAtributo`, `none`)
    }

    let get = getElement[objeto.datos] || "get"


    if (objeto.atributos.limiteCabecera == true && !$(`#bf${numeroForm} .fechaTablaAbm`).hasClass("ocultoBusq")) {

        detalleFiltroAtributos.fecha = { $gte: new Date(fechaDesdeModif), $lte: new Date(fechaHastaModif) }

        $(`#bf${numeroForm} .fechaTextoDeAbm`).val(fechaDesdeModif)
        $(`#bf${numeroForm} .fechaTextoHastaAbm`).val(fechaHastaModif)
        $(`#bf${numeroForm} .fechaTablaAbm`).removeClass("oculto")

    }
    $.each(objeto?.filtrosUnwind, (ind, val) => {
        $.each(val, (indice, value) => {

            if (!detalleFiltroAtributos[ind]) detalleFiltroAtributos[ind] = {};

            detalleFiltroAtributos[ind][indice] =
                value[0](objeto, numeroForm, value[1], value[2], value[3]);
        });
    });

    $.each(objeto.filtros, (indice, value) => {

        detalleFiltroAtributos[indice] = value[0](objeto, numeroForm, value[1], value[2], value[3])
    })
    $.each(objeto.filtrosComp, (indice, value) => {

        Object.assign(detalleFiltroAtributos, value[0](objeto, numeroForm, value[1], value[2], value[3]))
    })
    $.each(objeto.sort, (indice, value) => {

        sort += `&sort=${indice}:${value}`
    })
    let plancha = ""
    $.each(objeto.coleccionPlancha, (indice, value) => {

        plancha += `&componentes=${JSON.stringify(Object.keys(value.coleccion.componentes))}&key=${value.key}`
    })

    let consultaReCrear = "";

    if (objeto.empresa != false) {
        detalleFiltroAtributos = Object.assign(detalleFiltroAtributos, empresaFiltro)
    }
    const filtros = `&filtros=${JSON.stringify(detalleFiltroAtributos)}`

    $.ajax({
        type: "get",
        url: `/${get}?base=${objeto.accion}${filtros}${sort}${plancha}`,
        async: false,
        before: function () {
            mouseEnEsperaForm(objeto, numeroForm)
        },
        success: function (data) {

            consultaReCrear = data

            $.each(objeto?.funcionesPropias?.recrear, function (indice, value) {

                value(objeto, numeroForm, consultaReCrear)

            })

            let tabla = "";

            tabla += `<div class="tabs_contents_item active ${numeroForm}" id="t${numeroForm}" tabla="abm" nombre=${objeto.nombre} accion=${objeto.accion} linea="${lineaContenedor}">`;

            tabla += `<form method="POST" action="/${objeto.accion}" id="f${objeto.accion}${numeroForm}" enctype="multipart/form-data"></form>`;
            tabla += `<div class="table">`;

            for (let i = -1; i <= consultaReCrear.length; i++) {
                // definicion de cabecera de la tabla
                if (i < 0) {
                    let filtro = [];
                    let titulosTables = []
                    let widthTitlesD = []
                    let indec = 0
                    $.each(names, (indice, value) => {

                        switch (value.type) {
                            case "coleccionAbm":
                            case "coleccionAbmInd":

                                $.each(value.componentes, (ind, val) => {
                                    widthTitlesD.push(val)
                                    filtro.push(ind);
                                    titulosTables.push(titulos[indec] || val?.titulosComponentes?.[indec])
                                })
                                break;
                            case "coleccionInd":

                                (objeto.atributos.compuesto ??= {});
                                objeto.atributos.compuesto[value.nombre] = value;
                                $.each(objeto.atributos?.abmCompuesto?.[value.nombre]?.atributos, (ind, val) => {

                                    titulosTables.push(objeto.atributos.abmCompuesto[value.nombre].titulos[ind])
                                    filtro.push(val.nombre || val);
                                    widthTitlesD.push(objeto.atributos.compuesto[value.nombre].componentes[val.nombre || val])

                                })

                                indec++
                                break;
                            case "coleccionSimple":

                                $.each(value.componentes, (ind, val) => {

                                    filtro.push(ind);
                                    titulosTables.push(titulos[indec])
                                    widthTitlesD.push(val)

                                    indec++
                                });

                                break;
                            default:

                                titulosTables.push(titulos[indec])
                                filtro.push(value.nombre);
                                widthTitlesD.push(value)

                                indec++
                                break;
                        }
                    });
                    tabla += `<div class="tr tituloTablas">`;
                    $.each(titulosTables, (indice, value) => {

                        tabla += `<div class="th tituloTablas ${widthTitlesD[indice]?.nombre} ${filtro[indice]}" type=${widthTitlesD[indice].type} filtro="${filtro[indice]}" style="order:${indice}" ${widthObject[widthTitlesD[indice]?.width] || ""} ${ocultoOject[widthTitlesD[indice]?.oculto] || ""}><div class="th-contenido"><span class="tit">${[value]}</span><div class="iconos">${flechasOrden}${filtroIcon}</div></div></div>`;
                    });
                    tabla += `<div class="th tituloTablas date" type:"date" filtro="date" style="order:9998" width="doce">Auditoria</div>`;
                    tabla += `<div class="th tituloTablas username" type:"texto" filtro=username style="order:9999" width="doce" >Autor</div>`;
                    tabla += `</div>`;
                    tabla += `<div class="tr filtro">`;
                    $.each(filtro, function (indice, value) {
                        tabla += `<div class="td filtro oculto ${value}" type=${widthTitlesD[indice].type} filtro="${value}" numeroFila="${indice}" ${widthObject[widthTitlesD[indice]?.width] || ""} ${ocultoOject[widthTitlesD[indice]?.oculto] || ""}>
                                  <div class="filtroClass"><input class="busqueda"><p class="closeFiltro">+</p></div></div>`;
                    });
                    tabla += `<div class="td filtro oculto date" filtro="date" numeroFila="9998" sstyle="order:9998" width="doce">
                          <div class="filtroClass"><input class="busqueda"><p class="closeFiltro">+</p></div></div>`;
                    tabla += `<div class="td filtro oculto date" filtro="date" numeroFila="9998" sstyle="order:9998" width="doce">
                          <div class="filtroClass"><input class="busqueda"><p class="closeFiltro">+</p></div></div>`;

                } else if (i > -1 && i < consultaReCrear.length) {

                    //definicion de fomato de cada celda
                    let tab = tipoAtributo(consultaReCrear[i], objeto, numeroForm, saldoInicial, names);
                    tabla += `<div class="tr fila ${i} ${tab.clase}">`;
                    tabla += tab.celdas;
                    saldoInicial = parseFloat(tab.saldoInicial)

                } else {

                    //Creaciòn de campos input
                    if (permisObject[empresaSeleccionada?._id]?.crear?.[objeto.accion] == "true" || usu == "master") {

                        tabla += tipoInput(objeto, numeroForm, names)

                    }
                }
                tabla += `</div>`;
            }
            tabla += `</div>`;
            tabla += `</div>`;
            tt = $(tabla);

            $.each(objeto.ocultroAtributosSeguridad, (indice, value) => {

                $(`#t${numeroForm} div.${value.nombre || value}`).addClass("ocultoSeguridad");
            });

            tt.appendTo(`#tabs_contents`);

            let alto = $(`#t${numeroForm} .tr.tituloTablas`).height()
            $(`#t${numeroForm} .tr.filtro`).css({ "top": `${alto}px` })


            $(`#t${numeroForm}`).css(`max-height`, heightTabla(numeroForm))
            $(`#t${numeroForm}`).scrollTop(positionObject[numeroForm] || $(`#t${numeroForm}`).prop('scrollHeight'))
            formatoCeldas(objeto, numeroForm);
            validarFormulario(objeto, numeroForm)
            eliminarDeshabilitar(objeto, numeroForm)
            ordenarAbm(consultaReCrear, numeroForm)
            filtrarAbm(objeto, numeroForm)
            valoresInicialesAppAbm(objeto, numeroForm)
            totalesBaseYMonedaAbm(objeto, numeroForm)


            $(`#bf${numeroForm} .opcionFiltroRapido.botonActivo`).trigger("click")//para hacer trigger click boton de filtros multiples

            if (!($(`#tablas #p${numeroForm}`).hasClass(`active`))) {

                $(`#tablas .tabs_contents_item.${numeroForm}`).removeClass(`active`)
            }

            $.each(objeto?.funcionesPropias?.finalAbm, (indice, value) => {

                value[0](objeto, numeroForm, value[1], value[2], value[3])
            })

            $(`#comandera #bf${numeroForm} span.desHabilitarBoton,
                  #comandera #bf${numeroForm} span.deleteBoton,
                  #comandera #bf${numeroForm} span.editBoton,
                  #comandera #bf${numeroForm} span.historia`).addClass("ocultoOrigen")

            $(`#t${numeroForm} input[type^="date"]:not(.date)`).removeAttr("type").addClass("typeDate")
            $(`#t${numeroForm} input[type="datetime-local"]`).removeAttr("type")

            quitarEsperaForm(objeto, numeroForm)

            if (Object.values(filtroObj).length > 0) {

                $(`#t${numeroForm} .th:first span.filtro`).trigger("click")

                $.each(filtroObj, (indice, value) => {

                    $(`#t${numeroForm} .td.filtro.numeradorOperaciones input`).val(value).trigger("input")
                })
            }
        },
    });

    consultaGet[numeroForm] = consultaReCrear
    adjuntoCeldaAbm(objeto, numeroForm)
    return consultaReCrear
};
function reCrearporIngresoDeRegistro(objeto, numeroForm) {//Dicionario

    const tablasActivas = $(`#tabs_contents div.tabs_contents_item[tabla="abm"][accion="${objeto.accion}"]:not(.formAprob)`)
    const tablasActivasAprob = $(`#tabs_contents div.tabs_contents_item[tabla="abm"][accion="${objeto.accion}"].formAprob`)

    $.each(tablasActivas, (indice, value) => {

        let accion = $(value).attr("accion")

        if (accion == objeto.accion) {

            let id = $(value).attr("id").slice(1)

            $(`#bf${id} span.okBoton,
                 #bf${id} span.desHabilitarBoton,
                 #bf${id} span.deleteBoton,
                 #bf${id} span.editBoton,
                 #bf${id} span.cancelBoton,
                 #bf${id} span.recargar,
               #bf${id} span.historia`).addClass("ocultoOrigen")

            reCrearTabla(id, objeto)

        }
    })

    $.each(tablasActivasAprob, (indice, value) => {

        let id = $(value).attr("id").slice(1)
        let idRegistro = $(value).attr("aprobar")
        let indic = $(value).attr("agrupador")

        objeto = modulosLocales[indic].componentes[idRegistro]

        reCrearTabla(id, objeto)
    })
}
function reCrearporIngresoDeRegistroAprob(objeto, numeroForm) {//Dicionario

    const tablasActivas = $(`#tabs_contents div.tabs_contents_item[tabla="abm"][accion="${objeto.accion}"]:not(.formAprob)`)
    const tablasActivasAprob = $(`#tabs_contents div.tabs_contents_item[tabla="abm"][accion="${objeto.accion}"].formAprob`)

    $.each(tablasActivas, (indice, value) => {

        let accion = $(value).attr("accion")

        if (accion == objeto.accion) {

            let id = $(value).attr("id").slice(1)

            $(`#bf${numeroForm} span.okBoton,
               #bf${numeroForm} span.desHabilitarBoton,
               #bf${numeroForm} span.deleteBoton,
               #bf${numeroForm} span.editBoton,
               #bf${numeroForm} span.cancelBoton,
               #bf${numeroForm} span.recargar,
               #bf${numeroForm} span.historia`).addClass("ocultoOrigen")

            obje = variablesModelo[objeto.accion]

            reCrearTabla(id, obje)

        }
    })

    $.each(tablasActivasAprob, (indice, value) => {

        let id = $(value).attr("id").slice(1)

        reCrearTabla(id, objeto)
    })
}
function editRegistro(objeto, numeroForm) {

    let memoriaValoreEditados = new Object
    let filaSeleccionada = new Object

    let sel = $(`#t${numeroForm} .tr.sel`);

    if ($(sel).hasClass(`desencadenado`)) {

        let cartel = cartelInforUnaLinea(`No se puede editar un registro en desencadenado`, "❌", { cartel: "infoChiquito rojo", close: "ocultoSiempre" })
        $(cartel).appendTo(`#bf${numeroForm}`)
        removeCartelInformativo(objeto, numeroForm)

    } else if (sel.length > 0) {
        filaSeleccionada = [];
        $.each(objeto.atributos.names, function (indice, v) {

            let valor = $(`.tr.sel div.${v.nombre || v}`).html().trim();
            filaSeleccionada[v.nombre] = valor
            memoriaValoreEditados[v.nombre] = (valor)
        })

        memoriaValoreEditados.date = $(`.tr.sel div.date`).html().trim();
        memoriaValoreEditados.username = $(`.tr.sel div.username`).html().trim();
        memoriaValoreEditados._id = $(`#t${numeroForm} .tr.sel div.celda._id`).html().trim()
        filaSeleccionada.date = $(`#t${numeroForm} .tr.sel div.date`).html().trim()
        filaSeleccionada.username = $(`#t${numeroForm} .tr.sel div.username`).html().trim()

        filaSeleccionada._id = $(`#t${numeroForm} .tr.sel div.celda._id`).html().trim()

        $(`#bf${numeroForm} .cartelErrorFront`).addClass("noShow");
        $(`#t${numeroForm} div.inputTd div.contError`).remove()

        /////////////////////////////////////////////
        filaAbmEditada(objeto, numeroForm);

        $(`#bf${numeroForm} .editBoton,
           #bf${numeroForm} .desHabilitarBoton,
           #bf${numeroForm} .deleteBoton`).parents(`div.barraForm`).addClass(`oculto`)

    } else {

        let cartel = cartelInforUnaLinea(`Seleccione un registro para editar`, "✔️", { cartel: "infoChiquito", close: "ocultoSiempre" })
        $(cartel).appendTo(`#bf${numeroForm}`)
        removeCartelInformativo(objeto, numeroForm)
    }

    let fecha = dateNowAFechaddmmyyyy(Date.now(), `y-m-dThh`);
    $(`input.edit.date.${numeroForm} `).val(fecha);

    let objetoEditar = new Object
    objetoEditar[`filaSeleccionada`] = filaSeleccionada
    objetoEditar[`memoriaValoreEditados`] = memoriaValoreEditados

    return objetoEditar
}
function filaAbmEditada(objeto, numeroForm) {

    let accion = objeto.accion;
    let names = objeto.atributos.names;
    let validaciones = objeto.validaciones;
    let soloLectura = objeto.atributos?.modificar?.soloLectura || objeto.atributos?.soloLectura || []
    let eliminarAdjuntos = []

    let formu = "";
    formu += `<form method="PUT" action="/${accion}" id="f${accion}${numeroForm}"></form>`;

    let formulario = $(formu);

    formulario.appendTo(`.tabs_contents_item.active`);

    $.each(names, (indice, value) => {

        let valor = "";
        let inp = "";
        let input = "";

        valor = $(`#t${numeroForm} .tr.sel div.celda.${value.nombre}`).html().trim();
        let valorLogic = $(`#t${numeroForm} .tr.sel div.celda.${value.nombre} input[type="checkbox"]`).is(`:checked`);

        $(`#t${numeroForm} .tr.sel div.celda.${value.nombre}`).empty();

        inp = `<input type="${value.type}" ${autoCompOff} class="edit ${value.nombre} ${value.clase || ""}" name="${value.nombre}" form="f${accion}${numeroForm}" valid=${value.validacion} tabindex="${indice + 1}"></input>`;

        input = $(inp);

        input.appendTo(`#t${numeroForm} .tr.sel div.celda.${value.nombre}`);
        $(input).addClass(value.clase)

        switch (value.type) {
            case "fecha":
            case "date":

                let ano = valor.slice(6);
                let mes = valor.slice(3, 5);
                let dia = valor.slice(0, 2);

                $(`#t${numeroForm} input.edit.${value.nombre}`).prop("type", "date").val(`${ano}-${mes}-${dia}`);

                break;
            case "parametrica":
            case "parametricaMixta":

                let indice = $(`#t${numeroForm} input.edit.${value.nombre}`).attr("tabindex")
                $(`#t${numeroForm} input.edit.${value.nombre}`).remove()
                $(`#t${numeroForm} .tr.sel .celda.${value.nombre}`).addClass("pestRefEdit")
                let valorDef = $(`#t${numeroForm} .tr.sel .celda.${value.nombre}`).attr("idRegistro")

                let pest = prestanaFormIndividual(objeto, numeroForm, value, valorDef, parseFloat(indice) + 1, {})
                $(pest).appendTo(`#t${numeroForm} .tr.sel div.celda.${value.nombre}`);
                $(`#t${numeroForm} .tr.sel div.celda.${value.nombre} .inputSelect`).addClass("validado")

                break;
            case "parametricaPreEstablecida":

                let indicePre = $(`#t${numeroForm} input.edit.${value.nombre}`).attr("tabindex")
                $(`#t${numeroForm} input.edit.${value.nombre}`).remove()
                $(`#t${numeroForm} .tr.sel .celda.${value.nombre}`).addClass("pestRefEditPre")
                let valorDefPre = $(`#t${numeroForm} .tr.sel .celda.${value.nombre}`).html()

                let pestPre = prestanaFormIndividualPreEstablecida(objeto, numeroForm, value, valorDefPre, parseFloat(indicePre) + 1, {})
                $(pestPre).appendTo(`#t${numeroForm} .tr.sel div.celda.${value.nombre}`);
                $(`#t${numeroForm} .tr.sel div.celda.${value.nombre} .inputSelect`).addClass("validado")

                break;
            case `password`:
                let imgPassword = `<img class="ojoPassword tachado" src="/img/abm/ojoTachado.png">`;

                $(imgPassword).appendTo($(`.tr.sel div.celda.${value.nombre}`));
                $(`#t${numeroForm} .edit.${value.nombre}`).val("******");
                $(`#t${numeroForm} .edit.${value.nombre}`).attr(`type`, `password`);
                break;
            case "numerador":
                $(`#t${numeroForm} .edit.${value.nombre}`).val(valor).prop("readonly", true).addClass("transparente textoCentrado");
                break;
            case `adjunto`:

                $(`#t${numeroForm} .tr.sel div.celda.${value.nombre} input`).remove()
                $(`#t${numeroForm} .tr.sel div.celda.${value.nombre}`).addClass("edit")
                let atributo = `<div class="botonDescriptivo">${valor}</div>`;

                let atr = $(atributo);
                atr.appendTo(`#t${numeroForm} .tr.sel div.celda.${value.nombre}`);

                break;
            case "username":
                $(`.edit.${value.nombre}.${numeroForm}`).val(usu);

                break;
            case `listaNoEditable`:

                $(`#t${numeroForm} .tr.sel div.celda.${value.nombre} input`).remove()

                break;
            case `numero`:

                $(`#t${numeroForm} .edit.${value.nombre}`).val(valor).addClass("formatoNumero");
                break;
            case `checkbox`:

                $(`#t${numeroForm} .tr.sel .edit.${value.nombre}`).attr("type", "checkbox").removeAttr("form").removeAttr("name").prop("checked", valorLogic);
                let hidden = `<input type="hidden" class="edit ${value.nombre}" name="${value.nombre}" form="f${objeto.accion}${numeroForm}" value="${valorLogic || false}"  />`;

                $(hidden).appendTo(`#t${numeroForm} .tr.sel div.celda.${value.nombre}`);

                break;
            default:
                $(`#t${numeroForm} .edit.${value.nombre}`).val(valor);
                break;
        }

    });

    let inp = "";
    let input = "";

    $(`#t${numeroForm} .tr.sel div.celda.date`).empty();
    $(`#t${numeroForm} .tr.sel div.celda.username`).empty();
    let valorId = $(`#t${numeroForm} .tr.sel div.celda._id`).html();

    $(`#t${numeroForm} .tr.sel div.celda._id`).empty();

    inp = `<input class="edit auditoria date ${numeroForm}" name="date" form="f${accion}${numeroForm}" soloLec=true type="datetime-local"></input>`;

    input = $(inp);
    input.appendTo(`#t${numeroForm} .tr.sel div.celda.date`);

    let fecha = dateNowAFechaddmmyyyy(Date.now(), `y-m-dThh`);
    $(`#t${numeroForm} input.edit.date`).val(fecha);

    inp = `<input class="edit auditoria username ${numeroForm}" name="username" form="f${accion}${numeroForm}" soloLec=true></input>`;

    input = $(inp);

    input.appendTo(`#t${numeroForm} .tr.sel div.celda.username`);
    $(`#t${numeroForm} input.edit.username`).val(usu);

    inp = `<input class="edit _id ${numeroForm}" name="_id" form="f${accion}${numeroForm}" soloLec=true></input>`;
    input = $(inp);
    input.appendTo(`#t${numeroForm} .tr.sel div.celda._id`);
    $(`#t${numeroForm} input.edit._id`).val(valorId);


    if (names.includes(`moneda`)) {
        if ($(`.edit.moneda.${numeroForm}`).val() == "Pesos") {

            $(`.edit.importeUsd.${numeroForm},
               .edit.tc.${numeroForm}`).prop("readonly", "true");
        } else {
            $(`.edit.importeArs.${numeroForm}`).prop("readonly", "true");
        }
    }

    validarElementosExistentes(objeto, numeroForm)
    formatoCeldas(objeto, numeroForm);

    $.each(objeto?.funcionesPropias?.cargar, function (indice, value) {

        value[0](objeto, numeroForm, value[1], value[2], value[3])
    })

    $.each(validaciones, function (indice, value) {
        $(`#t${numeroForm} .edit.${value.nombre || value}`).addClass("requerido");
        $(`#t${numeroForm} .edit.${value.nombre || value}`).addClass("validado");


    });
    $(`#t${numeroForm} input.edit.num`).prop("readonly", "true")

    return eliminarAdjuntos

};
function eliminarRegistroTabla(id, objeto) {

    let filaSeleccionada = $(`#t${id} div.tr.sel`);

    filaSeleccionada.remove();
};
function desabilitarRegistroEditando(objeto, numeroForm, memoriaValoreEditados) {

    let names = objeto.atributos.names;

    $.each(names, function (indice, value) {

        let valor = memoriaValoreEditados[value.nombre];

        if (value == "fecha") {
            let fecha = dateNowAFechaddmmyyyy(valor, `d/m/y`)

            $(`#t${numeroForm} .tr.sel div.celda.${value.nombre}`).html(fecha);
        } else {

            $(`#t${numeroForm} .tr.sel div.celda.${value.nombre}`).html(valor);
        }
    });
    $(`#t${numeroForm} .tr.sel .celda`).removeClass("pestRefEdit")

    $(`#t${numeroForm} .tr.sel input`).remove();
    $(`#t${numeroForm} .tr.sel div.celda._id`).html(memoriaValoreEditados._id);
    $(`#t${numeroForm} .tr.sel div.celda.date`).html(memoriaValoreEditados.date);
    $(`#t${numeroForm} .tr.sel div.celda.username`).html(memoriaValoreEditados.username);
    $(`#t${numeroForm} .tr .celda.edit`).removeClass("edit")

    return false
};
function popUpEliminacion(objeto, numeroForm, idRegistro, pregunta) {

    let cartelEliminar = cartelElinimarSioNo(numeroForm, pregunta)
    let ca = $(cartelEliminar);
    ca.appendTo(`#tablas`);//ESto va a tabla porque me queda medio fijo sino depende mucho del largo de la tabla

    $(`.cartelEliminar.${numeroForm} .no`).on("click", () => {
        $(`.cartelEliminar.${numeroForm} `).remove();

        return false;
    });

    $(`.cartelEliminar.${numeroForm} .si `).on("click", () => {

        $(`.cartelEliminar.${numeroForm} `).remove();

        eliminarRegistro(objeto, numeroForm, idRegistro);

        let cartel = cartelInforUnaLinea(`${pregunta} se ha eliminado`, "✔️", { cartel: "infoChiquito", close: "ocultoSiempre" })
        $(cartel).appendTo(`#bf${numeroForm}`)
        removeCartelInformativo(objeto, numeroForm)

        return true;
    });
};
function eliminarRegistro(objeto, numeroForm, idRegistro) {

    $.ajax({
        type: "delete",
        url: `/delete?base=${objeto.accion}`,
        data: `_id=${idRegistro}`,
        beforeSend: function () {
            mouseEnEsperaForm(objeto, numeroForm)
        },
        complete: function () { },
        success: async function (data) {

            const referencias = data.updt.referencias;

            for (const indice of Object.keys(referencias)) {

                let value = referencias[indice];
                if (!value) continue;
                if (!Array.isArray(value)) { value = Object.values(value); }
                console.log(value)
                switch (indice) {

                    case "desencadenantesColec":
                    case "desencadenante":
                        for (const val of value) {
                            eliminarRegistroDesencadenado(variablesModelo[val.entidad], numeroForm, val._id);
                        }
                        break;

                    case "imputado":
                        for (const val of value) {

                            let imputacion = objeto.imputarcoleccion[val.identificador];
                            imputacion._id = val._id;
                            imputacion.destino = val.entidad;

                            await eliminarRegistroImputado(imputacion, objeto, { posteo: data.updt });

                        }

                        break;
                }
                console.log(value)
            }

            reCrearporIngresoDeRegistro(objeto, numeroForm);

            $(`#comanderaIndiv.closeForm.${numeroForm}`).trigger("click");

            $.each(objeto.acumulador, (indice, value) => {
                acumuladorUpdateDelete(value, data, objeto)
            })

            quitarEsperaForm(objeto, numeroForm);
        },

        error: function (error) {
            console.log(error);
        },
    });
};
function eliminarRegistroDesencadenado(objeto, numeroForm, idRegistro) {

    $.ajax({
        type: "delete",
        url: `/delete?base=${objeto.accion} `,
        data: `_id=${idRegistro}`,
        complete: function () { },
        success: function (data) {

            reCrearporIngresoDeRegistro(objeto, numeroForm)

            $.each(objeto.acumulador, (indice, value) => {
                acumuladorUpdateDelete(value, data, objeto)
            })

        },
        error: function (error) {
            console.log(error);
        },
    });
};
async function eliminarRegistroImputado(imputacion, objeto, data) {

    imputacion.log = { ...imputacion.opciones.true.atributoImputables.funcion };
    imputacion.opciones.true.atributoImputables.funcion = imputacion.opciones.true.atributoImputables.funcionReverso;
    imputacion.origen = "imputado";

    try {
        data.borrar = true
        const resultado = await imputacionDesdeColeccion(imputacion, objeto, data);

        imputacion.opciones.true.atributoImputables.funcion = { ...imputacion.log };
        delete imputacion.log;

        const idImputado = imputacion._id;

        const refAEliminar =
            `referencias.origenImputado.${imputacion.identificador}${data.posteo._id}`;
        console.log(refAEliminar)

        const res = await fetch(`/put?base=${imputacion.destino}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                _id: idImputado,
                unset: JSON.stringify({
                    [refAEliminar]: ""
                })
            })
        });

        if (!res.ok) throw new Error("Error al hacer unset");

        const r = await res.json();

        console.log("Referencia imputada eliminada", r);
        return r;

    } catch (err) {
        console.error(err);
        throw err;
    }
}

//////////// ENVIAR INFORMACION //////////////
async function enviarRegistroNuevo(objeto, numeroForm) {

    objeto.numerador != undefined && await insertarNumeradorAbm(objeto, numeroForm)

    let fecha = dateNowAFechaddmmyyyy(Date.now(), `y-m-dThh`);
    $.each(objeto?.funcionesPropias?.ejecutarAlconfimar, (indice, value) => {

        value[0](objeto, numeroForm, value[1], value[2], value[3])
    })
    transformarNumeroAntesEnviar(numeroForm)
    $(`.inputR.date.${numeroForm} `).val(fecha);

    let file = new FormData($(`#f${objeto.accion}${numeroForm}`)[0]);
    file.set("empresa", empresaSeleccionada?._id);

    $.ajax({
        type: "POST",
        url: `/post?base=${objeto.accion}`,
        data: file,
        contentType: false,
        processData: false, // tell jQuery not to process the data
        before: function () {
            mouseEnEsperaForm(objeto, numeroForm)
        },
        complete: function (data) { },
        success: function (response) {

            if (response.posteo != undefined) {

                $.each(objeto.desencadenante, (indice, value) => {
                    desencadenante(value, objeto, numeroForm, response, "post");
                })
                $.each(objeto.desencadenaColeccion, (indice, value) => {
                    desencadenaColec(value, objeto, numeroForm, response, "post");
                })
                $.each(objeto.child, (indice, value) => {
                    desencadenante(value, objeto, numeroForm, response, "post");
                })
                if (objeto.type == "parametrica") {

                    delete consultaPestanas[objeto.accion]
                    delete consultaPestanasConOrden[objeto.accion]

                }

                $(`#bf${numeroForm} .botonesForm .imgB.okfBoton`).css(`display`, `flex`);
                $(`#bf${numeroForm} .botonesForm .progressBar`).css(`display`, `none`);
                $(`#bf${numeroForm} .botonesForm .imgB`).css(`cursor`, `pointer`);

                $.each(objeto.acumulador, (indice, value) => {

                    acumuladorUpdate(value, response, objeto)
                })

                reCrearporIngresoDeRegistro(objeto, numeroForm)

                let cartel = cartelInforUnaLinea(response.mensaje, "☑️", { cartel: "infoChiquito verde", close: "ocultoSiempre" })
                $(cartel).appendTo(`#bf${numeroForm}`)
                removeCartelInformativo(objeto, numeroForm)
                quitarEsperaForm(objeto, numeroForm)


            } else {

                let cartel = cartelInforUnaLinea(response.mensaje, "❌", { cartel: "infoChiquito rojo", close: "ocultoSiempre" })
                $(cartel).appendTo(`#bf${numeroForm}`)
                removeCartelInformativo(objeto, numeroForm)
                activarSacarCartel(objeto, numeroForm)
            }
        },
        error: function (error) {
            console.log(error);
        },
    });
};
function enviarRegistroEditado(numeroForm, objeto, eliminarAdjunto, modificar) {

    let fecha = dateNowAFechaddmmyyyy(Date.now(), `y-m-dThh`);
    $(`#t${numeroForm} input.edit.date`).val(fecha);
    $.each(objeto?.funcionesPropias?.ejecutarAlconfimar, (indice, value) => {

        value[0](objeto, numeroForm, value[1], value[2], value[3])
    })
    transformarNumeroAntesEnviar(numeroForm)

    $(`#t${numeroForm} .tr.input`).remove()
    let file = new FormData($(`#f${objeto.accion}${numeroForm}`)[0]);

    file.set("descripcionEnvio", "Modificación Registro");
    file.set("modificaciones", JSON.stringify(modificar));
    file.set("empresa", empresaSeleccionada?._id);

    $.ajax({
        type: "put",
        url: `/put?base=${objeto.accion}`,
        data: file,
        contentType: false,
        processData: false, // tell jQuery not to process the data
        beforeSend: function () {
            mouseEnEsperaForm(objeto, numeroForm)
        },
        success: function (response) {

            if (response.posteo != undefined) {

                $.each(objeto.desencadenante, (indice, value) => {
                    desencadenante(value, objeto, id, response, "put");
                })

                $(`#bf${numeroForm} .botonesForm .imgB.okfBoton`).css(`display`, `flex`);
                $(`#bf${numeroForm} .botonesForm .imgB`).css(`cursor`, `pointer`);

                $.each(eliminarAdjunto, (inidce, value) => {
                    eliminarAdjunto(value)
                })
                if (objeto.type == "parametrica") {

                    delete consultaPestanas[objeto.accion]
                    delete consultaPestanasConOrden[objeto.accion]

                }
                let cartel = cartelInforUnaLinea(response.mensaje, "☑️", { cartel: "infoChiquito verde", close: "ocultoSiempre" })
                $(cartel).appendTo(`#bf${numeroForm}`)
                removeCartelInformativo(objeto, numeroForm)
                reCrearporIngresoDeRegistro(objeto, numeroForm)

                $.each(objeto.acumulador, (indice, value) => {

                    acumuladorUpdateEdit(value, response, objeto)
                })
            }

            quitarEsperaForm(objeto, numeroForm)
        },
        error: function (error) {
            console.log(error);
        },
    });

};
/////////////////VALIDACION FORMULARIOS/////////////////////////////////////////////////
function validarFormulario(objeto, numeroForm) {

    const validarCampo = (e) => {
        //  if () { }
        let match = validaciones[$(e.target).attr("valid")]

        if (match.test(e.target.value)) {

            $(e.target).addClass("validado");

        } else {

            if (!$(e.target).is("[readonly]")) {

                $(e.target).removeClass("validado");

            }
        }
    };

    const validarCampoSelectSelecSimul = (e) => {

        let contenedorSelect = $(e.target).parents(`.selectCont`)
        let sel = $(`.inputSelect`, contenedorSelect)
        let value = sel.val()

        let name = sel.attr("origen") || $(e.target).attr("name")
        crumb("validarCampoSelectSelecSimul:pre", {//03/02/2026
            name,
            valor: value,
            existe: !!consultaPestanas?.[name],
            keysConsulta: consultaPestanas ? Object.keys(consultaPestanas) : null
        });
        if (value.length > 0) {


            if (!consultaPestanas || !consultaPestanas[name]) {
                crumb("validarCampoSelectSelecSimul:consultaInexistente", { name });
                return;
            }

            let select = Object.values(consultaPestanas[name]).find(e => e.name.trim() == value.trim())

            if (select) {

                sel.addClass("validado");

            } else {

                $(`.opciones`, contenedorSelect).removeClass("hoverFlecha").removeClass("seleccionado")
            }

        } else {

            sel.removeClass("validado");
            $(`.opciones`, contenedorSelect).removeClass("hoverFlecha").removeClass("seleccionado")

        }
    }
    const validarCampoSelectSelecSimulPreEstab = (e) => {

        let contenedorSelect = $(e.target).parents(`.selectCont`)
        let sel = $(`.inputSelect`, contenedorSelect)
        let value = sel.val()

        if (value.length > 0) {

            let opciones = $(`.opciones`, contenedorSelect)
            let select = opciones.find(e => e.attr("value") == value.trim())

            if (select) {

                sel.addClass("validado");

            } else {

                $(`.opciones`, contenedorSelect).removeClass("hoverFlecha").removeClass("seleccionado")
            }

        } else {

            sel.removeClass("validado");
            $(`.opciones`, contenedorSelect).removeClass("hoverFlecha").removeClass("seleccionado")

        }
    }

    const validarTextArea = e => {
        const { value, type, readOnly } = e.target;
        const match = validaciones[type];
        const isValid = match.test(value);
        $(e.target).toggleClass("validado", !readOnly && isValid);
    };

    $(`#t${numeroForm}`).on(`blur`, `input.requerido:not(.requeridoEspecial):not(.inputSelect):not(.totalColec)`, validarCampo);
    $(`#t${numeroForm}`).on(`input`, `input.requerido:not(.requeridoEspecial):not(.totalColec):not(.inputSelect)`, validarCampo);
    $(`#t${numeroForm}`).on(`input`, `textarea.requerido`, validarTextArea);
    $(`#t${numeroForm}`).on(`change`, `input.divSelectInput`, validarCampoSelectSelecSimul);
    $(`#t${numeroForm}`).on(`change`, `input.inputSelect[type="parametricaPreEstablecida"]`, validarCampoSelectSelecSimulPreEstab);

};
function validarElementosExistentes(objeto, numeroForm) {

    let elementos = $(`#t${numeroForm} input.requerido:not(:disabled, .inputSelect, .totalColec)`)
    let parametricos = $(`#t${numeroForm} input.requerido.inputSelect:not(:disabled, .totalColec, .testingCabecera):not([type="parametricaPreEstablecida"])`)
    let parametricosPre = $(`#t${numeroForm} input.requerido.inputSelect[type="parametricaPreEstablecida"]:not(:disabled, .totalColec)`)

    $.each(elementos, (ind, val) => {

        let valor = $(val).val()
        let match = validaciones[$(val).attr("valid")]

        if (match.test(valor)) {

            $(val).addClass("validado");

        } else {

            if (!$(val).is("[readonly]")) {

                $(val).removeClass("validado");

            }
        }
    })
    $.each(parametricos, (ind, val) => {

        let contenedorSelect = $(val).parents(`.selectCont`)
        let value = $(val).val()
        let name = $(val).attr("origen") || $(val).attr("name")

        if (value.length > 0) {

            let select = Object.values(consultaPestanas[name]).find(e => e.name == value)

            if (select) {

                $(val).addClass("validado");

            } else {

                $(`.opciones`, contenedorSelect).removeClass("hoverFlecha").removeClass("seleccionado")
            }

        } else {

            $(val).removeClass("validado");
            $(`.opciones`, contenedorSelect).removeClass("hoverFlecha").removeClass("seleccionado")

        }
    })
    $.each(parametricosPre, (ind, val) => {

        let contenedorSelect = $(val).parents(`.selectCont`)
        let value = $(val).val()

        if (value.length > 0) {

            $(val).addClass("validado");

        } else {

            $(val).removeClass("validado");
            $(`.opciones`, contenedorSelect).removeClass("hoverFlecha").removeClass("seleccionado")
        }
    })
}
function formatoCeldas(objeto, numeroForm) {

    $.each((objeto.oculto || []).concat(objeto.atributos.oculto || []), function (indice, value) {

        $(`#t${numeroForm}[tabla="abm"] .tr div.${value.nombre || value},
           #t${numeroForm}[tabla="abm"] .th.${value.nombre || value},
           #t${numeroForm}[tabla="abm"] .inputTd.${value.nombre || value} input.${value.nombre || value} `).addClass("oculto");
    });
    $.each(objeto.atributos?.width, (indice, value) => {

        $.each(value, (ind, val) => {

            $(`#t${numeroForm} .celda.${val.nombre || val},
               #t${numeroForm} .div.${val.nombre || val},
               #t${numeroForm} .th.${val.nombre || val},
               #t${numeroForm} div.${val.nombre || val} `).attr("width", indice);
        });
    });
    //formato celda selecionada
    /* let registros = $(`#t${numeroForm} .tr.fila`);

      $.each(registros, (ind, vall) => {
  
          if ($(`div.origen`, vall).html() != "" && $(`div.origen`, vall).html() != "undefined") {
              $(vall).addClass(`desencadenado`);
          }
      });*/

    $.each(objeto.atributos.clases, function (indice, value) {

        $.each(value, (ind, val) => {

            $(`#t${numeroForm} div.celda.${indice}`).addClass(val);
        })
    });
};
/////////////////Numeradores/////////////////////////////////////////////////

const habilitadoTrAbm = {
    false: "desHabilitado"
}
function tipoAtributo(consulta, objeto, numeroForm, saldoInicial, names) {

    let celdas = "";

    const ocultarElementosFormularios = {//esto se usa en lista no editable, para cuando es no desencadenado
        child: "noModificable",
        childColec: "noModificable",
        desencadenantes: "",
        desencadenantesColec: "",
        origenChild: "",
        origenDesencadenante: "noModificable",
        origenImputado: "noModificable",
        imputado: "",
        atributoSistema: "noModificable",

    }

    let clase = ""

    $.each(names, (indice, value) => {

        celdas += tipoCeldatObj?.[value.type]?.(objeto, numeroForm, value, indice, consulta) || tipoCeldatObj.default(objeto, numeroForm, value, indice, consulta);
    });

    let valorUser = consultaPestanas?.user?.[consulta.username]?.usernameUser || ""
    celdas += `<div class="celda auditoria date" style="order:9995" width="doce">${mongoAGesfin(consulta.date, `d/m/yH`)}</div>`;
    celdas += `<div class="celda auditoria username" style="order:9996" width="doce" idregistro="${consultaPestanas?.user?.[consulta.username]?._id}">${valorUser}</div>`;
    celdas += `<div class="celda _id ocultoSiempre" style="order:9997">${consulta._id}</div>`;
    celdas += `<div class="celda empresa ocultoSiempre" style="order:9997">${consulta.empresa || ""}</div>`;
    celdas += `<div class="celda version ocultoSiempre" style="order:9997">${parseFloat(consulta?.version + 1) || 0}</div>`;

    clase = consulta.origen || ""

    $.each(consulta.referencias, (indice, value) => {

        clase = ocultarElementosFormularios[indice]

    })

    clase = clase || Object.values(consulta?.autoImputo || {})[Object.values(consulta?.autoImputo || {})?.length - 1]?.modificar || ""

    clase += `${habilitadoTrAbm[consulta.habilitado] || ""}`
    return {
        celdas,
        saldoInicial,
        clase
    };
};
function verdepenOnAtributo(objeto, numeroForm, gatillo, atributo, atributoDos) {

    const ocultarMostrar = function (e) {

        let father = $(e.target).parent()
        if ($(`input.${gatillo.nombre}`, father).is(`:checked`)) {

            father.siblings(`.${atributo.nombre}`).removeClass(`oculto`).removeAttr("readonly");
            $(`#t${numeroForm} th.${atributo.nombre}`).removeClass(`oculto`)
            $(`input`, father.siblings(`.${atributo.nombre}`)).removeClass(`oculto`).removeAttr("readonly");
            $(`input`, father.siblings(`.${atributoDos.nombre}`)).val(`Abierto`);

        } else {

            father.siblings(`.${atributo.nombre}`).addClass(`oculto`).attr("readonly", true);

            $(`input`, father.siblings(`.${atributo.nombre}`)).addClass(`oculto`).attr("readonly", true).val("");
            $(`input`, father.siblings(`.${atributoDos.nombre}`)).val("");
            $(`#t${numeroForm} th.${atributo.nombre}`).addClass(`oculto`)

        }
    };

    $(`#t${numeroForm}`).on("click", `input.${gatillo.nombre}`, ocultarMostrar);
};
function rellenoAbmEstado(objeto, numeroForm, atributo, opciones) {

    let registros = $(`#t${numeroForm} .tr.fila`);
    $.each(registros, (indice, value) => {
        let estado = $(value).find(`.${atributo}`).text().trim().toLowerCase()?.replace(/\s+/g, '');
        $(value).addClass(opciones[estado]);
    });

}
function rellenoAbmFechaVenc(objeto, numeroForm, atributo, opciones, fechaV) {

    let registros = $(`#t${numeroForm} .tr.fila`);

    $.each(registros, (indice, value) => {

        let estado = $(value).find(`.${atributo}`).text().trim().toLowerCase()?.replace(/\s+/g, '');
        let fechaVencimiento = $(value).find(`.${fechaV}`).text().trim().toLowerCase();
        let fechaCorregida = fechaVencimiento.split('-')?.reverse()?.join('-')
        if (new Date(fechaCorregida) < new Date()) {
            $(value).addClass(opciones[estado]);
        }
    });
}
function ordenarAbm(consulta, numeroForm) {

    const tipoOrden = {
        fecha: (valor) => { return new Date(valor?.split('-')?.reverse()?.join('-')) },
        importe: (valor) => { return Number(stringANumero(valor)) },
        numero: (valor) => { return Number(stringANumero(valor)) },
        numerador: (valor) => { return Number(stringANumero(valor)) },
        date: (valor) => { return new Date(valor?.slice(0, 10).split('/')?.reverse()?.join('-')); },
    }
    $(`#t${numeroForm} span.arriba`).on("click", function (e) {

        let objetivoClickMenuContextual = $(e.currentTarget).parents(".th.tituloTablas").attr("filtro")
        let type = $(e.currentTarget).parents(".th.tituloTablas").attr("type")
        let registros = $(`#t${numeroForm} .tr.fila`);
        let input = $(`#t${numeroForm} .tr:last`);


        registros.sort((a, b) => {
            let valor1 = tipoOrden?.[type]?.($(a).children(`div.${objetivoClickMenuContextual}`).html()) || $(a).children(`div.${objetivoClickMenuContextual}`).html().toLowerCase();
            let valor2 = tipoOrden?.[type]?.($(b).children(`div.${objetivoClickMenuContextual}`).html()) || $(b).children(`div.${objetivoClickMenuContextual}`).html().toLowerCase();
            if (valor1 < valor2) {
                return -1;
            }
            if (valor1 > valor2) {
                return 1;
            }
            return 0;

        });

        $.each(registros, (indice, value) => {

            $(`#t${numeroForm} div.table`).append(value);
        });

        $(`#t${numeroForm} div.table`).append(input);
    });

    $(`#t${numeroForm} span.abajo`).on("click", function (e) {

        let objetivoClickMenuContextual = $(e.currentTarget).parents(".th.tituloTablas").attr("filtro")
        let type = $(e.currentTarget).parents(".th.tituloTablas").attr("type")
        let registros = $(`#t${numeroForm} .tr.fila`);
        let input = $(`#t${numeroForm} .tr:last`);


        registros.sort((a, b) => {
            let valor1 = tipoOrden?.[type]?.($(a).children(`div.${objetivoClickMenuContextual}`).html()) || $(a).children(`div.${objetivoClickMenuContextual}`).html().toLowerCase();
            let valor2 = tipoOrden?.[type]?.($(b).children(`div.${objetivoClickMenuContextual}`).html()) || $(b).children(`div.${objetivoClickMenuContextual}`).html().toLowerCase();

            if (valor1 < valor2) {
                return 1;
            }
            if (valor1 > valor2) {
                return -1;
            }
            return 0;
        });

        $.each(registros, (indice, value) => {

            $(`#t${numeroForm} div.table`).append(value);
        });

        $(`#t${numeroForm} div.table`).append(input);
    });

};
function filtrarAbm(objeto, numeroForm) {
    const tipoFiltro = {
        fecha: (valor) => { return new Date(valor?.split('-')?.reverse()?.join('-')) },
        importe: (valor) => { return stringANumero(valor) },
        numero: (valor) => { return Number(stringANumero(valor)) },
        numerador: (valor) => { return Number(stringANumero(valor)) },
        date: (valor) => { return new Date(valor?.slice(0, 10).split('/')?.reverse()?.join('-')); },

    }

    $(`#t${numeroForm} span.filtro`).on("click", (e) => {

        console.log(numeroForm);
        let filtro = $(e.currentTarget).parents(".th.tituloTablas").attr("filtro");

        $(`#t${numeroForm} .td.filtro, 
           #t${numeroForm} .tr.filtro`).removeClass(`oculto`);
        console.log($(`#t${numeroForm} .td.filtro, 
           #t${numeroForm} .tr.filtro`));
        $(`#t${numeroForm} .td.filtro.${filtro} input`).trigger("focus")

        $(`#t${numeroForm}`).animate({ scrollTop: 0 }, 'slow')


    });

    $(`#quitarFiltroMenu, .closeFiltro`).on("click", function () {

        let registrosQuitar = $(`#t${numeroForm} .tr.fila`);
        let titulosTablas = $(`#t${numeroForm} .tr:first`).children();

        $.each(titulosTablas, (indice, value) => {
            let valueFiltro = $(value).attr(`filtro`);

            $(registrosQuitar).removeClass(`oculto${valueFiltro}`);
        });

        $(`#t${numeroForm} .td.filtro`).addClass(`oculto`);

        $(`#t${numeroForm} input.busqueda`).val("");
        $(`#bf${numeroForm} .cantidad`).html(consultaGet[numeroForm].length);
    });
    const normalizarTexto = (v) =>
        (v ?? "")
            .toString()
            .replace(/\u00A0/g, " ")  // &nbsp;
            .replace(/\s+/g, " ")     // colapsa espacios
            .trim()
            .toLowerCase();

    const celdaTexto = (row, filtrado) =>
        normalizarTexto($(row).children(`div.${filtrado}`).text());

    const filtoTabla = (e) => {

        let valorBuscado = $(e.target).val().toLowerCase();
        let type = $(e.currentTarget).parents(".td.filtro").attr("type");
        let primerCaracter = valorBuscado.slice(0, 1);
        let filtrado = $(e.target).parent().parent().attr(`filtro`);
        let registros = $(`#t${numeroForm} .tr.fila`);

        if (primerCaracter == ">") {

            if (valorBuscado.includes("<")) {
                let indice = valorBuscado.indexOf("<");
                let mayorQue = tipoFiltro?.[type]?.(valorBuscado.slice(1, indice).toLowerCase());
                let menorQue = tipoFiltro?.[type]?.(valorBuscado.slice(indice + 1).toLowerCase());

                $.each(registros, (indice, value) => {

                    let valorFila = tipoFiltro?.[type]?.($(value).children(`div.${filtrado}`).text().trim()) || $(value).children(`div.${filtrado}`).text().toLowerCase().trim();

                    if (valorFila > mayorQue && valorFila < menorQue) {
                        $(value).removeClass(`oculto${filtrado}`);
                    } else {
                        $(value).addClass(`oculto${filtrado}`);
                    }
                });

            } else {

                let valorBuscadoMenor = tipoFiltro?.[type]?.(valorBuscado.slice(1).toLowerCase());
                $.each(registros, (indice, value) => {
                    let valorFila = tipoFiltro?.[type]?.($(value).children(`div.${filtrado}`).text().trim()) || $(value).children(`div.${filtrado}`).text().toLowerCase().trim();


                    if (valorFila > valorBuscadoMenor) {
                        $(value).removeClass(`oculto${filtrado}`);
                    } else {
                        $(value).addClass(`oculto${filtrado}`);
                    }
                });

            }
        } else if (primerCaracter == "<") {

            if (valorBuscado.includes(">")) {
                let indice = valorBuscado.indexOf(">");
                let mayorQue = tipoFiltro?.[type]?.(valorBuscado.slice(1, indice).toLowerCase());
                let menorQue = tipoFiltro?.[type]?.(valorBuscado.slice(indice + 1).toLowerCase());

                $.each(registros, (indice, value) => {
                    let valorFila = tipoFiltro?.[type]?.($(value).children(`div.${filtrado}`).html().trim()) || $(value).children(`div.${filtrado}`).html().toLowerCase().trim();

                    if (valorFila < mayorQue && valorFila > menorQue) {
                        $(value).removeClass(`oculto${filtrado}`);
                    } else {
                        $(value).addClass(`oculto${filtrado}`);
                    }
                });

            } else {

                let valorBuscadoMenor = tipoFiltro?.[type]?.(valorBuscado.slice(1).toLowerCase());

                $.each(registros, (indice, value) => {
                    let valorFila = tipoFiltro?.[type]?.($(value).children(`div.${filtrado}`).html().trim()) || $(value).children(`div.${filtrado}`).text().toLowerCase().trim();

                    if (valorFila < valorBuscadoMenor) {
                        $(value).removeClass(`oculto${filtrado}`);
                    } else {
                        $(value).addClass(`oculto${filtrado}`);
                    }
                });
            }
        } else {
            const buscadoRaw = $(e.target).val();
            const buscado = normalizarTexto(buscadoRaw);

            $.each(registros, (indice, value) => {
                const fila = celdaTexto(value, filtrado);

                if (buscado === "vacio") {
                    if (fila === "") $(value).removeClass(`oculto${filtrado}`);
                    else $(value).addClass(`oculto${filtrado}`);
                    return;
                }

                if (buscado === "!vacio") {
                    if (fila !== "") $(value).removeClass(`oculto${filtrado}`);
                    else $(value).addClass(`oculto${filtrado}`);
                    return;
                }

                if (fila.includes(buscado)) $(value).removeClass(`oculto${filtrado}`);
                else $(value).addClass(`oculto${filtrado}`);
            });
        }
        $(`#bf${numeroForm} .cantidad`).html($(`#t${numeroForm} .tr.fila:visible`).length);
    };
    $(`#t${numeroForm} .busqueda`).on("input", filtoTabla);
};
function filtrarRegistrosCabeceraSelect(objeto, numeroForm, valorBuscado, filtrado) {
    // Primero, mostramos todos los registros
    $(`#t${numeroForm} div.fila`).removeClass(`oculto`);

    let registros = $(`#t${numeroForm} .tr.fila`);

    $.each(registros, (indice, value) => {
        let valorFila = $(value).children(`div.${filtrado}`).html().trim();

        // Si valorBuscado está vacío, mostramos todo; si no, filtramos
        if (valorBuscado === "" || valorFila == valorBuscado) {
            $(value).removeClass(`oculto${filtrado}`);
        } else {
            $(value).addClass(`oculto${filtrado}`);
        }
    });
}
function filtroRapidoMultiple(objeto, numeroForm) {

    let filtroRapido = "";
    let filtro = objeto.atributos.filtroRapido

    filtroRapido += `<div id=filtroRapido>`;

    $.each(filtro.filtros, (indice, value) => {

        $.each(value, (ind, val) => {

            filtroRapido += `<div class="opcionFiltroRapido" filtro="${indice}" valor="${val}">${filtro.titulos[indice][ind]}</div>`;
        })
    });

    filtroRapido += `</div>`;

    let filRapido = $(filtroRapido);


    if (objeto.atributos?.limiteCabecera != true) {

        $(`#bf${numeroForm} .progressBar`).after(filRapido);
    } else {

        filRapido.appendTo($(`#bf${numeroForm} .comandSegundaLinea`))
        $(`#bf${numeroForm}`).attr("linea", "dos")

    }

    $(`#bf${numeroForm} .opcionFiltroRapido[filtro=${filtro.inicio}]`).addClass(`botonActivo`);

    $(`#bf${numeroForm} .opcionFiltroRapido`).on("click", function () {
        $(this).toggleClass(`botonActivo`);

        if ($(this).html() == "Todos") {

            $(this).siblings().removeClass(`botonActivo`);

            $.each(filtro.filtros, (i, v) => {

                $(`#t${numeroForm} div.tr.fila`).removeClass(`oculto${i}`)
            })

        } else {
            $(this).siblings(`[filtro=todos]`).removeClass(`botonActivo`);

            let botonesActivos = $(`#bf${numeroForm} .opcionFiltroRapido.botonActivo`)
            let registros = $(`#t${numeroForm} .tr.fila`);

            if (!($(this).hasClass("botonActivo"))) {

                let filtro = $(this).attr("filtro")

                registros.removeClass(`oculto${filtro}`)
            }
            $.each(botonesActivos, (ind, val) => {

                let valBus = $(val).attr("valor");
                let atributo = $(val).attr(`filtro`);


                $.each(registros, (indice, value) => {

                    let valorFila = $(value).children(`div.${atributo}`).html().trim() || "false";

                    if (valorFila.toLocaleLowerCase() == valBus.toLocaleLowerCase()) {
                        $(value).removeClass(`oculto${atributo}`);
                    } else {
                        $(value).addClass(`oculto${atributo}`).removeClass("sel");
                    }
                });

            })
        }
    });
}
function eliminarDeshabilitar(objeto, numeroForm) {

    let fat = fatherId(objeto, numeroForm)

    if (objeto?.atributos?.eliminar == false) {

        $(`#bf${numeroForm} .comandPrimeraLinea span.deleteBoton`).parent("div").addClass(`ocultoTipo`);
        $(`#bf${numeroForm} .botonesPest span.deleteBoton`).parent("div").addClass(`oculto`);

    }
    if (objeto?.atributos?.editar == false) {

        $(`#bf${numeroForm} .comandPrimeraLinea span.editBoton`).parent("div").addClass(`ocultoTipo`);
        $(`#bf${numeroForm} .botonesPest span.editBoton`).parent("div").addClass(`oculto`);

    }
    if (objeto?.atributos?.deshabilitar == false) {

        $(`#bf${numeroForm} span.desHabilitarBoton`).parents("div.barraForm").addClass(`ocultoTipo`);
        $(`#bf${numeroForm} span.desHabilitarBotonInd`).parents("div.barraForm").addClass(`oculto`);

    } else {

        let tdHabilitado = $(`#t${numeroForm} div.habilitado`);

        $.each(tdHabilitado, (indice, value) => {
            let td = $(value).html();
            if (td == "false" || td == "") {
                $(value).parent().addClass(`desHabilitado`);
            }
        });

        $(`#formularioIndividual div.cuadroForm`).removeClass(`desHabilitado`);
        $(`#t${numeroForm},
            #bf${numeroForm}`).removeClass(`desHabilitado`);

        let hab = $(`#formularioIndividual input.habilitado`).val() || $(`#t${numeroForm} div.fo input.habilitado`).val();

        if (fat == `formulario${objeto.accion}${numeroForm}`) {
            if (hab == "false" || (hab == "" && $(`#formularioIndividual input._id`).val().length > 0)) {
                $(`#formularioIndividual div.cuadroForm`).addClass(`desHabilitado`);

            }
        }

        if (hab == "false" || (hab == "" && $(`#t${numeroForm} div.fo input._id`).val()?.length > 0)) {
            $(`#t${numeroForm},
                #bf${numeroForm}`).addClass(`desHabilitado`);


        }
    }
};
function habilitarDesHabilitarRegistro(objeto, numeroForm, idRegistro, estadoRegistro) {

    let registroaCambiar = {
        id: idRegistro,
        habilitado: estadoRegistro,
    };

    $.ajax({
        type: "delete",
        url: `/deshabilitar?base=${objeto.accion}`,
        data: registroaCambiar,
        beforeSend: function () { },
        complete: function () { },
        success: function (response) {

            if (estadoRegistro == false) {

                $(`#t${numeroForm} .tr.sel div.habilitado`).html("false");
                $(`#t${numeroForm} div.fo input.habilitado`).val(false);
            } else {

                $(`#t${numeroForm} .tr.sel div.habilitado`).html("true");
                $(`#t${numeroForm} div.fo input.habilitado`).val(true);
            }

            if (objeto.type == "parametrica") {

                delete consultaPestanas[objeto.accion]
                delete consultaPestanasConOrden[objeto.accion]

            }

            $(`#bf${numeroForm},
                #t${numeroForm}`).toggleClass(`desHabilitado`);
            reCrearporIngresoDeRegistro(objeto, numeroForm)

        },

        error: function (error) {
            console.log(error);
        },
    });
};
function lecturaLengthBooleano(objeto, numeroForm, logico, atrDos) {

    let lecturaCondicionalBooleano = function () {

        let father = $(this).parent().parent();
        let atributo = $(this).attr(`name`)

        if ($(`input.${atributo}`, father).is(`:checked`)) {

            let atributoObjetivo = $(`select.${atrDos.nombre}`, father)

            if (atributoObjetivo == undefined) {
                $(`input.${atrDos.nombre}`, father).prop(`readonly`, true)
            } else {
                $(`select.${atrDos.nombre}`, father).attr(`disabled`, true)
                $(`select.${atrDos.nombre}`, father).removeClass(`requerido`)
            }

            $(father).removeClass(`sel`)
        } else {

            $(`input.${atrDos.nombre}`, father).removeAttr(`readonly`)
            $(`select.${atrDos.nombre}`, father).removeAttr(`disabled`)
            $(`select.${atrDos.nombre}`, father).addClass(`requerido`)

            $(father).removeClass(`sel`)
        }
    }

    if ($(`#formularioIndividual .formulario`).length == 0) {
        $(`#t${numeroForm} input.${logico.nombre}`).change(lecturaCondicionalBooleano);
    } else {
        $(`#formularioIndividual input.${logico.nombre}`).change(lecturaCondicionalBooleano);
    }
}
function inhabilitarAtributo(objeto, numeroForm, triger, deshabilitados, editando) {

    let valores = new Object

    const inhabiltarForm = function () {

        if ($(`#formularioIndividual input.${triger.nombre}`).is(':checked')) {

            $.each(deshabilitados, (indice, value) => {

                valores[value.nombre] = $(`#formularioIndividual select.${value.nombre}`).val() || $(`#formularioIndividual input.${value.nombre}`).val()

                $(`#formularioIndividual input.${value.nombre},
                    #formularioIndividual select.${value.nombre}`).val("")
                $(`#formularioIndividual input.${value.nombre},
                    #formularioIndividual select.${value.nombre}`).attr("disabled", "disabled")

                if (objeto.pestanas.totales.includes(value)) {
                    $(`#formularioIndividual input.${value.nombre}`).removeAttr("disabled")
                }
            })
        } else {
            $.each(deshabilitados, (indice, value) => {


                valores[value.nombre] = $(`#formularioIndividual select.${value.nombre}`).val() || $(`#formularioIndividual input.${value.nombre}`).val()

                $(`#formularioIndividual input.${value.nombre},
                    #formularioIndividual select.${value.nombre}`).val(valores[value.nombre])

                if (objeto.pestanas.totales.includes(value)) {

                    $(`#formularioIndividual input.${value.nombre}`).attr("disabled", "disabled")
                }
            })
        }

    }
    const inhabiltar = function (father) {

        let valorText = $(`input.oculto.${triger.nombre}`, father).val()


        if ($(`input.${triger.nombre}`, father).is(':checked') || valorText == true) {

            $.each(deshabilitados, (indice, value) => {

                $(`input.${value.nombre},
                    select.${value.nombre}`, father).val("")
                $(`select.${value.nombre},
                    input.${value.nombre}`, father).attr("disabled", "disabled")

                if (objeto.pestanas.totales.includes(value)) {
                    $(`input.${value.nombre}`, father).removeAttr("disabled")
                }
            })
        } else {

            $.each(deshabilitados, (indice, value) => {
                valores[value.nombre] = $(`#t${numeroForm} select.${value.nombre}`).val() || $(`#t${numeroForm} input.${value.nombre}`).val()
                $(`input.${value.nombre},
                    select.${value.nombre}`, father).removeAttr("disabled")

                $(`input.${value.nombre},
                    select.${value.nombre}`, father).val(valores[value.nombre])

                if (objeto.pestanas.totales.includes(value)) {

                    $(`input.${value.nombre}`, father).attr("disabled", "disabled")
                }
            })
        }
    }

    if ($(`#formulario${objeto.accion}${numeroForm}`).length > 0) {

        $(`#formularioIndividual`).on(`click`, `input.${triger.nombre}`, inhabiltarForm)
        inhabiltarForm()
    } else {
        $(`#t${numeroForm}`).on(`click`, `input.${triger.nombre}`, function (e) {
            let father = $(e.target).parents().parents()
            inhabiltar(father)
        })

        inhabiltar($(`#t${numeroForm} .tr.sel`))
    }
}
/////////////funciones para completar
function valorOpuesto(valorObjeto, atributoUno, atributoDos, atributosTres) {

    let monedaPesos = Object.values(consultaPestanas.moneda).find(element => element.name == atributoDos)
    let monedaDolar = Object.values(consultaPestanas.moneda).find(element => element.name == atributosTres)

    if (valorObjeto.get(atributoUno) == moneda._id) {

        return monedaDolar._id

    } else {
        return monedaPesos._id
    }

}
function valorCondicional(valorObjeto, atributoUno, atributoDos, atributosTres, atributosCuatro) {

    let moneda = Object.values(consultaPestanas.moneda).find(element => element.name == atributoDos)

    if (valorObjeto.get(atributoUno) == moneda._id) {

        return valorObjeto.get(atributosCuatro)

    } else {

        return valorObjeto.get(atributosTres)
    }

}
function valorDeEdicion(atributo, objeto, numeroForm) {

    return $(`input.${atributo}`, `#t${numeroForm}`).val()

}
function filtroAsociativo(objeto, numeroForm, entidad, padre, hijo) {

    let chequearHijos = (e) => {
        let valor = e.target.value;
        let preFiltros = { [padre]: valor };
        if (valor === "") delete preFiltros[padre];
        const filtros = `&filtros=${JSON.stringify(preFiltros)}`;

        fetch(`/get?base=${entidad}${filtros}`)
            .then(response => response.json())
            .then(data => {
                if (valor != "") {
                    let pestanasSelect = { ...consultaPestanas[hijo] };

                    $(`#t${numeroForm} .selectCont.${hijo}:not(.filtrado) .inputSelect`).val("").trigger("change");
                    $(`#t${numeroForm} .selectCont.${hijo} .opciones`).removeClass("ocultoSiempre");

                    $.each(data, (indice, value) => {
                        delete pestanasSelect[value._id];
                    });

                    $(`#t${numeroForm} .selectCont.${hijo}`).addClass("filtrado");

                    $.each(pestanasSelect, (indice, value) => {
                        $(`#t${numeroForm} .selectCont.${hijo} .opciones[value="${value._id}"]`).addClass("ocultoSiempre");
                    });

                } else {
                    // Restaurar hijos si el padre está vacío
                    $(`#t${numeroForm} .selectCont.${hijo}`).removeClass("filtrado");
                    $(`#t${numeroForm} .selectCont.${hijo} .opciones`).removeClass("ocultoSiempre");
                }
            })
            .catch(error => console.error('Error de red:', error));
    };

    $(`#t${numeroForm}`).on(`change`, `.divSelectInput[name="${padre}"]`, chequearHijos);

    let chequearPadre = (e) => {
        let valor = e.target.value;

        if (valor != "") {
            $(e.target).parents(`.selectCont`).addClass(`filtrado`);

            let preFiltros = { _id: valor };
            if (valor === "") delete preFiltros["_id"];
            const filtros = `&filtros=${JSON.stringify(preFiltros)}`;

            fetch(`/get?base=${entidad}${filtros}`)
                .then(response => response.json())
                .then(data => {
                    if (data.length > 0) {
                        let padreEncontrado = data[0][padre];

                        // Asignar el valor del padre
                        $(`#t${numeroForm} .divSelectInput[name=${padre}]`).val(padreEncontrado).trigger("change");
                        $(`#t${numeroForm} .inputSelect.${padre}`).trigger("change");

                        // Ocultar los padres que no correspondan
                        let pestanasPadre = { ...consultaPestanas[padre] };
                        delete pestanasPadre[padreEncontrado];

                        $(`#t${numeroForm} .selectCont.${padre}`).addClass("filtrado");
                        $(`#t${numeroForm} .selectCont.${padre} .opciones`).removeClass("ocultoSiempre");

                        $.each(pestanasPadre, (indice, value) => {
                            $(`#t${numeroForm} .selectCont.${padre} .opciones[value="${value._id}"]`).addClass("ocultoSiempre");
                        });
                    }
                })
                .catch(error => console.error('Error de red:', error));
        } else {
            // Restaurar padres si el hijo está vacío
            $(`#t${numeroForm} .selectCont.${padre}`).removeClass("filtrado");
            $(`#t${numeroForm} .selectCont.${padre} .opciones`).removeClass("ocultoSiempre");
        }
    };

    $(`#t${numeroForm}`).on(`change`, `.selectCont:not(.filtrado) .divSelectInput[name="${hijo}"]`, chequearPadre);
}
function filtroAsociativoUnoAMuchos(objeto, numeroForm, atributs) {

    let main = atributs.main
    let atributos = atributs.atributos

    let asociativo = (e) => {

        if (e.target.value.length > 0) {

            let valores = consultaPestanas[main.nombre || main][e.target.value]

            $(`#t${numeroForm} .inputSelect.${atributos.nombre || atributos}`).val(consultaPestanas[atributos.nombre || atributos][valores[atributos.nombre || atributos]].name).trigger("change").addClass("asociado")
        }
    }

    $(`#t${numeroForm}`).on(`change`, `.divSelectInput[name=${main?.nombre}]`, asociativo)
    $(`#t${numeroForm}`).on(`change`, `.inputSelect.asociado`, (e) => {

        $(e.target).removeClass("asociado")
        $(`#t${numeroForm} .inputSelect.${main?.nombre}`).val("").trigger("change")


    })


}
function filtroAsociativoColec(objeto, numeroForm) {

    let filtrosActivo = new Object
    let atributos = objeto.atributos.filtroAsociativo

    let asociativo = (e, value, val) => {
        let filafather = $(e.target).parents("tr")


        if (e.target.value.length > 0) {

            let arrayNew = [...value]

            let filteredArray = arrayNew.filter((item) => item != val)

            $.each(filteredArray, (indice, valu) => {

                if (filtrosActivo[valu.nombre] == false || filtrosActivo[valu.nombre] == undefined) {

                    let option = $(`select.${valu.nombre} option`, filafather)

                    let optionFinal = option.slice(1)
                    let optionSinOculto = 0
                    let noOculto = ""

                    $.each(optionFinal, (ind, va) => {

                        $(va).removeClass(`oculto${val.nombre}`)
                        let primerParte = consultaPestanas[valu.nombre][$(va).val()][e.target.name] || consultaPestanas[e.target.name][e.target.value][valu.nombre]

                        let filtro = primerParte == e.target.value
                        let filtroDos = primerParte == $(va).val()


                        if (filtro == false && filtroDos == false) {
                            $(va).addClass(`oculto${val.nombre}`)

                            optionSinOculto++
                        } else {
                            noOculto = $(va).val()
                        }

                    })

                    $(`select.${valu.nombre}`, filafather).val(noOculto).addClass("validado")
                }
            })
            filtrosActivo[val.nombre] = true
        } else {

            if (filtrosActivo[val.nombre] = true) {

                $(`option`, filafather).removeClass(`oculto${val.nombre}`)

            }
            filtrosActivo[val.nombre] = false
        }
    }

    $.each(atributos, (indice, value) => {
        $.each(value, (ind, val) => {

            filtrosActivo[val.nombre] = false
            $(`#${father}`).on(`change`, `select.${val.nombre}`, (e) => {

                asociativo(e, value, val, father)
            })

            $(`#t${numeroForm} select.${value[0].nombre}`).trigger("change")

        })
    })
}
//////////////Anular cuando se cree el formulario de aprobaciones
function noEditarSegunValordeunAtributo(objeto, numeroForm, atributo, noEditar) {//esta funcion fue creada para no editar ejemplo cotizaciones aprobadas

    let tabla = $(`#t${numeroForm}`).attr("tabla")

    let classEdit = new Object

    $.each(noEditar, (indice, value) => {
        classEdit[value.nombre || value] = "oculto"
    })

    const noEditarInd = () => {
        $(`#bf${numeroForm} .editBoton`).parent("div").removeClass("oculto")
        let aprobado = $(`#t${numeroForm} div.fo.${atributo.nombre || atributo} input`).val()

        $(`#bf${numeroForm} .editBoton`).parent("div").addClass(classEdit[aprobado] || "")

        if (aprobado == "Aprobado") {

            $(`#${father}`).off(`dblclick`, "**");
            $(`#t${numeroForm} .tablaCompuesto`).off(`dblclick`, "**");

        }
    }
    const noEditarAbm = () => {
        let sacarEdit = (e) => {

            $(`#bf${numeroForm} .editBoton`).parents(".barraForm").removeClass("oculto")
            let fila = $(e.target).parent(".tr")


            if ($(fila).hasClass("sel")) {

                let aprobado = $(`div.celda.${atributo.nombre || atributo}`, fila).html()

                $(`#bf${numeroForm} .editBoton`).parent(".barraForm").addClass(classEdit[aprobado])
            }

        }

        $(`#t${numeroForm}`).on('click', `.celda`, sacarEdit)
    }
    const noEditarTabla = {
        formulario: noEditarInd,
        formularioPestana: noEditarInd,
        abm: noEditarAbm
    }

    noEditarTabla[tabla]()

}
function tipoInput(objeto, numeroForm, names) {

    let inputTabla = ""
    let orderInput = 0
    const valorInicial = {
        1: (valorInicial) => { return `valueInicial="${valorInicial}"` },
        0: () => { return "" }
    }

    inputTabla += `<div class="tr input">`;

    $.each(names, function (indice, value) {

        switch (value.type) {
            case "coleccionSimple":

                $.each(value.componentes, function (ind, val) {

                    inputTabla += `<div class="td inputTd des ${ind}" id="inputTd${val.nombre}${numeroForm}" style="order:${indice}" cont=${numeroForm}  ${widthObject[val.width] || ""} ${ocultoOject[val.oculto] || ""}>
                        <input class="inputR ${ind} ${numeroForm}" id="in${ind}${numeroForm}" readonly name="${ind}" form="f${objeto.accion}${numeroForm}" valid=${value.validacion}></div>`;
                    orderInput++
                });
                orderInput--
                break;
            case `listaNoEditable`:
            case "coleccionInd":
                break;
            case `checkbox`:
            case "importe":
            case "fecha":
            case "adjunto":

                inputTabla += tipoInputObj[value.type](objeto, numeroForm, value, indice)

                break;
            default:

                inputTabla += `<div class="td inputTd des ${value.nombre}" id="inputTd${value.nombre}${numeroForm}" style="order:${indice}" ${widthObject[value.width] || ""} ${ocultoOject[value.oculto] || ""} ${valorInicial[Math.min(1, value?.valorInicial?.length || 0)](value.valorInicial)} >
              <input type="${value.type}" class="inputR ${value.nombre} ${value.clase || ""}" ${autoCompOff} id="in${value.nombre}${numeroForm}" readonly name="${value.nombre}" form="f${objeto.accion}${numeroForm}" valid=${value.validacion} ></div>`;
        }

        orderInput++
    });

    inputTabla += `<div class="td inputTd auditoria des date" id="inputTddate${numeroForm}" style="order:9995" width=doce>
              <input class="inputR date" id="indate${numeroForm}" soloLec=true name="date" type="datetime-local" form="f${objeto.accion}${numeroForm}"></div>`;

    inputTabla += `<div class="td inputTd auditoria des username" id="inputTdusername${numeroForm}" style="order:9996" width="doce">
              <input class="inputR username" id="inusername${numeroForm}" soloLec=true name="username" form="f${objeto.accion}${numeroForm}" readonly></div>`;

    inputTabla += `<div class="td inputTd des version ocultoSiempre" id="inputTdversion${numeroForm}" style="order:9997">
              <input class="inputR version" id="inversion${numeroForm}" name="version" value=0></div>`;

    inputTabla += `<div class="td inputTd des empresa ocultoSiempre" id="inputTdversion${numeroForm}" valueinicial="${$(`.navegacionSupHomeLog .tituloEmpresa .empresaSelect`)?.html()?.trim()}" style="order:9997">
              <input class="inputR empresa" id="inversion${numeroForm}" name="empresa" value=0></div>`;

    inputTabla += `<div class="td inputTd  des _id ocultoSiempre" id="inputTd_id${numeroForm}" style="order:9998">
              <input class="inputR _id" id="in_id${numeroForm}" name="_id" form="f${objeto.accion}${numeroForm}"></div>`;

    inputTabla += "</div>"

    return inputTabla
}
function noEditarFormSelect(objeto, numeroForm, atributo) {

    soloLecturaSelectInput($(`#t${numeroForm}`), `.inputSelect.${atributo.nombre || atributo}`)

    $(`#t${numeroForm} .inputSelect.${atributo.nombre || atributo}`).removeClass("requerido").addClass("nofunc")

}
function crearCartelHistoria(objeto, numeroForm, registroBuscado, padre) {//Dic 

    const oculto = {
        modificaciones: "oculto"
    }
    const numeroDelForm = numeroForm + 1

    let textoRegistro = `<div class="cartelHistorial ${numeroForm}">`
    textoRegistro += `<div class=titulosGeneral><h1>Historial de cambios</h1></div><div class=closePop>+</div>`
    textoRegistro += `<div class=tableCartel>
            <div class=filaDeTitulos>
            <div class="titulos numero"></div><div class="titulos descripción">Movimiento</div><div class="titulos diez">Fecha</div><div class="titulos diez">Usuario</div><div class="titulos ocultoSiempre diez"></div></div>`

    $.each(registroBuscado.historia, (indice, value) => {

        textoRegistro += `<div class="filaRegistro">`
        textoRegistro += `<div class="numero tres">${indice}</div>`

        let registro = { ...value }

        registro.user = consultaPestanas.username?.[registro?.user]?.name
        registro.fecha = dateNowAFechaddmmyyyy(registro.fecha, `d/m/y-hh`)

        $.each(registro, (ind, val) => {

            textoRegistro += `<div class="celdaHistorial ${ind} ${oculto[ind] || ""}"> ${val}</div>`

        })
        textoRegistro += "</div>"//cierro fila
    })

    textoRegistro += "</div></div>"//cierro el tabla y cartel historial
    const cartelError = $(textoRegistro)

    cartelError.appendTo("body");
    $(`${padre} div.tableCartel div.filaRegistro:last-child`).addClass("registroActual")
    $(`${padre} div.tableCartel div.filaRegistro:last-child div.celdaHistorial.descripción `).html($(`${padre} div.tableCartel div.filaRegistro:last-child div.celdaHistorial.descripción `).html() + " -- Versión actual")

    const aperturaHistorial = (e) => {

        let parentTarget = $(e.target).parent(`.filaRegistro`)
        let version = $(`div.numero`, parentTarget).html()
        let valoresModHist = new Object

        valoresModHist.cabecera = new Object
        valoresModHist.coleccion = new Object
        valoresModHist.adjunto = new Object

        let registroReconstruido = { ...registroBuscado }
        registroReconstruido.trigger = []
        let father = $(e.target).parents(`.filaRegistro`)
        const objetoColores = {
            1: "atributosVerdes",
            2: "atributosAzules"
        }

        let objectModif = {
            cabecera: new Array,
            coleccion: new Array,
            adjunto: new Array,
        }

        let idFila = $(`div.numero`, father).html()

        let arrayLength = Object.values(registroReconstruido.historia).length
        arrayLength--

        while (arrayLength > idFila) {
            let tipoFunc = Math.max(1, Math.min(2, (arrayLength - idFila)))

            $.each(registroReconstruido.historia[arrayLength].modificaciones, (indice, value) => {

                switch (indice) {

                    case "coleccion":

                        for (const key in value) {

                            for (const k in value[key]) {

                                if (value[key][k] != "Nuevo") {

                                    (valoresModHist.coleccion[key] ??= {});
                                    valoresModHist.coleccion[key][k] = registroReconstruido[key][k];

                                    registroReconstruido[key][k] = value[key][k];

                                    objectModif.coleccion.push({
                                        color: objetoColores[tipoFunc],
                                        atributo: key,
                                        posicion: k

                                    })
                                } else {

                                    registroReconstruido[key].splice(k, 1);
                                    registroReconstruido.trigger.push(key)
                                }
                            }
                        }

                        break;
                    case "adjunto":

                        for (const key in value) {

                            for (const k in value[key]) {

                                if (value[key][k] != "Nuevo") {
                                    (valoresModHist.adjunto[key] ??= {});
                                    valoresModHist.adjunto[key][k] = registroReconstruido[key][k];
                                    registroReconstruido[key][k] = value[key][k];

                                } else {

                                    registroReconstruido[key].splice(k, 1);
                                    registroReconstruido.trigger.push(key)
                                }

                                objectModif.adjunto.push({
                                    color: objetoColores[tipoFunc],
                                    atributo: key,
                                    posicion: k

                                })
                            }
                        }

                        break;
                    case "cabecera":

                        $.each(value, (ind, val) => {
                            (valoresModHist.cabecera ??= {});
                            valoresModHist.cabecera[ind] = registroReconstruido[ind];
                            registroReconstruido[ind] = val
                            objectModif.cabecera.push({
                                color: objetoColores[tipoFunc],
                                atributo: ind
                            })

                        })
                        break;
                }
            })
            arrayLength--
        }

        registroReconstruido.valoresModHist = valoresModHist
        registroReconstruido.colores = objectModif
        registroReconstruido.histoForm = `Reconstrucción versión ${version}`
        let registroNum = ""
        if (registroReconstruido?.autoImputo != undefined) {

            let registro = Object.keys(registroReconstruido?.autoImputo).filter(e => parseFloat(e) >= parseFloat(version))

            registroNum = registro[0]

        }

        registroReconstruido.modificar = registroReconstruido?.autoImputo?.[registroNum]?.modificar || true
        $(`#formularioVistaPrevia`).addClass(`historialForm`)

        clickFormularioIndividualVistaPrevia(objeto, numeroForm, registroReconstruido)

        $(`#formularioVistaPrevia .editBoton`).trigger("click")

        $(`#formularioVistaPrevia .listaNoEditable,
           #formularioVistaPrevia .aprobacionesLink`).addClass("oculto")

        const noEditarAntiguedad = () => {

            $(`#formularioVistaPrevia span.okfoton,
           #formularioVistaPrevia span.okfImprimirBoton`).addClass("oculto")

        }
        const editarObj = {
            habilitado: () => { },
            deshabilitado: noEditarAntiguedad
        }

        const permisosFunc = permisoFechaEntidad(objeto, numeroDelForm)

        editarObj[permisosFunc.permisos]()

        $(`#bf${numeroDelForm}`).on("click", "img.okBoton", () => {

            $(`#bf${numeroDelForm} .closeForm`).trigger("click")
            $(`.cartelHistorial.${numeroForm} .closePop`).trigger("click")
        })
    }

    $(`.cartelHistorial.${numeroForm}`).on(`click`, `.filaRegistro:not(:last-child)`, aperturaHistorial)

    $(`.cartelHistorial.${numeroForm}`).on("click", ".closePop", () => {

        $(`.cartelHistorial.${numeroForm}`).off(`click`, `.filaRegistro:not(:last-child)`, aperturaHistorial)
        $(`.cartelHistorial.${numeroForm}`).remove()

    })

}
function evaluarFechaAbm(objeto, numeroForm) {

    let fe = $(`#t${numeroForm} .tr.sel div.fecha`).html().trim();

    let parte = fe.split("-");

    fechaDos = new Date(`${parte[2]}-${parte[1]}-${parte[0]}`);

    let m = Math.min.apply(null, limitePermiso);
    let fechaPermitida = new Date();
    fechaPermitida.setDate(fechaPermitida.getDate() - m);


    //if (fechaDos > fechaPermitida || !(permisObject[empresaSeleccionada?._id].limite.includes(`${objeto.nombre}`))) {
    return ""

    /*} else {
        return "noProceder"
 
    }*/
}
function preClickUnWindPestana(objeto, numeroForm, consultaTodo) {

    let idColec = $(`#t${numeroForm} .tr.sel ._idColeccionUnWind`).html() || 0
    let consult = consultaTodo.find(element => (element._idColeccionUnWind == idColec || 0))

    consult[`position${objeto.coleccionPlancha[0].coleccion.nombre}`] = consult[`position${objeto.coleccionPlancha[0].coleccion.nombre}`][consult._idColeccionUnWind]
    delete consult?.referencias
    delete consult?.autoImputo

        (objeto.funcionesPropias ??= {});
    (objeto.funcionesPropias.formularioIndiv ??= {});
    objeto.funcionesPropias.formularioIndiv.funcionUnWind = [funcionUnWind];
    clickFormularioIndividualPestana(objeto, numeroForm, consult)

}
function cambiarUbicacionAtributo(objeto, numeroForm, atributo) {//dic

    $.each(atributo, (indice, value) => {

        $(`#t${numeroForm} div.${indice}`).attr("style", `order:${value}`)

    })
}
////Cabecera
async function cabeceraFiltroAbm(objeto, numeroForm) {
    let atributosCabecera = `<div class=atributosCabera>`;

    for (const value of Object.values(objeto?.atributos?.cabeceraAbm?.select)) {
        atributosCabecera += `<div class="atributoCompletoCabecera"><h3>${value.titulo}:</h3>`;
        switch (value.atributo.type) {
            case "parametrica":
                atributosCabecera += await cargarPestanasCabecera(objeto, value.atributo);
                break;
            case "parametricaPreEstablecida":
                atributosCabecera += cargarPreEstablecidaCabecera(objeto, value.atributo);
                break;
        }
        atributosCabecera += `</div>`;
    }

    $.each(objeto.atributos.cabeceraAbm?.input, (indice, value) => {
        atributosCabecera += `<div class="atributoCompletoCabecera"><h3>${value.titulo}:</h3>
        <div><input class="${value?.atributo?.nombre || value?.atributo} cabecera" name="${value?.atributo?.nombre || value?.atributo}"></div></div>`;
    });

    $.each(objeto.atributos.cabeceraAbm?.div, (indice, value) => {
        atributosCabecera += `<div class="atributoCompletoCabecera"><h3>${value.titulo}:</h3>
        <div class="${value?.atributo?.nombre || value?.atributo} ${value?.atributo?.clase || ""} cabecera" style="min-width: 7rem" name="${value?.atributo?.nombre || value?.atributo}"></div></div>`;
    });

    atributosCabecera += `</div>`;
    let atr = $(atributosCabecera);

    /* if ($(`#bf${numeroForm} .fechaTablaAbm:not(.oculto)`).length == 0) {
         $(`#bf${numeroForm} .progressBar`).after(atr);
     } else {*/
    atr.appendTo($(`#bf${numeroForm} .comandSegundaLinea`));
    $(`#bf${numeroForm}`).attr("linea", "dos");
    //}

    // $(`#t${numeroForm}`).css(`max-height`, heightTabla(numeroForm));
    // $(`#t${numeroForm}`).scrollTop($(`#t${numeroForm}`)[0].scrollHeight);

    // Listener unificado que siempre llama a la función de filtrado
    $(`#bf${numeroForm}`).on("change", ".atributoCompletoCabecera .inputSelect:not(.recrear)", (e) => {

        $(`#bf${numeroForm} .cancelBoton`).trigger("click");
        let father = $(e.target).parents(".selectCont");
        let valorBuscado = $(e.currentTarget).val();
        let filtrado = $(father).attr(`name`);

        filtrarRegistrosCabeceraSelect(objeto, numeroForm, valorBuscado, filtrado);
    });
    $(`#bf${numeroForm}`).on("change", ".atributoCompletoCabecera .inputSelect.recrear", (e) => {


        if ($(e.target).val().trim() == objeto?.atributos?.cabeceraAbm?.ocultaFecha) {

            $(`#bf${numeroForm} .fechaTablaAbm`).addClass("ocultoBusq")
        } else {
            $(`#bf${numeroForm} .fechaTablaAbm`).removeClass("ocultoBusq")

        }
        reCrearTabla(numeroForm, objeto)

    })
    // Aplicamos filtrado inicial si algún select ya tiene valor
    $(`#bf${numeroForm} .atributoCompletoCabecera .inputSelect`).each((_, value) => {
        let valorBuscado = $(value).val();
        let filtrado = $(value).attr("name");
        filtrarRegistrosCabeceraSelect(objeto, numeroForm, valorBuscado, filtrado);
    });

    // Mantener valores al editar
    $(`#bf${numeroForm}`).on('click', `.editBoton`, (e) => {
        $(`#bf${numeroForm} .atributoCompletoCabecera .inputSelect`).each((_, value) => {
            let valor = $(value).val();
            if (valor != "") {
                let name = $(value).attr("name");
                $(`#t${numeroForm} .tr:not(.desencadenado) input.edit.${name}`)
                    .val(valor)
                    .trigger("change")
                    .prop("readonly", true)
                    .addClass("transparente");
                $(`#t${numeroForm} .inputTd.${name} .spanFlechaAbajo`).addClass("oculto");
            }
        });
    });

    $.each(objeto.atributos.cabeceraAbm.valorInicial, (indice, value) => {

        $(`#bf${numeroForm} .inputSelect.${indice}`).val(value)

        if (value == objeto?.atributos?.cabeceraAbm?.ocultaFecha) {

            $(`#bf${numeroForm} .fechaTablaAbm`).addClass("ocultoBusq")
        } else {
            $(`#bf${numeroForm} .fechaTablaAbm`).removeClass("ocultoBusq")

        }

    })
}
function asignarValorDesdeCabecera(objeto, numeroForm) {

    $(`#t${numeroForm}`).on('dblclick', `.inputTd.des`, (e) => {

        setTimeout(() => {

            let selects = $(`#bf${numeroForm} .atributoCompletoCabecera .inputSelect`);

            $.each(selects, (indice, value) => {
                let valor = $(value).val()
                if (valor != "") {

                    let name = $(value).attr("name")

                    $(`#t${numeroForm} input.${name}`).val(valor).trigger("change").prop("readonly", true).addClass("transparente")
                    $(`#t${numeroForm} .inputTd.${name} .spanFlechaAbajo`).addClass("oculto")
                }
            })

        }, 100)
    })
}
function filtraRegistroIniciales(objeto, numeroForm) {//Diccionario

    let selects = $(`#bf${numeroForm} .atributoCompletoCabecera select`)

    $.each(selects, (indice, value) => {

        let valorBuscado = $(`option:selected`, value).attr("valuestring")
        let filtrado = $(value).attr(`name`);

        filtrarRegistrosCabeceraSelect(objeto, numeroForm, valorBuscado, filtrado)

    })
}
async function calcularSaldoCabecera(objeto, numeroForm, acumulador) {

    $(`#bf${numeroForm} div.saldoInicial`).removeAttr("objetivo")

    let filtros = new Object

    for (const [indice, value] of Object.entries(acumulador.atributos)) {

        filtros[indice] = $(`#bf${numeroForm} input.divSelectInput[name="${value.nombre || value}"]`).val()
    }
    const todosCompletos = Object.values(filtros).every(v => v !== "" && v != null);

    if (todosCompletos) {

        filtros.fechaDesdeEntidad = $(`#bf${numeroForm} .fechaTextoDeAbm`).val() || $(`#bf${numeroForm} .fechaTextoDeReporte`).val()
        filtros.entidad = objeto.nombre || objeto.entidad

        let saldoInicial = await getAcumuladorSaldoIncial(acumulador, filtros)

        $(`#bf${numeroForm} div.saldoInicial`).html(numeroAString(saldoInicial)).trigger("contenidoCambiado");

    }
}
function asignacionSaldosCabeceraCC(objeto, numeroForm, acum, attFiltro, nombreAcum) {

    let acumulador = objeto.acumulador[acum]

    for (const value of Object.values(acumulador.atributos)) {

        $(`#bf${numeroForm}`).on("change", `input.divSelectInput[name="${value.nombre || value}"]`, (e) => {

            let filtro = $(`#bf${numeroForm} input.divSelectInput[name="${attFiltro}"]`).val()

            if (e.target.name == "moneda" && acum == nombreAcum) {

                if (attFiltro == "") {

                    calcularSaldoCabecera(objeto, numeroForm, acumulador)
                }

            } else {

                if (e.target.name == attFiltro) {

                    if (attFiltro == "") {

                        $(`#bf${numeroForm} input.divSelectInput[name="moneda"]`).trigger("change")
                    } else {

                        calcularSaldoCabecera(objeto, numeroForm, acumulador)
                    }

                } else {
                    calcularSaldoCabecera(objeto, numeroForm, acumulador)
                }
            }
        })
    }
}
function passwordAbm(objeto, numeroForm) {

    let atriutoCeldaPassword = $(`#t${numeroForm} .celda.password`)

    $.each(atriutoCeldaPassword, (indice, value) => {

        $(value).html("******")
    })
}
function valoresInicialesAppAbm(objeto, numeroForm) {

    $.each(valoresIncialesApp, (indice, value) => {

        switch (indice) {
            case "select":
                $.each(value, (ind, val) => {

                    $(`#t${numeroForm} .inputTd[class*="${ind}"]`).addClass("valorInicial").attr("valueinicial", `${val}`)

                })
                break;
        }
    })
}
function borrarTriggerRelacionados(numeroForm) {

    $(`body`).off('dblclick', `#t${numeroForm} .inputTd.des`)
    $(`body`).off('dblclick', `#t${numeroForm} div.celda`)
    $(`body`).off('click', `#t${numeroForm} input.edit:not(.valorPorFuncion), select.edit:not(.valorPorFuncion)`)

}
function adjuntoCeldaAbm(objeto, numeroForm) {

    $(`#t${numeroForm}`).on("click", `.celda.adjunto:not(.edit)`, (e) => {

        $(`#t${numeroForm} .listadoAdjunto`).remove()
        let father = $(e.target).parents(`.tr`)
        let id = $(`div.celda._id`, father).html()
        let registros = consultaGet[numeroForm].find(element => element._id == id)

        if (registros?.path?.length > 1 || (registros?.path?.length == 1 && registros?.path?.[0] != "")) {

            let listaAdjunto = ""

            listaAdjunto += `<div class="listadoAdjunto consulta">
            <div class="cabecera">
            <div class=tituloAdjunto><h2>Lista de adjuntos</h2></div>
            <div class="closePop">+</div>
            </div> 
            <div class=contenido>`
            listaAdjunto += `<div class="th fila titulos"><div class="nombre titulo" width="nueve">Nombre</div><div class="adjuntar ocultoSiempre titulo"></div><div class="verAdjunto titulo ocultoSiempre"></div><div class="titulo eliminarAdj"></div></div>`
            let fila = 0

            $.each(registros?.path, (indice, value) => {

                listaAdjunto += `<div class="tr fila" fila="${fila}">
                        <div class="celdAdj nameUsu src=""><input class="nameUsu adjuntoForm" value="${registros.nameUsu[indice]}" form="f${objeto.accion}${numeroForm}"/></div>
                        <div class="celdAdj originalname ocultoSiempre"><input class="originalname adjuntoForm" name="originalname" value="${registros.originalname[indice]}" form="f${objeto.accion}${numeroForm}"/></div> 
                        <div class="celdAdj path ocultoSiempre"><input class="path adjuntoForm ocultoSiempre" name="path" value="${value}" form="f${objeto.accion}${numeroForm}"/></div>                                                                 
                        <div class="celdAdj verAdj "><img class="verAdj" img src="/img/iconos/botonAdjunto/VerAdj.svg" title="Ver adjunto"></div></div>`
                fila++
            })

            listaAdjunto += `</div></div>`
            let adju = $(listaAdjunto)
            adju.appendTo(`#t${numeroForm}`);

            $(`#t${numeroForm}`).addClass("staticAdj")

            let contenedorFlotante = $(`#t${numeroForm} .listadoAdjunto:not(.nuevo)`);
            const offset = $(`#t${numeroForm}`).height() * 0.4;
            contenedorFlotante.css({
                top: `${offset}px`,
            });
        } else {
            let cartel = cartelInforUnaLinea("El registro no tiene adjuntos", "", { cartel: "infoChiquito ", close: "ocultoSiempre" })
            $(cartel).appendTo(`#bf${numeroForm}`)
            removeCartelInformativo(objeto, numeroForm)
        }
    })
    $(`#t${numeroForm}`).on("click", `.listadoAdjunto:not(.nuevo):not(.edit) .closePop`, (e) => {

        $(`#t${numeroForm} .listadoAdjunto`).remove()
        $(`#t${numeroForm}`).removeClass("staticAdj")

    })
    const vistaPrevia = (e) => {

        e.stopPropagation();
        const filaFather = $(e.target).parents("div.tr")
        let src = $(`div.celdAdj.path input`, filaFather).val();
        const esImagen = /\.(webp|jpg|jpeg|png)(\?.*)?$/i.test(src);
        const esPDF = /\.pdf(\?.*)?$/i.test(src);

        let canvasCointaner = ""

        if (esImagen) {

            canvasCointaner = `<div id="canvas_container"><img id="vistaPreviaImg" src="${src}"></div>`
            $(`#t${numeroForm}`).removeClass("staticAdj")

        } else if (esPDF) {

            canvasCointaner = `<div id="canvas_container" class="pdf"><embed id="vistaPreviaPDF" src="${src}" type="application/pdf"></div>`;
            $(`#t${numeroForm}`).removeClass("staticAdj")
        }

        let cortinaNegraComandos = `<div class="cortinaNegraComandosImg"><div class="closePop vistaPrevia">+</div><div>`
        $(cortinaNegraComandos).appendTo(`#bf${numeroForm}`)
        $(`#bf${numeroForm}`).addClass("cortina")
        $(canvasCointaner).appendTo(`#t${numeroForm}`)//Esta es la cortina negra para tapar los comandos

        let formularioFather = $(`#t${numeroForm}`);
        let contenedorFlotante = document.querySelector(`#canvas_container`);

        let leftScroll = formularioFather.scrollLeft();
        contenedorFlotante.style.left = `${leftScroll}px`;

        formularioFather.on('scroll', function () {

            let leftScroll = formularioFather.scrollLeft();
            contenedorFlotante.style.left = `${leftScroll}px`;
        });
    }
    $(`#bf${numeroForm}`).on(`click`, `.closePop.vistaPrevia`, (e) => {

        $(`#bf${numeroForm} .cortinaNegraComandosImg`).remove()
        $(`#t${numeroForm} #canvas_container`).remove()
        $(`#bf${numeroForm}`).removeClass("cortina")
        $(`#t${numeroForm}`).addClass("staticAdj").removeClass("prev")

    })
    $(`#t${numeroForm}`).on("click", `.listadoAdjunto:not(.nuevo) .verAdj`, vistaPrevia)
    //////////InputTd
    $(`#t${numeroForm}`).on("click", `.inputTd .botonDescriptivo`, (e) => {

        let cartelAdjunto = $(`#t${numeroForm} .listadoAdjunto`)

        if (cartelAdjunto.length == 0) {
            let listaAdjunto = ""

            listaAdjunto += `<div class="listadoAdjunto consulta nuevo">
            <div class="cabecera">
            <div class=tituloAdjunto><h2>Lista de adjuntos</h2></div>
            <div class="closePop">+</div>
            </div> 
            <div class=contenido>`
            listaAdjunto += `<div class="th fila titulos"><div class="nombre titulo" width="nueve">Nombre</div><div class="adjuntar ocultoSiempre titulo"></div><div class="verAdjunto titulo ocultoSiempre"></div><div class="titulo eliminarAdj"></div></div>`
            let fila = 0
            listaAdjunto += `<div class="tr fila filaVacia" fila="${fila}">
                        <div class="celdAdj nameUsu vacio" src=""><input class="nameUsu adjuntoForm" name="nameUsu" form="f${objeto.accion}${numeroForm}" /></div>
                        <div class="celdAdj path vacio ocultoSiempre" src=""><input class="path adjuntoForm" name="path" form="f${objeto.accion}${numeroForm}" /></div>
                        <div class="celdAdj originalname vacio ocultoSiempre" src=""><input class="adjuntoForm originalname" name="originalname" form="f${objeto.accion}${numeroForm}" /></div>
                        <div class="celdAdj adjunto vacio"><label for="adjunto${objeto.accion}${numeroForm}fila${fila}"></label><img src="/img/iconos/botonAdjunto/adjuntar.svg"/><input type=file id="adjunto${objeto.accion}${numeroForm}fila${fila}" name="adjunto" form="f${objeto.accion}${numeroForm}" class="adjunto adjuntoForm"/></div>
                        <div class="celdAdj verAdj vacio"><img class="verAdj" img src="/img/iconos/botonAdjunto/VerAdj.svg" title="Ver adjunto"></div>
                        <div class="celdAdj eliminarAdj vacio"><img class="eliminarAdj" src="/img/iconos/botonAdjunto/deleteAdj.svg" title="Eliminar adjunto"></div>
                        <div class="celdAdj agregarFila vacio"><img class="agregarFila" src="/img/iconos/botonAdjunto/addAdj.svg" title="Agregar fila"></div></div>`

            listaAdjunto += `</div></div>`

            fila++

            listaAdjunto += `</div></div>`
            let adju = $(listaAdjunto)

            adju.appendTo(`#t${numeroForm}`);
            $(`#t${numeroForm}`).addClass("staticAdj")

            let contenedorFlotante = $(`#t${numeroForm} .listadoAdjunto.nuevo`);
            const offset = $(`#t${numeroForm}`).height() * 0.4;

            contenedorFlotante.css({
                top: `${offset}px`,
            });


        } else {
            $(`#t${numeroForm} .listadoAdjunto.nuevo`).removeClass(`.oculto`)
        }

    })
    $(`#t${numeroForm}`).on("click", `.listadoAdjunto.nuevo .closePop, .listadoAdjunto.edit .closePop`, (e) => {

        const adj = {
            0: "Sin Adjuntos",
            1: "archivo adjunto",
            2: "archivos adjuntos",
        }
        const NumALet = {
            1: (largoArchivos) => { return primeraLetraMayusculaString(NumeroALetras("", largoArchivos, "")) },
            0: (largoArchivos) => { return "" }
        }

        let inputsUsados = $(`#t${numeroForm} .listadoAdjunto input.path`).filter(function () {
            return ($(this).val() != "" || $(`input.adjunto`, $(this).parents(`.tr`)).val() != "")
        }).length

        $(`#t${numeroForm} .inputTd.adjunto .botonDescriptivo`).html(`${NumALet[Math.min(inputsUsados, 1)](inputsUsados)} ${adj[Math.min(inputsUsados, 2)]}`)
        $(`#t${numeroForm} .celda.adjunto .botonDescriptivo`).html(`${NumALet[Math.min(inputsUsados, 1)](inputsUsados)} ${adj[Math.min(inputsUsados, 2)]}`)

        $(`#t${numeroForm} .listadoAdjunto.nuevo`).addClass(`.oculto`)
        $(`#t${numeroForm} .listadoAdjunto.edit`).addClass(`.oculto`)
        $(`#t${numeroForm}`).removeClass("staticAdj")

    })
    $(`#t${numeroForm}`).on("click", `.listadoAdjunto.nuevo .celdAdj.adjunto img`, (e) => {

        $(e.target).siblings("label").trigger("click")
    });
    $(`#t${numeroForm}`).on("change", ".listadoAdjunto.nuevo input.adjunto", (e) => {//Esta sirve para nuevo y edit

        let valorAdjunto = $(e.target).val();
        let fatherFila = $(e.target).parents("div.tr.fila")
        let file = e.target.files[0];
        const esWord = /\.(doc|docx)$/i.test(file.name) || /msword|wordprocessingml/i.test(file.type);
        const esExcel = /\.(xls|xlsx)$/i.test(file.name) || /excel|spreadsheetml/i.test(file.type);

        if (valorAdjunto == "") {

            $(`input.nameUsu`, fatherFila).val("").removeClass("adjuntado").attr("disabled", "disabled");
            $(`input.path`, fatherFila).val("").attr("disabled", "disabled");
            $(`input.originalname`, fatherFila).val("").attr("disabled", "disabled");

        } else {

            let ultimaBarra = valorAdjunto.lastIndexOf("\\");
            let ultimoPunto = valorAdjunto.lastIndexOf(".");
            let nombreSugerido = valorAdjunto.substring(ultimaBarra + 1, ultimoPunto);

            $(`input.nameUsu`, fatherFila).val(nombreSugerido).addClass("adjuntado")
            $(`input`, fatherFila).removeAttr("disabled")

            if (esWord || esExcel) {

                let cartel = cartelInforUnaLinea("Los archivos formato excel o word son convertidos a pdf", "", { cartel: "infoChiquito ", close: "ocultoSiempre" })
                $(cartel).appendTo(`#bf${numeroForm}`)
                removeCartelInformativo(objeto, numeroForm)

            }
        }
    })
    const vistaPreviaNuevo = (e) => {
        e.stopPropagation();
        const filaFather = $(e.target).parents("div.tr")
        let canvasCointaner = ""

        const file = $(`input.adjunto`, filaFather)[0].files[0];
        const esImagen = /^image\/(webp|jpeg|png)$/i.test(file.type);
        const esPDF = (/^application\/pdf$/i.test(file.type) || /\.pdf$/i.test(file.name));

        const reader = new FileReader();
        reader.onload = function (event) {

            if (esImagen) {
                canvasCointaner = `<div id="canvas_container"><img id="vistaPreviaImg" src="${reader.result}"></div>`
                let cortinaNegraComandos = `<div class="cortinaNegraComandosImg"><div class="closePop vistaPrevia">+</div><div>`

                $(`#t${numeroForm}`).removeClass("staticAdj").addClass("prev")
                $(cortinaNegraComandos).appendTo(`#bf${numeroForm}`)
                $(`#bf${numeroForm}`).addClass("cortina")
                $(canvasCointaner).appendTo(`#t${numeroForm}`)//Esta es la cortina negra para tapar los comandos

            } else if (esPDF) {

                canvasCointaner = `<div id="canvas_container" class="pdf"><embed id="vistaPreviaPDF" src="${reader.result}" type="application/pdf"></div>`;
                $(`#t${numeroForm}`).removeClass("staticAdj").addClass("prev")
                let cortinaNegraComandos = `<div class="cortinaNegraComandosImg"><div class="closePop vistaPrevia">+</div><div>`
                $(cortinaNegraComandos).appendTo(`#bf${numeroForm}`)
                $(`#bf${numeroForm}`).addClass("cortina")
                $(canvasCointaner).appendTo(`#t${numeroForm}`)//Esta es la cortina negra para tapar los comandos


            } else {

                let cartel = cartelInforUnaLinea("Solo tiene vista previa imagenes y pdf", "", { cartel: "infoChiquito ", close: "ocultoSiempre" })
                $(cartel).appendTo(`#bf${numeroForm}`)
                removeCartelInformativo(objeto, numeroForm)

                return; // No continúa con vista previa
            }

            let formularioFather = $(`#t${numeroForm}`);
            let contenedorFlotante = document.querySelector(`#canvas_container`);

            let leftScroll = formularioFather.scrollLeft();
            contenedorFlotante.style.left = `${leftScroll}px`;

            formularioFather.on('scroll', function () {

                let leftScroll = formularioFather.scrollLeft();
                contenedorFlotante.style.left = `${leftScroll}px`;
            });
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    }
    $(`#t${numeroForm}`).on("click", `.listadoAdjunto.nuevo img.verAdj`, vistaPreviaNuevo);

    $(`#t${numeroForm}`).on("click", `img.eliminarAdj`, (e) => {//Esta sirve para nuevo y edit

        let fila = $(e.target).parents("div.tr").attr("fila")
        let ultimaFila = $(`div.tr:last`, $(e.target).parents("div.listadoAdjunto")).attr("fila")

        if ($(`#t${numeroForm} div.celdAdj.nameUsu`).length == 1) {

            $(`#t${numeroForm} div.tr[fila=${fila}] input.nameUsu, 
                   #t${numeroForm} div.tr[fila=${fila}] input.path,
                   #t${numeroForm} div.tr[fila=${fila}] input.originalname, 
                   #t${numeroForm} div.tr[fila=${fila}] input[type="file"]`).val("")

        } else {

            if (fila == ultimaFila) {

                let botonAgregado = `<div class="celdAdj agregarFila vacio nuevo"><img class="agregarFila" src="/img/iconos/botonAdjunto/addAdj.svg" title="Agregar fila"></div>`
                $(botonAgregado).appendTo($(`#t${numeroForm} div.listadoAdjunto div.tr[fila=${ultimaFila}]`).prev())
            }

            $(`#t${numeroForm} div.tr[fila=${fila}]`).remove()

            if ($(`#t${numeroForm} input.nameUsu`).length == 1) {
                $(`#t${numeroForm} div.listadoAdjunto .tr.filaVacia input`).removeAttr("disabled")

            }
        }
    });
    $(`#t${numeroForm}`).on("click", "img.agregarFila", (e) => {//Esta sirve para nuevo y edit

        const fila = parseFloat($(e.target).parents("div.tr").attr("fila")) + 1
        const table = $(e.target).parents("div.contenido")

        let listaAdjunto = `<div class="tr fila filaVacia" fila="${fila}">
                                <div class="celdAdj nameUsu vacio ${numeroForm}" src=""><input class="nameUsu ${numeroForm}" id="nameUsu${numeroForm}" name="nameUsu" form="f${objeto.accion}${numeroForm}" disabled="disabled"/></div>
                                <div class="celdAdj path vacio ${numeroForm} ocultoSiempre" src=""><input class="path ${numeroForm}" id="path${numeroForm}" name="path" form="f${objeto.accion}${numeroForm}" disabled="disabled" /></div>                               
                                <div class="celdAdj originalname vacio ${numeroForm} ocultoSiempre" src=""><input class="originalname ${numeroForm}" id="originalname${numeroForm}" name="originalname" form="f${objeto.accion}${numeroForm}" disabled="disabled" /></div>                               
                                <div class="celdAdj adjunto vacio nuevo"><label for="adjunto${objeto.accion}${numeroForm}fila${fila}"><img src="/img/iconos/botonAdjunto/adjuntar.svg"/></label><input type=file id="adjunto${objeto.accion}${numeroForm}fila${fila}" name="adjunto" form="f${objeto.accion}${numeroForm}" class="adjunto"/></div>
                                <div class="celdAdj verAdj vacio nuevo"><img class="verAdj" img src="/img/iconos/botonAdjunto/VerAdj.svg" title="Ver adjunto"></div>
                                <div class="celdAdj eliminarAdj vacio nuevo"><img class="eliminarAdj" src="/img/iconos/botonAdjunto/deleteAdj.svg" title="Eliminar adjunto"></div>
                                <div class="celdAdj agregarFila vacio nuevo"><img class="agregarFila" src="/img/iconos/botonAdjunto/addAdj.svg" title="Agregar fila"></div></div>`;

        let adjunt = $(listaAdjunto)

        adjunt.appendTo(table);

        $(e.target).parents("div.agregarFila").remove()
        table.scrollTop(table.prop("scrollHeight"));

    })
    ////Edit
    $(`#t${numeroForm}`).on("click", `.celda.adjunto.edit .botonDescriptivo`, (e) => {

        $(`#t${numeroForm} .listadoAdjunto`).remove()
        let father = $(e.target).parents(`.tr`)
        let id = $(`div.celda._id input`, father).val()
        let consulta = consultaGet[numeroForm].find(element => element._id == id)
        let fila = 0
        let listaAdjunto = ""

        listaAdjunto += `<div class="listadoAdjunto consulta edit"><div class="cabecera"><div class=tituloAdjunto><h2>Lista de adjuntos</h2></div><div class="closePop">+</div></div> <div class=contenido>`
        listaAdjunto += `<div class="th fila titulos"><div class="nombre titulo" width="nueve">Nombre</div><div class="adjuntar ocultoSiempre titulo"></div><div class="verAdjunto titulo ocultoSiempre"></div><div class="titulo eliminarAdj"></div></div>`
        if (consulta?.path?.length > 1 || (consulta?.path?.length == 1 && consulta?.path?.[0] != "")) {

            $.each(consulta?.path, (indice, value) => {

                listaAdjunto += `<div class="tr fila" fila="${fila}">
                        <div class="celdAdj nameUsu src=""><input class="nameUsu adjuntoForm" value="${consulta.nameUsu[indice]}" name="nameUsu" form="f${objeto.accion}${numeroForm}"/></div>
                        <div class="celdAdj originalname ocultoSiempre"><input class="originalname adjuntoForm" name="originalname" value="${consulta.originalname[indice]}" form="f${objeto.accion}${numeroForm}"/></div> 
                        <div class="celdAdj path ocultoSiempre"><input class="path adjuntoForm ocultoSiempre" name="path" value="${value}" form="f${objeto.accion}${numeroForm}"/></div>                                                                 
                        <div class="celdAdj adjunto"><label for="adjunto${objeto.accion}${numeroForm}fila${fila}"><img src="/img/iconos/botonAdjunto/adjuntar.svg"/></label><input type=file id="adjunto${objeto.accion}${numeroForm}fila${fila}" name="adjunto" form="f${objeto.accion}${numeroForm}" class="adjunto adjuntoForm"/></div>
                        <div class="celdAdj verAdj "><img class="verAdj" img src="/img/iconos/botonAdjunto/VerAdj.svg" title="Ver adjunto"></div>
                        <div class="celdAdj eliminarAdj"><img class="eliminarAdj"src="/img/iconos/botonAdjunto/deleteAdj.svg" title="Eliminar adjunto"></div></div>`
                fila++
            })
        }

        listaAdjunto += `<div class="tr fila filaVacia" fila="${fila}">
                        <div class="celdAdj nameUsu vacio" src=""><input class="nameUsu adjuntoForm" name="nameUsu" form="f${objeto.accion}${numeroForm}" disabled="disabled" /></div>
                        <div class="celdAdj path vacio ocultoSiempre" src=""><input class="path adjuntoForm" name="path" form="f${objeto.accion}${numeroForm}" disabled="disabled" /></div>
                        <div class="celdAdj originalname vacio ocultoSiempre" src=""><input class="adjuntoForm originalname" name="originalname" form="f${objeto.accion}${numeroForm}" disabled="disabled"/></div>
                        <div class="celdAdj adjunto vacio"><label for="adjunto${objeto.accion}${numeroForm}fila${fila}"><img src="/img/iconos/botonAdjunto/adjuntar.svg"/></label><input type=file id="adjunto${objeto.accion}${numeroForm}fila${fila}" name="adjunto" form="f${objeto.accion}${numeroForm}" class="adjunto adjuntoForm"/></div>
                        <div class="celdAdj verAdj vacio"><img class="verAdj" img src="/img/iconos/botonAdjunto/VerAdj.svg" title="Ver adjunto"></div>
                        <div class="celdAdj eliminarAdj vacio"><img class="eliminarAdj" src="/img/iconos/botonAdjunto/deleteAdj.svg" title="Eliminar adjunto"></div>
                        <div class="celdAdj agregarFila vacio"><img class="agregarFila" src="/img/iconos/botonAdjunto/addAdj.svg" title="Agregar fila"></div></div>`

        listaAdjunto += `</div></div>`

        let adju = $(listaAdjunto)

        adju.appendTo(`#t${numeroForm}`);

        $(`#t${numeroForm}`).addClass("staticAdj")

        let contenedorFlotante = $(`#t${numeroForm} .listadoAdjunto:not(.nuevo)`);
        const offset = $(`#t${numeroForm}`).height() * 0.4;

        contenedorFlotante.css({
            top: `${offset}px`,
        });


    })
    const vistaPreviaNuevoEdit = (e) => {
        e.stopPropagation();

        const filaFather = $(e.target).parents("div.tr")
        let src = $(`div.celdAdj.path input`, filaFather).val();
        const esImagen = /\.(webp|jpg|jpeg|png)(\?.*)?$/i.test(src);
        const esPDF = /\.pdf(\?.*)?$/i.test(src);

        let canvasCointaner = ""

        if (src != "") {

            if (esImagen) {

                canvasCointaner = `<div id="canvas_container"><img id="vistaPreviaImg" src="${src}"></div>`
                let cortinaNegraComandos = `<div class="cortinaNegraComandosImg"><div class="closePop vistaPrevia">+</div><div>`
                $(cortinaNegraComandos).appendTo(`#bf${numeroForm}`)
                $(canvasCointaner).appendTo(`#t${numeroForm}`)//Esta es la cortina negra para tapar los comandos
                $(`#t${numeroForm}`).removeClass("staticAdj").addClass("prev")

            } else if (esPDF) {

                canvasCointaner = `<div id="canvas_container" class="pdf"><embed id="vistaPreviaPDF" src="${src}" type="application/pdf"></div>`;
                let cortinaNegraComandos = `<div class="cortinaNegraComandosImg"><div class="closePop vistaPrevia">+</div><div>`
                $(cortinaNegraComandos).appendTo(`#bf${numeroForm}`)
                $(canvasCointaner).appendTo(`#t${numeroForm}`)//Esta es la cortina negra para tapar los comandos
                $(`#t${numeroForm}`).removeClass("staticAdj").addClass("prev")

            }
            else {
                // Descargar automáticamente sin mostrar nada
                const a = document.createElement('a');
                a.href = src;
                a.download = src.split("/").pop();
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                return; // No continúa con vista previa
            }

        } else {

            const file = $(`input.adjunto`, filaFather)[0].files[0];
            const esImagen = /^image\/(webp|jpeg|png)$/i.test(file.type);
            const esPDF = (/^application\/pdf$/i.test(file.type) || /\.pdf$/i.test(file.name));

            const reader = new FileReader();
            reader.onload = function (event) {

                if (esImagen) {
                    canvasCointaner = `<div id="canvas_container"><img id="vistaPreviaImg" src="${reader.result}"></div>`
                    let cortinaNegraComandos = `<div class="cortinaNegraComandosImg"><div class="closePop vistaPrevia">+</div><div>`
                    $(cortinaNegraComandos).appendTo(`#bf${numeroForm}`)
                    $(canvasCointaner).appendTo(`#t${numeroForm}`)//Esta es la cortina negra para tapar los comandos
                    $(`#t${numeroForm}`).removeClass("staticAdj").addClass("prev")


                } else if (esPDF) {

                    canvasCointaner = `<div id="canvas_container" class="pdf"><embed id="vistaPreviaPDF" src="${reader.result}" type="application/pdf"></div>`;
                    let cortinaNegraComandos = `<div class="cortinaNegraComandosImg"><div class="closePop vistaPrevia">+</div><div>`
                    $(cortinaNegraComandos).appendTo(`#bf${numeroForm}`)
                    $(canvasCointaner).appendTo(`#t${numeroForm}`)//Esta es la cortina negra para tapar los comandos
                    $(`#t${numeroForm}`).removeClass("staticAdj").addClass("prev")

                } else {

                    let cartel = cartelInforUnaLinea("Solo tiene vista previa imagenes y pdf", "", { cartel: "infoChiquito ", close: "ocultoSiempre" })
                    $(cartel).appendTo(`#bf${numeroForm}`)
                    removeCartelInformativo(objeto, numeroForm)

                    return; // No continúa con vista previa
                }
            };

            if (file) {
                reader.readAsDataURL(file);
            }
        }
    }
    $(`#t${numeroForm}`).on("click", `.listadoAdjunto.nuevo.edit img.verAdj`, vistaPreviaNuevoEdit);

    $(`#t${numeroForm}`).on("change", ".listadoAdjunto.edit input.adjunto", (e) => {

        let valorAdjunto = $(e.target).val();
        let fatherFila = $(e.target).parents("div.tr.fila")
        let file = e.target.files[0];
        const esWord = /\.(doc|docx)$/i.test(file.name) || /msword|wordprocessingml/i.test(file.type);
        const esExcel = /\.(xls|xlsx)$/i.test(file.name) || /excel|spreadsheetml/i.test(file.type);

        if (valorAdjunto == "") {

            $(`input.nameUsu`, fatherFila).val("").removeClass("adjuntado").attr("disabled", "disabled");
            $(`input.path`, fatherFila).val("").attr("disabled", "disabled");
            $(`input.originalname`, fatherFila).val("").attr("disabled", "disabled");

        } else {

            let ultimaBarra = valorAdjunto.lastIndexOf("\\");
            let ultimoPunto = valorAdjunto.lastIndexOf(".");
            let nombreSugerido = valorAdjunto.substring(ultimaBarra + 1, ultimoPunto);

            $(`input.nameUsu`, fatherFila).val(nombreSugerido).addClass("adjuntado")
            $(`input`, fatherFila).removeAttr("disabled")

            if (esWord || esExcel) {

                let cartel = cartelInforUnaLinea("Los archivos formato excel o word son convertidos a pdf", "", { cartel: "infoChiquito ", close: "ocultoSiempre" })
                $(cartel).appendTo(`#bf${numeroForm}`)
                removeCartelInformativo(objeto, numeroForm)

            }
        }
    })
}
function sorteableAbm(objeto, numeroForm) {

    new Sortable(document.querySelector(`#t${numeroForm} .table`), {
        animation: 150,
        handle: '.celda', // arrastrás desde cualquier celda
        filter: `.th, .tr.input`, // NO mover estas filas
        preventOnFilter: false,
        onEnd: function (evt) {
        }
    });
}