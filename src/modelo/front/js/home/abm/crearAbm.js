let consultaGet = new Object
let consultaGetUnWind = new Object
let pestanasConsulta = new Object

function ocultarEditElimi(objeto, numeroForm, padre) {

    if (padre.hasClass("noModificable")) {

        $(`span.editBoton,
           span.deleteBoton`, `#bf${numeroForm}`).parents(".barraForm").addClass("oculto")
        $(`span.signoPregunta`, `#bf${numeroForm}`).parents(".barraForm").removeClass("ocultoSinLugar")


    } else {

        $(`span.editBoton,
           span.deleteBoton`, `#bf${numeroForm}`).parents(".barraForm").removeClass("oculto")
        $(`span.signoPregunta`, `#bf${numeroForm}`).parents(".barraForm").addClass("ocultoSinLugar")

    }
}
$('body').on('click ', `.nav-vert:not(.enEspera) .menuSelectAbm`, async function (e) {

    //////////////////////////
    let objeto = new Object
    let aprobar = $(this).attr("aprobar")
    let indice = $(this).attr("indice")
    let idRegistro = aprobar || this.id

    let valoresModificados = new Object
    valoresModificados.cabecera = new Object

    objeto = modulosLocales[indice].componentes[idRegistro]

    objeto.nombre = idRegistro
    objeto.aprob = aprobar
    objeto.agrupador = indice

    let memoriaValoreEditados = new Object
    let filaSeleccionada = new Object
    let eliminarAdjunto = []
    console.log(objeto)

    if (entidadesConsultas[objeto.nombre] == undefined) {
        agregarCaractAtributos(objeto)
        seguridadAtributos(objeto)
        entidadesConsultas[objeto.nombre] = true
    }
    //Numero del Formulario
    let numeroForm = contador;
    let p = `<div id=p${numeroForm} class="pestana active"><div class="palabraPest">${objeto.pest}</div><div class="close" id="${numeroForm}">+</div></div>`; //definicion de pestaña
    let pestana = $(p);

    let imgs = `<div class="comand" id="bf${contador}" agrupado=${indice} linea="uno"><div class="comandPrimeraLinea">${iHistoria}${iRecargar}${iDeshabilitar}${iDelete}${iEdit}${iCrearInd}${iCruz}${iOk}
      <div class="fechaTablaAbm oculto">
      <div><p>De:</p><input type="date" class="fechaTextoDeAbm"></div>
      <div><p>Hasta:</p><input type="date" class="fechaTextoHastaAbm"></div></div>
      <div class="cantidad"></div></div>
      <div class="comandSegundaLinea"></div></div>`;

    let imagenes = $(imgs);

    pestana.appendTo('#tabs_links'); //colgamos la pestaña final
    imagenes.appendTo('#comandera');

    let lineaContenedor = $(`#bf${numeroForm}`).attr("linea") || ""
    $(`.tabs_contents_item.active`).removeClass("active")
    let tablaDef = `<div class="tabs_contents_item creado construyendo active" id="t${numeroForm}"  tabla="abm" nombre=${objeto.nombre} accion=${objeto.accion} linea="${lineaContenedor}">`;
    tablaDef += `<form method="POST" action="/${objeto.accion}" id="f${objeto.accion}${numeroForm}" enctype="multipart/form-data"></form>`;
    let tt = $(tablaDef)
    tt.appendTo(`#tabs_contents`);
    progressBarHeight(objeto, numeroForm)

    const promesas = [];

    for (const value of (objeto.pestanas || [])) {
        const key = value.origen || value.nombre;

        if (!consultaPestanas[key]) {
            promesas.push(consultasPestanaIndividual(key));
        }
    }

    await Promise.all(promesas)

    let fechaDesdeEntidad = objeto.dfechaRegistros || caracteristicaEmpresa.fechaDesdeEmpersa || fechaDesde
    const getElement = {
        unWind: "getUnWind",
    }

    let get = getElement[objeto.datos] || "get"


    if (permisObject[empresaSeleccionada?._id]?.crear?.[objeto.accion] == "false" && usu != "master") {

        $(`#bf${contador} span.crearBotonInd`).attr(`segAtributo`, `none`)
    }
    if (permisObject[empresaSeleccionada?._id]?.eliminar?.[objeto.accion] == "false" && usu != "master") {
        $(`#bf${contador} span.deleteBoton`).attr(`segAtributo`, `none`)
        $(`#bf${contador} span.desHabilitarBoton`).attr(`segAtributo`, `none`)
    }
    if (permisObject[empresaSeleccionada?._id]?.editar?.[objeto.accion] == "false" && usu != "master") {

        $(`#bf${contador} span.editBoton`).attr(`segAtributo`, `none`)
    }
    let detalleFiltroAtributos = new Object

    let sort = ""

    $.each(objeto?.funcionesPropias?.inicio, function (indice, value) {

        value[0](objeto, contador, value[1], value[2], value[3])
    })
    $(`#bf${contador} .fechaTextoDeAbm`).val(fechaDesdeEntidad)
    $(`#bf${contador} .fechaTextoHastaAbm`).val(fechaHasta)
    if (objeto.atributos.limiteCabecera == true && !$(`#bf${contador} .fechaTablaAbm`).hasClass("ocultoBusq")) {

        detalleFiltroAtributos.fecha = { $gte: new Date(fechaDesdeEntidad), $lte: new Date(fechaHasta) }

        $(`#bf${contador} .fechaTablaAbm`).removeClass("oculto")
    }

    $.each(objeto?.filtrosUnwind, (ind, val) => {

        $.each(val, (indice, value) => {

            (detalleFiltroAtributos[ind] ??= {});
            detalleFiltroAtributos[ind][indice] =
                value[0](objeto, numeroForm, value[1], value[2], value[3]);
        })
    })

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

        plancha += `&componentes=${JSON.stringify(Object.keys(value?.coleccion?.componentes))}&key=${value?.key || value.type}`//El value key es para el atributo con listaArray.key /*|| value.type*/}`//El value type es para el atributo con listaArray
    })

    if (objeto.empresa != false) {
        detalleFiltroAtributos = Object.assign(detalleFiltroAtributos, empresaFiltro)
    }

    const filtros = `&filtros=${JSON.stringify(detalleFiltroAtributos)}`

    $.ajax({
        type: "get",
        async: false,
        url: `/${get}?base=${objeto.accion}${filtros}${sort}${plancha}`,
        beforeSend: function (data) {
            mouseEnEsperaMenu(objeto, numeroForm);
        },
        success: async function (data) {

            console.log(data)
            $(`#bf${contador} .cantidad`).html(data.length)
            consultaGet[numeroForm] = data

            // Acá también todo terminó de ejecutarse
            crearTabla(contador, objeto, consultaGet[numeroForm], fechaDesdeEntidad);
            formatoCeldas(objeto, numeroForm);//Estas a diferencia de formato es solo para tabla
            active(contador);
            ordenarAbm(consultaGet[numeroForm], numeroForm)
            filtrarAbm(consultaGet[numeroForm], numeroForm, objeto)
            // sorteableAbm(objeto, numeroForm)
            eliminarDeshabilitar(objeto, numeroForm)
            signoAlternativa(objeto, numeroForm)
            quitarEsperaMenu(objeto, numeroForm)

            $.each(objeto?.funcionesPropias?.cargar, function (indice, value) {

                value[0](objeto, numeroForm, value[1], value[2], value[3])
            })
            $.each(objeto?.funcionesPropias?.finalAbm, (indice, value) => {

                value[0](objeto, numeroForm, value[1], value[2], value[3])
            })
            $.each(objeto?.funcionesPropias?.crearAbm, (indice, value) => {//Esta a diferencia de finalAbm no se ejectua en recrear

                value[0](objeto, numeroForm, value[1], value[2])
            })

            totalesBaseYMonedaAbm(objeto, numeroForm)
            valoresInicialesAppAbm(objeto, numeroForm)
            funcionesFormato(objeto, numeroForm)
            validarFormulario(objeto, numeroForm);

            $(`#bf${numeroForm} span.okBoton,
               #bf${numeroForm} span.desHabilitarBoton,
               #bf${numeroForm} span.deleteBoton,
               #bf${numeroForm} span.editBoton,
               #bf${numeroForm} span.cancelBoton,
               #bf${numeroForm} span.recargar,
               #bf${numeroForm} span.historia`).addClass("ocultoOrigen")

            let linea = $(`#bf${numeroForm}`).attr("linea")

            pestanaHeight = pestanaHeight || $(`.pestana.active`).outerHeight(true);
            comHeigth[linea] = $(`#bf${numeroForm}`).outerHeight(true);

            let contenedorScroll = document.querySelectorAll(`#t${numeroForm}`)[0];
            contenedorScroll.scrollTop = contenedorScroll.scrollHeight;

            $.each(funcionesIniciales[objeto.type], (indice, value) => {

                value(objeto, numeroForm)
            })

            contador++;
            $(`#bf${numeroForm} .opcionFiltroRapido.botonActivo`).trigger("click")
        }
    });
    $(`#bf${numeroForm}`).on('click', `.okBoton:visible`, (e) => {

        e.preventDefault();
        let valid = [];

        $(`#t${numeroForm} .td.inputTd`).children(`.contError`).remove();
        let requeridos = $(`#t${numeroForm} .tr.sel input.requerido`)

        $.each(requeridos, (indice, val) => {

            let father = $(val).parent()
            $(val).children("p").remove();

            valid.push($(val).hasClass("validado"));

            if (!($(val).hasClass("validado"))) {
                let ancho = $(val).css(`width`)

                let p = `<div class="contError" style="max-width: ${ancho}"><p>${textoValidacion[$(val).attr("valid")] || "Campo requerido"}</p></div>`;
                let texto = $(p);

                texto.appendTo(father);
                $(father).addClass("errorAbierto");
            }

        })

        if (valid.includes(false)) {

            let cartel = cartelInforUnaLinea("Revisar los campos en rojo", "✔️", { cartel: "infoChiquito rojo", close: "ocultoSiempre" })
            $(cartel).appendTo(`#bf${numeroForm}`)
            removeCartelInformativo(objeto, numeroForm)

        } else {

            if ($(`#t${numeroForm} input.edit._id`).length > 0) {

                enviarRegistroEditado(numeroForm, objeto, eliminarAdjunto, valoresModificados)

                $(`#bf${numeroForm} .editBoton`).parent().removeClass(`oculto`)
                $(`#bf${numeroForm} .recagar`).parent().removeClass(`oculto`)
                memoriaValoreEditados = new Object

            } else if ((!$(`#t${numeroForm} .tr.input .td._id`).hasClass(`des`))) {

                enviarRegistroNuevo(objeto, numeroForm);
                memoriaValoreEditados = new Object

            } else {

                let cartel = cartelInforUnaLinea("No hay registros para enviar", "❌", { cartel: "infoChiquito rojo", close: "ocultoSiempre" })
                $(cartel).appendTo(`#bf${numeroForm}`)
                removeCartelInformativo(objeto, numeroForm)

            }
        }
    })
    $(`#bf${numeroForm}`).on('click', `.desHabilitarBoton:visible`, (e) => {

        e.preventDefault();

        let fechaDos = "";

        /*if (objeto.atributos.names.includes(fecha)) {
            fechaDos = dateNowAFechaddmmyyyy($(`#t${numeroForm} .tr.sel div.fecha`).html(), `y-m-d`);
    
        }
    
           let m = Math.min.apply(null, limitePermiso);
             let fechaPermitida = new Date();
             fechaPermitida.setDate(fechaPermitida.getDate() - m);*/

        //if (/*(fechaDos > fechaPermitida) || (!(objeto.atributos.names.includes(fecha))) ||*/ ) {

        let idRegistro = $(`.tr.sel div._id`).html();
        let estadoRegistro = $(`#t${numeroForm} .tr.sel div.habilitado`).html().trim();

        if (estadoRegistro == "false" || estadoRegistro == "") {

            estadoRegistro = true

        } else {
            estadoRegistro = false

        }

        habilitarDesHabilitarRegistro(objeto, numeroForm, idRegistro, estadoRegistro)
        seleccion = true;
        //   }

        if ($(`#t${numeroForm} .tr.sel`).length == 0) {
            ;
            let cartel = cartelInforUnaLinea("Seleccione un elemento a deshabilitar", "👉", { cartel: "infoChiquito", close: "ocultoSiempre" })
            $(cartel).appendTo(`#bf${numeroForm}`)
            removeCartelInformativo(objeto, numeroForm)
        }
    });
    $(`#bf${numeroForm}`).on('click', `.deleteBoton:visible`, (e) => {

        const eliminarRegistro = () => {

            const trs = $(`#t${numeroForm} .tr.sel`);
            let id = $(`#t${numeroForm} .tr.sel div.celda._id`).html().trim();
            let consulta = consultaGet[numeroForm].find(element => element._id == id)

            let pregunta = consulta[objeto.key || "name"]
            let idRegistro = $(`#t${numeroForm} .tr.sel div.celda._id`).html();

            $.each(trs, (indice, value) => {

                $.each(objeto.atributos.names, (indi, val) => {
                    filaSeleccionada[value.nombre] = $(`#t${numeroForm} .tr.sel div.${val.nombre}`).html()
                })

                popUpEliminacion(objeto, numeroForm, idRegistro, pregunta)
            })
        }

        const eliminarRegistroObj = {
            true: () => {

                let okFecha = evaluarFechaAbm(objeto, numeroForm) || eliminarRegistro()
            },
            false: () => { eliminarRegistro() }
        }

        // eliminarRegistroObj[objeto.atributos.names.includes(fecha)]()
        eliminarRegistro()
    });
    $(`#bf${numeroForm}`).on('click', `.editBoton:visible`, (e) => {

        e.preventDefault();

        const editRegistrosFec = () => {

            if (Object.values(objeto.atributos?.compuesto || {})?.length > 0) {

                $(`#bf${numeroForm} .crearBotonInd`).trigger("click")
                $(`#t${numeroForm} input.inputR`).val("").removeAttr('style').removeClass("validado")
                $(`#t${numeroForm} .inputTd`).addClass(`des`)
                setTimeout(() => { $(`.comanderaPestana.active span.editBoton`).trigger("click") }, 300)

            } else {

                $(`#bf${numeroForm} .cancelBoton`).trigger("click")
                let resulEdit = editRegistro(objeto, numeroForm)
                filaSeleccionada = resulEdit.filaSeleccionada
                memoriaValoreEditados = resulEdit.memoriaValoreEditados


                $(`span.okBoton,
                   span.cancelBoton, 
                   span.recargar,
                   span.historia`, `#bf${numeroForm}`).removeClass("ocultoOrigen")
            }
        }

        const editarFecha = {
            true: () => {

                let okFecha = evaluarFechaAbm(objeto, numeroForm) || editRegistrosFec()
            },
            false: () => { editRegistrosFec() }

        }

        editarFecha[objeto.atributos.names.includes(F())]()

    });
    $(`#bf${numeroForm}`).on('click', `.crearBotonInd:visible`, (e) => {

        e.preventDefault();
        let type = objeto?.formInd?.type || "individual"

        const formulario = {
            individual: {

                funcion: clickFormularioIndividualPestana

            },
            unWind: {
                atributos: [],
                funcion: preClickUnWindPestana
            },
        }

        let filtrado = {
            individual: (id) => { return consultaGet[numeroForm].find(element => element._id == id) },
            unWind: (id) => { return consultaGet[numeroForm].filter(element => element._id == id) },
        }

        let ids = []
        let trSelecs = $(`#t${numeroForm} .tr.sel:not(.selecAprobar)`)

        let trSelecsLogico = $(`#t${numeroForm} .tr.selecAprobar`)

        $.each(trSelecsLogico, (indice, value) => {

            ids.push($(`.celda._id`, value).html())
        })
        if (trSelecsLogico.length == 0) {


            $.each(trSelecs, (indice, value) => {

                ids.push($(`.celda._id`, value).html())
            })
        }
        if (trSelecsLogico.length == 0 && trSelecs.length == 0) {

            clickFormularioIndividualPestana(objeto, numeroForm)
        }

        $.each(ids, (ind, value) => {

            let consult = filtrado[type](value)
            formulario[type].funcion(objeto, numeroForm, consult)
        })

    });
    $(`#bf${numeroForm}`).on('click', `.crearDoble:visible`, (e) => {

        e.preventDefault();

        let ids = []
        let trSelecs = $(`#t${numeroForm} .tr.sel:not(.selecAprobar)`)

        let trSelecsLogico = $(`#t${numeroForm} .tr.selecAprobar`)

        $.each(trSelecsLogico, (indice, value) => {

            ids.push($(`.celda._id`, value).html())
        })
        if (trSelecsLogico.length == 0) {

            $.each(trSelecs, (indice, value) => {

                ids.push($(`.celda._id`, value).html())
            })
        }
        if (trSelecsLogico.length == 0 && trSelecs.length == 0) {

            crearTablaDobleEntradaForm(objeto, numeroForm)
        }

        $.each(ids, (ind, value) => {

            let consult = consultaGet[numeroForm].find(element => element._id == value)
            crearTablaDobleEntradaForm(objeto, numeroForm, consult)
        })

    });
    if (permisObject[empresaSeleccionada?._id]?.editar?.[objeto.accion] == true) {
        $(`#t${numeroForm} `).on('dblclick', `div.celda`, (e) => {
            $(`#bf${numeroForm} .editBoton`).trigger("click")

        })
    }
    $(`#bf${numeroForm}`).on('click', `.cancelBoton:visible`, (e) => {

        if ($(`#t${numeroForm} input.edit._id`).length > 0) {

            desabilitarRegistroEditando(objeto, numeroForm, memoriaValoreEditados)

            $(`#bf${numeroForm} span.okBoton,
               #bf${numeroForm} span.cancelBoton,
               #bf${numeroForm} span.recargar`).addClass("ocultoOrigen")
            $(`#bf${numeroForm} span.editBoton`).removeClass("ocultoOrigen")
            $(`#bf${numeroForm} span.editBoton`).parent().removeClass("oculto")


        } else if ($(`#t${numeroForm} .tr.input .td._id`).hasClass(`des`)) {

            $(`#t${contador} input[type^="date"]`).removeAttr("type").addClass("typeDate")

            let cartel = cartelInforUnaLinea("No registro nuevo o en edición para cancela", "❌", { cartel: "infoChiquito", close: "ocultoSiempre" })
            $(cartel).appendTo(`#bf${numeroForm}`)
            removeCartelInformativo(objeto, numeroForm)

        } else {

            $(`#t${numeroForm} .inputTd input`).val("").removeClass("validado requerido transparente").removeAttr("disabled").prop("readOnly", true);
            $(`#t${numeroForm} .inputTd`).addClass("des");
            $(`#t${numeroForm} td.inputTd div.contError`).remove()
            $(`#bf${numeroForm} span.okBoton,
               #bf${numeroForm} span.cancelBoton,
               #bf${numeroForm} span.recargar`).addClass("ocultoOrigen")

            let input = $(`#t${numeroForm} .inputTd input[type="parametrica"]`)
            $.each(input, (indice, value) => {
                let name = $(value).attr("name")
                let input = `<input class="inputR ${name} pestanaSelect" id="in${name}${numeroForm}" readonly name="${name}" form="f${objeto.accion}${numeroForm}" valid="parametrica" value="" diasbled/>`

                let father = $(value).parents(`.inputTd`)
                $(`div.selectCont`, father).remove()
                $(input).appendTo(father)
            })
            $(`#t${numeroForm} input[type="date"]`).attr(`type`, `fecha`)
            $(`#t${numeroForm} .listadoAdjunto`).remove()
            $(`#t${numeroForm} .inputTd.adjunto .botonDescriptivo`).html(" Adjunto").addClass("oculto")
        }
        $(`#t${numeroForm} div.contError`).remove()

    });
    $(`#bf${numeroForm}`).on('click', `.recargar:visible`, (e) => {

        if ($(`#t${numeroForm} tr.input td:first:visible`).hasClass(`des`)) {

            let cartel = cartelInforUnaLinea("No hay nuevo ingreso en proceso para actualizar", "❌", { cartel: "infoChiquito", close: "ocultoSiempre" })
            $(cartel).appendTo(`#bf${numeroForm}`)
            removeCartelInformativo(objeto, numeroForm)

        } else {

            const pestanas = $(`#t${numeroForm} .selectCont`)

            $.each(pestanas, (indice, value) => {

                let valor = $(`.divSelectInput`, value).val()
                let pestanasVal = consultaPestanas[valor] || ""

                if (pestanasVal == "") {

                    $(`.inputSelect`, value).val("").trigger("change")
                }

                $(`.opcionesSelectDiv .opciones:not(.primeroVacio)`, value).remove()

                const encontrarPestColec = () => {//Solo se usa si la pestaña es colección
                    const father = $(value).closest('table, div.coleccionSimple');
                    const coleccion = father.attr('compuesto');
                    const coleccionFind = objeto.atributos.names.find(({ nombre }) => nombre === coleccion);

                    return coleccionFind?.componentes[$(value).attr('name')];

                }
                console.log(atributo)
                let atributo = objeto.atributos.names.find(e => e.nombre == $(value).attr("name")) || encontrarPestColec()
                console.log(atributo)
                let opcionesHabilitadas = consultaPestanasConOrden[atributo.origen || atributo.nombre].filter(e => e.habilitado == "true")

                $.each(atributo.ocultCond, (indice, condicion) => {

                    opcionesHabilitadas = opcionesHabilitadas.filter(e => e[condicion.atributo] == condicion.valor)

                })
                let pestanas = ""

                $.each(opcionesHabilitadas, (ind, val) => {

                    pestanas += `<div class="opciones" valueString="${val[atributo.pestRef]}" value="${val._id}"><p>${val[atributo.pestRef]}</p></div>`
                })

                $('.opcionesSelectDiv', value).append(pestanas);
                $(`.inputSelect`, value).addClass("actualizado")

            })

            setTimeout(function () {
                $(`#t${numeroForm} .inputSelect`).removeClass("actualizado");
            }, 2000);

        }
    })
    $(`#bf${numeroForm}`).on('click', `.historia:visible`, (e) => {

        const idBuscado = $(`#t${numeroForm} .tr.fila.sel .celda._id`).html()

        let registroBuscado = JSON.parse(JSON.stringify(consultaGet[numeroForm].find(element => element._id == idBuscado)))
        crearCartelHistoria(objeto, numeroForm, registroBuscado, `#t${numeroForm}`)

    })
    $(`#bf${numeroForm}`).on('change', `input.fechaTextoDeAbm, input.fechaTextoHastaAbm`, (e) => {

        e.preventDefault();
        $(`#t${numeroForm}`).remove()

        consultaGet[numeroForm] = reCrearTabla(numeroForm, objeto);

        formatoCeldas(objeto, numeroForm);
        active(numeroForm);
        eliminarDeshabilitar(objeto, numeroForm)
        signoAlternativa(objeto, numeroForm)

    })
    $(`body`).on('dblclick', `#t${numeroForm} .inputTd.des`, (e) => {//Lo pongo desde el body porque cuando recreo tabla sinodeja de funcionar

        if (Object.values(objeto.atributos?.compuesto || {})?.length == 0) {
            $(e.target).parents(`.tr`).addClass(`sel`)

            if ($(`#t${numeroForm} input.edit._id`).length > 0) {

                desabilitarRegistroEditando(objeto, numeroForm, memoriaValoreEditados)

                $(`#bf${numeroForm} span.okBoton,
                   #bf${numeroForm} span.cancelBoton,
                   #bf${numeroForm} span.recargar`).addClass("ocultoOrigen")
                $(`#bf${numeroForm} span.editBoton`).removeClass("ocultoOrigen")
                $(`#bf${numeroForm} span.editBoton`).parent().removeClass("oculto")
            }

            const tabsItem = $(`#t${numeroForm}`)

            if (tabsItem.scrollTop() > 0) {

                tabsItem.addClass(`petArriba`)
            } else {

                tabsItem.addClass("pestanaActive")
            }

            $(`#t${numeroForm} .inputTd.des`).removeClass(`des`)
            $(`#t${numeroForm} input.typeDate:not(.date)`).attr("type", "date")

            $(`#bf${numeroForm} span.okBoton,
               #bf${numeroForm} span.cancelBoton,
               #bf${numeroForm} span.recargar`).removeClass("ocultoOrigen")

            $(`#bf${numeroForm} span.desHabilitarBoton,
               #bf${numeroForm} span.deleteBoton,
               #bf${numeroForm} span.editBoton,
               #bf${numeroForm} span.historia`).addClass("ocultoOrigen")

            $(`#t${numeroForm} .tr.fila.sel`).removeClass("sel")

            formularioIndAbm = false;
            let usu = $("#oculto").val();
            e.stopPropagation();

            $(`#t${numeroForm} .inputTd p`).remove()

            $(this).removeClass("des");
            $(this).siblings("td").removeClass("des");
            $(`#t${numeroForm} .inputTd.adjunto .botonDescriptivo`).removeClass("oculto");

            //Valores iniciales de input tras doble click
            $(`#t${numeroForm} .inputR`).removeAttr("readonly");

            if (objeto.numerador != undefined) {
                console.log(1)
                numeradorActualizarAbm(objeto, numeroForm)

            }

            $(`#t${numeroForm} .inputR.username`).val(usu);
            $(`#t${numeroForm} .inputR[class*=logico][type=text] `).val(false);

            let fecha = dateNowAFechaddmmyyyy(Date.now(), `y-m-dThh`);

            $(`#t${numeroForm} .inputR.date`).val(fecha);

            const parametricas = objeto?.atributos?.names.filter(item => item instanceof Parametrica)
            parametricas.forEach((value, indice) => {

                let pestanas = prestanaFormIndividual(objeto, numeroForm, value, [], 0, {})
                $(`#t${numeroForm} .inputTd.${value.nombre} input`).remove();

                $(pestanas).appendTo(`#t${numeroForm} .inputTd.${value.nombre}`);

            });
            const parametricasMixta = objeto?.atributos?.names.filter(item => item instanceof ParametricaMixta)
            parametricasMixta.forEach((value, indice) => {

                let pestanas = prestanaFormIndividual(objeto, numeroForm, value, [], 0, {})
                $(`#t${numeroForm} .inputTd.${value.nombre} input`).remove();

                $(pestanas).appendTo(`#t${numeroForm} .inputTd.${value.nombre}`);

            });
            const parametricasPreEstab = objeto?.atributos?.names.filter(item => item instanceof ParametricaPreEstablecida)
            parametricasPreEstab.forEach((value, indice) => {

                let pestanas = prestanaFormIndividualPreEstablecida(objeto, numeroForm, value, [], 0, {})

                $(`#t${numeroForm} .inputTd.${value.nombre} input`).remove();

                $(pestanas).appendTo(`#t${numeroForm} .inputTd.${value.nombre}`);

            });
            //Agregar validacion si lo erequire
            $.each(objeto.validaciones, function (indice, value) {

                $(`#t${numeroForm} .inputR.${value.nombre || value},
                   #t${numeroForm} .inputSelect.${value.nombre || value}`).addClass("requerido");

            })
            $.each(objeto.columna, function (indice, value) {

                $(`.inputR.${value.nombre}.${numeroForm} `).addClass("doEntrada");
            })

            let valoresInciales = $(`#t${numeroForm} .inputTd[valueinicial]`)

            $.each(valoresInciales, function (indice, value) {

                $(`.inputSelect`, value).val($(value).attr("valueinicial")).trigger("change")
                $(`.inputR`, value).val($(value).attr("valueinicial")).trigger("input")

            })

            if ($(`#t${numeroForm} input.edit._id`).length > 0) {

                desabilitarRegistroEditando(objeto, numeroForm, memoriaValoreEditados)

                $(`#bf${numeroForm} span.editBoton`).parents(`div.barraForm`).removeClass("oculto")

            }
            let elemento = document.querySelector(`#t${numeroForm}`);
            elemento.scrollTop = elemento.scrollHeight;

        } else {

            $(`#bf${numeroForm} .crearBotonInd`).trigger("click")
        }
    });
    $(`body`).on('click', `#t${numeroForm} div.celda`, (e) => {//Lo pongo desde el body porque cuando recreo tabla sinodeja de funcionar

        let editando = $(`#t${numeroForm} input.edit._id`)

        if (editando.length == 0) {

            let padre = $(e.target).parents(".tr")

            if (e.ctrlKey) {

                padre.toggleClass("sel");

            } else {

                padre.toggleClass("sel");
                padre.siblings().removeClass("sel");

                ocultarEditElimi(objeto, numeroForm, padre)

                if (padre.hasClass("sel")) {

                    $(`#bf${numeroForm} span.crearBotonInd`).removeAttr(`segAtributo`)

                    $(`#bf${numeroForm} span.desHabilitarBoton,
                       #bf${numeroForm} span.deleteBoton,
                       #bf${numeroForm} span.editBoton,
                       #bf${numeroForm} span.historia`).removeClass("ocultoOrigen")

                } else {

                    if (permisObject[empresaSeleccionada?._id]?.crear?.[objeto.accion] == "false" && usu != "master") {

                        $(`#bf${numeroForm} span.crearBotonInd`).attr(`segAtributo`, `none`)
                    }


                    $(`#bf${numeroForm} span.desHabilitarBoton,
                       #bf${numeroForm} span.deleteBoton,
                       #bf${numeroForm} span.editBoton,
                       #bf${numeroForm} span.historia`).addClass("ocultoOrigen")

                }
            }
        }
    });
    $(`body`).on("change", `#t${numeroForm} input.edit:not(.valorPorFuncion), select.edit:not(.valorPorFuncion)`, (e) => {//Lo pongo desde el body porque cuando recreo tabla sinodeja de funcionar

        valoresModificados.cabecera[e.target.name] = memoriaValoreEditados[e.target.name]

        $(e.target).addClass("modificado")
    })
})