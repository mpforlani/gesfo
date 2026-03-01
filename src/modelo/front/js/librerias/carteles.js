

let objetoClase = {
    true: "seleccionado",
    false: ""
}
let objetoInsertado = {
    true: "insertado",
    false: ""
}
function seleccionRegistro(e) {

    $(e.target).parents(`.filaSelec`).toggleClass("seleccionado")
}
function seleecionarRegistroUnico(e) {

    $(e.target).parent(`.filaSelec`).siblings("tr").removeClass("seleccionado")
    $(e.target).parent(`.filaSelec`).toggleClass("seleccionado")

}
let tipoSeleccion = {
    simple: seleecionarRegistroUnico,
    multiple: seleccionRegistro
}
function limpiarMedioPago(objeto, numeroForm) {

    let fatherGral = fatherId((objeto, numeroForm))

    $(`#${fatherGral}`).on(`change`, `select.tipoPago`, (e) => {

        let father = $(e.target).parents("tr")
        let valor = $(`option:selected`, e.target).attr("valuestring")

        if (father.hasClass("completado") && valor != "Cheque") {
            $(father).removeClass("completado")

            $.each(popUp.atributosDestino, (ind, val) => {

                $(`select.${val.nombre || val}`, father).val("").trigger("change").removeClass("oculto")
                $(`input.${val.nombre || val}`, father).val("").trigger("keyup").removeClass("oculto")

                $(`td.${val.nombre || val} p`, father).remove()
            })
        }
    })
}
function insertarCartelCabecera(objeto, numeroForm, mensaje) {
    const cartel = $(`<div class="cartel"><div class="cartelErrorForm" style="display: block;"><p>${mensaje}</p></div></div>`);
    cartel.appendTo(`#bf${numeroForm}`);

    setTimeout(() => {
        cartel.remove();
    }, 5000);
}
/////////////////////////////////////
function activarSacarCartel(objeto, numeroForm) {

    const quitarCartel = () => {

        $(`#bf${numeroForm} .cartelErrorForm`).fadeOut(5000).addClass("noShow")
        $(`#t${numeroForm}`).off("click", `:not(#bf${numeroForm} .cartelErrorForm)`, quitarCartel)
    }
    $(`#t${numeroForm}`).on("click", `:not(#bf${numeroForm} .cartelErrorForm)`, quitarCartel)
}

