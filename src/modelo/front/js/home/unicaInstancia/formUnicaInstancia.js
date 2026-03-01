async function crearFormulario(objeto, numeroForm, consult) {//doc

    let eliminarAdjuntos = [];
    let consulta = consult || ""
    progressBarHeight(objeto, numeroForm)

    if (entidadesConsultas[objeto.nombre || objeto.accion] == undefined) {

        agregarCaractAtributos(objeto)
        seguridadAtributos(objeto)
        entidadesConsultas[objeto.nombre] = true
    }

    const promesas = [];

    $.each(objeto.pestanas, (indice, value) => {
        const key = value.origen || value.nombre;

        if (!consultaPestanas[key]) {
            promesas.push(consultasPestanaIndividual(key));
        }
    });

    await Promise.all(promesas);

    let formulario = "";

    let tipoAtributos = await tipoAtributoForm(objeto, numeroForm, consulta);
    removeProgressBarHeightForm(objeto, numeroForm)

    let valoresModificados = new Object
    let tableModificadas = new Object //Esta la hago para enviar, en editar para ver si se modifcado una linea de colección, sino se modificico no actualizo movimiento colección
    valoresModificados.tipoDeModif = $(`#t${numeroForm}`).attr("recons") || "Modificación de registro"
    //Esto es usado para historal 
    valoresModificados.cabecera = new Object
    valoresModificados.coleccion = new Object
    valoresModificados.adjunto = new Object
    valoresModificados.eliminarRef = new Object
    //////

    formulario += tipoAtributos
    formulario += `</div>`;

    let form = $(formulario);
    form.appendTo(`#t${numeroForm}`);

    $.each(objeto.ocultroAtributosSeguridad, (indice, value) => {

        $(`#t${numeroForm} .form.${value.nombre || value},
           #t${numeroForm} .tablaCompuesto.${value.nombre || value},
           #t${numeroForm} .pestana.${value.nombre || value},
           #t${numeroForm} .tablaCompuesto th.${value.nombre || value},
           #t${numeroForm} .tablaCompuesto td.${value.nombre || value},
           #t${numeroForm} .tablaCompuesto div.${value.nombre || value},
           #t${numeroForm} .tablaCompuesto div.totalColec div.${value.nombre || value},
           #t${numeroForm} .fo.${value.nombre || value},
           #t${numeroForm} input.formColec.${value.nombre || value}`).addClass("ocultoSeguridad");
    });
    $.each(objeto?.formInd?.ocultoConLugar, (indice, value) => {

        $(`#t${numeroForm} input.${value.nombre || value}`).addClass("ocultoConLugar").attr("disabled", "disabled");;

    });

    if (permisObject[empresaSeleccionada?._id]?.eliminar?.[objeto.accion] == false && usu != "master") {
        $(`#bf${numeroForm} span.deleteBoton`).attr(`segAtributo`, `none`)
        $(`#bf${numeroForm} span.desHabilitarBoton`).attr(`segAtributo`, `none`)
    }
    if (permisObject[empresaSeleccionada?._id]?.editar?.[objeto.accion] == false && usu != "master") {
        $(`#bf${numeroForm} span.editBoton`).attr(`segAtributo`, `none`)
    }

    let permisosFunc = consulta._id == undefined ? { permisos: "habilitado", fechaPermitida: "" } : permisoFechaEntidad(objeto, numeroForm)
    let permisos = permisosFunc.permisos

    let fechaPermitida = permisosFunc.fechaPermitida

    const id = $(`#t${numeroForm} input._id`).val()
    $(`#bf${numeroForm}`).on('click', '.okfPlus, .okBoton', async (e) => {
        const $btn = $(e.currentTarget);

        // evita que se dispare dos veces seguidas
        if ($btn.data('procesando')) return;
        $btn.data('procesando', true);

        try {
            let previa = $(e.target).attr("previa") || false;
            funcionesAntesdeEnviar(objeto, numeroForm)
                .then(async () => {

                    let id = $(`#t${numeroForm} input._id`).val();

                    if (id != "") {
                        const res = await enviarRegistroEditadoForm(objeto, numeroForm, valoresModificados, tableModificadas);
                        if (previa == "true") {
                            formularioIndividualImpresion(objeto, numeroForm, res.posteo);
                        }
                    } else {

                        const res = await enviarRegistroNuevoForm(numeroForm, objeto);
                        if (previa == "true") {
                            formularioIndividualImpresion(objeto, numeroForm, res.posteo);
                        }
                    }

                })
                .catch((error) => {

                });


        } catch (error) {
            console.error(error);
            throw error;

        } finally {
            // 🔹 este bloque se ejecuta siempre, haya éxito o error
            $btn.data('procesando', false);
        }
    });
    $(`#bf${numeroForm}`).on("click", `.okfBotonHistoria:not(.enEspera)`, async (e) => {//Este boton es de historia, la diferencia con el boton normal es que evalua los desencadenantes

        if (consulta.modificar != "noModificable") {

            let preFather = $(`#t${numeroForm}`).attr("preFather")
            let preNumber = ""
            let _id = ""

            valoresModificados.cabecera = consulta.valoresModHist.cabecera
            valoresModificados.coleccion = consulta.valoresModHist.coleccion
            valoresModificados.adjunto = consulta.valoresModHist.adjunto

            await enviarRegistroEditadoForm(objeto, numeroForm, valoresModificados, tableModificadas)

            $(`#formularioVistaPrevia .closeForm`).trigger("click")

            let tabla = $(`#${preFather}`).attr("tabla")
            switch (tabla) {
                case `formulario`:

                    preNumber = $(`#${preFather} div.fo._id`).attr("id").slice(7)
                    _id = $(`#${preFather} input._id`).val()

                    eliminarFormularioIndividual(objeto, numeroForm)
                    break;
                case `abm`:

                    preNumber = $(`#${preFather}`).attr("id").slice(1)

                    reCrearTabla(preNumber, objeto)
                    $(`.cartelHistorial.${preNumber}`).remove()

                    break;
                case `formularioPestana`:

                    preNumber = $(`#${preFather}`).attr("id").slice(1)
                    _id = $(`#${preFather} input._id`).val()

                    let consultPest = consultaGet[numeroForm].find(element => element._id == _id)

                    $(`.closeFormInd#${preNumber}`).trigger("click")
                    clickFormularioIndividualPestana(objeto, numeroForm, consultPest)

                    break;
            }

        } else {

            let cartel = cartelInforUnaLinea(`No se puede reconstruir registro aprobado o rechazado`, "❌", { cartel: "infoChiquito rojo", close: "ocultoSiempre" })
            $(cartel).appendTo(`#bf${numeroForm}`)
            removeCartelInformativo(objeto, numeroForm)
        }
    })
    $(`#bf${numeroForm}`).on("click", `.editBoton:not(.parcial):not(enEspera)`, (e) => {

        const editar = () => {

            if ($(`#t${numeroForm} input._id`).attr(`disabled`) && $(`#t${numeroForm} input._id`).val() != "") {

                editFormulario(objeto, numeroForm);
                botonesEditarFormInd(numeroForm)
            }
        }
        const noEditar = () => {

            let cartel = cartelInforUnaLinea(`No tiene permisos para editar registros anteriores a ${dateNowAFechaddmmyyyy(fechaPermitida, `d/m/y`)}`, "❌", { cartel: "infoChiquito rojo", close: "ocultoSiempre" })
            $(cartel).appendTo(`#bf${numeroForm}`)
            removeCartelInformativo(objeto, numeroForm)
        }
        const editarObj = {
            habilitado: editar,
            deshabilitado: noEditar
        }

        editarObj[permisos]()

    });
    $(`#bf${numeroForm}`).on("click", `.editBoton.parcial:not(enEspera)`, (e) => {

        let entidadOrigen = e.target.getAttribute("entidadorgien")
        let elementos = variablesModeloTransformar?.[entidadOrigen]?.modificableParcial

        elementos[0](objeto, numeroForm, elementos[1], elementos[2])

        $(`#bf${numeroForm} .editBoton.parcial`).removeClass("parcial")
        $(`#bf${numeroForm} .editBoton`).trigger("click")
        $(`#bf${numeroForm} .editBoton.parcial`).addClass("parcial")
    })
    $(`#bf${numeroForm}`).on("click", `span.deleteBoton:not(enEspera)`, function () {

        let deletear = () => {
            let idRegistro = $(`#t${numeroForm} input.form._id`).val();
            let pregunta = $(`#t${numeroForm} input.${objeto.key || "name"}`).val();
            popUpEliminacionFormIndividual(objeto, numeroForm, idRegistro, pregunta)

        }
        let noDeletear = () => {

            let cartel = cartelInforUnaLinea(`No tiene permisos para eliminar registros anteriores a ${dateNowAFechaddmmyyyy(fechaPermitida, `y-m-d`)}`, "❌", { cartel: "infoChiquito rojo", close: "ocultoSiempre" })
            $(cartel).appendTo(`#bf${numeroForm}`)
            removeCartelInformativo(objeto, numeroForm)
        }
        let editarObj = {
            habilitado: deletear,
            deshabilitado: noDeletear
        }
        editarObj[permisos]()
    });
    $(`#bf${numeroForm}`).on("click", `.desHabilitarBoton:not(enEspera)`, (e) => {
        e.stopPropagation();

        let idRegistro = $(`#t${numeroForm} input._id`).val();
        let estadoRegistro = $(`#t${numeroForm} input.habilitado`).val();

        if (estadoRegistro == "false") {
            estadoRegistro = true;
        } else {
            estadoRegistro = false;
        }

        habilitarDesHabilitarRegistro(objeto, numeroForm, idRegistro, estadoRegistro);
    });
    $(`#bf${numeroForm}`).on("click", `.recargar:not(enEspera)`, async (e) => {

        for (const pestana of objeto.pestanas) {

            await consultasPestanaIndividual(pestana.origen || pestana.nombre)

            let esCabcera = objeto.atributos.names.find(e => e.nombre == pestana.nombre)

            if (esCabcera) {

                let pestanasVal = $(`#t${numeroForm} .divSelectInput[name="${pestana.nombre}"]`).val()
                let tabIndex = $(`#t${numeroForm} .inputSelect.${pestana.nombre}`).attr("tabindex")
                let pestanas = prestanaFormIndividual(objeto, numeroForm, pestana, pestanasVal || "", tabIndex, { clase: "form" })

                $(`#t${numeroForm} .selectCont.${pestana.nombre}`).remove()
                $(pestanas).appendTo(`#t${numeroForm} div.fo.${pestana.nombre}`)

                $(`#t${numeroForm} .inputSelect.${pestana.nombre}`).addClass("actualizado")
            } else {

                let selects = $(`#t${numeroForm} tr:not(.last) .inputSelect.${pestana.nombre}`)
                $.each(selects, (indice, select) => {

                    let fila = $(select).parents("tr")
                    let tabIndex = $(select).attr("tabindex")
                    let pestanasVal = $(`.divSelectInput[name="${select.nombre}"]`, fila).val()

                    let pestanas = prestanaFormIndividual(objeto, numeroForm, pestana, pestanasVal || "", tabIndex, { clase: "formColec" })

                    $(`.selectCont.${pestana.nombre}`, fila).remove()
                    $(pestanas).appendTo($(`td.${pestana.nombre}`, fila))
                    $(`.inputSelect.${pestana.nombre}`, fila).addClass("actualizado")

                })
            }
        }

        setTimeout(function () {
            $(`#t${numeroForm} .inputSelect`).removeClass("actualizado");
        }, 2000);


    })
    $(`#bf${numeroForm}`).on("click", `.historia:not(enEspera)`, (e) => {

        crearCartelHistoria(objeto, numeroForm, consulta, `#t${numeroForm}`)

        $(`#t${numeroForm} .cartelHistorial`).on("click", ".closePop", (e) => {

            $(`#t${numeroForm} .cartelHistorial`).remove()

        })
    })
    $(`#bf${numeroForm} `).on("click", `.okfLupa:not(enEspera)`, (e) => {

        formularioIndividualImpresion(objeto, numeroForm, consulta);
    });
    $(`#bf${numeroForm}`).on("click", `.okfImprimir:not(enEspera)`, (e) => {

        imprimirDirecto(objeto, numeroForm, consulta)
    });
    $(`#bf${numeroForm} .signoPregunta`).on("click", (e) => {

        let detalle = ""

        let componentes = { ...listaRelaciones.componentes }
        delete componentes.desencadenantes
        delete componentes.desencadenantesColec

        $.each(componentes, (indice, value) => {


            if (consulta[value.nombre || value] != undefined && consulta[value.nombre || value] != "") {

                $.each(consulta[value.nombre || value], (ind, val) => {

                    detalle += `<li> ${objetorelac[value.nombre]}: ${val.nombre} `

                    $.each(val.mostrar, (i, v) => {

                        detalle += `${i}: ${v} `

                    })
                })
            }
        })

        detalle += `</li>`

        let cartel = cartelInforUnaLinea(`No se puede editar/eliminar porque hay registros relacionados`, "❌", { cartel: "infoChiquito rojo", close: "ocultoSiempre" })
        $(cartel).appendTo(`#bf${numeroForm}`)
        removeCartelInformativo(objeto, numeroForm)


    })
    $(`#t${numeroForm}`).on(`dblclick`, `input.form`, (e) => {
        e.preventDefault();

        let editar = () => {

            if ($(`#t${numeroForm} input._id.${numeroForm}`).attr(`disabled`) && $(`#t${numeroForm} input._id.${numeroForm}`).val() != "") {

                editFormulario(objeto, numeroForm);
                botonesEditarFormInd(numeroForm)

            }
        }
        let noEditar = () => {

            let cartel = cartelInforUnaLinea(`No tiene permisos para editar registros anteriores a ${dateNowAFechaddmmyyyy(fechaPermitida, `y-m-d`)}`, "❌", { cartel: "infoChiquito rojo", close: "ocultoSiempre" })
            $(cartel).appendTo(`#bf${numeroForm}`)
            removeCartelInformativo(objeto, numeroForm)
        }
        let editarObj = {
            habilitado: editar,
            deshabilitado: noEditar
        }
        editarObj[permisos]()

    });
    //Cartel copiar o pegar
    $(`#t${numeroForm} .tablaCompuesto`).on(`click`, `tr:not(.fltrosOcultCol):not(.last) td.menuFila`, (e) => {

        const ocultoPegar = {
            0: "oculto",
            1: ""
        }

        let father = $(e.target).parents("tr")
        let tabla = $(e.target).parents("table").attr("compuesto")
        father.addClass("seleccionadoAccion")
        father.siblings("tr").removeClass("seleccionadoAccion")
        $(`#t${numeroForm} div.cartelOpcionesColeccion`).remove()

        let cartel = `<div class="cartelOpcionesColeccion">`

        cartel += `<div class="opcion fila copiar" accion="copiar"><span class="icono">📄</span>Copiar Fila</div>`
        cartel += `<div class="opcion fila cortar" accion="cortar"><span class="icono">✂️</span> Cortar Fila</div>`
        let copiar = $(`#t${numeroForm} table.${tabla} tr.cop`)

        cartel += `<div class="opcion fila pegar ${ocultoPegar[Math.min(1, copiar?.length)]}" accion="pegar"><span class="icono">📑</span>Pegar Fila</div>`
        cartel += `</div>`

        $(cartel).appendTo(father);

        const contenedor = $(`#t${numeroForm}`);
        const offset = contenedor.offset();
        const scrollLeft = contenedor.scrollLeft();
        const scrollTop = contenedor.scrollTop();

        $(`#t${numeroForm} .cartelOpcionesColeccion`).css({
            left: e.pageX - offset.left + scrollLeft,
            top: e.pageY - offset.top + scrollTop
        });

        function cerrarCartel(e) {

            if ($(e.target).closest('td.menuFila').length > 0 || $(e.target).closest('div.cartelOpcionesColeccion').length > 0) {
                return; // clic dentro de zonas excluidas
            }

            $(`#t${numeroForm} .cartelOpcionesColeccion`).addClass("chau")
            setTimeout(() => {
                $(`#t${numeroForm} .cartelOpcionesColeccion`).remove()
            }, 1000)
            $(`#t${numeroForm} .tablaOculto`).remove()
            $(`#t${numeroForm}`).off("click", cerrarCartel)
            $(`#t${numeroForm}`).off("click", `table tr`, cerrarCartelyDeseleccionar)
            $(`#t${numeroForm}.bloqueado`).off("click", cerrarCartel)
        }
        function cerrarCartelyDeseleccionar(e) {

            if ($(e.target).closest('td.menuFila').length > 0 || $(e.target).closest('div.cartelOpcionesColeccion').length > 0) {
                return; // clic dentro de zonas excluidas
            }
            $(`#t${numeroForm} .cartelOpcionesColeccion`).addClass("chau")
            setTimeout(() => {
                $(`#t${numeroForm} .cartelOpcionesColeccion`).remove()
            }, 1000)
            $(`#t${numeroForm} tr.seleccionCo`).removeClass("seleccionCo")
            $(`#t${numeroForm} tr.seleccionadoAccion`).removeClass("copiar").removeClass("seleccionadoAccion")
            $(`#t${numeroForm} tr.copiar`).removeClass("copiar").removeClass("cop")
            $(`#t${numeroForm} tr.cortar`).removeClass("cortar").removeClass("cop")
            $(`#t${numeroForm}`).off("click", `table tr`, cerrarCartelyDeseleccionar)
            $(`#t${numeroForm}`).off("click", cerrarCartel)
            $(`#t${numeroForm}.bloqueado`).off("click", cerrarCartel)
        }
        $(`#t${numeroForm}`).on("click", cerrarCartel)
        $(`#t${numeroForm}`).on("click", `table tr`, cerrarCartelyDeseleccionar)
        $(`#t${numeroForm}.bloqueado`).on("click", cerrarCartel)
    })
    $(`#t${numeroForm}`).on("click", `.cartelOpcionesColeccion .opcion.fila.pegar`, (e) => {

        let disabled = $(`#t${numeroForm} input._id`).attr(`disabled`)

        if (!disabled) {

            let table = $(`#t${numeroForm} table.active`).attr("compuesto")
            let copiar = $(`#t${numeroForm} table.${table} tr.cop`)
            let accion = copiar.attr("accion")

            $(`#t${numeroForm} table.${table} tr`).removeClass("pegado")
            $.each(copiar, (indice, value) => {

                $.each(value.attributes, (i, attr) => {
                    if (attr.name !== "accion" && attr.name !== "class" && attr.name !== "q") {  // Filtra el atributo 'accion'

                        $(`#t${numeroForm} table.${table} tr.seleccionadoAccion`).attr(attr.name, attr.value).addClass("pegado")
                    }
                });

            })

            $.each($(`td:not(.menuFila, .idColCotizacionGemela, .position${table}, .readOnlyFuncion)`, copiar), (indice, value) => {

                let elemFinal = $("input", value)
                let name = elemFinal.attr("name")
                let valor = elemFinal.val()

                $(`#t${numeroForm} table.${table} tr.seleccionadoAccion input.${name}`).val(valor).removeClass("cop copiar cortar seleccionadoAccion validado").trigger("input").trigger("change")

            })
            $(`#t${numeroForm} .cartelOpcionesColeccion`).addClass("chau")
            setTimeout(() => {
                $(`#t${numeroForm} .cartelOpcionesColeccion`).remove()
            }, 1000)


            if (accion == "cortar") {

                $(`#t${numeroForm} table.${table} tr.cop td.delete span`).trigger("click")
                $(`#t${numeroForm} table.${table} tr.cop`).removeClass("cop copiar cortar seleccionadoAccion  pegado").removeAttr("accion")

            } else {

                $(`#t${numeroForm} table.${table} tr`).removeClass("cop copiar cortar seleccionadoAccion  pegado").removeAttr("accion")

            }

        } else {

            let tabla = $(e.target).parents("table")
            let titulo = "No se puede pegar"
            let mensaje = "No se puede pegar registros en formularios que no esta en edición"
            let cartel = cartelAdvertenciaRojo(titulo, mensaje)

            $(cartel).appendTo(tabla)

            let offsetPadre = $(`#t${numeroForm}`).offset(); // contenedor relativo
            let offsetIntermedio = $(`#t${numeroForm} .tableCol`).offset();

            let left = offsetIntermedio.left - offsetPadre.left + ($(`#t${numeroForm} .tableCol`).outerWidth() / 2) - ($(`#t${numeroForm} .cartelRojoAdvertencia`).outerWidth() / 2);
            let top = offsetIntermedio.top - offsetPadre.top // un poco más abajo

            $(`#t${numeroForm} .cartelRojoAdvertencia`).css({
                position: 'absolute',
                left: left,
                top: top // o top calculado como antes si querés verticalmente centrado también
            });

            $(`#t${numeroForm} table tr`).trigger("click")

        }
    })
    $(`#t${numeroForm}`).on("click", `.cartelOpcionesColeccion .opcion.fila.copiar, .cartelOpcionesColeccion .opcion.fila.cortar`, (e) => {

        let accion = $(e.currentTarget).attr("accion")
        let tabla = $(e.target).parents("table")


        $(` tr.seleccionadoAccion`, tabla).removeAttr("accion").removeClass("seleccionadoAccion copiar cortar").addClass(`${accion} cop`).attr("accion", `${accion}`)
        $(`#t${numeroForm} .cartelOpcionesColeccion`).addClass("chau")
        setTimeout(() => {

            $(`#t${numeroForm} .cartelOpcionesColeccion`).remove()
        }, 1000)
    })
    //Funciones de colecciones
    $(`#t${numeroForm} .tablaCompuesto`).on(`dblclick`, `tr.last td.vacio`, (e) => {

        const editCompuesto = () => {

            if ($(`#t${numeroForm} input._id`).attr(`disabled`)) {
                editFormulario(objeto, numeroForm);
                botonesEditarFormInd(numeroForm)
            }

            let elemento = $(e.target).parents("table");
            let id = $(elemento).attr("id").slice(2);

            let input = $$$(`input`, e.target) || $(`textarea`, e.target)

            let ord = parseFloat($(input).attr(`ord`));

            editarCompuestoFormInd(objeto, numeroForm, id, input, ord);
        }
        const noEditCompuesto = () => {

            let cartel = cartelInforUnaLinea(`No tiene permisos para editar registros anteriores a ${dateNowAFechaddmmyyyy(fechaPermitida, `y-m-d`)}`, "❌", { cartel: "infoChiquito rojo", close: "ocultoSiempre" })
            $(cartel).appendTo(`#bf${numeroForm}`)
            removeCartelInformativo(objeto, numeroForm)
        }
        const lastObj = {
            habilitado: editCompuesto,
            deshabilitado: noEditCompuesto
        }

        lastObj[permisos]()
    });
    $(`#t${numeroForm}`).on(`dblclick`, `div.tableCol td.comp`, (e) => {

        let editComp = () => {

            if ($(`#t${numeroForm} input._id`).attr(`disabled`)) {
                editFormulario(objeto, numeroForm);
                botonesEditarFormInd(numeroForm)
            }
        }
        let noEditComp = () => {

            let cartel = cartelInforUnaLinea(`No tiene permisos para editar registros anteriores a ${dateNowAFechaddmmyyyy(fechaPermitida, `y-m-d`)}`, "❌", { cartel: "infoChiquito rojo", close: "ocultoSiempre" })
            $(cartel).appendTo(`#bf${numeroForm}`)
            removeCartelInformativo(objeto, numeroForm)
        }
        let compObj = {
            habilitado: editComp,
            deshabilitado: noEditComp
        }
        compObj[permisos]()
    });
    $(`#t${numeroForm}`).on(`click`, `td.delete span`, (e) => {

        let deleteComp = () => {

            if ($(`#t${numeroForm} input._id`).attr(`disabled`)) {
                editFormulario(objeto, numeroForm);
                botonesEditarFormInd(numeroForm)
            }

            if (($(`#t${numeroForm} input._id`).val() != "") && !($(e.target).parents("tr").hasClass("vacio")) && !($(e.target).parents("tr").hasClass("creado"))) {

                const fila = $(e.target).parents("tr").attr("q")
                const table = $(e.target).parents("table").attr("compuesto")
                const indiceDelObjeto = consulta?.[`position${table}`]?.indexOf(fila) || fila

                $.each(Object.keys(objeto.atributos.compuesto[table].componentes), (indice, value) => {

                    valoresModificados.coleccion[value] = valoresModificados.coleccion[value] || {};
                    const dato = consulta?.[value]?.[indiceDelObjeto];
                    valoresModificados.coleccion[value][fila] = dato ?? "";

                })
                $(e.target).addClass("modificado")
            }

            let objetoEliminar = deleteCompuesto(objeto, numeroForm, e.target);

            if (Object.values(objetoEliminar.valorEliminar).length > 0) {

                $.each(consulta?.referencias?.desencadenantesColec, (indice, value) => {

                    if (value._id == objetoEliminar.valorEliminar._id) {
                        valoresModificados.eliminarRef[`referencias.desencadenantesColec.${indice}`] = ""
                    }
                })
            }

            eliminarAdjuntos.push(objetoEliminar.adjunto);

        }
        let noDeleteComp = () => {

            let cartel = cartelInforUnaLinea(`No tiene permisos para editar registros anteriores a ${dateNowAFechaddmmyyyy(fechaPermitida, `y-m-d`)}`, "❌", { cartel: "infoChiquito rojo", close: "ocultoSiempre" })
            $(cartel).appendTo(`#bf${numeroForm}`)
            removeCartelInformativo(objeto, numeroForm)
        }
        let delCompObj = {
            habilitado: deleteComp,
            deshabilitado: noDeleteComp
        }
        delCompObj[permisos]()
    });
    //Botones de Adjunto
    $(`#t${numeroForm}`).on("click", `img.eliminarAdj`, (e) => {

        let fila = $(e.target).parents("div.tr").attr("fila")
        let ultimaFila = $(`div.tr:last`, $(e.target).parents("div.listadoAdjunto")).attr("fila")

        let eliminarAdja = () => {

            if ($(`#t${numeroForm} input._id`).attr(`disabled`) && $(`#t${numeroForm} input._id`).val() != "") {

                editFormulario(objeto, numeroForm);
                botonesEditarFormInd(numeroForm)
            }

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


                valoresModificados.adjunto.nameUsu = valoresModificados.adjunto.nameUsu || {};
                valoresModificados.adjunto.nameUsu[fila] = consulta?.nameUsu?.[fila] ?? {};

                valoresModificados.adjunto.path = valoresModificados.adjunto.path || {};
                valoresModificados.adjunto.path[fila] = consulta?.path?.[fila] ?? {};

                valoresModificados.adjunto.originalname = valoresModificados.adjunto.originalname || {};
                valoresModificados.adjunto.originalname[fila] = consulta?.originalname?.[fila] ?? {};

                $(`#t${numeroForm} div.tr[fila=${fila}]`).remove()

                if ($(`#t${numeroForm} input.nameUsu`).length == 1) {
                    $(`#t${numeroForm} div.listadoAdjunto .tr.filaVacia input`).removeAttr("disabled")

                }
            }
        }
        let noEliminarAdj = () => {

            let cartel = cartelInforUnaLinea(`No tiene permisos para editar registros anteriores a ${dateNowAFechaddmmyyyy(fechaPermitida, `y-m-d`)}`, "❌", { cartel: "infoChiquito rojo", close: "ocultoSiempre" })
            $(cartel).appendTo(`#bf${numeroForm}`)
            removeCartelInformativo(objeto, numeroForm)
        }
        let eliminarAdj = {
            habilitado: eliminarAdja,
            deshabilitado: noEliminarAdj
        }
        eliminarAdj[permisos]()

    });
    $(`#t${numeroForm}`).on("change", `input.nameUsu`, (e) => {

        let editarAdja = () => {

            if ($(`#t${numeroForm} input._id.${numeroForm}`).attr(`disabled`) && $(`#t${numeroForm} input._id.${numeroForm}`).val() != "") {

                editFormulario(objeto, numeroForm);
                botonesEditarFormInd(numeroForm)

            }
        }
        let noEditarAdj = () => {

            let fila = $(e.target).parents(".td").attr("fila")
            $(e.target).val(consulta.nameUsu[fila])

            let cartel = cartelInforUnaLinea(`No tiene permisos para editar registros anteriores a ${dateNowAFechaddmmyyyy(fechaPermitida, `y-m-d`)}`, "❌", { cartel: "infoChiquito rojo", close: "ocultoSiempre" })
            $(cartel).appendTo(`#bf${numeroForm}`)
            removeCartelInformativo(objeto, numeroForm)
        }

        let editarAdj = {
            habilitado: editarAdja,
            deshabilitado: noEditarAdj
        }
        editarAdj[permisos]()
    })
    $(`#t${numeroForm}`).on("change", "input.adjunto, input.adjuntoColec", (e) => {

        const nombreDescriptivo = () => {

            if ($(`#t${numeroForm} input._id`).attr(`disabled`)) {
                editFormulario(objeto, numeroForm);
                botonesEditarFormInd(numeroForm)
            }

            let valorAdjunto = $(e.target).val();
            let file = e.target.files[0];

            let fatherFila = $(e.target).parents("div.tr.fila")
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

                $(`input.nameUsu`, fatherFila).val(nombreSugerido).addClass("adjuntado").removeAttr("disabled")

                if (esWord || esExcel) {

                    let cartel = cartelInforUnaLinea("Los archivos formato excel o word son convertidos a pdf", "", { cartel: "infoChiquito ", close: "ocultoSiempre" })
                    $(cartel).appendTo(`#bf${numeroForm}`)
                    removeCartelInformativo(objeto, numeroForm)

                }
            }
        }
        const noNombreDescriptivo = () => {

            let fila = $(e.target).parents(".td").attr("fila")

            $(`#t${numeroForm} div.td[fila=${fila}] input.nameUsu`).val(consulta.nameUsu[fila] || "")

            let cartel = cartelInforUnaLinea(`No tiene permisos para editar registros anteriores a ${dateNowAFechaddmmyyyy(fechaPermitida, `y-m-d`)}`, "❌", { cartel: "infoChiquito rojo", close: "ocultoSiempre" })
            $(cartel).appendTo(`#bf${numeroForm}`)
            removeCartelInformativo(objeto, numeroForm)
        }
        const editarAdjNa = {
            habilitado: nombreDescriptivo,
            deshabilitado: noNombreDescriptivo
        }
        editarAdjNa[permisos]()
    })
    $(`#t${numeroForm}`).on("click", "img.agregarFila", (e) => {

        const agregarFila = () => {

            const fila = parseFloat($(e.target).parents("div.tr").attr("fila")) + 1
            const table = $(e.target).parents("div.contenido")

            if ($(`#t${numeroForm} input._id`).attr(`disabled`)) {
                editFormulario(objeto, numeroForm);
                botonesEditarFormInd(numeroForm)
            }

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

        }
        const noAgregarFila = () => {

            let cartel = cartelInforUnaLinea(`No tiene permisos para editar registros anteriores a ${dateNowAFechaddmmyyyy(fechaPermitida, `y-m-d`)}`, "❌", { cartel: "infoChiquito rojo", close: "ocultoSiempre" })
            $(cartel).appendTo(`#bf${numeroForm}`)
            removeCartelInformativo(objeto, numeroForm)
        }
        const agregarFi = {
            habilitado: agregarFila,
            deshabilitado: noAgregarFila
        }
        agregarFi[permisos]()

    })
    $(`#t${numeroForm} div.listaNoEditable.fo`).on("click", `div.individual`, (e) => {

        let father = $(e.target).parents(`div.individual`)
        let objetoNombre = $(`.entidadDest`, father).html()
        const _id = $(`._id`, father).html()

        const filtros = `&filtros=${JSON.stringify({ _id })}`

        $.ajax({
            type: "get",
            async: false,
            url: `/get?base=${objetoNombre}${filtros}`,
            //Before sending the request, set the cursor to "wait" mode
            beforeSend: function (data) {
                //Change the mouse cursor to a wait icon
                mouseEnEsperaForm(objeto, numeroForm)
            },
            success: function (data) {
                // Obtain the first element from the data array as the consulta
                consulta = data[0];

                // Retrieve or create the merged object for the given objetoNombre
                let objetoDest = variablesModelo[objetoNombre] || variablesFusionadas[objetoNombre]

                // Trigger the individual tab click with the merged object and consulta
                clickFormularioIndividualPestana(objetoDest, numeroForm, consulta);

                // Remove the waiting cursor from the form
                quitarEsperaForm(objeto, numeroForm);

                // Scroll the window back to the top
                window.scrollTo(0, 0);
            },
            error: function (error) {
                console.log(error);
            }
        })
    })
    $(`#t${numeroForm} .tableCol`).on("scroll", (e) => {

        $(`#t${numeroForm} table .selecSimulado.ubicado`).removeClass("ubicado")
        $(`#t${numeroForm} .opcionesSelectDiv:not(.oculto)`).addClass("oculto")
        document.activeElement?.blur();

    })

    validarFormulario(objeto, numeroForm);
    activePestana(objeto, numeroForm);
    renglones(objeto, numeroForm);
    eliminarDeshabilitar(objeto, numeroForm);
    totalesBaseYMoneda(objeto, numeroForm)
    funcionesFormato(objeto, numeroForm)
    sorteableTablas(objeto, numeroForm)

    $.each(objeto.validaciones, function (indice, value) {

        $(`#t${numeroForm} .form.${value.nombre || value}:not(.inputSelect)`).addClass("requerido")
        $(`#t${numeroForm} table tr input.formColec.${value.nombre || value}:not(.inputSelect)`).addClass("requerido")
    });
    $.each(objeto?.funcionesPropias?.cargar, function (indice, value) {

        value[0](objeto, numeroForm, value[1], value[2], value[3]);
    });
    $.each(objeto?.funcionesPropias?.formularioIndiv, (indice, value) => {

        value[0](objeto, numeroForm, value[1], value[2], value[3]);
    });
    $.each(objeto.atributos?.width, (indice, value) => {

        $.each(value, (ind, val) => {

            $(`#t${numeroForm} div.${val.nombre || val},
               #t${numeroForm} td.${val.nombre || val}`).attr("width", indice);

        });
    });
    $.each(objeto.atributos.clases, function (indice, value) {

        $.each(value, (ind, val) => {

            $(`#t${numeroForm} input.${val}`).addClass(indice);
        })
    });

    //Se ejecuta solo si no es edit /////////////////////////////
    if (id == "") {

        $(`#bf${numeroForm} .okfLupa,
           #bf${numeroForm} .okfImprimir`).addClass(`oculto`)

        $(`#bf${numeroForm} span.desHabilitarBoton,
           #bf${numeroForm} span.editBoton`).parent().addClass(`oculto`)

        $(`#t${numeroForm} input._id`).attr(`diasbled`, `disabled`)

        $(`#bf${numeroForm} img.historia`).addClass("oculto")
        let date = dateNowAFechaddmmyyyy(Date.now(), `y-m-dThh`)

        $(`#t${numeroForm} .form.date`).val(date);
        $(`#t${numeroForm} .form.username`).val(usu);
        ocultarBotonesNoUsados(objeto, numeroForm)

        $(`#t${numeroForm}:not(.aprobacionIndividual, [tabla="vistaPrevia"]) div.fo input[tabindex]:not([sololec], :disabled):visible:first`).trigger("focus");

        $.each(objeto?.atributos?.valorInicial?.select, (indice, value) => {

            $(`#t${numeroForm} tr.mainBody[q=0] .inputSelect.${indice}`).val(value).trigger("change")
        })

    } else {

        $(`#t${numeroForm} div.fo`).on("change", `input.form:not(.valorInicial), .inputSelect.form:not(.valorInicial)`, (e) => {

            valoresModificados.cabecera[e.target.name] = consulta[e.target.name]

            $(e.target).addClass("modificado")

        })
        $(`#t${numeroForm} table`).on("change", `input`, (e) => {//ESto lo uso para ver sis disparo de nuevos los desencadenantes de colecciones

            let fila = $(e.target).parents("tr").attr("q")
            let table = $(e.target).parents("table").attr("compuesto")

            let indiceDelObjeto = (consulta?.[`position${table}`] || []).indexOf(fila) || fila

            valoresModificados.coleccion = valoresModificados.coleccion || {};
            valoresModificados.coleccion[e.target.name] = valoresModificados.coleccion[e.target.name] || {};

            const dato = consulta?.[e.target.name]?.[indiceDelObjeto];
            valoresModificados.coleccion[e.target.name][fila] = dato ?? "Nuevo";

            tableModificadas = tableModificadas || {};
            tableModificadas[table] = tableModificadas[table] || {};
            tableModificadas[table][fila] = true;

            $(e.target).addClass("modificado")

        })
        $(`#t${numeroForm}`).on("change", `div.listadoAdjunto input`, (e) => {

            let fila = $(e.target).parents(".tr").attr("fila")
            if (e.target.name == "adjunto") {

                valoresModificados.adjunto.nameUsu = valoresModificados.adjunto.nameUsu || {};
                valoresModificados.adjunto.nameUsu[fila] = consulta?.nameUsu?.[fila] ?? "Nuevo";

                valoresModificados.adjunto.path = valoresModificados.adjunto.path || {};
                valoresModificados.adjunto.path[fila] = consulta?.path?.[fila] ?? "Nuevo";

                valoresModificados.adjunto.originalname = valoresModificados.adjunto.originalname || {};
                valoresModificados.adjunto.originalname[fila] = consulta?.originalname?.[fila] ?? "Nuevo";
            } else {

                valoresModificados.adjunto[e.target.name] = valoresModificados.adjunto[e.target.name] || {};

                const dato = consulta?.[e.target.name]?.[fila];
                valoresModificados.adjunto[e.target.name][fila] = dato ?? "Nuevo";
            }
        })
        valoresModificados.tipoDeModif = $(`#t${numeroForm}`).attr("recons") || "Modificación de registro"

        $(`span.okBoton,
                span.okfPlus,
                span.recargar`, `#bf${numeroForm}`).addClass("oculto")

        $(`#t${numeroForm} span.botonColeccion.deleteIcon`).addClass("oculto")
        $(`#t${numeroForm}:not(.aprobacionIndividual)`).addClass("bloqueado")
        signosImporteSignos(objeto, numeroForm)

    }
    valoresInicialesAppFunc(objeto, numeroForm, id)
    $.each(objeto?.funcionesPropias?.formularioIndivFinal, (indice, value) => {

        value[0](objeto, numeroForm, value[1], value[2]);
    });
    $.each(funcionesIniciales[objeto.type], (indice, value) => {

        value(objeto, numeroForm)
    })

    $(`#t${numeroForm}`).addClass(objeto?.formInd?.type || "")
    $(`#t${numeroForm} input.soloLectura`).attr("tabindex", "-1")
    $(`#t${numeroForm}`).css(`max-height`, heightTabla(numeroForm))
};
/////////////////////////////////////
async function enviarRegistroNuevoForm(numeroForm, objeto, electronica) {//doc

    let date = dateNowAFechaddmmyyyy(Date.now(), `y-m-dThh`);
    $(`#t${numeroForm} input.form.date`).val(date);
    transformarNumeroAntesEnviar(numeroForm)
    let response = null;
    try {
        if (objeto?.numerador && electronica !== true) {

            await insertarNumeradorForm(objeto, numeroForm);
        }

        const form = document.querySelector(`#f${objeto.accion}${numeroForm}`);
        const file = new FormData(form);
        file.set('mostrar', objeto?.pest);
        file.set('key', objeto?.key || 'name');
        file.set("empresa", empresaSeleccionada?._id);

        mouseEnEsperaForm(objeto, numeroForm);
        await new Promise(requestAnimationFrame);


        const resp = await fetch(`/post?base=${objeto.accion}`, { method: 'POST', body: file });
        response = await resp.json();

        if (!response?.posteo) {
            const cartel = cartelInforUnaLinea(response?.mensaje || "No se grabó el registro", "❌",
                { cartel: "infoChiquito rojo", close: "ocultoSiempre" });
            $(cartel).appendTo(`#bf${numeroForm}`);
            removeCartelInformativo(objeto, numeroForm);
            activarSacarCartel(objeto, numeroForm);
            quitarEsperaForm(objeto, numeroForm);   // ✅ añadir
            decrementarNumeradorForm(objeto, numeroForm);
            return response; // ⬅️ devolvés igual el response

        }

        const cartel = cartelInforUnaLinea(response.mensaje, "☑️",
            { cartel: "infoChiquito verde", close: "ocultoSiempre" });
        $(cartel).appendTo(`#bf${numeroForm}`);

        removeCartelInformativo(objeto, numeroForm);
        activarSacarCartel(objeto, numeroForm);

        try {
            await limpiarEnviarRegistro(objeto, numeroForm);

            if (objeto.numerador && objeto?.numerador?.type != "numeroCompuestoTrigger") {
                numeradorActualizarForm(objeto, numeroForm)

            } else {


                $(`#t${numeroForm} div.fo.numeradorCompuesto p`).html("");
            };
        } catch (e) { console.log(e); }

        if (objeto.type === "parametrica") {
            delete consultaPestanas[objeto.accion];
            delete consultaPestanasConOrden[objeto.accion];
        }

        quitarEsperaForm(objeto, numeroForm);
        let promises = []
        let valorEnviar = new Object
        valorEnviar.arrays = new Array

        $.each(objeto.desencadenante, (indice, value) => {
            value.origen = "desencadenante"
            desencadenante(value, objeto, numeroForm, response);
        })
        $.each(objeto.desencadenaColeccion, async (indice, value) => {

            value.origen = "desencadenaColeccion"
            const promise = desencadenaColec(value, objeto, numeroForm, response).then((resultado) => {

                valorEnviar._id = resultado._id
                let objetArray = {
                    arrayCompuesto: resultado.array,
                    atributosArrayCompuesto: resultado.atributosArray

                }
                valorEnviar.arrays.push(objetArray)

                valorEnviar.referencias = valorEnviar.referencias || {};

                const actual = valorEnviar.referencias["referencias.desencadenantesColec"] || {};
                const nuevo = resultado?.referencias?.["referencias.desencadenantesColec"] || {};

                valorEnviar.referencias.desencadenantesColec = { ...actual, ...nuevo };

            });

            promises.push(promise)
        })

        for (const value of Object.values(objeto.desencadenaColeccionAgrupado || [])) {
            value.origen = "desencadenaColeccionAgrupado";

            const resultado = await desencadenanteAgrupado(value, objeto, numeroForm, response);

            if (!resultado) continue; // <- rechazado: no hace nada y sigue

            valorEnviar._id = resultado._id;

            valorEnviar.arrays.push({
                arrayCompuesto: resultado.array,
                atributosArrayCompuesto: resultado.atributosArray
            });

            valorEnviar.referencias = valorEnviar.referencias || {};

            const actual = valorEnviar.referencias["referencias.desenColecAgrup"] || {};
            const nuevo = resultado?.referencias?.["referencias.desenColecAgrup"] || {};

            valorEnviar.referencias.desenColecAgrup = { ...actual, ...nuevo };

            promises.push(resultado)
        }
        $.each(objeto.child, (indice, value) => {
            value.origen = "child"
            desencadenante(value, objeto, numeroForm, response);
        })
        $.each(objeto.childColeccion, (indice, value) => {
            value.origen = "childColec"
            const promise = desencadenaColec(value, objeto, numeroForm, response).then((resultado) => {

                valorEnviar._id = resultado._id
                let objetArray = {
                    arrayCompuesto: resultado.array,
                    atributosArrayCompuesto: resultado.atributosArray

                }
                valorEnviar.arrays.push(objetArray)

                valorEnviar.referencias = valorEnviar.referencias || {};

                const actual = valorEnviar.referencias["referencias.desencadenantesColec"] || {};
                const nuevo = resultado?.referencias?.["referencias.desencadenantesColec"] || {};

                valorEnviar.referencias.childColec = { ...actual, ...nuevo };

            });
            promises.push(promise);
        })
        $.each(objeto.imputarcoleccion, (indice, value) => {
            value.origen = "imputado"
            const promise = imputacionDesdeColeccion(value, objeto, response).then((resultado) => {

                valorEnviar._id = resultado._id

                let objetArray = {
                    arrayCompuesto: resultado.array,
                    atributosArrayCompuesto: resultado.atributosArray

                }
                valorEnviar.arrays.push(objetArray)

                $.extend(true, valorEnviar, { referencias: { imputado: Object.assign(valorEnviar?.referencias?.["referencias.imputado"] || {}, resultado?.referencias?.["referencias.imputado"] || {}) } });
            });
            promises.push(promise)
        })
        $.each(objeto.acumulador, (indice, value) => {

            acumuladorUpdate(value, response, objeto)
        })

        if (promises.length > 0) {
            Promise.allSettled(promises).then((resultado) => {//Esto se hace para enviar un solo grabar  datos en origen, ya qub 

                actualizarOrigenColeccion(valorEnviar, objeto)

            }).catch((error) => {

                console.log(error);
            });
        }
        reCrearporIngresoDeRegistro(objeto, numeroForm)

    } catch (err) {
        console.error("❌ Error en fetch:", err);
        const cartel = cartelInforUnaLinea("Error de red o servidor", "❌",
            { cartel: "infoChiquito rojo", close: "ocultoSiempre" });
        $(cartel).appendTo(`#bf${numeroForm}`);
        response = { tipo: 'error', mensaje: 'Error de red o servidor' };
    } finally {
        quitarEsperaForm(objeto, numeroForm);   // ✅ garantiza limpiar cursor siempre
    }
    return response;
};
function enviarUsuarioNuevoForm(numeroForm, objeto) {//doc

    let date = dateNowAFechaddmmyyyy(Date.now(), `y-m-dThh`);
    $(`#t${numeroForm} .form.date`).val(date);

    let accion = objeto.accion;
    let file = new FormData($(`#f${accion}${numeroForm}`)[0]);

    file.set(`mostrar`, objeto.pest)
    file.set(`key`, objeto.key || "name")

    $.ajax({
        type: "POST",
        url: `users/post`,
        data: file,
        async: false,
        contentType: false,
        processData: false, // tell jQuery not to process the data
        beforeSend: function (data) {

            mouseEnEsperaForm(objeto, numeroForm)

        },
        complete: function (data) {
        },
        success: function (response) {


            let promises = []
            let valorEnviar = new Object
            valorEnviar.arrays = new Array

            if (response.posteo != undefined) {

                $.each(objeto.desencadenante, (indice, value) => {
                    value.origen = "desencadenante"
                    desencadenante(value, objeto, numeroForm, response);
                })
                $.each(objeto.desencadenaColeccion, async (indice, value) => {

                    const promise = desencadenaColec(value, objeto, numeroForm, response).then((resultado) => {

                        valorEnviar._id = resultado._id
                        let objetArray = {
                            arrayCompuesto: resultado.array,
                            atributosArrayCompuesto: resultado.atributosArray

                        }
                        valorEnviar.arrays.push(objetArray)

                        $.extend(true, valorEnviar, { referencias: { desencadenantesColec: Object.assign(valorEnviar?.referencias?.["referencias.desencadenantesColec"] || {}, resultado?.referencias?.["referencias.desencadenantesColec"] || {}) } });

                    });

                    promises.push(promise)
                })
                $.each(objeto.child, (indice, value) => {
                    value.origen = "child"
                    desencadenante(value, objeto, numeroForm, response);
                })
                $.each(objeto.imputarcoleccion, (indice, value) => {
                    value.origen = "imputado"
                    const promise = imputacionDesdeColeccion(value, objeto, response).then((resultado) => {

                        valorEnviar._id = resultado._id

                        let objetArray = {
                            arrayCompuesto: resultado.array,
                            atributosArrayCompuesto: resultado.atributosArray

                        }
                        valorEnviar.arrays.push(objetArray)

                        $.extend(true, valorEnviar, { referencias: { imputado: Object.assign(valorEnviar?.referencias?.["referencias.imputado"] || {}, resultado?.referencias?.["referencias.imputado"] || {}) } });
                    });
                    promises.push(promise)
                })

                $.each(objeto.acumulador, (indice, value) => {

                    acumuladorUpdate(value, response, objeto)
                })


                let cartel = cartelInforUnaLinea(response.mensaje, "✔️", { cartel: "infoChiquito verde", close: "ocultoSiempre" })
                $(cartel).appendTo(`#bf${numeroForm}`)
                removeCartelInformativo(objeto, numeroForm)

                limpiarEnviarRegistro(objeto, numeroForm).then((resultado) => {

                    if (objeto.numerador != undefined) {
                        numeradorActualizarForm(objeto, numeroForm)
                    }


                }).catch((error) => {

                    console.log(error);
                    throw error;
                });


                if (promises.length > 0) {
                    Promise.allSettled(promises).then((resultado) => {//Esto se hace para enviar un solo grabar  datos en origen, ya qub 

                        actualizarOrigenColeccion(valorEnviar, objeto)


                    }).catch((error) => {

                        console.log(error);
                        throw error;
                    });
                }

            } else {
                let key = Object.keys(response.keyValue);

                let cartel = cartelInforUnaLinea(`El ${key[0]} ${response.keyValue[key[0]]} ya fue registrado`, "❌", { cartel: "infoChiquito rojo", close: "ocultoSiempre" })
                $(cartel).appendTo(`#bf${numeroForm}`)
                removeCartelInformativo(objeto, numeroForm)

                $(`#t${numeroForm} div.fo.${key[0]} input`).css(`background-color`, `rgb(199, 94, 94)`
                );
                activarSacarCartel(objeto, numeroForm)
                quitarEsperaForm(objeto, numeroForm)

                $(`#t${numeroForm} div.fo.${key[0]} input`).on(`focus`, function () {
                    $(this).css(`background-color`, `rgb(235, 233, 2 36)`);
                });
            }

        },
        error: function (error) {
            console.log(error);
        },
    });
};
async function enviarRegistroEditadoForm(objeto, numeroForm, modificar, tableModificadas) {//doc

    let date = dateNowAFechaddmmyyyy(Date.now(), `y-m-dThh`);
    $(`#t${numeroForm} input.form.date`).val(date);

    $(`#t${numeroForm} div.fo input.noEditable`).removeAttr(`disabled`);//Esto no editable parcial como confirmar embaque
    $(`#t${numeroForm} tr:not(.last) input.noEditable`).removeAttr(`disabled`);//Esto no editable parcial como confirmar embaque
    transformarNumeroAntesEnviar(numeroForm)

    const form = document.querySelector(`#f${objeto.accion}${numeroForm}`);
    const file = new FormData(form);

    file.set("descripcionEnvio", modificar.tipoDeModif);
    delete modificar.tipoDeModif
    file.set("unset", JSON.stringify(modificar.eliminarRef || {}));
    delete modificar.eliminarRef
    file.set("modificaciones", JSON.stringify(modificar));
    file.set("empresa", empresaSeleccionada?._id);

    mouseEnEsperaForm(objeto, numeroForm);
    await new Promise(requestAnimationFrame);
    let response = null;

    try {
        const resp = await fetch(`/put?base=${objeto.accion}`, { method: 'PUT', body: file });

        response = await resp.json();

        if (!response?.posteo) {
            const cartel = cartelInforUnaLinea(response?.mensaje || "No se grabó el registro", "❌",
                { cartel: "infoChiquito rojo", close: "ocultoSiempre" });
            $(cartel).appendTo(`#bf${numeroForm}`);
            removeCartelInformativo(objeto, numeroForm);
            activarSacarCartel(objeto, numeroForm);
            quitarEsperaForm(objeto, numeroForm);   // ✅ añadir
            decrementarNumeradorForm(objeto, numeroForm);
            return response; // ⬅️ devolvés igual el response

        }

        const cartel = cartelInforUnaLinea(response.mensaje, "☑️",
            { cartel: "infoChiquito verde", close: "ocultoSiempre" });
        $(cartel).appendTo(`#bf${numeroForm}`);

        removeCartelInformativo(objeto, numeroForm);
        activarSacarCartel(objeto, numeroForm);

        try {
            let id = $(`#t${numeroForm} input._id`).val()
            if (id?.length > 0 && (permisObject[empresaSeleccionada?._id]?.crear?.[objeto.accion] == false && usu != "master")) {
                funcionCerrar($(`.closeFormInd#${numeroForm} `))

            } else {

                limpiarEnviarRegistro(objeto, numeroForm)
                quitarEsperaForm(objeto, numeroForm)
            }

            if (objeto.numerador && objeto?.numerador?.type != "numeroCompuestoTrigger") {
                numeradorActualizarForm(objeto, numeroForm)

            } else {

                $(`#t${numeroForm} div.fo.numeradorCompuesto p`).html("");
            };

        } catch (e) { console.log(e); }

        // Si es paramétrica, invalidar caches
        if (objeto.type === "parametrica") {
            delete consultaPestanas[objeto.accion];
            delete consultaPestanasConOrden[objeto.accion];
        }

        quitarEsperaForm(objeto, numeroForm);
        let promises = []
        let valorEnviar = new Object
        valorEnviar.arrays = new Array

        $.each(objeto.desencadenante, (indice, value) => {
            value.origen = "desencadenante"
            desencadenante(value, objeto, numeroForm, response, "put");
        })
        $.each(objeto.desencadenaColeccion, async (indice, value) => {
            value.origen = "desencadenaColeccion"
            const promise = desencadenaColec(value, objeto, numeroForm, response, tableModificadas).then((resultado) => {

                valorEnviar._id = resultado._id
                let objetArray = {
                    arrayCompuesto: resultado.array,
                    atributosArrayCompuesto: resultado.atributosArray

                }
                valorEnviar.arrays.push(objetArray)

                $.extend(true, valorEnviar, { referencias: { desencadenantesColec: Object.assign(valorEnviar?.referencias?.["referencias.desencadenantesColec"] || {}, resultado?.referencias?.["referencias.desencadenantesColec"] || {}) } });
            });

            promises.push(promise)
        })

        for (const value of Object.values(objeto.desencadenaColeccionAgrupado || [])) {
            value.origen = "desencadenaColeccionAgrupado";

            const resultado = await desencadenanteAgrupado(value, objeto, numeroForm, response);

            if (!resultado) continue; // <- rechazado: no hace nada y sigue

            valorEnviar._id = resultado._id;

            valorEnviar.arrays.push({
                arrayCompuesto: resultado.array,
                atributosArrayCompuesto: resultado.atributosArray
            });

            $.extend(true, valorEnviar, {
                referencias: {
                    desenColecAgrup: Object.assign(
                        valorEnviar?.referencias?.["referencias.desenColecAgrup"] || {},
                        resultado?.referencias?.["referencias.desenColecAgrup"] || {}
                    )
                }
            });

            promises.push(resultado)
        }
        $.each(objeto.acumulador, (indice, value) => {

            acumuladorUpdateEdit(value, response, objeto)
        })
        $.each(objeto.imputarcoleccion, (indice, value) => {
            value.origen = "imputado"
            const promise = imputacionDesdeColeccion(value, objeto, response).then((resultado) => {

                valorEnviar._id = resultado._id

                let objetArray = {
                    arrayCompuesto: resultado.array,
                    atributosArrayCompuesto: resultado.atributosArray

                }
                valorEnviar.arrays.push(objetArray)

                $.extend(true, valorEnviar, { referencias: { imputado: Object.assign(valorEnviar?.referencias?.["referencias.imputado"] || {}, resultado?.referencias?.["referencias.imputado"] || {}) } });
            });
            promises.push(promise)
        })

        if (promises?.length > 0) {
            Promise.allSettled(promises).then((resultado) => {//Esto se hace para enviar un solo grabar  datos en origen, ya qub 

                actualizarOrigenColeccion(valorEnviar, objeto)
                reCrearporIngresoDeRegistro(objeto, numeroForm)

            }).catch((error) => {

                console.log(error);
                throw error;
            });
        } else {
            reCrearporIngresoDeRegistro(objeto, numeroForm)
        }

    } catch (err) {
        console.error("❌ Error en fetch:", err);
        const cartel = cartelInforUnaLinea("Error de red o servidor", "❌",
            { cartel: "infoChiquito rojo", close: "ocultoSiempre" });
        $(cartel).appendTo(`#bf${numeroForm}`);
        response = { tipo: 'error', mensaje: 'Error de red o servidor' };
        throw err;
    }
    quitarEsperaForm(objeto, numeroForm);   // ✅ garantiza limpiar cursor siempre

    return response;

};
function limpiarEnviarRegistro(objeto, numeroForm) {//doc

    return new Promise((resolve, reject) => {

        $(`input:not(.username):not(.empresa),
           div.listadoAdjunto input,
           textarea`, `#t${numeroForm}`).val("").removeClass("autoCompletado").removeClass("modificado")

        $(`#t${numeroForm} .inputSelect`).trigger("change");
        $(`#t${numeroForm} input.logico`).val(false);

        $(`input.form,
           .inputSelect,  
           input.formLista, 
           textarea,
           input.formColec`, `#t${numeroForm} `).removeClass("validado modificado noEditable valorPorFuncion ocultoConLugar rojoNegativo verdePositivo transparente")

        //$(`#t${numeroForm} input.transparenteformt`).removeAttr("readonly")

        $(`#t${numeroForm} .opciones`).removeClass("seleccionado")

        $(`#t${numeroForm} div.botonDescriptivo:not(.blanquearCont)`).html("Sin Adjuntos");
        $(`#t${numeroForm} div.listadoAdjunto div.tr.fila:not(:last)`).remove()
        $(`#t${numeroForm} div.listadoAdjunto div.tr.fila`).attr("fila", 0);
        $(`#t${numeroForm} div.listadoAdjunto div.tr.fila input`).val("");

        $(`#t${numeroForm} div.fo.imagen div.vistaPrevia img`).remove();
        $(`#t${numeroForm} div.fo.imagen div.vistaPrevia`).html("Vacio");

        $(`#t${numeroForm} input[type=checkbox]`).prop(`checked`, null).trigger("change");
        $(`#t${numeroForm} .form.date`).val(dateNowAFechaddmmyyyy(Date.now(), `y-m-dThh`));
        $(`#t${numeroForm} a:visible:first`).trigger("click")

        $(`#t${numeroForm} table tr input:not(.inputPestana),
           #t${numeroForm} table tr select`).removeClass("ocultoPestana")

        $(`#t${numeroForm} div.fo.ocultoPorFunc`).removeClass("ocultoPorFunc")
        $(`#t${numeroForm} table tr:not(.last) input:not(.inputPestana)`).removeAttr("disabled")

        $(`#t${numeroForm} div.listaNoEditable`).remove()
        //Dejar en una fila la tabla adjuntos
        $(`input.nameUsu,
           input.path,
           input.originalname`, `#t${numeroForm} div.listadoAdjunto.tr.filaVacia`).attr("disabled", "disabled")

        let tables = $(`#tablaCol${objeto.accion}${numeroForm} table`);

        $.each(tables, (indice, value) => {

            $(`tr.mainBody:not(.last, :first)`, value).remove();
        });

        $.each($(`#t${numeroForm} input.valorInicial:not(.empresa)`), (indice, value) => {

            let atributo = objeto.atributos.names.find(e => e.nombre.trim() == $(value).attr("name")) || encontrarPestColec(objeto, value)
            $(value).val(typeof atributo.valorInicial === 'function' ? atributo.valorInicial() : atributo.valorInicial).trigger("change").trigger("input");
        })

        $(`#t${numeroForm} div.inputHijo:not(:last)`).remove()//remuevo todos los inputs de lista
        $(`input:not(.adjunto), select`, `#t${numeroForm}`).removeClass("modificado")

        $(`#bf${numeroForm} .botonesPest span.okBoton`).css(`display`, `flex`);
        $(`#bf${numeroForm} .botonesPest .imgB`).css(`cursor`, `pointer`);
        quitarEsperaForm(objeto, numeroForm)
        $(`#t${numeroForm} input[tabindex]:visible:first`).trigger("focus");
        resolve("ok")
        valoresInicialesAppFunc(objeto, numeroForm, "")
        $.each(objeto.atributos.valorInicial.select, (indice, value) => {

            $(`#t${numeroForm} tr.mainBody[q=0] .inputSelect.${indice}`).val(value).trigger("change")
        })
        if (objeto.type == "parametrica") {

            delete consultaPestanas[objeto.accion]
            delete consultaPestanasConOrden[objeto.accion]
        }

        $(`#t${numeroForm} input[class*=formt]`).each(function () {
            $(this).removeClass(function (_, clases) {
                return clases
                    .split(" ")
                    .filter(c => c.endsWith("formt"))
                    .join(" ");
            });
        });
    })

}
function tipoAtributoForm(objeto, numeroForm, consulta) {//doc

    const tipoDeTabla = objeto?.formInd?.type || "individual"

    const auditoria = {
        doble: tipoAtributoFormSistema,
        unWind: (objeto, numeroForm, consulta, diasbled) => {
            return `<div id="form_id${numeroForm}" class="fo _id ocultoSiempre" style="order:9999">    
                  <h2>ID</h2>
                  <input class="form _id ${numeroForm}" name="_id" value="${consulta._id}" form="f${objeto.accion}${numeroForm}" tabindex=9999 ${diasbled} />
                 </div>`
        },
        individual: tipoAtributoFormSistema
    }

    let form = "";
    let titulos = objeto?.formInd?.titulos || objeto?.atributos?.titulos;
    let accion = objeto.accion;
    let inputRenglones = objeto?.formInd?.inputRenglones || calcularRenglonesImplicitoFormIndividual(objeto.atributos.names)

    let compuesto = `<div class="compuesto ${numeroForm}" id="compuesto${accion}${numeroForm}">
        <div id="cabeceraCol${accion}${numeroForm}" class="cabeceraCol ${numeroForm}"></div>
        <div id="tablaCol${accion}${numeroForm}"class="tableCol ${numeroForm}" ></div>
        </div>`;
    let compuestoEsquel = $(compuesto);
    compuestoEsquel.appendTo(`#t${numeroForm}`);

    $.each(inputRenglones, (indice, value) => {
        form += `<div class="renglon ${indice}" renglon=${indice} reg=${value}></div>`;
    });
    let disabled = ""

    consulta?._id !== undefined && (disabled = "disabled");

    $.each(objeto.atributos.names, (indice, value) => {

        form += tipoatributoForm[value.type](objeto, numeroForm, indice, value, titulos, consulta, disabled) || tipoatributoForm.default(objeto, numeroForm, indice, value, titulos, consulta, disabled) || ""
    });

    form += auditoria[tipoDeTabla](objeto, numeroForm, consulta, disabled)

    return form

};
function editFormulario(objeto, numeroForm) {

    $(`#t${numeroForm}`).removeClass("bloqueado")

    let soloLectura = (objeto?.formInd?.soloLectura || [])?.concat(objeto.atributos?.soloLectura || [])

    /*le saco el diasbled a todos los input y text tarea del formulario individual*/
    $(`#t${numeroForm} input:not(.noEditable):not(.inputPestana):not(.adjuntoForm),
       #t${numeroForm} textarea:not(.noEditable)`).attr(`disabled`, false);

    $(`#t${numeroForm} div.botonDescriptivo,
       #t${numeroForm} img,
       #t${numeroForm} div.listadoAdjunto`).removeClass("disabled")

    /*todos los imput y text tarea le remuevo readonly True*/
    $(`#t${numeroForm} input:not(.total).form,
       #t${numeroForm} textarea,
       #t${numeroForm} #tablaCol${objeto.accion}${numeroForm} td:not(.readOnlyFuncion) input:not(.total):not(.readOnlyFuncion)`).removeAttr(`readonly`);

    //Deshabilito pestañas
    let pestanas = $(`#tablaCol${objeto.accion}${numeroForm} table`);
    $.each(pestanas, (indice, value) => {
        $(`tr.last input,
           tr.last textarea`, value).attr(`disabled`, `disabled`);
    });

    $(`#t${numeroForm} label.form.${numeroForm}`).removeAttr(`readonly`);
    $(`#t${numeroForm} td.comp label.formColec.${numeroForm}`).removeAttr(`disabled`).removeClass(`disabled`);

    $.each($(`#t${numeroForm} input.requerido:not(.inputSelect), #t${numeroForm} textarea.requerido`), function (indice, value) {

        $(value).trigger("input");
    });

    $.each(soloLectura, (indice, value) => {

        $(`#t${numeroForm} .form.${value.nombre || value},
           #t${numeroForm} .formColec.${value.nombre || value}`).prop("readonly", "true");
    })

    if ($(`#t${numeroForm} select.form.moneda`).val() == "Pesos") {
        $(`#t${numeroForm} input.form.tc,
           #t${numeroForm} input.form.importeUsd`).prop(`readonly`, `true`);
    } else {
        $(`#t${numeroForm} input.form.importeArs`).prop(`readonly`, `true`);

        $(`#t${numeroForm} input.form.importeUsd,
           #t${numeroForm} input.form.tc`).on("input", function () {

            $(`#t${numeroForm} input.form.importeArs`).val($(`#t${numeroForm} input.form.importeUsd`).val() * $(`input.form.tc`).val());
        });
    }

    $(`#t${numeroForm} .form.username`).val(usu);

    let monedas = $(`#t${numeroForm} select[class*="moneda"]:not(:disabled)`)

    $.each(monedas, (indice, value) => {

        if (consultaPestanas?.moneda[$(value).val()]?.name == "Pesos") {

            $(`input`, $(value).parent().siblings("[class*=tipoCambio]")).prop("readonly", true)
        }
    })

    $(`#t${numeroForm} .form.username`).val(usu);
    let date = dateNowAFechaddmmyyyy(Date.now(), `y-m-dThh`);
    $(`#t${numeroForm} .form.date`).val(date);
    $(`#t${numeroForm} input.empresa`).attr("disabled", "disabled")

    validarElementosExistentes(objeto, numeroForm)

};
function activePestana(objeto, numeroForm) {

    const accion = objeto.accion;

    const moveDown = (elemento) => {
        let father = $(elemento).parents("table")
        let ord = parseFloat($(elemento).attr("ord"))
        let nom = $(elemento).attr("name")
        let ultimoOrd = parseFloat($(`tr.last input[name=${nom}]`, father).attr("ord"))

        let ordDef = Math.min(ultimoOrd, (ord + 1))

        $(`input[name=${nom}][ord=${ordDef}]`).trigger("focus")
    }
    const moveUp = (elemento) => {
        let ord = parseFloat($(elemento).attr("ord"))
        let ordDef = Math.max(0, (ord - 1))
        let nom = $(elemento).attr("name")
        $(`input[name=${nom}][ord=${ordDef}]`).trigger("focus")
    }

    const moveCeldas = {
        ArrowDown: moveDown,
        ArrowUp: moveUp,

    }

    $(`#cabeceraCol${accion}${numeroForm} .pestana.colect:not(.ocultoSeguridad)`).first().addClass(`active`);
    $(`#tablaCol${accion}${numeroForm} .tablaCompuesto`).first().addClass(`active`);

    $(`#cabeceraCol${accion}${numeroForm}`).on("click", `.pestana.colect`, (e) => {

        let i = $(e.target).attr("id"); //atrapo el id de la pestaña
        let id = i.slice(2); //Le saco la "p" del Id

        $(`#cabeceraCol${accion}${numeroForm} #pe${id}`).addClass(`active`);
        $(`#cabeceraCol${accion}${numeroForm} #pe${id}`).siblings().removeClass("active");
        $(`#tablaCol${accion}${numeroForm} #pc${id}`).addClass(`active`);
        $(`#tablaCol${accion}${numeroForm} #pc${id}`).siblings().removeClass("active");
    });
};
function renglones(objeto, numeroForm) {

    let div = $(`#t${numeroForm} div.fo:not(.auditoria):not(.textoDov)`);

    let cabecera = $(`#t${numeroForm} div.cabeceraCol`);
    let compuesto = $(`#t${numeroForm} div.tableCol`);
    $(`#t${numeroForm} div.renglon[reg="compuesto"]`).append(cabecera);
    $(`#t${numeroForm} div.renglon[reg="compuesto"]`).append(compuesto);
    $(`#t${numeroForm} div.renglon[reg="compuesto"]`).addClass("compuesto")
    let renglon = 0;
    let contieneRenglon = 0;
    let inputRenglones = objeto?.formInd?.inputRenglones || calcularRenglonesImplicitoFormIndividual(objeto.atributos.names)
    let renglonesWidth = {}

    div.sort((a, b) => {
        let valor1 = a.style.order;
        let valor2 = b.style.order;

        if (parseFloat(valor1 || 0) < parseFloat(valor2 || 0)) {
            return -1;
        }
        if (parseFloat(valor1 || 0) > parseFloat(valor2 || 0)) {
            return 1;
        }
        return 0;
    });

    $.each(div, (indice, value) => {

        if (inputRenglones[renglon] > contieneRenglon) {
            $(`#t${numeroForm} div.renglon.${renglon}`).append(value);

            renglonesWidth[renglon] = Number(renglonesWidth[renglon] || 0) + Number(parseFloat(value.clientWidth));
            contieneRenglon++;
        } else {
            renglon++;

            if (isNaN(inputRenglones[renglon])) {
                contieneRenglon = 0;

                $(`#t${numeroForm} div.renglon.${renglon}`).addClass(inputRenglones[renglon]);


                renglon++;
                contieneRenglon = 1;
                $(`#t${numeroForm} div.renglon.${renglon}`).append(value);
            } else {

                contieneRenglon = 1;

                $(`#t${numeroForm} div.renglon.${renglon}`).append(value);
                renglonesWidth[renglon] = Number(renglonesWidth[renglon] || 0) + Number(parseFloat(value.clientWidth));
            }
        }
    });
    let divFullRenglon = $(`#t${numeroForm} div.fo.textoDiv`);

    if (divFullRenglon.length > 0) {
        let divFull = `<div class="renglon full divTexto" renglon="fullTexto"></div>`

        $.each(divFullRenglon, (indice, value) => {

            $(divFull).appendTo(`div.full.divTexto`);

        })
    }

    /*  $.each($(`#t${numeroForm} div.renglon:not(.auditoria, .compuesto)`), (indice, value) => {
  
          let numeroRenglon = $(value).attr("renglon")
          
          $.each($(`div.fo`, value), (ind, div) => {
  
              let width = div.clientWidth
              console.log(width)
              let anchoPorcentual = ((Number(width) * 100) / Number(renglonesWidth[numeroRenglon])).toFixed(2) - 0.01
              $(div).removeAttr("width")
              $(div).css("width", `${anchoPorcentual}%`)
  
  
  
          })
       
      })*/
};
function eliminarFormularioIndividual(objeto, numeroForm, idRegistro) {

    const preFather = $(`#t${numeroForm}`).attr("prefather")
    let numeroAnt = preFather.slice(1)

    funcionCerrar($(`.closeFormInd#${numeroForm} `))
    eliminarRegistro(objeto, numeroForm, idRegistro);
    reCrearTabla(numeroAnt, objeto);

};
function popUpEliminacionFormIndividual(objeto, numeroForm, idRegistros) {

    let eliminacion = `<div class="cartelEliminar ${numeroForm}"><h1> ¿ Desea eliminar el registro ?</h1>`;
    eliminacion += `<div class="respuestas">
    <div class="si">SI</div> <div class="no">NO</div>
    </div>
    </div>`;

    let el = $(eliminacion);

    el.appendTo(`#t${numeroForm}`);

    $(`#t${numeroForm} .no`).on("click", () => {
        $(`.cartelEliminar.${numeroForm}`).remove();

        return false;
    });

    $(`#t${numeroForm} .si`).on("click", () => {

        $(`.cartelEliminar.${numeroForm}`).remove();

        eliminarFormularioIndividual(objeto, numeroForm, idRegistros);
        $(`#cortinaNegra`).remove()

        return true;
    });
};
function popUpCerrarFormIndividualPest(objeto, numeroForm, self) {

    let eliminacion = `<div class="cartelEliminar ${numeroForm}"><h1> ¿ Desea cerrar formulario y descartar cambios ?</h1>`;

    eliminacion += `<div class="respuestas">
    <div class="si${numeroForm}">SI</div> <div class="no${numeroForm}">NO</div>
    </div>
    </div>`;

    let el = $(eliminacion);

    el.appendTo(`#t${numeroForm}`);

    const scrollTop = $(`#t${numeroForm}`).scrollTop();
    const top = scrollTop + $(`#t${numeroForm}`).height() * 0.2;

    el.css('top', `${top}px`);

    $(`#t${numeroForm} .no${numeroForm}`).on("click", () => {
        $(`.cartelEliminar.${numeroForm}`).remove();

        return false;
    });

    $(`#t${numeroForm} .si${numeroForm}`).on("click", () => {
        $(`.cartelEliminar.${numeroForm}`).remove();

        funcionCerrar(self)
        delete consultaGet[numeroForm]

        return true;
    });
};
function deshabitarValidarColec(objeto, numeroForm) {

    let key = $(`#tablaCol${objeto.accion}${numeroForm} tr`).eq(1);

    $(`input`, key).remove(`requerido`);

    if (key.attr(`comp`) == undefined) {
        $(`input, select`, key).removeClass(`requerido`);

        const comprobarLengt = function () {

            if ($(`td input.idColec`, key).val() == "") {

                let comp = $(this).attr(`colec`)
                let contadorIdColec = $(`#formulario${objeto.accion}${numeroForm} input.contadorId`).val();

                let compuesto = comp || $(this).siblings("input").attr(`colec`)

                $(`input.post`, key).val(`prePost`);
                $(`td input.idColec`, key).val(parseFloat(contadorIdColec) + 1);
                $(`td input.destinoColec`, key).val(objeto.atributos.compuesto[compuesto].titulos);
                $(`#formulario${objeto.accion}${numeroForm} input.contadorId`).val(parseFloat(contadorIdColec) + 1);
            }

            let validaciones = objeto.validaciones;
            let select = $(`select`, key)

            $.each(select, (indice, value) => {
                if ($(value).val().length == 0) {

                    $(value).addClass(`requerido`);
                    $(value).removeClass(`validado`);
                    $(value).removeAttr(`disabled`);
                }
            })

            $.each(validaciones, (indice, value) => {
                if (!($(`input.${value.nombre}`, key).attr(`disabled`) == `disabled`)) {
                    $(`input.${value.nombre}`, key).addClass(`requerido`);
                }
            });
        };
        $(key).on(`change`, `input`, comprobarLengt);
    }
};
function asignarUnidadesMedida(objeto, numeroForm, unidades) {

    $.each(unidades, (indice, value) => {

        let metrosColec = $(`#t${numeroForm} tr:not(.last) input.formColec.${value}`)

        $.each(metrosColec, (indice, val) => {

            $(val).parents("td").attr(`unidadMedida`, value)
            $(val).parents("div").attr(`unidadMedida`, value)
        })
    })

    $(`#t${numeroForm}`).on(`dblclick`, "input.position", (e) => {

        let father = $(e.target).parents("tr")
        $.each(unidades, (indice, value) => {

            let metrosColec = $(`input.formColec.${value}`, father)

            $.each(metrosColec, (indice, val) => {

                $(val).parents("td").attr(`unidadMedida`, value)

            })
        })
    })
}
function validarMediosPagos(objeto, numeroForm) {

    let validado = false;
    const totalForm = stringANumero($(`#t${numeroForm} div.fo.importeTotal input`).val())
    const totalMedioPago = stringANumero($(`#t${numeroForm} input.totalimporteTipoPago`).val())

    if (totalMedioPago == totalForm) {
        validado = true

    }
    return {

        validado,
        mensaje: "El total de los medios de pagos no coincide con el total de la transacción",

    }
}
function verificarCondicion(atributo, tipo, resultadoEsperado, fileEnviar, propiedad) {

    let valido = false

    switch (tipo) {
        case "directo":

            valido = (fileEnviar[atributo] == resultadoEsperado)

            break;
        case "propiedad":

            let objetoBuscar = consultaPestanas[atributo.nombre][fileEnviar[atributo.nombre]]

            valido = objetoBuscar[propiedad.nombre] == resultadoEsperado

            break;

    }
    return valido
}
function cabeceraFormIndividual(objeto, numeroForm) {

    if ($(`#t${numeroForm} input.form._id`).val() == "") {

        let idAnterior = $(`#t${numeroForm}`).attr("prefather")
        let numAterior = idAnterior.slice(1)

        $.each(objeto.atributos.cabeceraAbm.select, (indice, value) => {

            let valor = $(`#bf${numAterior} .inputSelect.${value.atributo.nombre}`).val()
            $(`#t${numeroForm} .inputSelect.${value.atributo.nombre}`).val(valor).trigger("change")

        })
    }
}
function valoresInicialesAppFunc(objeto, numeroForm, id) {

    if (id == "") {

        $.each(valoresIncialesApp, (indice, value) => {

            switch (indice) {
                case "select":

                    $.each(value, (ind, val) => {

                        let valorInicial =
                            Object.values(consultaPestanas?.[ind?.toLowerCase()] || {})
                                ?.find(e => e.name?.toLowerCase() === val?.toLowerCase())
                                ?.name

                        $(`#t${numeroForm}:not([tabla="vistaPrevia"]) .inputSelect.form[class*="${ind}"]:not(.notValApp)`).val(valorInicial).addClass("valorInicial").trigger("change")

                    })
                    break;
                case "coleccionSelectFirst":
                    $.each(value, (ind, val) => {

                        let tables = $(`#t${numeroForm}:not([tabla="vistaPrevia"]) table`)

                        let valorInicial =
                            Object.values(consultaPestanas?.[ind?.toLowerCase()] || {})
                                .find(e => e.name?.toLowerCase() === val.toLowerCase())
                                ?.name

                        $.each(tables, (i, v) => {

                            $(`tr[q=0] .inputSelect.formColec[class*="${ind}"]:not(.notValApp)`, v).val(valorInicial).addClass("valorInicial").trigger("change");
                            $(`.divSelectInput[name*="${ind}"]:first:not(.notValApp)`, v).addClass("valorInicial")


                        })
                    })
                    break;
            }
        })
    }

    $(`#t${numeroForm}:not([tabla="vistaPrevia"])`).on("dblclick", `input.position`, (e) => {

        let colecction = $(e.target).parents("table").attr("compuesto")
        let parentFila = $(e.target).parents("tr")

        $.each(valoresIncialesApp.coleccion, (indice, value) => {

            if (objeto.atributos.compuesto[colecction].componentes[indice] != undefined) {

                $(`input.${indice}`, parentFila).val(value).trigger("change").trigger("input")
            }
        })
    })
}
function deshabilitarRequeridoBancos(objeto, numeroForm) {

    $(`#t${numeroForm}`).on("change", `input.bancoTexto`, (e) => {

        let valor = e.target.value
        let father = $(e.target).parents("tr")

        if (valor.length > 0) {

            $(`.bancoDestino`, father).addClass("ocultoConLugar")
            $(`select.bancoDestino,
               input.bancoDestino`, father).attr("disabled", "disabled")
            $(`select.bancoDestino`, father).removeClass("requerido")


        } else {

            $(`.bancoDestino`, father).removeClass("ocultoConLugar")
            $(`select.bancoDestino`, father).removeAttr("disabled").addClass("requerido")

        }
    })
}
/*function sacarOcultoSiHayChequeSelec(objeto, numeroForm) {//esta funcion solo se usa en compuesto de pagos que tiene el logico de terceros que gralmente se usa para cheques
 
    let father = fatherId(objeto, numeroForm)
 
    const chequearCheque = (e) => {
 
        let table = $(e.target).parents("table")
 
        let valores = []
        let selects = $(`select.tipoPago`, table)
 
        $.each(selects, (indice, value) => {
            let valor = $(`option:selected`, value).attr("valuestring")
 
            valores.push(valor)
        })
 
        if (valores.includes("Cheque")) {
 
            $(`input.propio, 
               td.propio`, $("tr.last", table)).removeClass("oculto")
 
        }
    }
 
    $(`#${father} .tablaCompuesto.compuestoMedioPagosConChequeTercero`).on(`dblclick`, `tr.last td.vacio`, chequearCheque)
}*/
function calcularRenglonesImplicitoFormIndividual(atributos) {

    let numetroAtributos = atributos.length
    let renglones = Math.ceil(numetroAtributos / 5);
    let renglonesFinal = []

    while (renglones > 0) {

        renglonesFinal.push(5)
        renglones--
    }

    return renglonesFinal
}
function funcionesAntesdeEnviar(objeto, numeroForm) {//dic

    return new Promise((resolve, reject) => {

        let okEnviar = false

        let validarAlConfirmar = new Object
        validarAlConfirmar.validar = []
        validarAlConfirmar.mensaje = []
        validarAlConfirmar.detalle = []

        $.each(objeto?.funcionesPropias?.validarAlConfirmar, (indice, value) => {

            let resultado = value(objeto, numeroForm)

            validarAlConfirmar.validar.push(resultado.validado)
            validarAlConfirmar.mensaje.push(resultado.mensaje)
        })

        let valid = [];
        let requeridos = $(`#t${numeroForm} input.requerido:not(:disabled):not([readonly]):not(.ocultoConLugar):visible`)
        let requeridosTdOculto = $(`#t${numeroForm} table:not(.active):not(.notValid) td:not(.oculto):not(.ocultoConLugar) input.requerido:not(.ocultoPestana):not(:disabled):not([readonly])`)
        let totalRequeridos = (requeridos).add(requeridosTdOculto)
        $.each(totalRequeridos, function (indice, value) {

            $(value).siblings(`.contError`).remove();
            valid.push($(value).hasClass("validado"));

            if ($(value).hasClass("validado") == false) {

                let p = `<div class="contError"><p>${textoValidacion[$(value).attr("valid")] || "Campo requerido"}</p></div>`;
                let texto = $(p);

                $(`div.contError`, $(value).parents(`div.fo`)).remove();
                texto.appendTo($(value).parents(`div.fo`));
                $(`div.contError`, $(value).parents(`td`)).remove();
                texto.appendTo($(value).parents(`td`));
            }
        });

        if (valid.includes(false)) {

            let cartel = cartelInforUnaLinea("Revisar los campos en rojo", "❌", { cartel: "infoChiquito rojo", close: "ocultoSiempre" })
            $(cartel).appendTo(`#bf${numeroForm}`)
            removeCartelInformativo(objeto, numeroForm)
            confirmarImprimir = false;

        } else if (validarAlConfirmar.validar.includes(false)) {
            let cartel = cartelInforUnaLinea(validarAlConfirmar.mensaje, "❌", { cartel: "infoChiquito rojo", close: "ocultoSiempre" })
            $(cartel).appendTo(`#bf${numeroForm}`)
            removeCartelInformativo(objeto, numeroForm)

        } else {

            $.each(objeto?.funcionesPropias?.ejecutarAlconfirmar, (indice, value) => {

                value[0](objeto, numeroForm, value[1], value[2], value[3])
            })

            okEnviar = true
        }

        if (okEnviar) {
            resolve("ok")
        } else {
            reject("resject");
        }
    })
}

