async function formularioTesting(objeto, numeroForm) {

    const formEl = $(`#f${objeto.accion}${numeroForm}`)[0];
    const data = Object.fromEntries(new FormData(formEl).entries());

    // 🔹 Limpiar los atributos que sean "false" (string) o false (boolean)
    const limpio = Object.fromEntries(
        Object.entries(data).filter(([k, v]) => v !== 'false' && v !== "")
    );

    fetch('/testingIngresar?visible=true&slowmo=300', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(limpio)
    })
        .then(res => res.json())
        .then(data => {
            console.log('Respuesta del servidor:', data);
        })
        .catch(err => {
            console.error('Error en la solicitud:', err);
        });
}
$(`body`).one('click ', `#testing`, function (objeto, numeroForm) {

    let navCompleta = $(`.nav-vert .desplegableAbm:not([view="base"]):not([agrupador="Usuario y Seguridad"])`)
    let objetoTabla = []
    variablesModelo.testing.tablaDobleEntrada.oculto = new Object
    variablesModelo.testing.tablaDobleEntrada.oculto.crearInd = []
    variablesModelo.testing.tablaDobleEntrada.oculto.crearAbm = []
    variablesModelo.testing.tablaDobleEntrada.oculto.editInd = []
    variablesModelo.testing.tablaDobleEntrada.oculto.editAbm = []
    variablesModelo.testing.tablaDobleEntrada.oculto.eliminar = []
    variablesModelo.testing.tablaDobleEntrada.oculto.imprimir = []

    $.each(navCompleta, (indice, value) => {

        let items = $(`.menuSelectAbm`, $(value).siblings(`.subMenu`))
        let agrup = $(value).attr(`agrupador`)
        let detalle = { componentes: [], titulo: agrup }

        $.each(items, (indice, val) => {

            let id = $(val).attr(`aprobar`) || $(val).attr(`id`)
            let agrupTit = $(val).html().trim()
            let elemento = { nombre: id, titulo: agrupTit }
            detalle.componentes.push(elemento)

            if ($(val).attr(`aprobar`) != undefined) {

                variablesModelo.testing.tablaDobleEntrada.oculto.crearInd.push(id)
                variablesModelo.testing.tablaDobleEntrada.oculto.editInd.push(id)
                variablesModelo.testing.tablaDobleEntrada.oculto.editAbm.push(id)
                variablesModelo.testing.tablaDobleEntrada.oculto.eliminar.push(id)
                variablesModelo.testing.tablaDobleEntrada.oculto.imprimir.push(id)

            }

            if ($(val).attr(`aprobar`) == undefined && $(`.menuFormulario#${id}`).length == 0) {

                variablesModelo.testing.tablaDobleEntrada.oculto.crearInd.push(id)

            }

            if ($(val).attr(`aprobar`) == undefined && variablesModelo?.[id]?.atributos?.names?.find(e => e.type == "coleccionInd") != undefined) {

                variablesModelo.testing.tablaDobleEntrada.oculto.crearAbm.push(id)
                variablesModelo.testing.tablaDobleEntrada.oculto.editAbm.push(id)

            }
        })

        if (items.length > 0) {
            objetoTabla.push(detalle)

        }
    })

    variablesModelo.testing.tablaDobleEntrada.fila = objetoTabla
})
function botonMultipleTesting(objeto, numeroForm) {

    $(`#t${numeroForm}`).on(`click`, `div.botonMultiple`, (e) => {

        let father = e.target.closest(`td`)
        let registros = $(`input[type="hidden"]`, father)

        cartelComplementoConCortina(objeto, numeroForm, { claseCartel: "casosDet widthTreinta" })

        $(`#t${numeroForm} .cartelComplemento.casosDet`).attr("entidad", $(e.currentTarget).attr("atributo"))

        let registrosTabla = `<table>`
        let fila = 0

        registrosTabla += `<tr class="filaInput titulo"><th width="quince">Caso Testing</th>
            <th></th>
            <th></th></tr>`

        $.each(registros, (ind, val) => {

            fila++

            registrosTabla += `<tr class="filaInput" fila="${ind}"><td width="veinte"><input fila="${ind}" name="testingCrear" value="${val.value}" form="test${numeroForm}"  ${autoCompOff} /></td>
            <td class="textoCentrado notPadding"><span class="material-symbols-outlined botonesCartel ver">search</span></td>
            <td class="textoCentrado notPadding"><span class="material-symbols-outlined botonesCartel delete">delete</span></td></tr>`
        })

        registrosTabla += `<tr class="filaInput agregar" fila="${fila}"><td width="veinte"><input fila="${fila}" name="testingCrear" form="test${numeroForm}" readonly  ${autoCompOff} /></td>
            <td class="textoCentrado notPadding"><span class="material-symbols-outlined botonesCartel ver oculto">search</span></td>
            <td class="textoCentrado notPadding"><span class="material-symbols-outlined botonesCartel delete oculto">delete</span></td></tr>`
        fila++

        registrosTabla += `</table>`

        $(registrosTabla).appendTo($(`#t${numeroForm} .cartelComplemento .bloque0`))
        $(`#t${numeroForm} .cartelComplemento .bloque0`).addClass("flex centrado")
    })
    $(`#t${numeroForm}`).on("dblclick", `.cartelComplemento tr.filaInput.agregar`, (e) => {

        let father = e.currentTarget
        let fila = stringANumero($(father).attr("fila"))
        $(`input`, father).removeAttr("readonly")
        fila++
        $(father).removeClass("agregar")
        $(`span.oculto`, father).removeClass("oculto")

        let registrosTablaAgregar = `<tr class="filaInput agregar" fila="${fila}"><td width="veinte"><input fila="${fila}" name="testingCrear" form="test${numeroForm}" readonly  ${autoCompOff} /></td>
            <td class="textoCentrado notPadding"><span class="material-symbols-outlined botonesCartel ver oculto">search</span></td>
            <td class="textoCentrado notPadding"><span class="material-symbols-outlined botonesCartel delete oculto">delete</span></td></tr>`


        $(registrosTablaAgregar).appendTo($(`#t${numeroForm} .cartelComplemento .bloque0 table`))

    })
    $(`#t${numeroForm}`).on("click", `.cartelComplemento span.delete`, (e) => {

        let father = $(e.target).parents(`tr`)
        let primerFilafila = $(`#t${numeroForm} .cartelComplemento .bloque0 table tr:not(.titulo):first`);

        if (primerFilafila.attr("fila") == father.attr("fila")) {

            let lenghtFila = $(`#t${numeroForm} .cartelComplemento .bloque0 table tr:not(.agregar):not(.titulo)`).length

            if (lenghtFila > 1) {
                father.remove()
            } else {
                $(`input`, father).val("")

            }
        } else {

            $(father).remove()

        }
    })
    $(`#t${numeroForm}`).on("click", `.cartelComplemento span.ver`, async (e) => {

        let entidad = $(e.target).parents(`.cartelComplemento`).attr("entidad")

        let numeroFormNuevo = await formularioIndividualTesting(variablesModelo[entidad], numeroForm)
        $(`#t${numeroFormNuevo} .cabeceraTesting .inputSelect.testingCabecera`).val(variablesModelo[entidad].pest).addClass("validado")

    })
}
async function formularioIndividualTesting(objetoDef, numeroFormAnt, consulta) {

    let objeto = objetoDef
    if (consulta._id?.length > 0) {

        consulta.atributos._id = consulta._id
        objeto = variablesModelo[consulta.entidad]
    }

    const nuevaFunc = { agregarIDPestanas: [agregarIDPestanas], ...objeto?.funcionesPropias?.cargar };
    objeto.funcionesPropias = objeto.funcionesPropias || {};
    objeto.funcionesPropias.cargar = nuevaFunc;

    await clickFormularioIndividualPestana(objeto, numeroFormAnt, consulta?.atributos || {})

    let numeroForm = $(`.tabs_contents_item.active[prefather="t${numeroFormAnt}"]`).attr("id").slice(1)
    let cabeceraTesting = cabeceraTestingFunc(objeto, numeroForm, consulta)

    $(cabeceraTesting).prependTo(`#t${numeroForm}`)
    $(`#t${numeroForm}`).css(`max-height`, heightTabla(numeroForm))
    $(`#bf${numeroForm}`).on(`click`, `.enviarTesting`, (e) => {

        funcionesAntesdeEnviar(objeto, numeroForm).then(async (resultado) => {

            await enviarRegistroTesting(numeroForm, objetoDef)
            quitarEsperaForm(objeto, numeroForm)

        }).catch((error) => {
            console.error(error);
        });
    });

    funcionalidadesTesting(objeto, numeroForm)

    if (objeto.accion == "casosTesting") {
        $(`#t${numeroForm} .renglon:not(:first)`).remove()
        $(`#t${numeroForm} .renglon div`).remove()

        document.querySelector(`#t${numeroForm} .renglon`).style.minHeight = "150px";
    }
    botonesEdit(objeto, numeroForm)

    if (consulta?._id?.length > 1) {

        $(`#t${numeroForm} .cabeceraTesting input`).addClass("validado")
        consultaGet[numeroForm] = consulta
    }

    return numeroForm

}
async function enviarRegistroTesting(numeroForm, objeto) {

    let type = {
        true: "put",
        false: "post"
    }

    const date = dateNowAFechaddmmyyyy(Date.now(), 'y-m-dThh');
    transformarNumeroAntesEnviar(numeroForm);

    let _id = $(`#t${numeroForm} input._id`).val();
    let entidad = $(`#t${numeroForm} .divSelectInputTest`).val().trim()

    const formEl = document.querySelector(`#f${variablesModelo[entidad].accion}${numeroForm}`);
    const env = document.querySelector(`#test${numeroForm}`);
    const atributos = {};
    const formData = new FormData(formEl);

    for (const [key, value] of formData.entries()) {

        let atributoCabecera = variablesModelo[entidad].atributos.names.find(e => e.nombre == key)

        if (atributoCabecera == undefined) {

            atributos[key] = atributos[key] || []
            atributos[key].push(value);

        } else {

            atributos[key] = value;
        }
    }

    const datoTesting = Object.fromEntries(new FormData(env).entries());

    const objetoEnviar = {
        _id,
        date,
        mostrar: objeto?.pest ?? '',
        key: objeto?.key ?? 'name',
        atributos: atributos,   // 👈 acá van todos los campos del form
        ...datoTesting
    };
    delete objetoEnviar.atributos._id
    if (_id == "") {
        await insertarNumeradorForm(objeto, numeroForm);
    }

    $.ajax({
        type: type[_id.length > 1],
        url: `/${type[_id.length > 1]}?base=casosTesting`,
        data: JSON.stringify(objetoEnviar),
        contentType: 'application/json',
        beforeSend: () => mouseEnEsperaForm(objeto, numeroForm),
        success: async function (response) {

            if (response.posteo != undefined) {

                let cartel = cartelInforUnaLinea(response.mensaje, "☑️", { cartel: "infoChiquito verde", close: "ocultoSiempre" })
                $(cartel).appendTo(`#bf${numeroForm}`)
                let entidad = $(`#t${numeroForm} .inputSelect.testingCabecera `).val()
                removeCartelInformativo(objeto, numeroForm)
                reCrearporIngresoDeRegistro(objeto, numeroForm)

                await recrearTestingForm(objeto, numeroForm)

                let numerador = numeradorDato(variablesModelo.casosTesting, numeroForm).numerador
                $(`#t${numeroForm} .foTest.numerador h2.num`).html(numerador)
                $(`#t${numeroForm} .foTest.numerador input`).val(numerador)
                $(`#t${numeroForm} .inputSelect.testingCabecera`).val(entidad).trigger("change")
                $(`#t${numeroForm} .cabeceraTesting input.nombreTesting`).val("").removeClass("validado")

                $(`#t${numeroForm} .cabeceraTesting input#edit`).prop('checked', false).trigger("change")

            } else {
                //  errorMongoEnvio(objeto, numeroForm, response)
            }
        },
        error: function (error) {
            console.log(error);
        },
    });
};
async function enviarRegistroEdit(numeroForm, objeto) {

    const date = dateNowAFechaddmmyyyy(Date.now(), 'y-m-dThh');
    transformarNumeroAntesEnviar(numeroForm);

    const formEl = document.querySelector(`#f${objeto.accion}${numeroForm}`);
    const atributosEdit = Object.fromEntries(new FormData(formEl).entries());

    const objetoEnviar = {
        date,
        entidad: objeto.accion,
        mostrar: objeto?.pest ?? '',
        key: objeto?.key ?? 'name',
        atributosEdit   // 👈 acá van todos los campos del form
    };

    $.ajax({
        type: 'PUT',
        url: '/put?base=casosTesting',
        data: JSON.stringify(objetoEnviar),
        contentType: 'application/json',
        beforeSend: () => mouseEnEsperaForm(objeto, numeroForm),

        success: function (response) {

            if (response.posteo != undefined) {

                let cartel = cartelInforUnaLinea(response.mensaje, "☑️", { cartel: "infoChiquito verde", close: "ocultoSiempre" })
                $(cartel).appendTo(`#bf${numeroForm}`)
                removeCartelInformativo(objeto, numeroForm)
                activarSacarCartel(objeto, numeroForm)

                limpiarEnviarRegistro(objeto, numeroForm).then((resultado) => {
                    numeradorActualizarForm(objeto, numeroForm)

                }).catch((error) => {

                    console.log(error);
                });

                reCrearporIngresoDeRegistro(objeto, numeroForm)

            } else {
                //  errorMongoEnvio(objeto, numeroForm, response)


            }
        },
        error: function (error) {
            console.log(error);
        },
    });
};
function crearTesting(objeto, numeroForm) {

    $(`#bf${numeroForm}`).on(`click`, `.crearTesting`, async (e) => {

        let id = $(`#t${numeroForm} .tr.sel div.celda._id`)?.html()?.trim();
        let consulta = consultaGet[numeroForm].find(element => element._id == id) || {}

        await formularioIndividualTesting(objeto, numeroForm, consulta)

    })
}
function validarCampoSelectSelecTest(e) {

    let contenedorSelect = $(e.target).parents(`.selectCont`)
    let sel = $(`.inputSelect`, contenedorSelect)
    let value = sel.val()
    let opcionesOculto = $(`.opcionesSelectDiv .opciones:not(.primeroVacio) p`, contenedorSelect)

    if (value.length > 0) {

        let select = opcionesOculto.toArray().find(e => e.textContent.trim() === value.trim());

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
function botonesEdit(objeto, numeroForm) {

    function oculAtributos(e) {

        if ($(e.target).is(":checked")) {

            $(`#t${numeroForm} div.foTest.editObj`).removeClass("oculto")

        } else {
            $(`#t${numeroForm} div.foTest.editObj`).addClass("oculto")
        }
    }
    $(`#t${numeroForm}`).on("change", `input#edit`, oculAtributos)
    $(`#t${numeroForm} input#edit`).trigger("change")

    $(`#t${numeroForm}`).on("click", "span.ojito", (e) => {

        let father = e.target.closest("div")
        $("span.ojito", father).toggleClass("oculto")

        if ($(`#t${numeroForm}`).hasClass(`formularioTesting`)) {

            $(`#bf${numeroForm} span.editBoton`).trigger("click").addClass("oculto")
            $(`#t${numeroForm}`).removeClass(`formularioTesting`).addClass("formularioTestingEdit")
            $(`#t${numeroForm}  .tipoTest h2`).html("Registro Editado")

            $(`#t${numeroForm} div.fo:not(.notEdit),
           #t${numeroForm} td:not(.notEdit)`).addClass("testNoActive")
            $(`#t${numeroForm} .testNoActive input:not(._id),
           #t${numeroForm} .testNoActive textarea`).attr("disabled", "disabled")

            $(`#bf${numeroForm} span.enviarTesting`).removeClass(`enviarTesting`).addClass("enviarTestingEdit")

            delete consultaGet?.[numeroForm]?.atributosEdit._id

            for (const [indice, value] of Object.entries(consultaGet?.[numeroForm]?.atributosEdit || {})) {

                let atributo = objeto.atributos.names.find(e => e.nombre == indice)

                switch (atributo.type) {
                    case "parametrica":

                        let valor = consultaPestanas[atributo.origen][value]
                        $(`#t${numeroForm} div.fo.${indice}`).removeClass("testNoActive")
                        $(`#t${numeroForm} .inputSelect.${indice}`).val(valor.name).removeAttr("disabled").trigger("change")

                        break;
                    default:

                        $(`#t${numeroForm} input[name=${indice}]`).removeAttr("disabled").val(value).trigger("input")

                        break;
                }
            }

        } else {

            $(`#bf${numeroForm} span.enviarTestingEdit`).removeClass(`enviarTestingEdit`).addClass("enviarTesting")
            $(`#t${numeroForm} div.fo.testNoActive,
            #t${numeroForm} td.testNoActive`).removeClass("testNoActive")
            $(`#t${numeroForm} td input.opacityCero`).parents("div.fo").addClass("testNoActive")
            $(`#t${numeroForm}`).addClass(`formularioTesting`).removeClass("formularioTestingEdit")
            $(`#t${numeroForm}  .tipoTest h2`).html("Registro Nuevo")

        }
    })
}
async function recrearTestingForm(objeto, numeroForm) {

    let cabecera = $(`#t${numeroForm} .cabeceraTesting`)
    let preFather = $(`#t${numeroForm}`).attr("prefather")
    $(`#t${numeroForm}`).remove()

    let formularioPrimer = "";
    formularioPrimer += `<div class="tabs_contents_item active creado formulario${objeto.accion}${numeroForm} formularioPestana" id="t${numeroForm}" tabla="formularioPestana" nombre="${objeto.nombre || objeto.accion}" preFather="${preFather}">`;
    formularioPrimer += `<form method="POST" action="/${objeto.accion}" id="f${objeto.accion}${numeroForm}"></form>`;

    let formPrim = $(formularioPrimer);
    formPrim.appendTo(`#tabs_contents`);
    $(cabecera).prependTo(`#t${numeroForm}`)

    await crearFormulario(objeto, numeroForm);

    $(`#bf${numeroForm} span.okBoton`).removeClass(`okBoton`).addClass("enviarTesting")

    funcionalidadesTesting(objeto, numeroForm)
    botonesEdit(objeto, numeroForm)
}
function cabeceraTestingFunc(objeto, numeroForm, consulta) {

    const checking = {
        true: "checked",
        false: ""
    }
    let numerador = consulta.numerador || numeradorDato(variablesModelo.casosTesting, numeroForm).numerador

    let cabeceraTesting = `<div class="cabeceraTesting padding-bot-med"><form id="test${numeroForm}"></form>`
    cabeceraTesting += `<div class="filaUnoTestin flex">`
    cabeceraTesting += `<div class="foTest numerador flex"><div><h2>Número:&nbsp</h2></div><div><h2 class="num">${numerador}</h2><input type="hidden" name="numerador" form="test${numeroForm}" value=${numerador}  ${autoCompOff} /></div></div>`
    cabeceraTesting += `<div class="foTest flex margin-left-dos"><div><h2>Nombre testing: &nbsp</h2></div><div><input type="texto" class="form nombreTesting padding-left-med requerido" name="name" value="${consulta.name || ""}" form="test${numeroForm}" valid="texto"  ${autoCompOff} /></div> </div>`
    cabeceraTesting += `<div class="foTest flex margin-left-dos"><div><h2>Entidad: &nbsp</h2></div><div>${cargarPreEstablecidaTesting(objeto, numeroForm, consulta?.entidad || "")}</div></div>`
    cabeceraTesting += `<div class="foTest flex margin-left-dos"><div><h2>Accion: &nbsp</h2></div><div>${accionesTesting(objeto, numeroForm)}</div></div>`
    cabeceraTesting += `</div>`
    cabeceraTesting += `<div class="filaDosTestin flex margin-top-uno">`
    cabeceraTesting += `<div class="foTest flex"><div class="centroVertical"><h2>Editar:&nbsp</h2></div><div class="centroVertical"><input type="checkbox" ${checking[consulta?.edit || false]} class="form checkbox verticalAlignInput" id="edit"  ${autoCompOff} /><input type="hidden" class="form checkbox" name="edit" form="test${numeroForm}" value="${consulta.edit || ""}"  ${autoCompOff} /></div></div>`
    cabeceraTesting += `<div class="foTest flex editObj margin-left-dos"><div class="centroVertical"><h2>Vista Edición:&nbsp</h2></div><div class="centroVertical"><span class="material-symbols-outlined oculto ojito">visibility</span>
        <span class="material-symbols-outlined tachado ojito">visibility_off</span></div></div>`
    cabeceraTesting += `<div class="foTest flex margin-left-dos editObj"><div class="tipoTest"><h2>Registro Nuevo</h2></div></div>`
    cabeceraTesting += `</div></div>`

    return cabeceraTesting
}
function funcionalidadesTesting(objeto, numeroForm) {

    $(`#bf${numeroForm}`).addClass("formularioTesting")
    $(`#t${numeroForm}`).addClass("formularioTesting")
    $(`#t${numeroForm} input`).addClass("casoTesting")

    let autoCompletado = `<p class="autcompletado">Autocompletado</p>`
    $(autoCompletado).appendTo(`#t${numeroForm} div.fo.numerador`)

    $(`#t${numeroForm} div.fo.numerador`).addClass("notEdit")

    $(`#t${numeroForm} div.fo.adjunto,
       #t${numeroForm} div.listadoAdjunto `).remove()

    $(`#t${numeroForm} div.fo.habilitado input,
       #t${numeroForm} input.date,
       #t${numeroForm} input.username,
       #t${numeroForm} input[type="importe"][name$="ma"],
       #t${numeroForm} input[type="importe"][name$="mb"],
       #t${numeroForm} input.soloLectura,
       #t${numeroForm} input.total,
       #t${numeroForm} input.divSelectInput,
       #t${numeroForm} div.fo.numerador input`).removeAttr("form")

    $(`#t${numeroForm} input.soloLectura,
       #t${numeroForm} input.total`).parents("div").addClass("notEdit")
    $(`#t${numeroForm} input.soloLectura,
       #t${numeroForm} input.total`).parents("td").addClass("notEdit")

    $(`#bf${numeroForm} span.okBoton`).removeClass(`okBoton`).addClass("enviarTesting").removeClass("oculto")
    $(`#t${numeroForm} .inputSelect:not(.testingCabecera )`).attr("form", `f${objeto.accion}${numeroForm}`)

    let accion = $(`#t${numeroForm} .inputSelect.testingCabecera.acciones`).val()
    accion = accion.charAt(0).toLowerCase() + accion.slice(1);
    accion = accion.replace(/\s+/g, '');
    $(`#t${numeroForm}`).attr("testingAccion", accion)

    $(`#t${numeroForm}`).on(`change`, `input.divSelectInputTest`, validarCampoSelectSelecTest);
    $(`#t${numeroForm}`).on(`change`, `.selectCont.testing .inputSelect:not(.filtrando)`, (e) => {//Completar id

        let valorTexto = e.target.value
        let father = $(e.target).parents(`.selectCont`)

        let valorId = $(`.opciones[valuestring="${valorTexto}"]`, father).attr("value")

        $(`input.divSelectInputTest`, father).val(valorId).trigger("change")

    })
    $(`#t${numeroForm}`).on(`change`, `.divSelectInputTest`, async (e) => {
        let entidad = e.target.value
        await recrearTestingForm(variablesModelo[entidad], numeroForm)
        $(`#t${numeroForm}`).css(`max-height`, heightTabla(numeroForm))
    })
    $(`#t${numeroForm}`).on("click", "div.testNoActive, td.testNoActive", (e) => {

        $(e.currentTarget).removeClass("testNoActive")
        $("input", e.currentTarget).removeAttr("disabled")

    })
    $(`#t${numeroForm}.formularioTestingEdit`).on("dblclick", "div.fo:not(.testNoActive), td:not(.testNoActive)", (e) => {

        $(e.currentTarget).addClass("testNoActive")
        $("input", e.currentTarget).val("").attr("disabled", "disabled")
        $(`.opcionesSelectDiv`, e.currentTarget).addClass("oculto")

    })
    $(`#t${numeroForm}`).on(`dblclick`, `div.tableCol td.comp`, (e) => {

        let filaFather = $(e.target).parents(`tr`)

        $(`input.divSelectInput`, filaFather).removeAttr("form")
        $(`input.soloLectura,
           input.total`, filaFather).parents("td").addClass("notEdit")
        $(`.inputSelect`, filaFather).attr("form", `f${objeto.accion}${numeroForm}`)
    })
    $(`#t${numeroForm}`).on("change", ".inputSelect.acciones", (e) => {

        let accion = $(`#t${numeroForm} .inputSelect.testingCabecera.acciones`).val()
        accion = accion.charAt(0).toLowerCase() + accion.slice(1);
        accion = accion.replace(/\s+/g, '');
        $(`#t${numeroForm}`).attr("testingAccion", accion)
    })
    $(`#t${numeroForm}`).on("dblclick", "input", (e) => {

        if ($(`#t${numeroForm}`).attr("testingaccion") == "completarCartel") {

            if ($(e.currentTarget).hasClass("completadoCartel")) {

                $(e.currentTarget).removeClass("completadoCartel").removeAttr("readonly").val("").trigger("change").trigger("input")

            } else {
                $(e.currentTarget).addClass("completadoCartel").prop("readonly", true).val("Completa Cartel")
            }
        }
    });
    $(`#bf${numeroForm} span.editBoton`).trigger("click")
    delete objeto?.funcionesPropias?.cargar?.agregarIDPestanas
}
function cambiarNombreEntidad(objeto, numeroForm) {

    let registros = $(`#t${numeroForm} .tr.fila .celda.entidad`)
    $.each(registros, (indice, value) => {

        $(value).html(variablesModelo[$(value).html().trim()].pest)

    })
}
function lastRenglonTEst(objeto, numeroForm) {

    $(`#t${numeroForm} .inputTd`).removeClass("des").addClass("test")

    $(`#t${numeroForm}`).on("dblclick", ".inputTd.test", (e) => {

        $(`#bf${numeroForm} span.crearTesting`).trigger("click")
    })
    $(`#bf${numeroForm} span.editBoton`).removeClass("editBoton").addClass("editBotonTest")

    $(`#bf${numeroForm}`).on("click", "span.editBotonTest", (e) => {

        $(`#bf${numeroForm} span.crearTesting`).trigger("click")
    })
}
function agregarIDPestanas(objeto, numeroForm) {

    let _id = $(`#t${numeroForm} input._id`).val()

    if (_id != "") {

        let pestanas = $(`#t${numeroForm} .inputSelect`)

        $.each(pestanas, (indice, value) => {

            $(value).trigger("change")
        })
    }
}
function accionesTesting(objeto, numeroForm) {

    let pest = ""

    pest += `<div class="selectCont testingAcciones" name="testing">`

    pest += `<div class="selecSimulado"><div class="selectInput"><input type="parametricaTesting" class="inputSelect testingCabecera acciones" autocomplete="off" value="Completar Usuario"  ${autoCompOff} /><div class="spanFlechaAbajo"><span class="material-symbols-outlined abajo">stat_minus_1</span></div></div></div>`

    pest += `<div class="opcionesSelectDiv oculto">`
    pest += `<div class="opciones" value="completarUsuario" valueString="Completar Usuario"><p>Completar Usuario</p></div>`
    pest += `<div class="opciones" value="completarCartel" valueString="Completar Cartel"><p>Completar Cartel</p></div>`

    pest += `</div>`//Cerrar opcionesSelectDiv
    pest += `</div>`;//Cerrar selectCont

    return pest

}
