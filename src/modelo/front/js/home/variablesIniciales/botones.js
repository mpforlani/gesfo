//Comandos completa ABM
const iCrearInd = `<div class="barraForm crearInd"><span class="material-symbols-outlined botones crearBotonInd">add_circle</span></div>`;
const iCrearDoble = `<div class="barraForm crearInd"><span class="material-symbols-outlined botones crearDoble">add_circle</span></div>`;
const iCrearTesting = `<div class="barraForm crearInd"><span class="material-symbols-outlined botones crearTesting">add_circle</span></div>`;
const iCrearTestingEdit = `<div class="barraForm crearInd"><span class="material-symbols-outlined botones crearTestingEdit">add_circle</span></div>`;
const iEdit = `<div class="barraForm"><span class="material-symbols-outlined botones editBoton">edit</span></div>`;
const iDelete = `<div class="barraForm"><span class="material-symbols-outlined botones deleteBoton">delete</span> </div>`;
const iDeshabilitar = `<div class="barraForm"><span class="material-symbols-outlined botones desHabilitarBoton">block</span> </div>`;
const iCruz = `<div class="barraForm"> <span class="material-symbols-outlined botones cancelBoton">cancel</span></div>`;
const iHistoria = `<div class="barraForm"><span class="material-symbols-outlined botones historia">hourglass</span></div>`;
///Ok Enviar
const iOk = `<div class="barraForm"><span class="material-symbols-outlined botones okBoton">check_circle</span></div>`;
const iOkFacturaElec = `<div class="barraForm"> <span class="material-symbols-outlined botones enviarfacturaElectronica">check_circle</span></div>`;//Factura electronica
const iOkConfirmarCartel = `<div class="barraForm"> <span class="material-symbols-outlined botones okBotonConfirmarCartel">check_circle</span></div>`;
const iOkVistaPrevia = `<div class="barraForm"><span class="material-symbols-outlined botones okfBotonVistaPrevia">check_circle</span></div>`;
const iOkFHistoria = `<div class="barraForm ocultoImpresion"> <span class="material-symbols-outlined botones okfBotonHistoria">check_circle</span></div>`;//Confirmar negar historia
const iOkUsuario = `<div class="barraForm"> <span class="material-symbols-outlined botones okUsuarioBoton">check_circle</span></div>`;//Solo se usa para usuairo
//Imprimir
const iLupa = `<div class="barraForm ocultoImpresion"><span class="material-symbols-outlined botones okfLupa">search</span></div>`;
const iLupaRep = `<div class="barraForm"><span class="material-symbols-outlined botones okfLupa">search</span></div>`;
const iImprimir = `<div class="barraForm ocultoImpresion"><span class="material-symbols-outlined botones okfImprimir">print</div>`;
const iImprimirRep = `<div class="barraForm "><span class="material-symbols-outlined botones okfImprimir">print</div>`;
const iOkimprimir = `<div class="barraForm ocultoImpresion"><span class="material-symbols-outlined botones okfImprimirBoton" imprimir=true>print_connect</span></div>`;
const iOkimprimirVistaPrevia = `<div class="barraForm ocultoImpresion"><span class="material-symbols-outlined botones okfImprimirBotonVistaPrevia" imprimir=true>print_connect</span></div>`;
const okPlus = `<div class="barraForm ocultoImpresion"><span class="material-symbols-outlined botones okfPlus" previa=true>add_task</span></div>`//Imprimir y enviar
const okPlusElectronica = `<div class="barraForm ocultoImpresion"><span class="material-symbols-outlined botones okfPlusElectronica" previa=true>add_task</span></div>`//Imprimir y enviar
////Email
const iOkEmail = `<div class="barraForm "><span class="material-symbols-outlined botones okEnviarEmail">forward_to_inbox</span></div>`
const iOkDescargar = `<div class="barraForm "> <span class="material-symbols-outlined botones descargarFile">download</span></div>`
//////
//Recargar pestaña
const iRecargar = `<div class="barraForm"><span class="material-symbols-outlined botones recargar">autorenew</span></div>`;
const iPlay = `<div class="barraForm"><span class="material-symbols-outlined botones play">play_arrow</span></div>`;
/////
const iSave = `<div class="barraForm"><span class="material-symbols-outlined botones save">save</span></div>`;
const undoF = `<div class="barraForm"> <span class="material-symbols-outlined botones undo">undo</span></div>`
const logoFormIndividual = `<div class="logoIndividual"><img alt=""></img></div>`
/////Reportes
const configReporte = `<div class="barraForm"><span class="material-symbols-outlined botones">settings</span></div>`
const emailRep = `<div class="barraForm"><span class="material-symbols-outlined botones envioEmail">outgoing_mail</span></div>`
////////////////
const flechasOrden = `<div class="flechasOrden"><span class="material-symbols-outlined arriba">stat_1</span><span class="material-symbols-outlined abajo">stat_minus_1</span></div>`
const filtroIcon = `<div class="filtro"><span class="material-symbols-outlined filtro">filter_alt</span></div>`
////
function botonCabecera(mensajeBoton) {

    let boton = `<div class="botonesCabecera"><div class="botonInd">${mensajeBoton}</div></div>`

    return boton
}
///
function cambiarBotonOkUsuario(objeto, numeroForm) {

    let valorId = $(`#t${numeroForm} input._id`).val()

    if (valorId == "") {

        let okBoton = $(`#bf${numeroForm} .okBoton`).parent(".barraForm")
        okBoton.before(iOkUsuario)
        okBoton.remove()
    }
}
function cambiarBoton(objeto, numeroForm, botonActual, botonNuevo) {

    let okBoton = $(`#bf${numeroForm} .${botonActual}`).parent(".barraForm")
    okBoton.after(botonNuevo)
    okBoton.remove()

}
function agregarBoton(objeto, numeroForm, before, botonNuevo) {

    let botonRef = $(`#bf${numeroForm} .${before}`).parent(".barraForm")
    botonRef.after(botonNuevo)
}
function claseBoton(objeto, numeroForm, boton, clase) {

    $(`#bf${numeroForm} span.${boton}`).addClass(clase)
}
function botonSeguridad(objeto, numeroForm) {//este genera seguridad por atributos
    let method = "post"
    let propCheck = {
        true: "checked",
        false: "false"
    }
    let entidadId = ""
    let fatherFila = ""

    $(`#t${numeroForm}`).on(`click`, `div.boton`, async (e) => {
        method = "post"

        let idAtributos = ""
        entidadId = ""
        fatherFila = ""
        e.stopPropagation()

        fatherFila = $(e.currentTarget).parents(`tr`)
        fatherFila.addClass("seleccionado");

        let tituloEntidad = $(`th.filaNombre`, fatherFila).contents().filter(function () {
            return this.nodeType === 3; // Filtra solo nodos de texto
        }).text().trim();

        entidadId = $(`#t${numeroForm} input._id`).val()

        idAtributos = $(`input.boton`, fatherFila).val() || ""

        let entidad = $(e.currentTarget).attr("atributo")
        let dataBol = {}

        if (idAtributos != "") {

            const response = await fetch(`/get?base=seguridadAtributo&_id=${idAtributos}`);
            const data = await response.json();
            dataBol = data.find(e => e._id == idAtributos)
            method = "put"
        }
        cartelComplementoConCortina(objeto, numeroForm, { bloques: 3, claseCartel: "widthTreinta" })

        let bloqueCero = `<div class="tituloTabla"><h2>Seguridad por atributos</h2></div>`

        let bloqueUno = `<div class="subTitulo">
        <h4>Entidad: ${tituloEntidad}</h4>
        <input type="hidden" id="_id" name="_id" form="atributos${numeroForm}" value="${idAtributos}"  ${autoCompOff} />
        <input type="hidden" id="entidad" name="entidad" form="atributos${numeroForm}" value="${entidadId}"  ${autoCompOff} /></div>`

        $(bloqueCero).appendTo($(`#t${numeroForm} .cartelComplemento .bloque0`))
        $(bloqueUno).appendTo($(`#t${numeroForm} .cartelComplemento .bloque1`))

        let bloqueDos = `<form method="POST" action="/${objeto.accion}" id="atributos${numeroForm}"></form>`;

        bloqueDos += `<table class="transpencia">`
        bloqueDos += `<tr class="titulosTable"><th class="borderBottom minWidthQuince">Atributo</th><th class="borderBottom widthSiete">Visualizar</th><th class="borderBottom widthSiete">Editar</th></tr>`

        bloqueDos += `<tr class="fila tituloTabla filtroTodo"><th class="borderBottom">Seleccionar todo</th>`
        bloqueDos += `<th class="borderBottom"><input class="seleccionarTodo widthCatorce" filtro="visualizar" type="checkbox"  ${autoCompOff} /></th>`
        bloqueDos += `<th class="borderBottom"><input class="seleccionarTodo widthCatorce" filtro="editar" type="checkbox"  ${autoCompOff} /></th></tr>`

        let names = variablesModelo?.[entidad]?.atributos?.names || variablesFusionadas[entidad]?.atributos?.names
        let titulos = variablesModelo?.[entidad]?.atributos?.titulos || variablesFusionadas[entidad]?.atributos?.titulos

        $.each(names, (indice, value) => {

            if (value.type == "coleccionInd") {

                bloqueDos += `<tr class="fila" colec="${value.nombre}"><th>${value.titulos} Colección completa</th>`
                bloqueDos += `<td><input type="checkbox" class="widthCatorce" ${propCheck[dataBol?.visualizar?.[value.nombre]] || "checked"} filtro="visualizar"  ${autoCompOff} /><input type="hidden" name="visualizar.${value.nombre}" form="atributos${numeroForm}" value="${dataBol?.visualizar?.[value.nombre] || "true"
                    } "  ${autoCompOff} /></td><td></td>`

                bloqueDos += `<tr class="fila coleccionAgrupador" colec="${value.nombre}"><th>${value.titulos}</th>`
                bloqueDos += `<td><input type="checkbox" class="widthCatorce coleccionAgrupador" colec="${value.nombre}" ${propCheck[dataBol?.visualizar?.[`${value.nombre}Tot`]] || "checked"} filtro="visualizar"  ${autoCompOff} /><input type="hidden" name="visualizar.${value.nombre}Tot" form="atributos${numeroForm}" value="${dataBol?.visualizar?.[`${value.nombre}Tot`] || "true"}"  ${autoCompOff} /></td>`
                bloqueDos += `<td><input type="checkbox" class="widthCatorce coleccionAgrupador" colec="${value.nombre}" ${propCheck[dataBol?.editar?.[`${value.nombre}Tot`]] || "checked"} filtro="editar"  ${autoCompOff} /><input type="hidden" name="editar.${value.nombre}Tot" form="atributos${numeroForm}" value="${dataBol?.editar?.[`${value.nombre}Tot`] || "true"}"  ${autoCompOff} /></td></tr>`


                $.each(Object.values(value.componentes), (ind, val) => {

                    if (val.oculto != "oculto") {
                        bloqueDos += `<tr class="fila coleccion" colec="${value.nombre}"><th>${value.titulosComponentes[ind]}</th>`
                        bloqueDos += `<td><input type="checkbox" class="widthCatorce" ${propCheck[dataBol?.visualizar?.[val.nombre]] || "checked"}  filtro="visualizar" ${autoCompOff} /><input type="hidden" name="visualizar.${val.nombre}" form="atributos${numeroForm}" value="${dataBol?.visualizar?.[val.nombre] || "true"}"  ${autoCompOff} /></td>`
                        bloqueDos += `<td><input type="checkbox" class="widthCatorce" ${propCheck[dataBol?.editar?.[val.nombre]] || "checked"} filtro="editar"  ${autoCompOff} /><input type="hidden" name="editar.${val.nombre}" form="atributos${numeroForm}" value="${dataBol?.editar?.[value.nombre] || "true"}"  ${autoCompOff} /></td></tr>`
                    }
                })
            } else {

                bloqueDos += `<tr class="fila"><th>${titulos[indice]}</th>`
                bloqueDos += `<td><input type="checkbox" class="widthCatorce" ${propCheck[dataBol?.visualizar?.[value.nombre]] || "checked"} filtro="visualizar"  ${autoCompOff} /><input type="hidden" name="visualizar.${value.nombre}" form="atributos${numeroForm}" value="${dataBol?.visualizar?.[value.nombre] || "true"}"  ${autoCompOff} /></td>`
                bloqueDos += `<td><input type="checkbox" class="widthCatorce" ${propCheck[dataBol?.editar?.[value.nombre]] || "checked"} filtro="editar"  ${autoCompOff} /><input type="hidden" name="editar.${value.nombre}" form="atributos${numeroForm}" value="${dataBol?.editar?.[value.nombre] || "true"}"  ${autoCompOff} /></td></tr>`
            }
        })
        bloqueDos += `</table>`
        bloqueDos += `</div>`

        $(`#t${numeroForm} .cartelComplemento .bloque2`).addClass("center")
        $(bloqueDos).appendTo(`#t${numeroForm} .cartelComplemento .bloque2`)

        $(`#ampliar${numeroForm} input[filtro="visualizar"]:not(.seleccionarTodo):first`).trigger("change");
        $(`#ampliar${numeroForm} input[filtro="editar"]:not(.seleccionarTodo):first`).trigger("change");
        $(`#ampliar${numeroForm} tr.fila.modificado`).removeClass("modificado")

    })
    $(`#t${numeroForm}`).on(`change`, `.cartelComplemento input.seleccionarTodo`, (e) => {

        let father = $(e.currentTarget).parents(".cartelComplemento")
        let filtro = $(e.currentTarget).attr("filtro")

        if ($(e.currentTarget).is(":checked")) {

            $(`input[type="checkbox"][filtro="${filtro}"]:not(.seleccionarTodo)`, father).prop("checked", true).trigger("change");

        } else {

            $(`input[type="checkbox"][filtro="${filtro}"]:not(.seleccionarTodo)`, father).prop("checked", false).trigger("change");

        }
    })
    $(`#t${numeroForm}`).on("click", `.cartelComplemento span.okBoton`, (e) => {

        const url = `/${method}?base=seguridadAtributo&vers=no`;//vers es si hace historia o no
        let data = new FormData($(`#atributos${numeroForm}`)[0]);
        const obj = {};

        data.forEach((value, key) => {

            const keys = key.split('.'); // Divide por el punto (.) para manejar objetos anidados
            let ref = obj;

            while (keys.length > 1) {
                const prop = keys.shift();
                ref[prop] = ref[prop] || {};

                ref = ref[prop];

            }
            ref[keys[0]] = value;
        });

        fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(obj)
        }).then(response => {
            if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
            return response.json();
        }).then(data => {
            $(`#amplicar${numeroForm} tr`).removeClass("modificado")

            if (method == "post") {

                $(`td.atributos input`, fatherFila).val(data.posteo._id)

                $(`#bf${numeroForm} .save`).trigger("click")

            }

            let cartel = `<div class="cartelInformativo claro azul bold">`
            cartel += `<p>Registo actualizado</p>`
            cartel += `</div>`

            $(`#ampliar${numeroForm} .bloqueCabecera`).append(cartel);


            setTimeout(() => {

                $(`#ampliar${numeroForm} .bloqueCabecera .primerRenglon`).fadeOut(2000, function () {
                    $(this).remove();

                });
                $(`#ampliar${numeroForm} tr.fila.modificado`).removeClass("modificado");
            }, 1000)


        }).catch(error => {
            console.error("Error en la solicitud:", error);
        });

    })
    $(`#t${numeroForm}`).on("change", `.cartelComplemento input[type="checkbox"]:not(.seleccionarTodo)`, (e) => {

        let filtro = $(e.currentTarget).attr("filtro")
        let checkboxs = $(`#ampliar${numeroForm} input[filtro="${filtro}"]:not(.seleccionarTodo)`)

        let index = 0
        let checkedTot = true
        while (index < checkboxs.length && checkedTot == true) {

            checkedTot = $(checkboxs[index]).is(":checked")
            index++
        }

        $(`#ampliar${numeroForm} input[filtro="${filtro}"].seleccionarTodo`).prop("checked", checkedTot)
    })
    $(`#t${numeroForm}`).on("click", `.cartelComplemento .closePop`, (e) => {

        $(`#t${numeroForm} tr.seleccionado`).removeClass("seleccionado");
    })
    $(`#t${numeroForm}`).on("click", `input.coleccionAgrupador `, (e) => {

        let filtro = $(e.target).attr("filtro")
        let colec = $(e.target).parents("tr").attr("colec")

        if ($(e.target).is(":checked")) {

            $(`#ampliar${numeroForm} tr[colec="${colec}"] input[filtro="${filtro}"]:not(.seleccionarTodo)`).prop("checked", true).trigger("change");

        } else {

            $(`#ampliar${numeroForm} tr[colec="${colec}"] input[filtro="${filtro}"]:not(.seleccionarTodo)`).prop("checked", false).trigger("change");

        }
    })
    $(`#t${numeroForm}`).on("click", `input.coleccion:not(.coleccionAgrupador )  `, (e) => {

        let filtro = $(e.target).attr("filtro")
        let colec = $(e.target).parents("tr").attr("colec")
        let input = $(`#ampliar${numeroForm} tr[colec="${colec}"] input[filtro="${filtro}"]`)
        let checked = true;
        let index = 0

        $.each(input, (indice, value) => {

            while (index < input.length && checked == true) {

                checked = $(input[indice]).is(":checked");

                index++;
            }

        })
    })
}
function removerOcultoBoton(objeto, numeroForm, boton) {

    $(`#bf${numeroForm} span.${boton}`).parents("div").removeClass("oculto")

}
function botonEnviarelectronica(objeto, numeroForm) {

    $(`#bf${numeroForm}`).on(`click`, `.okfPlusElectronica:not(.enEspera), .enviarfacturaElectronica:not(.enEspera)`, (e) => {

        let previa = $(e.target).attr("previa") || false

        funcionesAntesdeEnviar(objeto, numeroForm).then(async (resultado) => {
            try {
                const { cae, vtocae, numero } = await posteoElectronica(objeto, numeroForm);
                let resultado = await enviarRegistroNuevoForm(numeroForm, objeto, true)

                if (previa == "true") {
                    formularioIndividualImpresion(objeto, numeroForm, resultado.posteo);
                }

            } catch (error) {
                console.error("Error en posteoElectronica:", error);
                throw error;

            }
        });
    })
}
////funcion de boton play testing
function testingBotonPlayInd(objeto, numeroForm) {

    $(`#bf${numeroForm} span.play`).on("click", (e) => {

        formularioTesting(objeto, numeroForm)
    })
}
function testingBotonPlayAbm(objeto, numeroForm) {

    $(`#bf${numeroForm} span.play`).on("click", (e) => {

        $(`#bf${numeroForm} span.crearDoble`).trigger("click")
        let numeroFormNew = $(`.tabs_contents_item.active`).attr("id").slice(-1)

        $(`#t${numeroFormNew} div.fo`).addClass("ocultoSiempre")
        $(`#bf${numeroFormNew} .save,
           #bf${numeroFormNew} .deleteBoton`).addClass("ocultoSiempre")

    })
}
function botonPlay(objeto, numeroForm) {//Este se usa solo para testing

    $(iPlay).appendTo(`#bf${numeroForm} .botonesPest`)
    $(`#bf${numeroForm}`).on("click", `span.play`, function (e) {

        formularioTesting(objeto, numeroForm)
    })
}