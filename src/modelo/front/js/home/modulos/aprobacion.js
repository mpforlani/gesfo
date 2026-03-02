function enviarAprobacionColec(objeto, numeroForm) {

    let dataActualizar = []
    let aprobar = $(`#t${numeroForm} .tr.selecAprobar`)
    let idREgistros = new Object
    let desecadena = false

    $.each(aprobar, (indicee, valueFila) => {

        let id = $(`.celda._id`, valueFila).html()

        let idCol = $(`.celda._idColeccionUnWind`, valueFila)?.html()?.trim() || "0"

        idREgistros[id] = {
            _id: id,
            array: (idREgistros?.[id]?.array || []).concat([idCol]),
            atributosArray: new Object,
            atributosCabecera: new Object
        }

        let registro = consultaGet[numeroForm].find(element => (element._id == id && element._idColeccionUnWind == idCol))

        dataActualizar.push(registro)

    })

    let preFather = $(`#t${numeroForm}`).attr("prefather")?.slice(1) || numeroForm
    $.each(objeto.desencadenaAgrupado, (indice, value) => {
        desecadena = true

        desencadenanteAgrupadoColeccionVistaPrevia(value, objeto, preFather, dataActualizar);
    })

    if (desecadena == false) {

        atributosConfirmadoAlEnviarColec(objeto, numeroForm, idREgistros)

    }

    reCrearporIngresoDeRegistroAprob(objeto, numeroForm)
    $(`#bf${numeroForm} span.crearBotonInd`).addClass("oculto")

}
function enviarAprobacionColecInd(objeto, numeroForm) {

    let dataActualizar = []
    let idREgistros = new Object
    let desecadena = false

    let id = $(`#t${numeroForm} input._id`).val()
    let idCol = consultaGet[numeroForm]._idColeccionUnWind

    idREgistros[id] = {
        _id: id,
        array: (idREgistros?.[id]?.array || []).concat([idCol]),
        atributosArray: new Object,
        atributosCabecera: new Object
    }

    let registro = consultaGet[numeroForm]
    dataActualizar.push(registro)

    $.each(objeto.desencadenaAgrupado, (indice, value) => {
        desecadena = true

        desencadenanteAgrupadoColeccionVistaPrevia(value, objeto, numeroForm, dataActualizar, "post");
    })

    if (desecadena == false) {
        atributosConfirmadoAlEnviarColec(objeto, numeroForm, idREgistros)
    }

    const preFather = $(`#t${numeroForm}`).attr("prefather")
    let numeroAnt = preFather.slice(1)
    $(`#p${numeroForm} div.closeFormInd`).trigger("click")

    reCrearporIngresoDeRegistroAprob(objeto, numeroAnt)
    $(`#cortinaNegra`).remove()

}
function desaprobarColec(objeto, numeroForm) {

    let idREgistros = new Object
    transformarNumeroAntesEnviar(numeroForm)
    let aprobar = $(`#t${numeroForm} .tr.selecAprobar`)

    $.each(aprobar, (indicee, valueFila) => {

        let id = $(`.celda._id`, valueFila).html()
        let idCol = $(`.celda._idColeccionUnWind`, valueFila).html().trim() || "0"

        idREgistros[id] = {
            _id: id,
            array: (idREgistros?.[id]?.array || []).concat([idCol]),
            atributosArray: new Object,
            atributosCabecera: new Object
        }

        $(valueFila).remove()
    })

    rechazarRegistroColec(objeto, numeroForm, idREgistros)
    reCrearporIngresoDeRegistroAprob(objeto, numeroForm)
}
function desaprobarColecInd(objeto, numeroForm) {

    let idREgistros = new Object
    let id = $(`input._id`, `#t${numeroForm}`).val()
    let idCol = $(`input._idColeccionUnWind`, `#t${numeroForm}`).val() || "0"

    idREgistros[id] = {
        _id: id,
        array: (idREgistros?.[id]?.array || []).concat([idCol]),
        atributosArray: new Object,
        atributosCabecera: new Object
    }

    rechazarRegistroColec(objeto, numeroForm, idREgistros)

    const preFather = $(`#t${numeroForm}`).attr("prefather")
    let numeroAnt = preFather.slice(1)
    $(`#p${numeroForm} div.closeFormInd`).trigger("click")

    reCrearporIngresoDeRegistroAprob(objeto, numeroAnt)
    $(`#cortinaNegra`).remove()
}
function enviarAprobacion(objeto, numeroForm) {

    transformarNumeroAntesEnviar(numeroForm)
    let aprobar = $(`#t${numeroForm} .tr.selecAprobar`)

    let responseAnidadas = []

    $.each(aprobar, (indicee, valueFila) => {

        let valid = [];

        let requeridos = $(`input.requerido`, valueFila)

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

            let cartel = cartelInforUnaLinea("Revisar los campos en rojo", "❌", { cartel: "infoChiquito rojo", close: "ocultoSiempre" })
            $(cartel).appendTo(`#bf${numeroForm}`)
            removeCartelInformativo(objeto, numeroForm)

        } else {

            let dataUpdate = new Object
            dataUpdate._id = $(`._id`, valueFila).html()
            dataUpdate.UsuarioAprobador = usu

            dataUpdate.descripcionEnvio = objeto.typeHistorial || objeto.pest

            let objetoModificados = new Object

            $.each(objeto?.atributosModificadosAlEnviar?.confirmar?.cabecera, (ind, val) => {

                switch (typeof val) {
                    case "string":
                        dataUpdate[ind] = val
                        objetoModificados[ind] = val || ""
                        break;
                    case "function":

                        dataUpdate[ind] = val(ind, objeto, numeroForm, valueFila)
                        objetoModificados[ind] = val(ind, objeto, numeroForm, valueFila) || ""
                        break;
                    case "object":

                        dataUpdate[ind] = val[0](ind, objeto, numeroForm, valueFila, val[1], val[2]) || ""
                        objetoModificados[ind] = val[0](ind, objeto, numeroForm, valueFila, val[1], val[2]) || ""

                        break;
                }
            })

            $.each(objeto?.atributosConfirmadosEnForm?.cabecera, (indice, value) => {

                dataUpdate[value.nombre || value] = $(`input.${value.nombre || value}`, valueFila).val()
            })

            let usuario = Object.values(consultaPestanas.user).find(element => element.usernameUser == usu)
            dataUpdate.modificaciones = JSON.stringify(objetoModificados)

            let objetoReferencia = {
                nombre: objeto.nombre,
                modificar: objeto.modificarPostAprob || true,
                tituloMostrar: objeto.pest,
                mostrar: {
                    fecha: {
                        valor: dateNowAFechaddmmyyyy(Date.now(), `d/m/y-hh`),
                        titulo: "Fecha"
                    },
                    accion: {
                        valor: $(`#bf${numeroForm} div.botonAprobar p`).html(),
                        titulo: "Acción"
                    },
                    user: {
                        valor: usuario._id,
                        titulo: "Usuario"
                    },
                }
            }
            const version = $(`div.celda.version`, valueFila).html()
            dataUpdate[`autoImputo.${version}`] = objetoReferencia
            dataUpdate.typeOper = "aprobacion"

            dataUpdate.mostrar = objeto?.pest
            dataUpdate.key = objeto?.key

            $.ajax({
                type: "put",
                url: `/put?base=${objeto.accion}`,
                contentType: "application/json",
                data: JSON.stringify(dataUpdate),
                beforeSend: function () {
                    mouseEnEsperaForm(objeto, numeroForm)
                },
                success: function (response) {

                    responseAnidadas.push(response)
                    $(valueFila).remove()

                    $.each(objeto.desencadenante, (indice, value) => {
                        value.origen = "desencadenante"
                        desencadenante(value, objeto, numeroForm, response);
                    })
                    $.each(objeto.desencadenaAgrupado, (indice, value) => {

                        if (aprobar.length == (indicee + 1)) {
                            desencadenanteAgrupado(value, objeto, numeroForm, responseAnidadas);
                        }
                    })
                    $.each(objeto.child, (indice, value) => {
                        value.origen = "child"

                        desencadenante(value, objeto, numeroForm, response);
                    })

                    reCrearporIngresoDeRegistroAprob(objeto, numeroForm)
                    quitarEsperaForm(objeto, numeroForm)

                    let cartel = cartelInforUnaLinea(response.mensaje, "☑️", { cartel: "infoChiquito verde", close: "ocultoSiempre" })
                    $(cartel).appendTo(`#bf${numeroForm}`)
                    removeCartelInformativo(objeto, numeroForm)

                    $(`#bf${numeroForm} span.crearBotonInd`).addClass("oculto")

                },
                error: function (error) {
                    console.log(error);
                },
            });
        }
    })
}
function enviarAprobacionFormInd(objeto, numeroForm) {

    funcionesAntesdeEnviar(objeto, numeroForm).then((resultado) => {
        transformarNumeroAntesEnviar(numeroForm)
        let file = $(`#f${objeto.accion}${numeroForm}`).serializeArray();

        let dataUpdate = new Object

        dataUpdate = file.reduce((resultado, objeto) => {
            if (resultado[objeto.name] == undefined) {
                resultado[objeto.name] = objeto.value;
            } else if (Array.isArray(resultado[objeto.name])) {
                resultado[objeto.name]?.push(objeto.value)
            } else {
                resultado[objeto.name] = [resultado[objeto.name], objeto.value]
            }

            return resultado;
        }, {}); // <- valor inicial vacío para no pisar el primer elemento


        dataUpdate._id = $(`#t${numeroForm} input._id`).val()
        dataUpdate.UsuarioAprobador = usu
        dataUpdate.descripcionEnvio = objeto.typeHistorial || objeto.pest

        let objetoModificados = new Object
        objetoModificados.type = "aprobacion"

        $.each(objeto?.atributosModificadosAlEnviar?.confirmar?.cabecera, (ind, val) => {

            switch (typeof val) {
                case "string":

                    dataUpdate[ind] = val
                    objetoModificados[ind] = val
                    break;
                case "function":

                    dataUpdate[ind] = val(ind, objeto, numeroForm, `#t${numeroForm}`)
                    objetoModificados[ind] = val(ind, objeto, numeroForm, `#t${numeroForm}`)
                    break;
                case "object":

                    dataUpdate[ind] = val[0](ind, objeto, numeroForm, `#t${numeroForm}`, val[1])
                    objetoModificados[ind] = val[0](ind, objeto, numeroForm, `#t${numeroForm}`, val[1], val[2])

                    break;
            }
        })

        let usuario = Object.values(consultaPestanas.user).find(element => element.usernameUser == usu)
        dataUpdate.modificaciones = JSON.stringify(objetoModificados)

        let objetoReferencia = {
            nombre: objeto.nombre,
            modificar: objeto.modificarPostAprob || true,
            tituloMostrar: objeto.pest,
            mostrar: {
                fecha: {
                    valor: dateNowAFechaddmmyyyy(Date.now(), `d/m/y-hh`),
                    titulo: "Fecha"
                },
                accion: {
                    valor: $(`#bf${numeroForm} div.botonAprobar p`).html(),
                    titulo: "Acción"
                },
                user: {
                    valor: usuario._id,
                    titulo: "Usuario"
                },
            }
        }

        const version = $(`#t${numeroForm} div.fo.version input`).val()

        dataUpdate[`autoImputo.${version}`] = objetoReferencia
        dataUpdate.mostrar = objeto?.pest
        dataUpdate.key = objeto?.key

        $.ajax({
            type: "put",
            url: `/put?base=${objeto.accion}`,
            contentType: "application/json",
            data: JSON.stringify(dataUpdate),
            beforeSend: function () {
                mouseEnEsperaForm(objeto, numeroForm)
            },
            complete: function () { },
            success: function (response) {

                $.each(objeto.desencadenante, (indice, value) => {
                    value.origen = "desencadenante"

                    desencadenante(value, objeto, numeroForm, response);
                })
                $.each(objeto.child, (indice, value) => {
                    value.origen = "child"

                    desencadenante(value, objeto, numeroForm, response);
                })

                quitarEsperaForm(objeto, numeroForm)

                const preFather = $(`#t${numeroForm}`).attr("prefather")
                let numeroAnt = preFather.slice(1)
                if (objeto.imprimirAprob == true) {
                    formularioIndividualImpresion(objeto, numeroForm, response.posteo);

                }

                funcionCerrar($(`#p${numeroForm} div.closeFormInd`))
                reCrearporIngresoDeRegistroAprob(objeto, numeroAnt)


                let cartel = cartelInforUnaLinea(response.mensaje, "☑️", { cartel: "infoChiquito verde", close: "ocultoSiempre" })
                $(cartel).appendTo(`#bf${numeroAnt}`)
                removeCartelInformativo(objeto, numeroForm)

                $(`#bf${numeroAnt} span.crearBotonInd`).addClass("oculto")

            },
            error: function (error) {
                console.log(error);
            },
        });
    }).catch((error) => {
        //console.error(error)
    })
}
function enviarRechazado(objeto, numeroForm) {

    let aprobar = $(`#t${numeroForm} .tr.selecAprobar`)

    $.each(aprobar, (indicee, valueFila) => {

        let dataUpdate = new Object
        dataUpdate._id = $(`._id`, valueFila).html()
        dataUpdate.UsuarioAprobador = usu
        dataUpdate.descripcionEnvio = (objeto.typeHistorial || objeto.pest)

        let objetoModificados = new Object
        objetoModificados.type = "aprobacion"

        $.each(objeto.atributosModificadosAlEnviar.rechazar.cabecera, (ind, val) => {

            switch (typeof val) {
                case "string":
                    dataUpdate[ind] = "Rechazado"
                    objetoModificados[ind] = val
                    break;
                case "function":
                    dataUpdate[ind] = val(ind, objeto, numeroForm, valueFila) ///aca pongo value asi me sale la fila tr padre
                    objetoModificados[ind] = val(ind, objeto, numeroForm, valueFila)
                    break;
                case "coleccion":
                    break;
            }
        })

        let usuario = Object.values(consultaPestanas.user).find(element => element.usernameUser == usu)
        dataUpdate.modificaciones = JSON.stringify(objetoModificados)

        let objetoReferencia = {
            nombre: objeto.nombre,
            modificar: objeto.modificarPostAprob || true,
            tituloMostrar: objeto.pest,
            mostrar: {
                fecha: {
                    valor: dateNowAFechaddmmyyyy(Date.now(), `d/m/y-hh`),
                    titulo: "Fecha"
                },
                accion: {
                    valor: $(`#bf${numeroForm} div.botonRechazar p`).html(),
                    titulo: "Acción"
                },
                user: {
                    valor: usuario._id,
                    titulo: "Usuario"
                },
            }
        }

        const version = $(`div.celda.version`, valueFila).html()
        dataUpdate[`autoImputo.${version}`] = objetoReferencia
        dataUpdate.mostrar = objeto?.pest
        dataUpdate.key = objeto?.key

        $.ajax({
            type: "put",
            url: `/put?base=${objeto.accion}`,
            contentType: "application/json",
            data: JSON.stringify(dataUpdate),
            beforeSend: function () {
                mouseEnEsperaForm(objeto, numeroForm)
            },
            complete: function () { },
            success: function (response) {

                let cartel = cartelInforUnaLinea(response.mensaje, "☑️", { cartel: "infoChiquito", close: "ocultoSiempre" })
                $(cartel).appendTo(`#bf${numeroForm}`)
                removeCartelInformativo(objeto, numeroForm)

                reCrearporIngresoDeRegistroAprob(objeto, numeroForm)
                quitarEsperaForm(objeto, numeroForm)

            },
            error: function (error) {
                console.log(error);
            },
        });
    })
}
function enviarRechazadoInd(objeto, numeroForm) {

    let dataUpdate = new Object
    dataUpdate._id = $(`#t${numeroForm} input._id`).val()
    dataUpdate.UsuarioAprobador = usu
    dataUpdate.descripcionEnvio = objeto.typeHistorial || objeto.pest

    let objetoModificados = new Object
    objetoModificados.type = "aprobacion"

    $.each(objeto?.atributosModificadosAlEnviar?.rechazar?.cabecera, (ind, val) => {

        switch (typeof val) {
            case "string":
                dataUpdate[ind] = "Rechazado"
                objetoModificados[ind] = val
                break;
            case "function":
                dataUpdate[ind] = val(ind, objeto, numeroForm, valueFila) ///aca pongo value asi me sale la fila tr padre
                objetoModificados[ind] = val(ind, objeto, numeroForm, `#t${numeroForm}`)
                break;
            case "coleccion":
                break;
        }
    })

    let usuario = Object.values(consultaPestanas.user).find(element => element.usernameUser == usu)
    dataUpdate.modificaciones = JSON.stringify(objetoModificados)

    let objetoReferencia = {
        nombre: objeto.nombre,
        modificar: objeto.modificarPostAprob || true,
        tituloMostrar: objeto.pest,
        mostrar: {
            fecha: {
                valor: dateNowAFechaddmmyyyy(Date.now(), `d/m/y-hh`),
                titulo: "Fecha"
            },
            accion: {
                valor: $(`#bf${numeroForm} div.botonRechazar p`).html(),
                titulo: "Acción"
            },
            user: {
                valor: usuario._id,
                titulo: "Usuario"
            },
        }
    }

    const version = $(`#t${numeroForm} div.fo.version input`).val()

    dataUpdate[`autoImputo.${version}`] = objetoReferencia
    dataUpdate.mostrar = objeto?.pest
    dataUpdate.key = objeto?.key

    $.ajax({
        type: "put",
        url: `/put?base=${objeto.accion}`,
        contentType: "application/json",
        data: JSON.stringify(dataUpdate),
        complete: function () { },
        success: function (response) {

            const preFather = $(`#t${numeroForm}`).attr("prefather")
            let numeroAnt = preFather.slice(1)

            let cartel = cartelInforUnaLinea(response.mensaje, "☑️", { cartel: "infoChiquito verde", close: "ocultoSiempre" })
            $(cartel).appendTo(`#bf${numeroAnt}`)
            removeCartelInformativo(objeto, numeroForm)

        },
        error: function (error) {
            console.log(error);
        },
    });

    const preFather = $(`#t${numeroForm}`).attr("prefather")
    let numeroAnt = preFather.slice(1)
    $(`#p${numeroForm} div.closeFormInd`).trigger("click")

    reCrearporIngresoDeRegistroAprob(objeto, numeroAnt)

    $(`#cortinaNegra`).remove()
}
const enviarActualizado = {
    aprobarColección: enviarAprobacionColec,
    aprobar: enviarAprobacion,
}
const enviarActualizadoind = {
    aprobarColección: enviarAprobacionColecInd,
    aprobar: enviarAprobacionFormInd,
}
const enviarRechazo = {
    aprobarColección: desaprobarColec,
    aprobar: enviarRechazado,
}
const enviarRechazoInd = {
    aprobarColección: desaprobarColecInd,
    aprobar: enviarRechazadoInd,
}
//Modficacion abm entidades aprovacion
function entidadAprobacionInicio(objeto, numeroForm) {//No quiero que se ejecute dos veces si recreo tabla

    if (!(objeto.modificar == true && Object.values(objeto.atributos?.compuesto || {})?.length > 0)) {

        let botonAprobar = `<div class="botonApobacion botonAprobar"><p>${objeto?.botones?.aprobar || "Aprobar"}</p></div>`;
        let botonRechazar = `<div class="botonApobacion botonRechazar"><p>${objeto?.botones?.rechazar || "Rechazar"}</p></div>`;

        $(`#bf${numeroForm} .crearBotonInd`).parents(".barraForm").after(botonAprobar);
        $(`#bf${numeroForm} .botonAprobar`).after(botonRechazar);

        $.each(objeto?.botones?.acciones, (indice, value) => {

            switch (value) {

                case `eliminarBotonDesaprobar`:
                    $(`#bf${numeroForm} .botonRechazar`).remove()
                    break;
                case `eliminarBotonAprobar`:
                    $(`#bf${numeroForm} .botonAprobar`).remove()
                    break;
            }
        })

        $(`body`).on('click', `#bf${numeroForm}:not(.enEspera) .botonAprobar`, (e) => {

            const seleccionados = $(`#t${numeroForm} .tr.selecAprobar`)

            if (seleccionados.length > 0) {

                enviarActualizado[objeto.type](objeto, numeroForm)
            } else {

                let cartel = cartelInforUnaLinea(`Debe seleccionar al menos un registro`, "☑️", { cartel: "infoChiquito", close: "ocultoSiempre" })
                $(cartel).appendTo(`#bf${numeroForm}`)
                removeCartelInformativo(objeto, numeroForm)
            }


        })
        $(`body`).on('click', `#bf${numeroForm}:not(.enEspera) .botonRechazar`, (e) => {

            const seleccionados = $(`#t${numeroForm} .tr.selecAprobar`)

            if (seleccionados.length > 0) {

                enviarRechazo[objeto.type](objeto, numeroForm)
            } else {

                let cartel = cartelInforUnaLinea(`Debe seleccionar al menos un registro`, "☑️", { cartel: "infoChiquito", close: "ocultoSiempre" })
                $(cartel).appendTo(`#bf${numeroForm}`)
                removeCartelInformativo(objeto, numeroForm)

            }
        })
    }

    $(`.okBoton,
       .cancelBoton,
       .editBoton,
       .historia,
       .deleteBoton,
       .recargar,
       .desHabilitarBoton`, `#bf${numeroForm}`).addClass("ocultoSiempre")

    $(`#bf${numeroForm} span.crearBotonInd`).removeClass("ocultoCrear").addClass("oculto")

}
function entidadAprobacion(objeto, numeroForm) {

    const formIndividual = (e) => {

        let padre = $(e.target).parents(".tr")
        let select = $(`#t${numeroForm} .tr.selecAprobar`)


        if (!padre.hasClass("sel") || select.length > 0) {

            $(`#bf${numeroForm} .crearBotonInd`).removeClass("oculto")

        } else {

            if ($(`#t${numeroForm} div.tr.selecAprobar`).length == 0) {

                $(`#bf${numeroForm} span.crearBotonInd`).addClass("oculto")
            }
        }
    }

    $(`#tabs_contents`).on('click', `div.celda`, formIndividual)
    $(`#t${numeroForm}`).attr("aprobar", objeto.aprob).attr("agrupador", objeto.agrupador).addClass("formAprob")
    $(`#t${numeroForm} div.tr.input`).addClass("ocultoSiempre")
    $(`#t${numeroForm} div.logicoAprobacion input`).removeAttr("disabled")

    seleccionarAprobar(objeto, numeroForm, objeto?.atributosConfirmadosEnForm?.cabecera || [], objeto?.atributoMultipleMenu || [])
    ///////////////////////////////////////////
}
function seleccionarAprobar(objeto, numeroForm, atributoEdit, atributoSame) {//dic

    let fechaSugerida = new Object

    const selecionado = (e) => {

        let checked = $(e.target).is(":checked")
        let fatherFil = $(e.target).parents("div.tr")

        if (checked == true) {

            $(fatherFil).addClass("selecAprobar")

            $.each(atributoEdit, (indice, value) => {
                let valueAtributo = $(`div.celda.${value.nombre}`, fatherFil).html().trim()

                fechaSugerida[value.nombre] = valueAtributo

                $(`div.celda.${value.nombre}`, fatherFil).html("")

                let celdas = ""
                switch (value.type) {
                    case `fecha`:

                        valueAtributo = valueAtributo.split(`-`)

                        celdas += `<input type="date" class="editAprobacion ${value.nombre} requerido" valid="${value.validacion}" value="${valueAtributo[2]}-${valueAtributo[1]}-${valueAtributo[0]}" ${autoCompOff} ></input>`;
                        break
                    case `texto`:

                        celdas += `<input  class="editAprobacion ${value.nombre} requerido" type="texto" valid="${value.validacion}" value="${valueAtributo || ""}" ${autoCompOff} ></input>`;
                        break
                }

                let celd = $(celdas)

                celd.appendTo($(`div.celda.${value.nombre}`, fatherFil))
                $(`div.celda.${value.nombre} input`, fatherFil).trigger("input").trigger("change")

            })

            $.each(atributoSame, (indice, value) => {//Este atributo filtra los registros con iguales de estos registros

                let valorCliente = $(`div.${value.nombre || value}`, fatherFil).html()
                let valorAtributoSame = $(`div.celda.${value.nombre || value}`, `#t${numeroForm}`)

                $.each(valorAtributoSame, (indice, val) => {

                    let valorFila = $(val).html()

                    if (valorCliente != valorFila) {

                        $(e.target).parents(`.tr.fila`).addClass(`check${value.nombre || value}`)
                        $(val).parents(`div.tr.fila`).addClass(`oculto${value.nombre || value}`)

                    }
                })
            })

        } else {

            $(fatherFil).removeClass("selecAprobar")

            $.each(atributoSame, (indice, val) => {

                $(e.target).parents(`.tr.fila`).removeClass(`check${val.nombre || val}`)

                let checkSelec = $(`#t${numeroForm} div.tr.check${val.nombre || val}`)

                if (checkSelec.length == 0) {
                    $(`#t${numeroForm} div.tr.fila`).removeClass(`oculto${val.nombre || val}`)
                }


            })

            $.each(atributoEdit, (indice, value) => {

                $(`div.celda.${value.nombre} input`, fatherFil).remove()
                $(`div.celda.${value.nombre}`, fatherFil).html(fechaSugerida[value.nombre])
            })
        }
    }
    validarFormulario(objeto, numeroForm);
    $(`#t${numeroForm}`).on("change", `div.logicoAprobacion input`, selecionado)
}
//Modificacion formINd
function entidadAprobacionInd(objeto, numeroForm) {

    $(`#t${numeroForm} div.fo.logicoAprobacion`).addClass("oculto")

    $(`#bf${numeroForm} span.material-symbols-outlined`).addClass("ocultoAprob")

    let botonAprobar = `<div class="botonApobacion botonAprobar"><p>${objeto?.botones?.aprobar || "Aprobar"}</p></div>`;
    let botonRechazar = `<div class="botonApobacion botonRechazar"><p>${objeto?.botones?.rechazar || "Rechazar"}</p></div>`;

    $(`#bf${numeroForm} div.barraForm:first`).before(botonAprobar)
    $(`#bf${numeroForm} div.barraForm:first`).before(botonRechazar)

    $.each(objeto?.botones?.acciones, (indice, value) => {

        switch (value) {

            case `eliminarBotonDesaprobar`:
                $(`#bf${numeroForm} .botonRechazar`).remove()
                break;
            case `eliminarBotonAprobar`:
                $(`#bf${numeroForm} .botonAprobar`).remove()
                break;
        }
    })

    $(`#bf${numeroForm} div:not(.enEspera) div.botonAprobar`).on('click', (e) => {

        enviarActualizadoind[objeto.type](objeto, numeroForm, `t${numeroForm}`)
    })
    $(`#bf${numeroForm} div.botonRechazar`).on('click', (e) => {

        enviarRechazoInd[objeto.type](objeto, numeroForm, `t${numeroForm}`)

    })
    $.each(objeto.atributosConfirmadosEnForm, (indice, value) => {

        switch (indice) {
            case "coleccion":
                $.each(value, (ind, val) => {

                    let table = $(`#t${numeroForm} table.${val.colec}`)

                    $.each(val.atributos, (i, v) => {

                        $(`${ind}.${v.nombre || v}`, table).removeAttr("disabled").addClass("confirmar").addClass("requerido").trigger("input").trigger("change")

                    })
                })
                break
            default:
                $.each(value, (ind, val) => {
                    $(`#t${numeroForm} input.${val.nombre || val}`).removeAttr("disabled").trigger("input").addClass("requerido").trigger("input").trigger("change")
                })

                break
        }
    })

    if (objeto.modificar == true) {

        $(`#t${numeroForm} span.botonColeccion.deleteIcon`).removeClass("oculto")
        $(`#t${numeroForm}`).addClass("aprobacionIndividual")
        $(`#bf${numeroForm} span.editBoton`).trigger("click")
        validarElementosExistentes(objeto, numeroForm)

    } else {
        $(`#t${numeroForm}`).off(`dblclick`, `input.form, select.form`);
        $(`#t${numeroForm}`).addClass("aprobacionIndividual")
        $(`#t${numeroForm} .tablaCompuesto`).off(`dblclick`, `tr:last td.vacio`)
        $(`#t${numeroForm}`).off(`dblclick`, `div.tableCol td.comp`)
        $(`#t${numeroForm} div.tableCol.${numeroForm}`).off(`click`, `td.delete`)
        $(`#t${numeroForm} div.fo.adjunto img.eliminarAdj`).off("click")
    }
}
function rechazarRegistroColec(objeto, numeroForm, objetoEnviar) {

    $.each(objetoEnviar, (indice, value) => {


        $.each(objeto?.atributosModificadosAlEnviar?.rechazar?.cabecera, (ind, val) => {

            value.atributosCabecera[ind] = val
        })

        $.each(objeto?.atributosModificadosAlEnviar?.rechazar?.coleccion, (ind, val) => {

            value.atributosArray[ind] = [val]
        })

        $.ajax({
            type: "put",
            url: `/putValoresArray?base=${objeto.accion}`,
            dataType: "JSON",
            async: false,
            contentType: "application/json",
            data: JSON.stringify(value),
            success: function (respon) { },
            error: function (error) {
                console.log(error);
            },
        });
    })

}
function revertirAtributoRechazado(atributo, objeto, numeroForm, father, valor) {

    let valorAtributo = $(`input.${atributo.nombre || atributo}`, father).val() || $(`.${atributo.nombre || atributo}`, father).html()

    valorAtributo == "Rechazado" && (valorAtributo = valor);

    return valorAtributo
}
function atributosConfirmadoAlEnviarColec(objeto, numeroForm, objetoEnviar) {

    $.each(objetoEnviar, (indice, value) => {

        $.each(objeto?.atributosModificadosAlEnviar?.confirmar?.cabecera, (ind, val) => {

            value.atributosCabecera[ind] = val
        })

        $.each(objeto?.atributosModificadosAlEnviar?.confirmar?.coleccion, (ind, val) => {

            value.atributosArray[ind] = [val]
        })

        $.ajax({
            type: "put",
            url: `/putValoresArray?base=${objeto.accion}`,
            dataType: "JSON",
            async: false,
            contentType: "application/json",
            data: JSON.stringify(value),
            success: function (respon) {

            },
            error: function (error) {
                console.log(error);
            },
        });
    })
}
//funciones nuevas por las aprobaciones multiples
function botonAprobarMultiple(objeto, numeroForm) {

    $(`#t${numeroForm} div.logicoAprobacion input`).removeAttr("disabled")
    $(`#t${numeroForm} tr:last`).addClass("ocultoSiempre")

}
function entidadAprobacionMult(objeto, numeroForm) {
    //oculto botones que no vo usar nunca
    $(`.okBoton,
       .cancelBoton,
       .editBoton,
       .crearBoto,
       .historia,
       .deleteBoton,
       .recargar,
       .desHabilitarBoton`, `#bf${numeroForm}`).addClass("ocultoSiempre")

    $(`#bf${numeroForm} .crearBotonInd`).addClass("oculto")
    //este oculta el logico aprobación del form individual
    $(`#t${numeroForm} div.logicoAprobacion input`).removeAttr("disabled")
    //oculto siempre el ultimo input de crear
    $(`#t${numeroForm} tr:last`).addClass("ocultoSiempre")
    $.each(objeto.botones, (indice, value) => {

        let boton = `<div class="botonApobacion ${indice}" boton="${indice}"><p>${value.nombreBoton}</p></div>`;
        $(`#bf${numeroForm} .crear`).after(boton);
    })

    $(`#bf${numeroForm}`).on('click', `.botonApobacion`, (e) => {

        enviarActualizado[objeto.type](objeto, numeroForm)
    })
    $(`#bf${numeroForm}`).on('click', `.botonRechazar`, (e) => {

        enviarRechazo[objeto.type](objeto, numeroForm)
    })

    const formIndividual = (e) => {

        $(`#bf${numeroForm} .crearBotonInd`).addClass("oculto")
        let padre = $(e.target).parents(".tr")

        if (!padre.hasClass("sel")) {

            $(`#bf${numeroForm} .crearBotonInd`).removeClass("oculto")
        } else {

            $(`#bf${numeroForm} .crearBotonInd`).addClass("oculto")
        }
    }

    $(`#tabs_contents`).on('click', `div.celda`, formIndividual)

    ///////////////////////////////////////////
}
function bloquearFormExcepto(objeto, numeroForm, atributos, table) {

    $(`#t${numeroForm} input`).addClass("noEditable")
    $(`#t${numeroForm}`).addClass("noEditable")
    $(`#t${numeroForm} table`).addClass("noEditable")

    $.each(atributos, (indice, value) => {

        $(`#t${numeroForm} input.${value.nombre || value}`).removeClass("noEditable")

    })
    if (table != undefined) {
        $(`#t${numeroForm} table.${table}`).removeClass("noEditable")
        $(`#t${numeroForm} table.${table} tr.last input`).removeClass("noEditable")
    }
}
function habilitarFormExcepto(objeto, numeroForm, atributosComp) {

    $(`#t${numeroForm}`).addClass("noEditable").removeClass("bloqueado")

    $.each(atributosComp.colecciones, (indice, tabla) => {

        $(`#t${numeroForm} table.${tabla.nombre || tabla}`).addClass("noEditable")
        $(`#t${numeroForm} table.${tabla.nombre || tabla} input`).addClass("noEditable")

    })
    $.each(atributosComp.atributos, (indice, value) => {

        $(`#t${numeroForm} input.${value.nombre || value}`).addClass("noEditable")

    })
}