function posteoElectronica(objeto, numeroForm) {
    return new Promise(async (resolve, reject) => {
        try {
            let mon = {
                Pesos: "PES",
                Dolar: "DOL"
            };

            mouseEnEsperaForm(objeto, numeroForm);
            const data = {};
            let form = document.querySelector(`#f${objeto.accion}${numeroForm}`);
            const formData = new FormData(form);

            let cliente = consultaPestanas.cliente[formData.get('cliente')];
            let tipoDocumento = docTipo?.[cliente?.DocTipo?.replace(/\s+/g, '')?.toLowerCase()] || 99;
            data.DocTipo = tipoDocumento;

            if (tipoDocumento == 99 || cliente.documento == "") {
                data.DocTipo = 99;
                data.DocNro = 0;
            } else {
                data.DocNro = cliente.documento.replace(/[-.]/g, '');
            }

            let tipoDeComprobante = tiposComprobante[formData.get('tipoComprobante').replace(/\s+/g, '')?.toLowerCase()][objeto.accion];
            data.CbteTipo = tipoDeComprobante;

            let importeNeto = formData.getAll('importeNeto');
            let iva = formData.getAll('impuestoFactVentas');
            let porcent = formData.getAll('porcentaje');

            let importeNetoDef = 0;
            let ivaDef = 0;

            if (tipoDeComprobante == 1 || tipoDeComprobante == 6) {
                data.Iva = [];
                let ivas = {};

                $.each(importeNeto, (indice, value) => {
                    let neto = Number(stringANumero(value || ""));
                    let impIVA = Number(stringANumero(iva[indice] || ""));
                    let porc = stringANumero(porcent[indice] || "");
                    let idIVA = tasasImpositivas[porc || 0];

                    importeNetoDef += neto;
                    ivaDef += impIVA;

                    if (!ivas[idIVA]) ivas[idIVA] = { Id: idIVA, BaseImp: 0, Importe: 0 };
                    ivas[idIVA].BaseImp += neto;
                    ivas[idIVA].Importe += impIVA;
                });

                data.Iva = Object.values(ivas);
            } else {
                $.each(importeNeto, (i, value) => {
                    importeNetoDef += Number(stringANumero(value || ""));
                    ivaDef += Number(stringANumero(iva[i] || ""));
                });
            }

            data.ImpNeto = importeNetoDef;
            data.ImpIVA = ivaDef;

            let moneda = mon[consultaPestanas.moneda[formData.get('moneda')].name];
            data.MonId = moneda;

            let concepto = consultaPestanas.itemVenta[formData.get('itemVenta')].concepto;
            let conceptoDef = 1;

            if (concepto.includes("Servicio")) conceptoDef = 2;
            if (concepto.includes("Producto") && concepto.includes("Servicio")) conceptoDef = 3;

            if (conceptoDef > 1) {
                let fecha = formData.get('FchServDesde');
                let ano = fecha || obtenerAno(new Date());
                let mes = fecha ? fecha.slice(4, 6) : (`0${obtenerMes(new Date())}`).slice(-2);
                data.FchServDesde = formData.get('FchServDesde') || `${ano}${mes}01`;
                data.FchServHasta = formData.get('FchServHasta') || `${ano}${mes}${getLastDayOfMonth(ano, mes)}`;
                data.FchVtoPago = formData.get('FchServHasta') || `${ano}${mes}${getLastDayOfMonth(ano, mes)}`;
            }

            data.CondicionIVAReceptorId = condicionIva?.[cliente?.condicionImpositiva?.replace(/\s+/g, '')?.toLowerCase()] || 5;
            data.Concepto = conceptoDef;
            data.PtoVta = stringANumero(formData.get('ancla'));
            data.MonCotiz = stringANumero(formData.get('tipoCambio') || 1);
            data.ImpTotal = stringANumero(formData.get('importeTotal'));

            const res = await fetch('/facturaElectronica', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const resJson = await res.json();

            if (!resJson.error) {

                const numero = resJson.numeroFactura.toString().padStart(8, "0");
                const ancla = formData.get('ancla')
                const filtro = formData.get('tipoComprobante')

                $(`#t${numeroForm} input.CAE`).val(resJson.CAE);
                $(`#t${numeroForm} input.vtocae`).val(resJson.CAEFchVto);
                $(`#t${numeroForm} input[name=numerador]`).val(numero);
                $(`#t${numeroForm} div.fo.numeradorFactura p`).html(`${ancla} ${numero}`);

                let numeradorObjeto = {};
                numeradorObjeto.name = objeto.accion
                numeradorObjeto.numerador = numero
                numeradorObjeto.ancla = ancla
                numeradorObjeto.filtroUno = filtro

                try {
                    const response = await fetch('/numeradorAbosoluto', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(numeradorObjeto)
                    });

                    const data = await response.json();

                } catch (error) {
                    console.log(error);
                    throw error;
                }

                resolve({
                    cae: resJson.CAE,
                    vtocae: resJson.CAEFchVto,
                    numero
                });
            } else {
                let cartel = cartelInforUnaLinea(resJson.error, "❌", { cartel: "infoChiquito rojo", close: "ocultoSiempre" });
                $(cartel).appendTo(`#bf${numeroForm}`);
                removeCartelInformativo(objeto, numeroForm);
                reject(resJson.error);
            }
        } catch (error) {
            console.error('Error en fetch:', error);
            let cartel = cartelInforUnaLinea(error, "❌", { cartel: "infoChiquito rojo", close: "ocultoSiempre" });
            $(cartel).appendTo(`#bf${numeroForm}`);
            removeCartelInformativo(objeto, numeroForm);
            throw error;
            reject(error);

        }
    });
}
function ocultarElementosFormSistema(objeto, numeroForm) {

    $(`span.editBoton,
       span.deleteBoton,
       span.cruzBoton,
       span.okfPlus,
       span.okBoton`, `#bf${numeroForm}`).parent("div").addClass("oculto")

    $(`#t${numeroForm} div.listadoAdjunto div.tr.filaVacia,
       #t${numeroForm} div.listadoAdjunto div.celdAdj.adjunto,
       #t${numeroForm} div.listadoAdjunto div.celdAdj.eliminarAdj`).addClass("oculto")
}
const ocultarElementosFormularios = {//esto se usa en lista no editable, para cuando es no desencadenado
    child: ocultarElementosFormSistema,
    childColec: ocultarElementosFormSistema,
    desencadenantes: () => { },
    desencadenantesColec: () => { },
    desenColecAgrup: () => { },
    origenChild: () => { },
    origenDesencadenante: ocultarElementosFormSistema,
    desencAgrup: () => { },
    orDesencAgrup: ocultarElementosFormSistema,
    origenImputado: ocultarElementosFormSistema,
    noModificable: ocultarElementosFormSistema,
    imputado: () => { },
    autoImputo: () => { },
    autoImputoFull: () => { },
    autoImputoMid: () => { }
}
const tituloElementos = {
    child: "Movimiento hijo",
    desenColecAgrup: "Movimiento hijo",
    origenChild: "Origen",
    origenDesencadenante: "Origen",
    origenDesencadenanteAgrupado: "Origen",
    desencadenante: "Movimiento hijo",
    orDesencAgrup: "Origen",
    desencadenantesColec: "Movimiento hijo desde colección",
    desencAgrup: "Movimiento hijo",
    origenImputado: "Fue imputado",
    imputado: "Imputó",
}
function tipoAtributoFormSistema(objeto, numeroForm, consulta, disabled) {//dic

    let formSistema = "<div class='renglon auditoria'>";

    let objetoOcultoAutoImput = {
        true: "oculto"
    }

    $.each(consulta?.referencias, (origen, ref) => {

        ocultarElementosFormularios?.[origen]?.(objeto, numeroForm)

        formSistema += `<div class="listaNoEditable fo auditoria ${origen} linkRelacionado" style="order:${9998}">`

        formSistema += `<h2>${tituloElementos[origen]}</h2>`;
        $.each(ref, (indice, value) => {

            formSistema += `<div class="individual"><div class="individualChild"><span class="material-symbols-outlined negrita">east</span><p class=negrita>${value.nombre}:  </p>`;

            $.each(value.mostrar, (i, v) => {

                if (consultaPestanas[i] == undefined) {
                    formSistema += `<h3>${i}: </h3><p>${v} </p>`
                } else {

                    formSistema += `<h3>${i}: </h3><p>${consultaPestanas[i][v].name} </p>`
                }
            })
            formSistema += `</p>`;
            formSistema += `<div class="ocultoSiempre _id" >${value._id}</div>
                                <div class="ocultoSiempre nombreObjeto">${indice}</div>
                                <div class="ocultoSiempre type">${value.type}</div>
                                <div class="ocultoSiempre entidadDest">${value.entidad}</div></div></div>`;

        })
        formSistema += `</div>`;
    })

    let ocultoAprb = consulta?.autoImputo == undefined
    formSistema += `<div class="aprobacionesLink fo auditoria ${objetoOcultoAutoImput[ocultoAprb] || ""}" style="order:${9998}"><div class="cabecera"><h2>Aprobaciones</h2></div>`

    let aut = Object.values(consulta?.autoImputo || {}).slice(-1)

    if (aut?.[0]?.modificar == "noModificable") {

        ocultarElementosFormSistema(objeto, numeroForm)

    } else if (aut?.[0]?.modificar == "modificableParcial") {

        $(`#bf${numeroForm} span.editBoton`).addClass("parcial").attr("entidadOrgien", aut?.[0]?.nombre)
    }

    $.each(consulta?.autoImputo, (indice, value) => {

        formSistema += `<div class="listaNoEditableNoLink  ${value.nombre}" style="order:${9998}" ${widthObject[value.width] || ""} >`
        formSistema += `<h2>${value.tituloMostrar || value.titulo}:</h2>`;
        formSistema += `<div class="individual"><div class="individualChild">`;

        $.each(value.mostrar, (i, v) => {

            if (consultaPestanas[i] == undefined) {

                formSistema += `<h3>${v.titulo}: </h3><p>${v.valor} </p>`
            } else {

                formSistema += `<h3>${v.titulo}: </h3><p>${consultaPestanas[i][v.valor].name} </p>`
            }
        })

        formSistema += `</div></div>`;
        formSistema += `</div>`;
    })
    formSistema += `</div>`

    let _id = consulta._id || ""
    formSistema += `<div id="form_id${numeroForm}" class="fo auditoria _id ocultoSiempre" style="order:9999">    
                  <h2>ID</h2>
                  <input class="form _id ${numeroForm}" name="_id" value="${_id}" form="f${objeto.accion}${numeroForm}" tabindex=9999 ${disabled} />
                 </div>`;

    let valorDefDate = consulta.date || ""
    let usuarioForm = consultaPestanas?.user?.[consulta?.username]?.usernameUser || ""
    if (empresaSeleccionada == undefined) {

        crumb("empresaSeleccionada", { //18/02/2026
            estado: "undefined",
            mensaje: "empresaSeleccionada no está definida",
            valor: empresaSeleccionada,
            user: usuarioForm
        });
    }



    formSistema += `<div id="formauditoria${numeroForm}" class="fo auditoria auditoria" style="order:9999">
                  <div class="titulos"><h2>Auditoria</h2></div>
                  <div class="atributos">
                  <div class="date"><input class="form date ${numeroForm}" name="date" type="datetime-local" soloLec=true value=${dateNowAFechaddmmyyyy(valorDefDate, `y-m-dThh`)} form="f${objeto.accion}${numeroForm}" tabindex=9999 /></div>
                  <div class="username"><input class="form username ${numeroForm}" name="username" value="${usuarioForm}" idregistro="${consultaPestanas?.username?.[consulta.username]?._id || ""}" soloLec=true form="f${objeto.accion}${numeroForm}" tabindex=9999/></div>
                  <div class="empresa ocultoSiempre"><input class="form empresa ${numeroForm}" name="empresa" value="${empresaSeleccionada?._id || ""}"  soloLec=true form="f${objeto.accion}${numeroForm}" tabindex=9999/></div>
                   </div>
                  </div>`;

    let version = parseFloat(consulta?.version + 1) || 0
    formSistema += `<div id="formversion${numeroForm}" class="fo auditoria version ocultoSiempre" style="order:9999">
                  <h2>version</h2>
                  <input class="form version ${numeroForm}" name="version" value="${version}" tabindex=9999 />
                 </div>`;

    formSistema += `</div></div>`

    return formSistema

}
function botonesEditarFormInd(numeroForm) {

    $(`#bf${numeroForm} span.okBoton,
       #bf${numeroForm} span.okfPlus,
       #bf${numeroForm} span.recargar`).removeClass("oculto")

    $(`#bf${numeroForm} span.editBoton,
       #bf${numeroForm} span.okfImprimir,
       #bf${numeroForm} span.okfLupa`).addClass("oculto")
    $(`#t${numeroForm} span.botonColeccion.deleteIcon`).removeClass("oculto")
}
function insertarColeccionesGemelas(objeto, numeroForm, nombreColeccion, atributo) {

    const nombrePest = {
        0: (valorPest) => { return valorPest },
        1: (valorPest, valorAtr) => { return `${valorPest}-${valorAtr}` },
    }
    let valorAtr = ""
    let tableClonar = $(`#t${numeroForm} table[compuesto="${nombreColeccion}"]`)
    let pestanaTableClonar = $(`#t${numeroForm} a.${nombreColeccion}`)
    let ord = 0

    tableClonar.attr("ordAtr", ord)//relaciono la tabla con el primer atributo
    pestanaTableClonar.attr("ordAtr", ord)//rela    ciono la pestana con el primer atributo

    //Clonamiento y tratamiento de pestaña
    let idPestClonar = pestanaTableClonar.attr("id")
    const valorPest = pestanaTableClonar.html();
    //Clonamiento y tratamiento de table
    let idTableClonar = tableClonar.attr("id")
    ////////////////////////////////////////

    const agregarTablaDin = (e) => {

        valorAtr = $(e.target).val()
        let ord = $(e.target).attr("ord")

        if ($(`#t${numeroForm} table[ordAtr="${ord}"]`).length == 0) {

            //Clonamiento y tratamiento de pestaña
            let pestanaClonada = pestanaTableClonar.clone(true)

            pestanaClonada.html(`${valorPest}-${valorAtr}`).attr("id", `${idPestClonar}-${ord}`).attr("ordAtr", ord).removeClass("active")
            //Clonamiento y tratamiento de table
            let tablaClonada = tableClonar.clone(true)
            let lengthTabla = $(`tr`, tablaClonada).length

            if (lengthTabla > 3) {

                tablaClonada.find('tr.mainBody:not(:first, .last )').remove();
            }

            tablaClonada.attr("id", `${idTableClonar}-${ord}`).attr("ordAtr", ord).removeClass("active")
            $(`tr`, tablaClonada).removeClass("seleccionadoAccion copiar cop cortar").removeAttr("accion")

            $(`#cabeceraCol${objeto.accion}${numeroForm}`).append(pestanaClonada)
            $(`#tablaCol${objeto.accion}${numeroForm}`).append(tablaClonada)

            tablaClonada.find('input').each(function () {

                $(this).val('').trigger("input").trigger("change");
            });

            let valoresInciales = Object.entries(objeto?.atributos?.valoresIniciales?.coleccion || {})
            let valoresIncialesSelect = { ...objeto?.atributos?.valoresIniciales?.select || {} }
            let valoresIncialesFiltrado = valoresInciales.filter(([key, value]) => value.coleccion == nombreColeccion);

            $.each(valoresIncialesFiltrado, (indice, value) => {

                $(`input[name="${value[0]}"`, tablaClonada).val(value[1].valor)

            })
            $.each(valoresIncialesSelect, (ind, val) => {

                let valor = $(`select.${ind} option[valuestring="${val}"]`, tablaClonada).val()
                $(`select.${ind}`, tablaClonada).val(valor).addClass("valorInicial").trigger("change")

            })
            $(`input.idColCotizacionGemela:first`, `#t${numeroForm} table.${nombreColeccion}[ordAtr="${ord}"]`).val(valorAtr)


        } else {

            $(`#t${numeroForm} a.${nombreColeccion}[ordAtr="${ord}"]`).html(nombrePest[Math.min(1, valorAtr?.length || 0)](valorPest, valorAtr))
            let inputsID = $(`input.idColCotizacionGemela`, `#t${numeroForm} table.${nombreColeccion}[ordAtr="${ord}"]`)

            $.each(inputsID, (indice, value) => {

                $(value).val(valorAtr)

            })
        }
    }
    const deleteColecAgre = (e) => {

        let father = $(e.target).parents(`.inputHijo`)
        let valorOrd = $(`input`, father).attr("ord")

        if ($(`#t${numeroForm} a[ordatr="${valorOrd}"]`).hasClass("active")) {

            $(`#t${numeroForm} a[ordatr="${valorOrd}"]`).prev().addClass("active")
            $(`#t${numeroForm} table[ordatr="${valorOrd}"]`).prev().addClass("active")
        }
        $(`#t${numeroForm} table[ordatr="${valorOrd}"]`).remove()
        $(`#t${numeroForm} a[ordatr="${valorOrd}"]`).remove()
    }
    const valorInicialId = (e) => {

        let ordAtr = $(e.target).parents("table").attr("ordatr")
        let valorAtrCol = $(`#t${numeroForm} input.${atributo}[ord="${ordAtr}"]`).val()

        $(`input.idColCotizacionGemela`, $(e.target).parents("tr")).val(valorAtrCol)

    }

    $(`#t${numeroForm} table[compuesto="${nombreColeccion}"]`).on("dblclick", `tr.last td.vacio`, valorInicialId)
    $(`#t${numeroForm}`).on("change", `input.${atributo}`, agregarTablaDin)
    $(`#t${numeroForm}`).on(`click`, `.listaInputs span.botonListaDelete:not(.ocultoConLugar)`, deleteColecAgre)

    ///Chequea si hay colecciones gemelas
    let valorInicial = $(`#t${numeroForm} div.fo.listaDesplegableTexto div.inputIndiv.main input`).val().toLowerCase()//Este es el input de la lista desplegable que da lugar a colecciones gemelas

    if (valorInicial != "") {

        let filasMudadas = []
        let clonTotal = 0
        pestanaTableClonar.html(`${valorPest}-${valorInicial}`)
        let coleccionesValores = $(`#t${numeroForm} div.fo.listaDesplegableTexto div.inputIndiv.lista input:not(:last)`)

        let filasTablaOriginal = tableClonar.find('tr.mainBody:not(.last)')
        let totalesColec = $(`tr.totales td input`, tableClonar)

        $.each(filasTablaOriginal, (indice, value) => {

            let valorFilaColec = $(`input.idColCotizacionGemela`, value).val().toLowerCase()

            if (valorFilaColec != valorInicial) {

                filasMudadas.push(value)
                $(value).remove()
            }
        })

        $.each(totalesColec, (indice, value) => {

            let name = $(value).attr("name")
            $(value).val(numeroAString(consultaGet[numeroForm][name][clonTotal] || ""))

        })
        clonTotal++

        $.each(coleccionesValores, (indice, value) => {

            let ord = $(value).attr("ord")
            valorAtr = $(value).val()

            let pestanaClonada = pestanaTableClonar.clone(true)

            pestanaClonada.html(`${valorPest}-${valorAtr}`).attr("id", `${idPestClonar}-${ord}`).attr("ordAtr", ord).removeClass("active")
            let tablaClonada = tableClonar.clone(true)
            tablaClonada.attr("id", `${idTableClonar}-${ord}`).attr("ordAtr", ord).removeClass("active")

            let lengthTabla = $(`tr`, tablaClonada).length

            if (lengthTabla > 3) {

                tablaClonada.find('tr.mainBody:not(:first, .last )').remove();


            }

            tablaClonada.find('input').each(function () {

                $(this).val('');
            });

            let ordefinFilasInsertadas = 0

            $.each(filasMudadas, (indice, value) => {

                let valorFilaColec = $(`input.idColCotizacionGemela`, value).val()

                if (valorFilaColec == valorAtr) {

                    $(value).attr("q", ordefinFilasInsertadas)
                    $(`td`, value).attr("ord", ordefinFilasInsertadas)
                    $(`input`, value).attr("ord", ordefinFilasInsertadas)
                    $('tr.mainBody:first', tablaClonada).addClass("eliminar");
                    $(`tr.last`, tablaClonada).before(value);

                    ordefinFilasInsertadas++
                }

                let totalesColecClon = $(`tr.totales td input`, tablaClonada)
                $.each(totalesColecClon, (indice, value) => {

                    let name = $(value).attr("name")

                    $(value).val(numeroAString(consultaGet[numeroForm][name][clonTotal] || ""))

                })
                clonTotal++

                $(`tr.last`, tablaClonada).attr("q", ordefinFilasInsertadas);
                $(`tr.last td,
                   tr.last,
                   tr.last input`, tablaClonada).attr("ord", ordefinFilasInsertadas);
            })

            $(`tr.eliminar`, tablaClonada).remove();
            $(`#cabeceraCol${objeto.accion}${numeroForm}`).append(pestanaClonada)
            $(`#tablaCol${objeto.accion}${numeroForm}`).append(tablaClonada)

        })
    }

}
function agregarOcultarColumna(objeto, numeroForm, tabla) {

    const ocultarColumna = (e) => {

        $(e.target).parents("td.celdaSignoOculto").addClass("oculto")

        let table = $(e.target).parents("table")
        let claseOcultar = $(e.target).attr("claseOcultar")

        $(`td.${claseOcultar},
           th.${claseOcultar},
           td.totales.${claseOcultar}`, table).addClass("oculto")

    }
    $(`#t${numeroForm} `).on("click", `table.tablaCompuesto.${tabla.nombre} td.celdaSignoOculto span.minus`, ocultarColumna)
    let table = ""
    const verOcultos = (e) => {
        table = $(e.target).parents("table")
        $(`.tablaOculto`).remove()

        let tablaOcultos = `<div class="cartelOpcionesColeccion tablaOculto vertOpciones">`
        let ocultos = $(`th.ocltable.oculto:not(.ocultoSiempre):not(.ocultoSeguridad)`, table)

        if (ocultos.length > 0) {
            tablaOcultos += `<div class="notClose titulo"> <span class="icono">👁️</span> Ver ocultos</div>`
            tablaOcultos += `<div class="notClose fila todos">Todos</div>`

            $.each(ocultos, (indice, value) => {

                let valor = $(value).html()
                tablaOcultos += `<div class="notClose fila" ocltable=${$(value).attr("ocltable")}>${valor}`
                tablaOcultos += `</div>`

            })
            tablaOcultos += `</div>`

        } else {

            tablaOcultos += `<div class="titulo">No hay elementos ocultos</div>`
        }

        $(tablaOcultos).appendTo(`#t${numeroForm}`);

        const contenedor = $(`#t${numeroForm}`);
        const offset = contenedor.offset();
        const scrollLeft = contenedor.scrollLeft();
        const scrollTop = contenedor.scrollTop();

        $(`#t${numeroForm} .tablaOculto`).css({
            left: e.pageX - offset.left + scrollLeft,
            top: e.pageY - offset.top + scrollTop
        });

        $(`#t${numeroForm}`).on("click", "div:not(.menuFila), div:not(.tablaOculto) div:not(.notClose)", function (e) {

            $(`#t${numeroForm} .tablaOculto`).remove()
            $(`#t${numeroForm}`).off("click", "div:not(.menuFila), div:not(.tablaOculto) div:not(.notClose)")
        })

    }
    $(`#t${numeroForm}`).on("click", `table.${tabla.nombre} tr.fltrosOcultCol td.menuFila`, verOcultos)

    const chequeFilaNuevaColeccion = (e) => {

        let tabla = $(e.target).parents("table")
        let father = ("tr.last", tabla)
        let ocultos = $(`tr[q="0"] td.oculto`, tabla)
        let ocltable = $(`tr[q="0"] td.ocltable`, tabla)

        $.each(ocultos, (indice, value) => {

            $(`input[name="${$("input", value).attr("name")}"]`, father).parents("td").addClass("oculto")
        })
        $.each(ocltable, (indice, value) => {

            $(`input[name="${$("input", value).attr("name")}"]`, father).parents("td").addClass("ocltable")

        })
    }

    $(`#t${numeroForm}`).on("dblclick", `table.tablaCompuesto.${tabla.nombre} input.idColec`, chequeFilaNuevaColeccion)//Esto para chequear el coleccion

    const desocultar = (e) => {

        let target = $(e.target).attr("ocltable")

        $(`td.${target},
               th.${target}`, table).removeClass("oculto")
        $(`td.celdaSignoOculto.${target}`, table).removeClass("oculto")

        $(`#t${numeroForm} .tablaOculto`).remove()

    }

    $(`#t${numeroForm}`).on("click", `div.tablaOculto div.fila:not(.todos), div.tablaOcultoWait div.fila:not(.todos)`, desocultar)

    const abrirTodos = (e) => {

        let father = $(e.target).parents(".tablaOculto")
        father.removeClass("tablaOculto").addClass("tablaOcultoWait")
        let filas = $(`div.fila:not(.todos)`, father)

        $.each(filas, (indice, value) => {
            $(value).trigger("click")

        })

        $(`#t${numeroForm} tablaOcultoWait`).remove()

    }

    $(`#t${numeroForm}`).on("click", `div.tablaOculto div.fila.todos`, abrirTodos)

}
function formatoPassword(objeto, numeroForm) {

    let form = ""
    let listaAdjunto = ""
    let id = $(`#t${numeroForm} input._id`).val()
    let indice = $(`#t${numeroForm} input.password`).attr("tabindex")
    $(`#t${numeroForm} div.fo.password input`).remove()

    if (id == "") {
        let repetir = ""

        form += `<div class="cont" ><input type="password" class="form password requerido" name="password" form="f${objeto.accion}${numeroForm}" tabindex="${indice}" valid="password" />
                  <span class="material-symbols-outlined oculto ojito">visibility</span>
                  <span class="material-symbols-outlined tachado ojito">visibility_off</span>`;

        repetir += `<div class="fo repetirContrasena" width="quince" set=t${numeroForm}>
        <h2>Repetir contraseña</h2>`;

        repetir += `<div class="cont"><input type="password" class="form repetirContrasena requerido requeridoEspecial chequeo"  tabindex="${indice}"/>
              <span class="material-symbols-outlined oculto ojito">visibility</span>
              <span class="material-symbols-outlined tachado ojito">visibility_off</span>`;

        $('div.fo.password').after($(repetir));

    } else {

        $(`#t${numeroForm} div.fo.password h2`).remove()
        $(`#t${numeroForm} div.fo.password`).addClass("blanquear")

        form += `<div class="botonDescriptivo blanquearCont disabled=diasbled">Blanquear contraseña</div>`;
        form += `</div>`

        let cartel = cartelComplemento(objeto, numeroForm, { claseCartel: "blanquearCont paddingAmplio widthCuarenta cartel black oculto", bloques: 2, botonConfirmar: "oculto", position: { top: "5%" } })
        $(cartel).appendTo(`#t${numeroForm}`)

        let bloqueCero = `<div class="titulo"><h2>Blanquear contraseña</h2>`

        let bloqueUno = `<form method="POST" action="/${objeto.accion}" id="contrasena${numeroForm}"></form><div class="inputs">
        <div class="contrasena inputDiv flex marginBot">
        <input type="password" disabled class="nuevaCont " name="password" placeholder="Nueva contraseña" valid="password" form="contrasena${numeroForm}"/>
        <span class="material-symbols-outlined oculto ojito">visibility</span><span class="material-symbols-outlined tachado ojito">visibility_off</span></div>
        <div class="paddingCero textoValidacionContrasena oculto"><p class="bold">La contraseña debe tener al menos una mayúscula, un número y un caracter especial</p></div>`
        bloqueUno += `<div class="repetirContrasena inputDiv flex marginBot">
        <input type="password" disabled class="nuevaCont requeridoEspecial chequeo" placeholder="Repetir contraseña"  />
        <span class="material-symbols-outlined oculto ojito">visibility</span><span class="material-symbols-outlined tachado ojito">visibility_off</span></div>
        <div class="paddingCero marginBotUno textoValidacionRep oculto"><p class="bold">La contraseñas no coinciden</p></div>`
        bloqueUno += `<button class="botonEnviar">💾 Blanquear contraseña</button></div>`;

        $(bloqueCero).appendTo(`#t${numeroForm} .blanquearCont .bloque0`)
        $(bloqueUno).appendTo(`#t${numeroForm} .blanquearCont .bloque1`)

    }
    $(form).appendTo(`#t${numeroForm} div.fo.password`);
}
function validadPasswordIguales(objeto, numeroForm) {

    let password = ""
    let passwordRepetida = ""

    $(`#t${numeroForm}`).on("input", "input.password", (e) => {

        password = $(e.target).val()

        if (password == passwordRepetida) {

            $(`#t${numeroForm} input.repetirContrasena`).addClass("validado")
        } else {

            $(`#t${numeroForm} input.repetirContrasena`).removeClass("validado")
        }
    })

    $(`#t${numeroForm}`).on("input", "input.repetirContrasena", (e) => {

        passwordRepetida = $(e.target).val()

        if (password == passwordRepetida) {

            $(e.target).addClass("validado")
        } else {

            $(e.target).removeClass("validado")
        }
    })
}
function chequearOcultoValor(objeto, numeroForm, atributo, valor, atributoOculto) {

    if ($(`#t${numeroForm} .inputSelect.${atributo}`).val().trim() == valor) {

        $(`#t${numeroForm} div.fo.${atributoOculto}`).removeAttr("oculto")
    }
}
function itemsNegativos(objeto, numeroForm, atributos) {

    let attrPosNeg = (e) => {

        let tipo = consultaPestanas[atributos][$(e.target).val()].tipoItems

        if (tipo == "Egresos") {

            $(`#t${numeroForm} input[type="importe"]`).addClass("rojoNegativo").removeClass("verdePositivo")

        } else {
            $(`#t${numeroForm} input[type="importe"]`).removeClass("rojoNegativo").addClass("verdePositivo")
        }
    }

    $(`#t${numeroForm}`).on("change", `.divSelectInput[name="${atributos}"]`, attrPosNeg)
    let signoNegativo = (e) => {

        setTimeout(() => {

            let valor = $(e.target).val()
            if (!valor.startsWith("-")) {
                $(e.target).val("-" + valor);

                let siblings = $(e.target).siblings("input")

                for (const value of siblings) {
                    let valorSiblings = $(value).val()
                    $(value).val("-" + valorSiblings)
                }
            }

        }, 200)
    }

    $(`#t${numeroForm}`).on("blur", `input.rojoNegativo`, signoNegativo)
    $(`#bf${numeroForm}`).on("click", `span.editBoton`, (e) => {

        $(`#t${numeroForm} .divSelectInput[name="${atributos}"]`).trigger("change")

    })
}
function funcionUnWind(objeto, numeroForm) {

    let tablas = $(`#t${numeroForm} .tablaCompuesto`)

    $.each(tablas, (indice, value) => {

        let mainBody = $(`tr.mainBody:not(.last)`, value)
        if (mainBody.length == 0) {

            $(value).addClass("ocultoSiempre")
            let numerosId = $(value).attr("id").slice(2)
            $(`#t${numeroForm} #pe${numerosId}`).addClass("ocultoSiempre")

        } else {

            $(`tr.last`, value).addClass("ocultoSiempre")
            $(`td.menuFila,
               th.menuFila`, value).addClass("ocultoSiempre")
        }
    })
    let tot = Object.values(objeto.totalizadores).filter(e => e.type == "totalizadorCabecera")

    $.each(tot, (indice, value) => {

        $(`#t${numeroForm} div.fo.${value.total[0].nombre || value.total[0]}`).addClass("ocultoSiempre")

    })

}
function probarFact() {

    fetch('http://localhost:3000/api/facturar', {
        method: 'POST'
    })
        .then(response => response.json())
        .then(data => {
            console.log('✅ Respuesta:', data);
        })
        .catch(error => {
            console.error('❌ Error:', error);
        });

}
function anularCalculoManual(objeto, numeroForm, total) {

    function anularCalculo(e) {

        if (e.key.toLowerCase() === 'm') {
            e.preventDefault();
            $(e.target).parents("tr").addClass("anuloCalculo");
            $(e.target).removeAttr("readonly").removeClass("total");
        }

        if (e.key.toLowerCase() === 'c') {
            e.preventDefault();
            $(e.target).parents("tr").removeClass("anuloCalculo");
            $(e.target).prop("readonly", true).addClass("total");
        }
    }
    $(`#t${numeroForm}`).on("keydown", `input.${total}`, anularCalculo)
}
function chequeGrupo(objeto, numeroForm) {

    let grupoSeguridad = $(`#t${numeroForm} table.gruposDeSeguridad tr.mainBody:not(.last) .divSelectInput[name="grupoSeguridad"]`)

    $.each(grupoSeguridad, (indice, value) => {

        if (consultaPestanas.grupoSeguridad[$(value).val()] == undefined) {

            $(value).parents("tr").addClass("ocultoSiempre")

        }
    })
    let mainBody = $(`#t${numeroForm} table.gruposDeSeguridad tr.mainBody:not(.ocultoSiempre):not(.last)`)
    if (mainBody.length == 0) {

        setTimeout(() => {//Es eso para eviatar el oculto del id="" cuando creo formulario

            $(`#t${numeroForm} table.gruposDeSeguridad tr.last td.vacio`).trigger("dblclick")
        }, 400)
    }
}