function activarEliminarCartel(objeto, numeroForm) {

    const quitarCartel = (e) => {

        e.stopPropagation();

        setTimeout(function () {

            $(`#bf${numeroForm} .cartelErrorFront`).remove()
        }, 5000);

        $(document).off("click", `:not(#bf${numeroForm} .cartelErrorFront)`, quitarCartel)
    }
    $(document).on("click", `:not(#bf${numeroForm} .cartelErrorFront)`, quitarCartel)
}
function activarSacarCartelDoble(objeto, numeroForm) {

    const quitarCartel = () => {

        $(`#com${objeto.accion}${numeroForm} .cartelErrorForm`).fadeOut(5000)
        $(`#formularioIndividual`).off("click", `:not(#com${objeto.accion}${numeroForm} .cartelErrorForm)`, quitarCartel)
    }
    $(`#formularioIndividual`).on("click", `:not(#com${objeto.accion}${numeroForm} .cartelErrorForm)`, quitarCartel)
}
function agragarAtributoOtraLinea(objeto, numeroForm, atributo, renglon, titulo) {

    const table = $(`#ampliar${numeroForm}`)

    let lineaExtra = `<div class=" lineaExtra">`
    lineaExtra += `<div class="th"><h2>${titulo}</h2></div>`
    lineaExtra += `<div class="td"><textarea class="tablaDetalle ${atributo.nombre || atributo} ${objeto.clasesInput[atributo.nombre || atributo] || ""}" name="${atributo.nombre || atributo}"></textarea></div>`

    lineaExtra += `</div>`

    $(lineaExtra).appendTo($(`.${renglon}`, table))
}
///// componenetes de carteles 
function aperturaCartelH(objeto, numeroForm) {

    let cuerpoPrincipal = parseFloat($(`#t${numeroForm}`).prop(`scrollHeight`));

    let apertura = `<div class="cartelHelpTotal oculto"><div class="cortinaNegraCartel" style="height:${cuerpoPrincipal}px"><div class="cartelHelp" id="ampliar${numeroForm}">`
    return apertura

}
function filaEspejo(objeto, numeroForm, table) {

    let filaEspejo = ""
    filaEspejo += `<div class="atributosFila">`
    let filasAtr = `<div class="tr fila">`
    let textTarea = `<div class="tr fila textarea">`
    let titulosAtr = `<div class="tr titulos">`
    let titulosIndice = 0

    $.each(table.componentes, (indice, value) => {

        switch (value.type) {
            case `parametrica`:
                filasAtr += `<div class="tdFila ${indice} ${value.nombre}" ${widthObject[value?.width] || `width="diez"`} ${ocultoOject[value?.oculto] || ""}>`

                let param = $(`#t${numeroForm} table.${table.nombre} tr.mainBody:first td.${indice} div.selectCont`)
                let paramDef = param.prop("outerHTML")

                filasAtr += paramDef
                filasAtr += `</div>`
                titulosAtr += `<div class="thFila ${indice} ${value.nombre}" ${widthObject[value?.width] || `width="diez"`}>${table.titulosComponentes[titulosIndice]}</div>`

                $(`#t${numeroForm}`).on(`change`, `#ampliar${numeroForm} .tr.fila input.${indice}`, (e) => {

                    let valorNuevo = e.target.value
                    $(`#t${numeroForm} table.${table.nombre} tr.seleccionadoAmpliar input.${indice}`).val(valorNuevo).trigger("change")
                })

                break;
            case `textarea`:

                let texta = $(`#t${numeroForm} table.${table.nombre} tr.mainBody:first textarea.${indice}`)
                let textaDef = texta.prop("outerHTML")

                textTarea += `<div class="tdFila textarea ${indice} ${value.nombre}">`
                textTarea += `<div class="thFila ${indice} ${value.nombre}">${table.titulosComponentes[titulosIndice]}</div>`
                textTarea += textaDef
                textTarea += `</div>`

                $(`#t${numeroForm}`).on(`input`, `#ampliar${numeroForm} .tr.fila textarea.${indice}`, (e) => {

                    let valorNuevo = e.target.value
                    $(`#t${numeroForm} table.${table.nombre} tr.seleccionadoAmpliar textarea.${indice}`).val(valorNuevo).trigger("input change")
                })


                break;
            default:

                filasAtr += `<div class="tdFila ${indice} ${value.nombre}" ${widthObject[value?.width] || `width="diez"`} ${ocultoOject[value?.oculto] || ""}>`
                let input = $(`#t${numeroForm} table.${table.nombre} tr.mainBody:first input.${indice}`)
                let inputDef = input.prop("outerHTML")

                filasAtr += inputDef

                filasAtr += `</div>`
                titulosAtr += `<div class="thFila ${indice} ${value.nombre}" ${widthObject[value?.width] || `width="diez"`}>${table.titulosComponentes[titulosIndice]}</div>`

                $(`#t${numeroForm}`).on(`input`, `#ampliar${numeroForm} .tr.fila input.${indice}`, (e) => {

                    let valorNuevo = e.target.value

                    $(`#t${numeroForm} table.${table.nombre} tr.seleccionadoAmpliar input:not(.horaMinutos).${indice}`).val(valorNuevo).trigger("input")
                })
                break;
        }
        titulosIndice++

    })
    titulosAtr += `</div>`//Cierro tr titulos
    filasAtr += `</div>`//Cierro tr fila
    filaEspejo += titulosAtr
    filaEspejo += filasAtr
    filaEspejo += textTarea
    filaEspejo += `</div>`
    filaEspejo += `</div>`

    return filaEspejo

}
function tablesComplemento(objeto, numeroForm, table) {

    let tableCuerpo = ``
    let primeraFila = ""
    let ultimaFila = ""
    let totales = ""
    const datos = {
        fecha: (valor) => { return dateNowAFechaddmmyyyy(valor, `y-m-d`) },

    }
    let fila = (indice, value, objeto, numeroForm, valor) => {

        let fila = `<div class="td ${indice}" ${widthObject[value.width] || ""}><input type="${value.type}" class="tablaDetalle ${indice} ${objeto.clasesInput[indice] || ""}" name="${indice}" value="${valor}" form="f${objeto.accion}${numeroForm}" /></div>`

        return fila
    }

    tableCuerpo += `<div class="table ${table.nombre}">`
    //Armado de tabla detalle
    tableCuerpo += `<div class="tableTareas">`
    //Tr titulos
    tableCuerpo += `<div class="tr titulos">`
    primeraFila += `<div class="tr filaInfo" filaOrigen="0">`
    ultimaFila += `<div class="tr filaInfo last">`
    totales += `<div class="tr totales">`
    let indiceCero = 0

    let lengthTable = []

    $.each(table?.complemento?.atributos, (indice, value) => {

        tableCuerpo += `<div class="th ${indice}" ${widthObject[value.width] || ""}>${table?.complemento?.titulos[indiceCero]}</div>`

        let valor = datos?.[value.type]?.(consultaGet?.[numeroForm]?.[indice]?.[0] || "") || consultaGet?.[numeroForm]?.[indice]?.[0] || ""

        primeraFila += fila(indice, value, objeto, numeroForm, valor)
        ultimaFila += `<div class="td ${indice}" ${widthObject[value.width] || ""}><input type="${value.type}"  class="tablaDetalle ${indice} ${objeto.clasesInput[indice] || ""}" name="${indice}" form="f${objeto.accion}${numeroForm}" readOnly=true /></div>`
        totales += `<div class="td totales ${indice}" ${widthObject[value.width] || ""}></div>`

        lengthTable.push(consultaGet?.[numeroForm]?.[indice]?.length)
        indiceCero++
    })

    tableCuerpo += `<div class="th deleteIcon"></div>`
    tableCuerpo += `</div>`//Cierre tr titulos
    primeraFila += `<div class="td oculto"><input class="tablaDetalle positionDetalle" name="positionDetalle" value=${0} form="f${objeto.accion}${numeroForm}"/></div>`
    primeraFila += `<div class="td delete"><span class="material-symbols-outlined botonColeccion deleteIcon">delete</span></div>`;
    primeraFila += `</div>`//Cierre tr primeraFila
    ultimaFila += `<div class="td oculto"><input class="tablaDetalle positionDetalle" name="positionDetalle" form="f${objeto.accion}${numeroForm}" /></div>`
    ultimaFila += `<div class="td delete last"><span class="material-symbols-outlined botonColeccion deleteIcon">delete</span></div>`;
    ultimaFila += `</div>`//Cierre ultima Fila
    totales += `<div class="td delete last"><span class="material-symbols-outlined botonColeccion deleteIcon">delete</span></div>`;
    totales += `</div>`//Cierre totales

    ////ArmadoTabla
    let largo = Math.max(...lengthTable)

    tableCuerpo += primeraFila
    for (let index = 0; index < (largo - 2); index++) {
        let filasExtras = `<div class="tr filaInfo" filaOrigen="${index + 1}">`
        $.each(table?.complemento?.atributos, (indice, value) => {

            let valor = datos?.[value.type]?.(consultaGet[numeroForm][indice][0]) || consultaGet[numeroForm][indice][index + 1]
            filasExtras += fila(indice, value, objeto, numeroForm, valor)
        })

        filasExtras += `<div class="td delete"><span class="material-symbols-outlined botonColeccion deleteIcon">delete</span></div>`;
        filasExtras += `</div>`//Cierre tr filaExtra
        tableCuerpo += filasExtras

    }

    tableCuerpo += ultimaFila
    tableCuerpo += `</div>`//Cierre tableTareas
    tableCuerpo += `</div>`//Cierre tableDetalleTareas
    tableCuerpo += `</div>`//Cierre cartelHelp
    tableCuerpo += `</div>`//Cierre cortinaNegraCartel
    tableCuerpo += `</div>`//Cierre cartelHelpTotal

    return { tableCuerpo: tableCuerpo, totales: totales }

}
function totalesTabla(objeto, numeroForm, table, totales) {
    $.each(table.complemento.totales, (indice, value) => {

        let totColec = $(totales)

        $(`#ampliar${numeroForm} .table.${table.nombre} .tr.last`).after(totColec)


        $.each(value.componentes, (ind, val) => {

            let celda = `<input class="tablaDetalle total ${ind} ${val.nombre || val} ${objeto.clasesInput[indice] || ""}" />`
            $(celda).appendTo($(`.td.totales.${ind}`, $(`#ampliar${numeroForm}`)))

        })
    })
}
//Lista de carteles
function cartelfilaOriginalMasTablaComp(objeto, numeroForm, tablaOrigen) {

    let currentPosition = 0
    let cartelAmpliar = ""
    cartelAmpliar += aperturaCartelH(objeto, numeroForm)
    cartelAmpliar += primeraLineaConfimar()
    cartelAmpliar += filaEspejo(objeto, numeroForm, tablaOrigen)
    const cuerpoTabla = tablesComplemento(objeto, numeroForm, tablaOrigen)
    cartelAmpliar += cuerpoTabla.tableCuerpo

    $(cartelAmpliar).appendTo(`#t${numeroForm}`)
    let cortinaNegraComandos = `<div class="cortinaNegraComandos oculto"><div>`
    $(cortinaNegraComandos).appendTo(`#bf${numeroForm}`)//Esta es la coritna negra para tapar los comandos

    $(`#ampliar${numeroForm} .atributosFila input`).removeAttr(`form`).removeClass(`requerido`)
    $(`#ampliar${numeroForm} input[type=fecha]`).attr(`type`, `date`)


    totalesTabla(objeto, numeroForm, tablaOrigen, cuerpoTabla.totales)

    const aperturaCartel = (e) => {

        let filaFather = $(e.target).parents(`tr`)
        filaFather.addClass("seleccionadoAmpliar")
        currentPosition = $(`input.position`, filaFather).val()

        $(`#t${numeroForm} .cartelHelpTotal`).removeClass(`oculto`)
        $(`#bf${numeroForm} .cortinaNegraComandos`).removeClass(`oculto`)
        $(e.target).trigger("blur")//pongo blur para validar horaFecha

        $.each(tablaOrigen.componentes, (indice, value) => {

            switch (value.type) {
                case `parametrica`:

                    let valorIncialSelect = $(`input.${indice}`, filaFather).val()
                    $(`#ampliar${numeroForm} input.inputSelect.${indice}`).val(valorIncialSelect).trigger("change")

                    break;
                case `textarea`:

                    let valorIncialtext = $(`textarea.${indice}`, filaFather).val()
                    $(`#ampliar${numeroForm} textarea.${indice}`).val(valorIncialtext).trigger("change")

                    break;
                default:

                    let valorIncial = $(`input.${indice}`, filaFather).val()
                    $(`#ampliar${numeroForm} input.${indice}`).val(valorIncial).trigger("change")

                    break;
            }
        })

        let filasDisponibles = $(`#ampliar${numeroForm} .table.${tablaOrigen.nombre} .tr:not(.titulos):not(.totales):not(.last)`)

        let filasposition = 0
        $.each(filasDisponibles, (indice, value) => {

            if (Number($(`input.positionDetalle`, value).val()) == Number(currentPosition)) {

                $(value).removeClass(`oculto`)
                filasposition++
            } else {
                $(value).addClass(`oculto`)
            }
        })

        if (filasposition == 0) {

            $(`#t${numeroForm} .cartelHelpTotal .tr.last`).trigger(`dblclick`)

        }
        let consumido = 0
        let remanente = 0

        $.each($(`#ampliar${numeroForm} .tr.filaInfo:not(.last):visible`), (indice, value) => {

            let consumidoFila = horasAMinutos($(`input.consumidoDetalle`, value).val() || '0h 0m')
            let remanentefila = horasAMinutos($(`input.remanenteDetalle`, value).val() || '0h 0m')

            consumido = consumido + consumidoFila
            remanente = remanente + remanentefila
        })
        $(`#ampliar${numeroForm} input.totalconsumidoDetalle`).val(minutosAHoraMinutos(consumido))
        $(`#ampliar${numeroForm} input.totalremanenteDetalle`).val(minutosAHoraMinutos(remanente))


    }

    $(`#t${numeroForm} .tablaCompuesto`).on(`dblclick`, 'tr:not(.last) input:not(.position)', aperturaCartel)

    $(`#t${numeroForm} table.${tablaOrigen.nombre}`).addClass("dblclick")

    let dobleclick = `<div class="dobleClick"><h1>Doble click</h1></div>`
    $(dobleclick).appendTo(`#t${numeroForm} table.${tablaOrigen.nombre}`)


    $(`#ampliar${numeroForm}`).on(`click`, `.okEnviar`, (e) => {

        $(`#t${numeroForm} .cartelHelpTotal`).addClass(`oculto`)
        $(`#bf${numeroForm} .cortinaNegraComandos`).addClass(`oculto`)
        $(`#t${numeroForm} tr.seleccionadoAmpliar`).removeClass("seleccionadoAmpliar")
    })

    $(`#t${numeroForm}`).on(`mouseenter`, `table.${tablaOrigen.nombre}:not(.referenciaCartelDblClick)`, (e) => {

        $(e.currentTarget).addClass(`referenciaCartelDblClick`)

        const tableUbic = $(`#t${numeroForm} table.${tablaOrigen.nombre}`)

        const tableUbi = tableUbic.offset();
        const dimensiones = tableUbic.outerHeight()

        let ubicacion = Number(tableUbi.top) - Number(dimensiones) + 25
        $(`#t${numeroForm} div.dobleClick`).css({ "top": `${ubicacion}px`, "left": "30px" })
    })
    $(`#t${numeroForm}`).on(`mouseenter`, `table.dblclick tr`, (e) => {

        let father = $(e.target).parents(`table`)


        $(`div.dobleClick`, father).addClass(`show`)
    })
    $(`#t${numeroForm}`).on(`mouseleave`, `table.dblclick tr`, (e) => {

        let father = $(e.target).parents(`table`)
        $(`div.dobleClick`, father).removeClass(`show`)

    })

    const agregarFila = (e) => {

        let father = e.currentTarget

        $(father).removeClass("last").attr(`filaOrgien`, currentPosition)
        $(`input.positionDetalle`, father).val(currentPosition)
        $(`.td.delete`, father).removeClass("last")
        $(`input`, father).removeAttr("readOnly")

        let nuevoRenglon = `<div class="tr filaInfo last">`

        $.each(tablaOrigen?.complemento?.atributos, (indice, value) => {

            nuevoRenglon += `<div class="td ${indice}" ${widthObject[value.width] || ""}><input type="${value.type}" class="tablaDetalle ${indice} ${objeto.clasesInput[indice] || ""}" name="${indice}" form="f${objeto.accion}${numeroForm}" readOnly=true/></div>`
        })
        nuevoRenglon += `<div class="td oculto"><input class="tablaDetalle" name="positionDetalle" form="f${objeto.accion}${numeroForm}" /></div>`
        nuevoRenglon += `<div class="td delete last"><span class="material-symbols-outlined botonColeccion deleteIcon">delete</span></div>`;

        nuevoRenglon += `</div>`

        $(father).after(nuevoRenglon)
        $(`#ampliar${numeroForm} input[type=fecha]`).attr(`type`, `date`)

    }

    $(`#t${numeroForm}`).on(`dblclick`, `.cartelHelpTotal .tr.last`, agregarFila)

    const deleteFila = (e) => {

        let father = $(e.target).parents(".tr.filaInfo")

        if (father.index() == 1) {

            $(`input:not(.positionDetalle)`, father).val("")

        } else {

            $(father).remove()

        }
    }
    $(`#t${numeroForm}`).on(`click`, `.td.delete`, deleteFila)

    $.each(tablaOrigen.complemento.oculto, (indice, value) => {

        $(`#ampliar${numeroForm} .tdFila.${value.nombre || value},
           #ampliar${numeroForm} .thFila.${value.nombre || value}`).addClass("oculto")
    })
}
function cartelAccion(objeto, numeroForm, mensaje) {

    let cartel = `<div class="cartelComplementario cartelInformativo accion">`
    cartel += primeraLineaConfimar(objeto, numeroForm)


}
function agregarCotinaNegra(father) {

    let height = $(father)[0].scrollHeight;

    let cortina = `<div class="cortinaNegra" style="height:${height}px;"></div>`

    $(cortina).appendTo(father)
}
function removeCotinaNegra(numeroForm) {

    $(`#t${numeroForm} .cortinaNegra`).remove()
    $(`#bf${numeroForm} .cortinaNegraComandos`).remove()
}
/////Crear cartel
function cartelElinimarSioNo(numeroForm, pregunta) {
    let eliminacion = `<div class= "cartelEliminar ${numeroForm}"><h1>¿ Desea eliminar ${pregunta} ?</h1>`;

    eliminacion += `<div class= "respuestas">
        <div class="si">SI</div> <div class="no">NO</div>
        </div>
        </div>`;

    return eliminacion;
}
function cartelSioNo(numeroForm, pregunta) {
    let eliminacion = `<div class= "cartelsino ${numeroForm}"><h1> ${pregunta}</h1>`;

    eliminacion += `<div class= "respuestas">
        <div class="si">SI</div> <div class="no">NO</div>
        </div>
        </div>`;

    return eliminacion;
}
function cartelInforUnaLinea(mensaje, icono, clase) {

    let cartel = `<div class="cartelInfo ${clase?.cartel || ""}">
        <div class="cabecera"><div class="closePopInf ${clase?.close}">+</div></div>
        <div class="bloque"><div class="icono ${clase?.icono || ""}">${icono}</div><div class="texto">${mensaje}</div></div>
        </div>`

    return cartel
}
function cartelInforUnaLineaBotonEnviar({ mensaje, mensajeBoton }, { iconoTexto, iconoBoton }, clase) {

    let cartel = `<div class="cartelInfo ${clase?.cartel || ""}">
        <div class="cabecera"><div class="closePopInf">+</div></div>
        <div class="bloque 0">
        <div class="icono ${clase?.icono || ""}">${iconoTexto || ""}</div><div class="texto">${mensaje}</div>
        </div>
        <div class="bloque 1">
        <div class="botonEnviar"> ${iconoBoton || ""}${mensajeBoton || ""}</div></div>
        </div>
        </div>`

    return cartel
}
function cartelInformativoTexto(objeto, numeroForm, mensaje) {

    let cartel = `<div class="cartelInformativo">
    <div class="closePop">+</div>
    
    <h5>${mensaje}</h5></div>`

    $(cartel).appendTo(`#t${numeroForm}`)

    $(`.cartelInformativo div.closePop`).on("click", () => {

        $(`#t${numeroForm} .cartelInformativo`).remove()
    })

}
function cartelAdvertenciaRojo(titulo, mensaje) {//Cartel rojo con cruz, titulo y descripción

    let cartel = `<div class="cartelRojoAdvertencia">

    <div class="icono-error">❌</div>
     <div class="contenidoCartelRojo">
      <div class="closePopAdv">+</div>
            <strong>${titulo}</strong>
            <p>${mensaje}.</p>
        </div>
    </div>`

    return cartel

}
function cartelComplemento(objeto, numeroForm, estructura) {

    let cartelComplemento = `<div class="cartelComplemento ${estructura?.claseCartel || ""}" id="ampliar${numeroForm || "cartel"}" style="top:${estructura?.position?.top || "20%"}; left:${estructura?.position?.left || "50%"};">`

    cartelComplemento += `<div class="bloqueCabecera ${estructura?.clasebloqueCabecera || ""}"><div class="botonera"><div class="botonCartel ${estructura?.botonConfirmar || ""} "><span class="material-symbols-outlined botones okBoton">check_circle</span></div></div><div class="closePop">+</div></div>`

    for (let x = 0; x < (estructura?.bloques || 1); x++) {
        cartelComplemento += `<div class="bloque bloque${x} ${estructura?.claseBloque || ""}">`
        cartelComplemento += `</div>`//Cerrar bloque    }
    }

    cartelComplemento += `</div>`//Cerrar cartel complemento
    return cartelComplemento

}
function cartelComplementoConCortina(objeto, numeroForm, estructura) {

    let cortinaNegraComandos = `<div class="cortinaNegraComandos"><div>`
    $(cortinaNegraComandos).appendTo(`#bf${numeroForm}`)//Esta es la cortina negra para tapar los comandos

    let cartel = cartelComplemento(objeto, numeroForm, estructura)

    $(cartel).appendTo(`#t${numeroForm}`)

    setTimeout(() => {
        agregarCotinaNegra(`#t${numeroForm}`);
    }, 200);
}
function removeCartelInformativo(objeto, numeroForm) {

    setTimeout(function () {

        $(`#bf${numeroForm} .cartelInfo`).addClass(`chau`)
        setTimeout(function () {

            $(`#bf${numeroForm} .cartelInfo`).remove()

        }, 1500)

    }, 3000);
}
$(`body`).on("click", `.cartelComplemento:not(.body):not(.notCort) .closePop`, (e) => {

    let cartel = $(e.target).parents(`.cartelComplemento`)
    let numeroForm = $(e.target)?.parents(`.tabs_contents_item`)?.attr("id")?.slice(1)
    removeCotinaNegra(numeroForm)
    $(cartel).remove()

})
$(`body`).on("click", `.cartelComplemento.notCort:not(.body) .closePop`, (e) => {

    let cartel = $(e.target).parents(`.cartelComplemento`)
    $(cartel).remove()
})
$(`body`).on("click", `.cartelComplemento.body .closePop`, (e) => {

    let cartel = $(e.target).parents(`.cartelComplemento.body`)
    $(`.cartelComplemento.body`).addClass("chau")
    setTimeout(() => {
        $(cartel).remove()
    }, 1000);


})
$(`body`).on("click", `.tabs_contents_item .closePopAdv`, (e) => {

    let cartel = $(e.target).parents(`.cartelRojoAdvertencia`)
    cartel.addClass("chau")
    setTimeout(() => {
        $(cartel).remove()

    }, 2000)

})
//cartel informativo
$(`body`).on("click", `.cartelInfo .closePopInf`, (e) => {

    let cartel = $(e.currentTarget).parents(`.cartelInfo`)
    cartel.addClass("chau")

    setTimeout(() => {
        $(cartel).remove()

    }, 2000)

})