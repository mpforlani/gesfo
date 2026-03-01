$('body').on('click ', `.nav-vert:not(.enEspera) p.menuFormulario`,
    function () {

        let idObj = this.id
        let aprobar = $(this).attr("aprobar")
        let consulta = ""
        let numeroForm = ""

        let imgs = `<div class="comanderaPestana" id="bf${contador}"> <div class="logoGesfin active">
                            <div class="flecha">&nbsp;</div>
                            <div class="logoGesfin_icon uno">&nbsp;</div>
                            <div class="logoGesfin_icon dos">&nbsp;</div>
                            <div class="logoGesfin_icon tres">&nbsp;</div>
                            <div class="logoGesfin_icon cuatro">&nbsp;</div>

                        </div><div class="cartelErrorForm noShow"><p>Revisar los campos en rojo</p></div>
                    <div class="botonesPest">${iHistoria}${iRecargar}${okPlus}${iOk}<div>
            </div>`;

        let idRegistro = aprobar || this.id
        let objeto = variablesModelo[idObj]
        objeto.nombre = idRegistro

        clickFormularioIndividualPestana(objeto, numeroForm, consulta, imgs)
    });

async function clickFormularioIndividualPestana(objeto, numeroFormAnt, consulta, im) {

    let accion = objeto.accion
    let numerAnt = numeroFormAnt.toString() || ""
    const numeroForm = contador
    contador++
    consultaGet[numeroForm] = consulta

    let p = `<div id=p${numeroForm} class="pestana active"><div class="palabraPest">${objeto.pestIndividual || objeto.pest}</div><div class="closeFormInd" id="${numeroForm}">+</div></div>`; //definicion de pestaña

    let pestana = $(p);

    let imgs = im || `<div class="comanderaPestana active" id="bf${numeroForm}" agrupado=${objeto.agrupador || ""}><div class="botonesPest">${iHistoria}${iRecargar}${iLupa}${iImprimir}${iDeshabilitar}${iDelete}${iEdit}${okPlus}${iOk}</div>
            </div>`;

    let imagenes = $(imgs);

    pestana.appendTo('#tabs_links'); //colgamos la pestaña final
    imagenes.appendTo('#comandera');

    let formularioPrimer = "";
    $(`.tabs_contents_item.active`).removeClass("active")
    formularioPrimer += `<div class="tabs_contents_item active creado construyendo formulario${accion}${numeroForm} formularioPestana" id="t${numeroForm}" tabla="formularioPestana" nombre="${objeto.nombre || objeto.accion}" preFather="t${numerAnt}">`;
    formularioPrimer += `<form method="POST" action="/${accion}" id="f${accion}${numeroForm}"></form>`;

    let formPrim = $(formularioPrimer);
    formPrim.appendTo(`#tabs_contents`);

    await crearFormulario(objeto, numeroForm, consulta);
    active(numeroForm);

    $(`#p${numeroForm} .closeFormInd`).on(`click`, function () {

        if ($(`#t${numeroForm} input._id`).val()?.length > 0 && $(`#t${numeroForm} input._id`).attr(`disabled`) != `disabled`) {

            popUpCerrarFormIndividualPest(objeto, numeroForm, this);

        } else {

            funcionCerrar(this)
        }
    })

    $.each(objeto?.formInd?.impresion, (indice, value) => {

        $(`#bf${numeroForm} .barraForm.ocultoImpresion`).removeClass("ocultoImpresion")

    })

}
async function clickFormularioIndividualVistaPrevia(objeto, numeroFormAnt, consulta) {

    const numeroForm = contador
    contador++
    const accion = objeto.accion
    let aprobar = $(`p.menuSelectAbm#${objeto.accion}`).attr("aprobar")

    let idRegistro = aprobar || objeto.accion
    objeto.nombre = idRegistro
    objetoAnterior = variablesFusionadas[$(`#t${numeroFormAnt}`).attr("nombre")]
    const preFather = `#t${numeroFormAnt}`

    let deferred = $.Deferred();

    const okObject = {
        false: iOkVistaPrevia,
        true: iOkFHistoria
    }

    const noEditarObj = {
        true: noEditarAllForm,
        false: (objeto, numeroForm) => { }
    }

    let imgs = `<div class="cabeceraFormIndividual" id="bf${numeroForm}" agrupado=${objeto.agrupador || ""}><div class="tituloFormulario ${consulta.histoForm || ""}"><h1>${consulta.histoForm || objeto.pest}</h1></div>
     <div class="botonesFormIndividual">${iLupa}${iImprimir}${okPlus}${iEdit}${okObject[consulta?.histoForm?.length > 0]}</div>
     <div class="cartel"><div class="cartelErrorForm noShow"><p>Revisar los campos en rojo</p></div></div>
     <div class="closeForm ${numeroForm}">+</div>
     </div>`;
    let imagenes = $(imgs);

    imagenes.appendTo("#formularioVistaPrevia");

    $(`#bf${numeroForm} img.editBoton`).addClass("oculto")

    let formularioPrimer = "";
    formularioPrimer += `<div id="t${numeroForm}" class="formulario tabs_contents_item active creado formulario${accion}${numeroForm}" tabla="vistaPrevia" preFather="${preFather}" recons="${consulta.histoForm || ""}">`;
    formularioPrimer += `<form method="post" action="/${accion}" id="f${accion}${numeroForm}" enctype="multipart/form-data"></form></div>`;

    let formPrim = $(formularioPrimer);
    formPrim.appendTo(`#formularioVistaPrevia`);

    $(`#formularioVistaPrevia`).css("display", "flex");
    consultaGet[numeroForm] = consulta

    await crearFormulario(objeto, numeroForm, consulta)

    $(`#formularioVistaPrevia .closeForm`).on(`click`, () => {

        $(`#formularioVistaPrevia`).css("display", "none");
        $(`#formularioVistaPrevia #t${numeroForm}`).remove();
        $(`#formularioVistaPrevia #bf${numeroForm}`).remove();

        $(`#bf${numeroForm}`).css('pointer-events', 'auto');

        $(`#cortinaNegra`).remove()
        delete consultaGet[numeroForm]

    });
    crearCortinaNegra()
    $(`#bf${numeroForm} .okfBotonVistaPrevia,
       #bf${numeroForm} .okfPlus`).on(`click`, async (e) => {

        let confirmarImprimir = $(e.target).attr("imprimir") || false
        funcionesAntesdeEnviar(objeto, numeroForm).then(async (resultado) => {

            let resultadoPost = await enviarRegistroNuevoForm(numeroForm, objeto)
            if (confirmarImprimir == "true") {

                imprimirDirecto(objeto, numeroForm, resultadoPost.posteo)
            }
            deferred.resolve(resultadoPost);
            $(`#formularioVistaPrevia .closeForm`).trigger("click")
        })
    });

    $.each(objeto?.funcionesPropias?.transformacion, (indice, value) => {

        value[0](objeto, numeroForm, value[1], value[2])
    })
    $.each(consulta?.colores?.cabecera, (indice, value) => {

        const elemento = $(`#form${value.atributo}${numeroForm}`)
        elemento.addClass(value.color)
        $(`input, select`, elemento).trigger("change").trigger("input")

    })
    consulta?.colores?.coleccion.forEach((value, indice) => {

        const elemento = $(`#tablaCol${objeto.accion}${numeroForm} tr[q="${value.posicion}"] input.${value.atributo}`)

        elemento.trigger("change").trigger("input")
        elemento.parent("td").addClass(value.color)

    })
    $.each(consulta?.colores?.adjunto, (indice, value) => {

        $(`#t${numeroForm} div.listadoAdjunto div.tr.fila[fila="${value.posicion}"] div.celdAdj.${value.atributo}`).addClass(value.color)
    })
    $.each(objeto.totalizadores, (indice, value) => {

        $(`#t${numeroForm} input.${value.trigger[0]}`).trigger("input")
    })
    $.each(objetoAnterior?.trigger?.select, (indice, value) => {

        $(`#t${numeroForm} .inputSelect.${value}`).trigger("change")
    })

    noEditarObj[consulta?.histoForm?.length > 0](objeto, numeroForm)

    $(`#t${numeroForm} input.modificado`).trigger("change").trigger("blur")
    //trigger coleccion
    $(`#t${numeroForm} td.atributosVerdes .inputSelect`).trigger("change")
    $(`#t${numeroForm} td.atributosVerdes input:not(.inputSelect)`).trigger("input")
    if ($(`#t${numeroForm}`).attr("recons") != undefined) {

        $(`img.okfImprimirBoton,
           img.okfLupa,
           img.okfImprimir`, `#bf${numeroForm}`).addClass("ocultoSiempre")
    }

    validarElementosExistentes(objeto, numeroForm)
    $.each(objeto.formInd.impresion, (indice, value) => {

        $(`#bf${numeroForm} .barraForm.ocultoImpresion`).removeClass("ocultoImpresion")

    })


    return deferred.promise();
}