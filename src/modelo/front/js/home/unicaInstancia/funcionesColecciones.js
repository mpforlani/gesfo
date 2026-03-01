
function editarCompuestoFormInd(objeto, numeroForm, id, self, ordInput) {//dic

    let oculto = objeto.ocultroAtributosSeguridad
    let father = $(self).parents("tr");
    let fatherTable = $(self).parents("table");
    let compuesto = objeto.atributos.compuesto;
    let ord = parseFloat(ordInput);
    //////////////////
    $(`input.formColec,
        input.position,
       select.form,
       textarea.formColec`, father).attr(`disabled`, false)
    let tabIndex = $(`td.vacio:first input`, fatherTable).attr("tabindex")
    let coleccion = $(fatherTable).attr("compuesto") || $(`#tablaCol${objeto.accion}${numeroForm} tr.0`).attr(`compuesto`);
    $(`td.vacio`, fatherTable).addClass(`editando`);
    $(`td.editando`, fatherTable).removeClass(`vacio`);
    $(`input:not(.soloLectura):not(.total),
       textarea:not(.soloLectura)`, father).removeAttr(`readonly`);
    $(`tr.last`, fatherTable).addClass(coleccion);

    $(`td.editando`, fatherTable).addClass("comp");
    $(`td.editando`, fatherTable).addClass(coleccion);

    let se = `<td class=delete ord=${ord}><span class="material-symbols-outlined botonColeccion deleteIcon">delete</span></td>`;

    let signoEliminar = $(se);
    signoEliminar.appendTo(`.tableCol.${numeroForm} #pc${id} tr.last`); ////////////////////////////////////////////////////////////////////////////////

    let valorCompuesto = compuesto[coleccion];

    let colec = `<tr class="creado creando mainBody vacio last" q=${ord + 1}>`;
    colec += `<td class="menuFila">`;

    $.each(valorCompuesto.componentes, (indice, value) => {

        colec += `<td class="vacio ${indice} ${value.nombre} ${valorCompuesto?.clases?.[indice] || ""}" ${widthObject[value.width] || ""} ${ocultoOject[value.oculto] || ""}  ord="${ord}" set="${fatherTable.attr("id")}">`;

        if (value.valorInicial != null) {
            $(`input.${value.nombre}`, father).val(typeof value.valorInicial === 'function' ? value.valorInicial() : value.valorInicial).trigger("change").trigger("input");
        }

        switch (value.type) {

            case `adjunto`:

                colec += `<input class="formColec ${valorCompuesto.nombre} ${indice} ${value.clase || ""} " colec="${valorCompuesto.nombre}" name="${indice}" form="f${objeto.accion}${numeroForm}" ord=${ord + 1} readonly tabindex="${tabIndex}" disabled="disabled"/></td>`;
                $(`tr.last td.adjuntoColeccion input`, fatherTable).remove();

                let listaAdjunto = ""
                listaAdjunto += `<div class="adjuntoColec tr fila">
                                 <div class="celdAdj nameUsu vacio ${numeroForm}" src=""><input class="nameUsu ${numeroForm}" name="nameUsuColec" form="f${objeto.accion}${numeroForm}" disabled="disabled" /></div>
                                 <div class="celdAdj path vacio ${numeroForm} ocultoSiempre" src=""><input class="path ${numeroForm}" id="path${numeroForm}" name="pathColec" form="f${objeto.accion}${numeroForm}" disabled="disabled" /></div>
                                 <div class="celdAdj originalname vacio  ${numeroForm} ocultoSiempre" src=""><input class="originalname ${numeroForm}" id="originalname${numeroForm}" name="originalnameColec" form="f${objeto.accion}${numeroForm}" disabled="disabled"/></div>
                                 <div class="celdAdj adjunto "><label for="adjunto${objeto.accion}${numeroForm}"></label><img src="/img/iconos/botonAdjunto/adjuntar.svg"/><input type=file id="adjunto${objeto.accion}${numeroForm}" name="adjuntoColec" form="f${objeto.accion}${numeroForm}" class="adjunto"/></div>
                                 <div class="celdAdj verAdj vacio"><img class="verAdj" img src="/img/iconos/botonAdjunto/VerAdj.svg" title="Ver adjunto"></div>
                                 <div class="celdAdj eliminarAdj vacio"><img class="eliminarAdj" src="/img/iconos/botonAdjunto/deleteAdj.svg" title="Eliminar adjunto"></div></td>`

                listaAdjunto += `</div></div>`

                $(listaAdjunto).appendTo(`tr.last td.adjuntoColeccion`, fatherTable)

                break;
            case `fecha`:

                colec += `<input class="formColec ${valorCompuesto.nombre} ${indice} ${value.clase || ""}" colec="${valorCompuesto.nombre}" name="${indice}" form="f${objeto.accion}${numeroForm}" tabindex="${tabIndex}"  ord=${ord + 1} valid=${value.validacion}  type="date" readonly disabled="disabled"/></td>`;

                break;
            case `logico`:

                colec += `<input type="text" class="formColec ${valorCompuesto.nombre} ${indice} ${value.class || ""}" colec="${valorCompuesto.nombre}" name="${indice} form="f${objeto.accion}${numeroForm}"  ord=${ord + 1} style="display:none">
                        <input type="checkbox" class="formColec ${valorCompuesto.nombre} ${indice}" colec="${valorCompuesto.nombre}" name="${indice}" tabindex="${tabIndex}" disabled="disabled"/>`
                break;
            case `importe`:

                colec += `<input type="${value.type}" class="formColec formatoNumero ${valorCompuesto.nombre} ${indice} ${value.clase || ""} monedaFormulario" colec="${valorCompuesto.nombre}" name="${indice}" form="f${objeto.accion}${numeroForm}" ord=${ord + 1} autocomplete="off"  valid=${value.validacion}  readonly tabindex="${tabIndex}"  disabled="disabled"/>
                <input type="${value.type}" class="ocultoSiempre formColec ${valorCompuesto.nombre} ${indice}mb monedaBase" colec="${valorCompuesto.nombre}" name="${indice}mb" form="f${objeto.accion}${numeroForm}" ord=${ord + 1}"  disabled="disabled"/>
                <input type="${value.type}" class="ocultoSiempre formColec  ${valorCompuesto.nombre} ${indice}ma monedaAlternativa" colec="${valorCompuesto.nombre}" name="${indice}ma" form="f${objeto.accion}${numeroForm}" ord=${ord + 1} "  disabled="disabled"/>
                </td>`;
                break;
            case `cantidad`:

                colec += `<input type="${value.type}" class="formColec formatoNumero ${valorCompuesto.nombre} ${indice} ${value.clase || ""} " colec="${valorCompuesto.nombre}" name="${indice}" form="f${objeto.accion}${numeroForm}" ord=${ord + 1} valid=${value.validacion} autocomplete="off" readonly tabindex="${tabIndex}"  disabled="disabled"/></td>`;
                break;
            case `parametrica`:

                $(`tr.last:not(.creando) td.${indice} input.formColec`, fatherTable).remove()

                let pestanas = prestanaFormIndividual(objeto, numeroForm, value, [], tabIndex, { clase: "formColec" })

                $(pestanas).appendTo($(`tr.last:not(.creando) td.${indice}`, fatherTable))
                $(`tr.last:not(.creando) td.${indice}`, fatherTable).addClass("pestanaSelect")

                colec += `<input type="${value.type}" class="formColec ${valorCompuesto.nombre} ${indice} ${value.nombre} ${value.clase || ""} " colec="${valorCompuesto.nombre}" name="${indice}" form="f${objeto.accion}${numeroForm}" ord=${ord + 1} readonly tabindex="${tabIndex}" autocomplete="off"  disabled="disabled"/></td>`;
                break;
            case `parametricaPreEstablecida`:

                $(`tr.last:not(.creando) td.${indice} input.formColec`, fatherTable).remove()

                //let pestanasPreEst = prestanaFormIndividual(objeto, numeroForm, value, [], tabIndex, { clase: "formColec" })
                let pestanasPreEst = prestanaFormIndividualPreEstablecida(objeto, numeroForm, value, [], tabIndex, { clase: "formColec" })

                $(pestanasPreEst).appendTo($(`tr.last:not(.creando) td.${indice}`, fatherTable))
                $(`tr.last:not(.creando) td.${indice}`, fatherTable).addClass("pestanaSelect")

                break;
            case `textarea`:

                colec += `<textarea class="formColec ${valorCompuesto.nombre} ${indice} ${value.clase || ""} " colec="${valorCompuesto.nombre}" name="${indice}" form="f${objeto.accion}${numeroForm}" ord=${ord + 1} readonly tabindex="${tabIndex}"  valid=${value.validacion}  disabled="disabled"></textarea></td>`;
                break;
            default:

                colec += `<input type="${value.type}" class="formColec ${valorCompuesto.nombre} ${indice} ${value.clase || ""} " colec="${valorCompuesto.nombre}" name="${indice}" form="f${objeto.accion}${numeroForm}" ord=${ord + 1} readonly tabindex="${tabIndex}" valid=${value.validacion} autocomplete="off" disabled="disabled"/></td>`;
                break;

        }
    });

    colec += `<td class="vacio position ocultoSiempre position${valorCompuesto.nombre} ${valorCompuesto.nombre}" ord="${ord}" set="${fatherTable.attr("id")}">
    <input class="position ${valorCompuesto.nombre}" name="position${valorCompuesto.nombre}" form="f${objeto.accion}${numeroForm}" value="${parseFloat($(`input.position`, father).val()) + 1}" readonly="true" disabled="disabled"/></td>`;
    colec += `</tr>`;

    let col = $(colec);

    $(`tr.last`, fatherTable).after(col)
    $(`tr.last:not(.creando)`, fatherTable).removeClass("last")
    $(`tr.creando`, fatherTable).removeClass("creando")

    let lastFile = $(`tr.last`, fatherTable)

    if (valorCompuesto.moneda == undefined) {

        let moneda = $(`#t${numeroForm} .divSelectInput[name=moneda]`).val();
        $(`input.monedaFormulario`, father).each(function () {
            $(this).parents("td").attr("moneda", consultaPestanas.moneda[moneda]?.name);
        });
    }

    $.each(objeto.validaciones, (indice, value) => {

        $(`input.${value}`, lastFile).addClass(`requerido`)
    })

    let colecciones = Object.values(objeto.totalizadores || {}).filter(e => e.type == "totalizadorColeccion")
    let totalizadorColeccionSegunValorExt = Object.values(objeto.totalizadores || {}).filter(e => e.type == "totalizadorColeccionSegunValorExt")

    $.each(colecciones, (indice, value) => {

        $(`input.${value.total[0]}`, father).addClass("total").attr("readonly", true).attr(`tabindex`, -1)

    })

    $.each(totalizadorColeccionSegunValorExt, (indice, value) => {

        $(`#t${numeroForm} input.${value.total[0].nombre || value.total[0]}`).addClass("total").attr("readonly", true)
    })
    $.each(oculto, (indice, value) => {

        $(`td.${value.nombre || value},
            div.${value.nombre || value},
            div.${value.nombre || value},
            input.formColec.${value.nombre || value}`, lastFile).addClass("oculto");
    });

    $.each($(`tr.mainBody:first td.oculto.ocltable `, fatherTable), (indice, value) => {

        let name = $(`input.formColec`, value).attr(`name`)
        $(`tr.last td.${name}`, fatherTable).addClass(`oculto`).addClass(`ocltable`)
    })
    $.each($(`tr.mainBody:first td.ocltable:not(.oculto) `, fatherTable), (indice, value) => {

        let name = $(`input.formColec`, value).attr(`name`)
        $(`tr.last td.${name}`, fatherTable).addClass(`ocltable`)
    })

    $(`input[class^="position"]:first`, father).trigger("dblclick")//Este trigger se agrega porque todo las funciones que se tiene que reevaluar por la nueva fila,

};
function deleteCompuesto(objeto, numeroForm, self) {//Dic

    const table = $(self).parents("table")
    const tablaLength = $(`tr.mainBody:not(.last)`, table).length;
    const filaEliminar = $(self).parents("tr");
    const adjunto = "";
    let valorEliminar = new Object

    $.each($(`td.adjunto`, filaEliminar), (indice, value) => {
        if ($(value).hasClass(`adjunto`)) {
            adjunto = $(`div.src`, value).attr(`src`);
        }
    });

    $.each($(`td[class*="idCol"]:not(.idColCotizacionGemela)`, filaEliminar), (indice, value) => {

        let valorElliminar = $(`input`, value).attr("name").slice(5)
        let fatherTr = $(value).parents("tr")
        valorEliminar._id = $(`input`, value).val()

        valorEliminar.entidad = $(`input.destino${valorElliminar}`, fatherTr).val()

    });

    if (tablaLength > 1) {
        filaEliminar.remove();
    } else {
        $(`input:not(.position${table.attr("compuesto")}), select`, filaEliminar).val("");
        $(`select option[selected="selected"]`, filaEliminar).removeAttr("selected")

        $.each(objeto.atributos?.valoresIniciales?.coleccionFirst, (indice, value) => {

            $.each(value, (ind, val) => {

                let table = $(`#${father} table.${val.coleccion} tr`).eq(1)

                $(`input.${ind}`, table).val(val.valor).trigger("input");
            })
        })

        if (objeto.formInd.compuestoObligatorio == false) {

            $.each(objeto.validaciones, (indice, value) => {
                $(`input.${value}, select.${value.nombre}`, filaEliminar).removeClass("requerido")
                $(`select.${value}`, filaEliminar).attr("disabled", "disabled");
            });
        } else {
            $.each(objeto.validaciones, (indice, value) => {
                $(`input.${value}, select.${value.nombre}`, filaEliminar).removeClass("validado");

            });
        }
        filaEliminar.removeClass(`rojoEliminar`);
    }

    $(`tr.mainBody:first input`, table).trigger("input")
    let deleteObj = new Object();
    deleteObj.adjunto = adjunto;
    deleteObj.valorEliminar = valorEliminar || "";

    return deleteObj;
};
function valoresInicialesMediosPagos(objeto, numeroForm, importe) {

    let id = $(`#t${numeroForm} input._id`).val()

    const monedaColec = (e) => {

        let coleccionLength = $(`#t${numeroForm} table.compuestoMedioPagos tr.mainBody:not(.last)`).length

        if (coleccionLength == 1) {
            $(`#t${numeroForm} .inputSelect.monedaTipoPago:first`).val($(e.target).val()).trigger("change")

        }
    }
    const importeTotalPagar = (e) => {

        let valorTotal = stringANumero($(e.target).val())
        let coleccionLength = $(`#t${numeroForm} table.compuestoMedioPagos tr.mainBody:not(.last)`).length

        if (coleccionLength == 1) {
            valorTotal > 0 ?
                $(`#t${numeroForm} input.importeTipoPago:first:not([readonly])`).val(valorTotal).trigger("input").trigger("blur") : "";
        }
    }

    if (id == "") {
        $(`#t${numeroForm}`).on("input", `input.${importe}`, importeTotalPagar)
        $(`#t${numeroForm}`).on(`change`, `.inputSelect.moneda`, monedaColec)
    }
}
function coleccionSoloEditablePorBoton(objeto, numeroForm, table) {

    $(`#t${numeroForm} table.${table.nombre || table}`).on('mousedown', `input, select`, function (event) {
        event.preventDefault();
    });
    $(`#t${numeroForm} table.${table.nombre || table}`).on("click", function (event) {
        event.preventDefault();
    });
    $(`#t${numeroForm} table.${table.nombre || table}`).addClass("soloLecturaInfo")
    $(`#t${numeroForm} table.${table.nombre || table} tr.last`).addClass("oculto")
    $(`input,select`, `#t${numeroForm} table.${table.nombre || table}`).removeClass("requerido")

}
function idColecciones(objeto, numeroForm) {

    let compuesto = $(`#t${numeroForm} table.active`).attr("compuesto")
    let ord = $(`#t${numeroForm} table.active tr.${compuesto}:last`).attr("q")

    return ord
}
function monedaUnicaPorColeccion(objeto, numeroForm, table) {

    const monedaUnicaColeccion = (e) => {

        let valorMoneda = $(e.target).val()

        if (valorMoneda != "") {

            let fila = $(e.target).parents("tr").attr("q")
            let moneda = $(e.target).attr("name")
            let tableFather = $(e.target).parents("table")

            let monedas = $(`tr:not([q="${fila}"]) select[name="${moneda}"]`, tableFather)

            $.each(monedas, (indice, value) => {

                $(value).val(valorMoneda).addClass("autoValor").trigger("change").removeClass("autoValor").attr("func", "unicoValorPorColec")
            })
            $.extend(true, objeto.atributos, { valoresIniciales: { select: { [moneda]: consultaPestanas.moneda[valorMoneda].name } } });

        }
    }

    $(`#t${numeroForm} table.${table.nombre || table}`).on("change", `select.${objeto?.atributos?.compuesto?.[table.nombre || table]?.moneda}:not(.autoValor)`, monedaUnicaColeccion)


}
function cobroChequesTerceros(objeto, numeroForm) {

    function validarChequesTerceros(e) {
        let numeroCheque = $(e.target).val()
        let repetido = false;

        $.each($(`#t${numeroForm} input[name="numeroDeCheque"]`), (indice, value) => {

            if (value != e.target && $(value).val() == numeroCheque) {
                repetido = true;
                return false;
            }
        });

        if (repetido && numeroCheque != "") {
            let cartel = cartelInforUnaLinea("Ya existe un cheque en este pago con este número y para este cliente", "❌", { cartel: "infoChiquito rojo", close: "ocultoSiempre" })
            $(cartel).appendTo(`#bf${numeroForm}`)
            removeCartelInformativo(objeto, numeroForm)
            $(e.target).addClass("requerido").removeClass("validado")
            return;
        }

        let clienteCheque = $(`#t${numeroForm} .divSelectInput[name="cliente"]`).val()
        if (!clienteCheque) {
            return; // no hay cliente, no se hace el fetch
        }

        let preFiltros = { numeroDeCheque: numeroCheque, cliente: clienteCheque }
        const filtros = `&filtros=${JSON.stringify(preFiltros)}`
        fetch(`/get?base=chequesTercero${filtros}`)
            .then(response => response.json())
            .then(data => {

                if (data.length > 0) {
                    let cartel = cartelInforUnaLinea("Ya existe un cheque en cartera con este número y para este cliente", "❌", { cartel: "infoChiquito rojo", close: "ocultoSiempre" })
                    $(cartel).appendTo(`#bf${numeroForm}`)
                    removeCartelInformativo(objeto, numeroForm)
                    $(e.target).addClass("requerido").removeClass("validado")
                }
            })
            .catch(error => console.error('Error de red:', error));

    }
    $(`#t${numeroForm}`).on("blur", "input.numeroDeCheque", validarChequesTerceros)

    $(`#t${numeroForm}`).on("change", `.divSelectInput[name="cliente"]`, () => {

        $(`#t${numeroForm} input.numeroDeCheque`).trigger("blur")
    })
}
function depositoDeCheques(objeto, numeroForm) {

    let filaDeCheque = ""
    function abrirPopCheques(e) {
        filaDeCheque = $(e.target).parents("tr")
        consultaChequesCartera(objeto, numeroForm)
    }
    function seleccionarCheque(e) {
        $(e.currentTarget).toggleClass(`seleccionado`)
        $(e.currentTarget).siblings().removeClass(`seleccionado`)
    }

    $(`#t${numeroForm}`).on("focus", "table.compuestoDeposito tr:not(.last) input:not(.transparente, .casoTesting):not([name='cajaDestino']):not([name='cuentaDestino'])", abrirPopCheques)
    $(`#t${numeroForm}`).on("click", ".chequesTercero tr.filaTable", seleccionarCheque)
    $(`#t${numeroForm}`).on("click", ".chequesTercero .okBoton", (e) => { copiarChequeEnColeccion(e, filaDeCheque, numeroForm) })

}
function consultaChequesCartera(objeto, numeroForm) {
    let preFiltros = { estado: "En cartera" }
    const filtros = `&filtros=${JSON.stringify(preFiltros)}`
    fetch(`/get?base=chequesTercero${filtros}`)
        .then(response => response.json())
        .then(data => {

            cartelComplementoConCortina(objeto, numeroForm, { bloques: 2, claseCartel: "chequesTercero" })

            let titulo = "<div><h4>Cheques en cartera</h4></div>"
            $(titulo).appendTo(`#t${numeroForm} .bloque0`)
            let cuerpoPrincipal = ""
            cuerpoPrincipal += `<table>`
            cuerpoPrincipal += `<tr class="titulosTable">`
            cuerpoPrincipal += `<th class="oculto">ID</th><th>Número</th><th>Cliente</th><th>Fecha</th><th>Vencimiento</th><th>Moneda</th><th>Importe</th><th class="oculto">importema</th><th class="oculto">importemb</th><th class="oculto">TC</th><th>Banco cheque</th>`
            cuerpoPrincipal += `</tr>`
            $.each(data, (indice, value) => {

                cuerpoPrincipal += `<tr class="filaTable">`
                cuerpoPrincipal += `<td class="oculto _id"> ${value._id} </td> <td class="numeroDeCheque">${value.numeroDeCheque || ""}</td><td class="cliente">${consultaPestanas?.cliente?.[value.cliente]?.name || ""}</td><td class="fecha" fechaFormateada="${dateNowAFechaddmmyyyy(value.fecha, "y-m-d")}">${dateNowAFechaddmmyyyy(value.fecha, "d/m/y")}</td><td class="vencimientoCheque" fechaFormateada="${dateNowAFechaddmmyyyy(value.vencimientoCheque, "y-m-d")}">${dateNowAFechaddmmyyyy(value.vencimientoCheque, "d/m/y")}</td><td class="moneda">${consultaPestanas?.moneda?.[value.moneda]?.name || ""}</td><td class="importe">${numeroAString(value.importe || 0)}</td><td class="oculto importema"> ${value.importema} </td><td class="oculto importemb"> ${value.importemb} </td><td class="oculto tipoCambio"> ${value.tipoCambio} </td><td class="bancoCheque">${value.bancoCheque || ""}</td>`
                cuerpoPrincipal += `</tr>`
            })
            $(cuerpoPrincipal).appendTo(`#t${numeroForm} .bloque1`)

            $(`#t${numeroForm} table.compuestoMedioPagos tr[mediopago="cheque"]`).each((indice, elemento) => {
                const numeroDeCheque = $(elemento).find('td.numeroDeCheque input').val();

                $(`#t${numeroForm} .cartelComplemento.chequesTercero tr.filaTable`).filter(function () {
                    return $(this).find('td.numeroDeCheque').html().trim() === numeroDeCheque;
                }).addClass('oculto');
            });
            $(`#t${numeroForm} table.compuestoDeposito tr.mainBody:not(.last)`).each((indice, elemento) => {
                const numeroDeCheque = $(elemento).find('td.numeroDeCheque input').val();

                $(`#t${numeroForm} .cartelComplemento.chequesTercero tr.filaTable`).filter(function () {
                    return $(this).find('td.numeroDeCheque').html().trim() === numeroDeCheque;
                }).addClass('oculto');
            });
        })
        .catch(error => console.error('Error de red:', error));
}
function copiarChequeEnColeccion(e, filaDeCheque, numeroForm) {
    let filaSeleccionada = $(`#t${numeroForm} .chequesTercero tr.seleccionado`);
    if (filaSeleccionada.length > 0) {
        $.each(filaSeleccionada, (indice, value) => {
            $("input.monedaTipoPago", filaDeCheque).val($("td.moneda", value).html()).prop("readonly", true).addClass("transparente").trigger("change");
            $("input.importeTipoPago", filaDeCheque).val($("td.importe", value).html()).prop("readonly", true).trigger("input").addClass("transparente");
            $("input.importeTipoPagoma", filaDeCheque).val($("td.importema", value).html()).prop("readonly", true).trigger("input");
            $("input.importeTipoPagomb", filaDeCheque).val($("td.importemb", value).html()).prop("readonly", true).trigger("input");
            $("input.tipoCambioTipoPago", filaDeCheque).val($("td.tipoCambio", value).html()).prop("readonly", true).trigger("change").addClass("transparente");
            $("input.numeroDeCheque", filaDeCheque).val($("td.numeroDeCheque", value).html()).prop("readonly", true).addClass("transparente");
            $("input.vencimientoCheque", filaDeCheque).val($("td.vencimientoCheque", value).attr(`fechaFormateada`)).prop("readonly", true).addClass("transparente");
            $("input.bancoCheque", filaDeCheque).val($("td.bancoCheque", value).html()).prop("readonly", true).addClass("transparente");

            $(`#t${numeroForm} .chequesTercero .closePop`).trigger(`click`);
        });
    }
}
function pagarConChequesEnCartera(objeto, numeroForm) {
    let filaDeCheque = ""
    let flagTraerCheques = false;

    function traerChequesTerceros(e) {
        if (flagTraerCheques) {
            return;
        }
        flagTraerCheques = true;
        setTimeout(() => flagTraerCheques = false, 200); // reseteo

        let cheque = Object.values(consultaPestanas.tipoPago)
            .find(e => e.admCheque == "true" && e.admBancos != "true");
        filaDeCheque = $(e.target).parents("tr");

        if (e.target.value == cheque.name) {
            consultaChequesCartera(objeto, numeroForm);
        } else {

            $("input.monedaTipoPago[readonly]", filaDeCheque).removeAttr("readonly").removeClass("transparente");
            $(`input.importeTipoPago[readonly],
            input.numeroDeCheque[readonly],
            input.vencimientoCheque[readonly],
            input.bancoCheque[readonly]`, filaDeCheque).val("").removeAttr("readonly").trigger("input").removeClass("transparente");
        }
    }


    function seleccionarCheque(e) {
        $(e.currentTarget).toggleClass(`seleccionado`)
        $(e.currentTarget).siblings().removeClass(`seleccionado`)
    }

    $(`#t${numeroForm}`).on("click", ".chequesTercero tr.filaTable", seleccionarCheque)
    $(`#t${numeroForm}`).on("change", ".inputSelect.tipoPago", traerChequesTerceros)
    $(`#t${numeroForm}`).on("click", ".chequesTercero .okBoton", (e) => {
        copiarChequeEnColeccion(e, filaDeCheque, numeroForm);
    });

    if ($(`#t${numeroForm} input._id`).val() != "") {

        $.each($(`#t${numeroForm} table.compuestoMedioPagos tr.mainBody:not(.last)`), (indice, value) => {

            let tipoPagoSeleccionado = $(".divSelectInput[name=tipoPago]", value).val();

            let esChequeTercero = consultaPestanas.tipoPago[tipoPagoSeleccionado].admCheque == "true" && consultaPestanas.tipoPago[tipoPagoSeleccionado].admBancos != "true"

            if (esChequeTercero) {

                $(`input.monedaTipoPago,
                    input.importeTipoPago,
                    input.numeroDeCheque,
                    input.vencimientoCheque,
                    input.bancoCheque`, value).addClass(`soloLectura`)
            }
        })
    }
}
function habilitarChequesTerceros(objeto, numeroForm) {

    if (objeto.accion != "pagosRealizados") {

        let ocultarMedios = Object.values(consultaPestanas.tipoPago).filter(e => e.admCheque == "true" && e.admBancos == "true")

        $.each(ocultarMedios, (indice, value) => {

            $(`#t${numeroForm} .selectCont.tipoPago .opciones[value="${value._id}"]`).addClass("ocultoSiempre")
        })

        $(`#t${numeroForm}`).on(`dblclick`, "input.position", (e) => {

            let fila = $(e.target).parents(`tr`)

            $.each(ocultarMedios, (indice, value) => {
                $(`.selectCont.tipoPago .opciones[value="${value._id}"]`, fila).addClass("ocultoSiempre")
            })
        })
    }
}
function habilitarCuentaCorriente(objeto, numeroForm) {
    if (objeto.accion == "pagosRealizados" || objeto.accion == "cobrosRecibidos") {

        let ocultarMedios = Object.values(consultaPestanas.tipoPago).filter(e => e.admCheque == "false" && e.admBancos == "false" && e.admCajas == "false")

        $.each(ocultarMedios, (indice, value) => {

            $(`#t${numeroForm} .selectCont.tipoPago .opciones[value="${value._id}"]`).addClass("ocultoSiempre")
        })

        $(`#t${numeroForm}`).on(`dblclick`, "input.position", (e) => {

            let fila = $(e.target).parents(`tr`)

            $.each(ocultarMedios, (indice, value) => {
                $(`.selectCont.tipoPago .opciones[value="${value._id}"]`, fila).addClass("ocultoSiempre")
            })
        })
    }
}
function cobroPendientes(objeto, numeroForm) {
    let movimientoPendiente = "";
    function cartelCobros(e) {

        movimientoPendiente = $(e.target).parents("tr");
        let preFiltros = {
            estado: ["Pendiente", "Pago parcial"],
            cliente: $(`#t${numeroForm} input.divSelectInput[name="cliente"]`).val()

        }

        const filtros = `&filtros=${JSON.stringify(preFiltros)}`
        fetch(`/get?base=cuentaCorrienteClientes${filtros}`)
            .then(response => response.json())
            .then(data => {

                cartelComplementoConCortina(objeto, numeroForm, { bloques: 2, claseCartel: "cobrosCtaCte" })

                let titulo = "<div><h4>Movimientos pendientes</h4></div>"
                $(titulo).appendTo(`#t${numeroForm} .bloque0`)
                let cuerpoPrincipal = ""
                cuerpoPrincipal += `<table>`
                cuerpoPrincipal += `<tr class="titulosTable">`
                cuerpoPrincipal += `<th class="oculto">ID</th><th>Fecha</th><th>Cliente</th><th>Tipo</th><th>Comprobante</th><th>Moneda</th><th>Importe</th><th class="oculto">importema</th><th class="oculto">importemb</th><th class="oculto">TC</th><th>Saldo</th>`
                cuerpoPrincipal += `</tr>`
                $.each(data, (indice, value) => {

                    cuerpoPrincipal += `<tr class="filaTable">`
                    cuerpoPrincipal += `<td class="oculto idComprobante"> ${value._id} </td> <td class="fechaComprobante" fechaFormateada="${dateNowAFechaddmmyyyy(value.fecha, "y-m-d")}">${dateNowAFechaddmmyyyy(value.fecha, "d/m/y")}</td><td class="cliente">${consultaPestanas?.cliente?.[value.cliente]?.name || ""}</td><td class ="tipoComprobante">${value.tipoComprobante}</td><td class ="numComprobante">${value.numComprobante}</td> <td class="moneda">${consultaPestanas?.moneda?.[value.moneda]?.name || ""}</td><td class="importe">${numeroAString(value.importe || 0)}</td><td class="oculto importema"> ${value.importema} </td><td class="oculto importemb"> ${value.importemb} </td><td class="oculto tipoCambio"> ${value.tipoCambio} </td><td class="saldoComprobante">${numeroAString(value.saldoComprobante || 0)}</td>`
                    cuerpoPrincipal += `</tr>`
                })
                $(cuerpoPrincipal).appendTo(`#t${numeroForm} .bloque1`)
                $(`#t${numeroForm} table.cobrosCtaCte tr.mainBody:not(.last)`).each((indice, elemento) => {
                    const idComprobante = $(elemento).find('td.idComprobante input').val();
                    $(`#t${numeroForm} .cartelComplemento.cobrosCtaCte tr.filaTable`).filter(function () {
                        return $(this).find('td.idComprobante')?.html()?.trim() === idComprobante;
                    }).addClass('oculto');
                });
            })
            .catch(error => console.error('Error de red:', error));
    }
    function seleccionarMovimiento(e) {

        $(e.currentTarget).toggleClass(`seleccionado`)
        $(e.currentTarget).siblings().removeClass(`seleccionado`)
    }
    $(`#t${numeroForm}`).on("click", ".cobrosCtaCte tr.filaTable", seleccionarMovimiento)
    $(`#t${numeroForm}`).on("click", "table.cobrosCtaCte tr:not(.last) input:not(.transparente):not([name='importeaCobrar'])", cartelCobros)
    $(`#t${numeroForm}`).on("click", ".cobrosCtaCte .okBoton", (e) => {
        let filaSeleccionada = $(`#t${numeroForm} .cobrosCtaCte tr.seleccionado`);
        if (filaSeleccionada.length > 0) {
            $.each(filaSeleccionada, (indice, value) => {
                $("input.idComprobante", movimientoPendiente).val($("td.idComprobante", value).html().trim()).trigger("change");
                $("input.fechaComprobante", movimientoPendiente).val($("td.fechaComprobante", value).attr(`fechaFormateada`)).trigger("input").addClass("transparenteformt");
                $("input.tipoComprobante", movimientoPendiente).val($("td.tipoComprobante", value).html().trim()).trigger("change").addClass("transparenteformt");
                $("input.numComprobante", movimientoPendiente).val($("td.numComprobante", value).html().trim()).trigger("change").addClass("transparenteformt");
                $("input.monedaPendiente", movimientoPendiente).val($("td.moneda", value).html().trim()).trigger("change").addClass("transparenteformt");
                $("input.importePendiente", movimientoPendiente).val($("td.importe", value).html().trim()).trigger("input").addClass("transparenteformt");
                $("input.importePendientema", movimientoPendiente).val($("td.importema", value).html().trim()).trigger("input");
                $("input.importePentiendemb", movimientoPendiente).val($("td.importemb", value).html().trim()).trigger("input");
                $("input.tipoCambioPendiente", movimientoPendiente).val($("td.tipoCambio", value).html().trim()).trigger("change").addClass("transparenteformt");
                $("input.saldoComprobante", movimientoPendiente).val($("td.saldoComprobante", value).html().trim()).prop("readonly", true).trigger("input").addClass("transparenteformt");
                $("input.importeaCobrar", movimientoPendiente).val($("td.saldoComprobante", value).html().trim()).trigger("input")

                $(`#t${numeroForm} .cobrosCtaCte .closePop`).trigger(`click`);
            });
        }
    });

}
function pagoPendientes(objeto, numeroForm) {
    let movimientoPendiente = "";
    function cartelPagos(e) {

        movimientoPendiente = $(e.target).parents("tr");
        console.log(movimientoPendiente)
        let preFiltros = {
            estado: ["Pendiente", "Pago parcial"],
            proveedor: $(`#t${numeroForm} input.divSelectInput[name="proveedor"]`).val()

        }

        const filtros = `&filtros=${JSON.stringify(preFiltros)}`
        fetch(`/get?base=cuentaCorrienteProveedores${filtros}`)
            .then(response => response.json())
            .then(data => {

                cartelComplementoConCortina(objeto, numeroForm, { bloques: 2, claseCartel: "pagosCtaCte" })

                let titulo = "<div><h4>Movimientos pendientes</h4></div>"
                $(titulo).appendTo(`#t${numeroForm} .bloque0`)
                let cuerpoPrincipal = ""
                cuerpoPrincipal += `<table>`
                cuerpoPrincipal += `<tr class="titulosTable">`
                cuerpoPrincipal += `<th class="oculto">ID</th><th>Fecha</th><th>Proveedor</th><th>Tipo</th><th>Comprobante</th><th>Moneda</th><th>Importe</th><th class="oculto">importema</th><th class="oculto">importemb</th><th class="oculto">TC</th><th>Saldo comprobante</th>`
                cuerpoPrincipal += `</tr>`
                $.each(data, (indice, value) => {

                    cuerpoPrincipal += `<tr class="filaTable">`
                    cuerpoPrincipal += `<td class="oculto idComprobante"> ${value._id} </td> <td class="fechaComprobante" fechaFormateada="${dateNowAFechaddmmyyyy(value.fecha, "y-m-d")}">${dateNowAFechaddmmyyyy(value.fecha, "d/m/y")}</td><td class="cliente">${consultaPestanas?.proveedor?.[value.proveedor]?.name || ""}</td><td class ="tipoComprobante">${value.tipoComprobante}</td><td class ="numComprobante">${value.numComprobante}</td> <td class="moneda">${consultaPestanas?.moneda?.[value.moneda]?.name || ""}</td><td class="importe">${numeroAString(value.importe || 0)}</td><td class="oculto importema"> ${value.importema} </td><td class="oculto importemb"> ${value.importemb} </td><td class="oculto tipoCambio"> ${value.tipoCambio} </td><td class="saldoComprobante">${numeroAString(value.saldoComprobante || 0)}</td>`
                    cuerpoPrincipal += `</tr>`
                })
                $(cuerpoPrincipal).appendTo(`#t${numeroForm} .bloque1`)

                $(`#t${numeroForm} table.pagosCtaCte tr.mainBody:not(.last)`).each((indice, elemento) => {
                    const idComprobante = $(elemento).find('td.idComprobante input').val();
                    $(`#t${numeroForm} .cartelComplemento.pagosCtaCte tr.filaTable`).filter(function () {
                        return $(this).find('td.idComprobante')?.html()?.trim() === idComprobante;
                    }).addClass('oculto');
                });
            })
            .catch(error => console.error('Error de red:', error));
    }
    function seleccionarMovimiento(e) {

        $(e.currentTarget).toggleClass(`seleccionado`)
        $(e.currentTarget).siblings().removeClass(`seleccionado`)
    }
    $(`#t${numeroForm}`).on("click", ".pagosCtaCte tr.filaTable", seleccionarMovimiento)
    $(`#t${numeroForm}`).on("click", "table.pagosCtaCte tr:not(.last) input:not(.transparente):not([name='importeaPagar'])", cartelPagos)
    $(`#t${numeroForm}`).on("click", ".pagosCtaCte .okBoton", (e) => {

        let filaSeleccionada = $(`#t${numeroForm} .pagosCtaCte tr.seleccionado`);

        if (filaSeleccionada.length > 0) {
            $.each(filaSeleccionada, (indice, value) => {
                $("input.idComprobante", movimientoPendiente).val($("td.idComprobante", value).html().trim()).trigger("change");
                $("input.fechaComprobante", movimientoPendiente).val($("td.fechaComprobante", value).attr(`fechaFormateada`)).trigger("input").addClass("transparenteformt");
                $("input.tipoComprobante", movimientoPendiente).val($("td.tipoComprobante", value).html().trim()).trigger("change").addClass("transparenteformt");
                $("input.numComprobante", movimientoPendiente).val($("td.numComprobante", value).html().trim()).trigger("change").addClass("transparenteformt");
                $("input.monedaPendiente", movimientoPendiente).val($("td.moneda", value).html().trim()).trigger("change").addClass("transparenteformt");
                $("input.importePendiente", movimientoPendiente).val($("td.importe", value).html().trim()).trigger("input").addClass("transparenteformt");
                $("input.importePendientema", movimientoPendiente).val($("td.importema", value).html().trim()).trigger("input");
                $("input.importePentiendemb", movimientoPendiente).val($("td.importemb", value).html().trim()).trigger("input");
                $("input.tipoCambioPendiente", movimientoPendiente).val($("td.tipoCambio", value).html().trim()).trigger("change").addClass("transparenteformt");
                $("input.saldoComprobante", movimientoPendiente).val($("td.saldoComprobante", value).html().trim()).prop("readonly", true).trigger("input").addClass("transparenteformt");
                $("input.importeaPagar", movimientoPendiente).val($("td.saldoComprobante", value).html().trim()).trigger("input")
                $(`#t${numeroForm} .pagosCtaCte .closePop`).trigger(`click`);
            });
        }
    });

    $(`#t${numeroForm}`).on("dblclick", "input.position", (e) => {

        let father = $(e.target).parents("tr");

        setTimeout(() => {

            $(`td.tipoCambioPendiente ,
                input.tipoCambioPendiente `, father).removeClass("oculto")
        }, 200)
    })
}
function validarImporteCtaCte(objeto, numeroForm, importeComprobante) {

    function compararImportes(e) {
        let fila = $(e.target).parents("tr");
        let $input = $(`input.${importeComprobante}`, fila);
        let importe = stringANumero($(`input.saldoComprobante`, fila).val());
        let importe2 = stringANumero($input.val());
        if (importe < importe2) {
            let cartel = cartelInforUnaLinea("El importe ingresado no puede ser mayor al saldo del comprobante", "❌", { cartel: "infoChiquito rojo", close: "ocultoSiempre" })
            $(cartel).appendTo(`#bf${numeroForm}`)
            removeCartelInformativo(objeto, numeroForm)
            setTimeout(() => {
                $input.removeClass("validado");
            }, 0);
        } else {
            setTimeout(() => {
                $input.addClass("validado");
            }, 0);
        }
    }
    $(`#t${numeroForm}`).on("change", `input.${importeComprobante}`, compararImportes);
}
function calcularTotalMediosPagoConvertido(objeto, numeroForm) {

    $(`#t${numeroForm} table.compuestoMedioPagos input.totalColec.totalimporteTipoPago`).addClass(`total`)
    let monedaFormulario = $(`#t${numeroForm} .divSelectInput[name=moneda]`).val();
    $(`#t${numeroForm} table.compuestoMedioPagos td.totales.importeTipoPago`).attr(`moneda`, consultaPestanas?.moneda?.[monedaFormulario]?.name)

    function monedayTipoCambio(e) {
        monedaFormulario = $(`#t${numeroForm} .divSelectInput[name=moneda]`).val();
        tipoCambioMonedaFormulario = stringANumero($(`#t${numeroForm} input.form.tipoCambio`).val());

        $(`#t${numeroForm} table.compuestoMedioPagos td.totales.importeTipoPago`).attr(`moneda`, consultaPestanas?.moneda?.[monedaFormulario]?.name)
        calculoTotal()

    }
    function calculoTotal(e) {
        let total = 0;
        $.each($(`#t${numeroForm} table.compuestoMedioPagos tr.mainBody:not(.last)`), (indice, value) => {

            let monedaTipoPago = $(".divSelectInput[name=monedaTipoPago]", value).val().toLowerCase();
            let importeTipoPago = stringANumero($("input.importeTipoPago", value).val());

            let tipoCambioTipoPago = stringANumero($("input.tipoCambioTipoPago", value).val());
            let tipoCambioMonedaFormulario = stringANumero($(`#t${numeroForm} input.form.tipoCambio`).val());

            if (monedaTipoPago != monedaFormulario) {

                total += Number(importeTipoPago) * (Number(tipoCambioTipoPago) / Number(tipoCambioMonedaFormulario));
            } else {

                total += Number(importeTipoPago);
            }

        });

        $(`#t${numeroForm} table.compuestoMedioPagos input.totalColec.totalimporteTipoPago`).val(total || 0).trigger("blur");
    }
    $(`#t${numeroForm}`).on("input", "input.importeTipoPago, input.tipoCambioTipoPago", calculoTotal)
    $(`#t${numeroForm}`).on("change", "input.importeTipoCambio, .divSelectInput[name=moneda]", monedayTipoCambio)
    calculoTotal()
}
function ocultarHermanos(objeto, numeroForm) {

    function ocultarOrigen(e) {
        let fila = $(e.target).parents("tr")
        let name = e.target.name
        let valor = e.target.value
        fila.attr("origen", name)
        let cajasAbiertas = $(`#t${numeroForm} tr.mainBody:not(.last):not([origen=cuentaOrigen])`)
        let cuentasAbiertas = $(`#t${numeroForm} tr.mainBody:not(.last):not([origen=cajaOrigen])`)

        if (name == "cajaOrigen") {

            if (cuentasAbiertas.length > 0) {

                $(`td.cuentaOrigen,
                   td.cuentaOrigen .inputSelect`, fila).addClass("ocultoConLugar")

            } else {

                $(`#t${numeroForm} td.cuentaOrigen`).addClass("oculto")
                $(`#t${numeroForm} th.cuentaOrigen`).addClass("oculto")
                $(`#t${numeroForm} .selecSimulado`).removeClass("ubicado")
            }
        } else {
            $(`td.cuentaOrigen,
               td.cuentaOrigen .inputSelect`, fila).removeClass("oculto").removeClass("ocultoConLugar")

            $(`#t${numeroForm} th.cuentaOrigen`).removeClass("oculto")
            $(`#t${numeroForm} tr.mainBody.last td.cuentaOrigen`).removeClass("oculto")
            $(`#t${numeroForm} .selecSimulado`).removeClass("ubicado")

        }


        if (name == "cuentaOrigen") {

            if (cajasAbiertas.length > 0) {

                $(`td.cajaOrigen,
                   td.cajaOrigen .inputSelect`, fila).addClass("ocultoConLugar")
            } else {

                $(`#t${numeroForm} td.cajaOrigen`).addClass("oculto")
                $(`#t${numeroForm} th.cajaOrigen`).addClass("oculto")
                $(`#t${numeroForm} .selecSimulado`).removeClass("ubicado")
            }

        } else {
            $(`td.cajaOrigen,
               td.cajaOrigen .inputSelect`, fila).removeClass("oculto").removeClass("ocultoConLugar")
            $(`#t${numeroForm} th.cajaOrigen`).removeClass("oculto")
            $(`#t${numeroForm} tr.mainBody.last td.cajaOrigen`).removeClass("oculto")
            $(`#t${numeroForm} .selecSimulado`).removeClass("ubicado")
        }
        if (valor == "") {
            $(`td.cajaOrigen,
                td.cajaOrigen .inputSelect`, fila).removeClass("oculto").removeClass("ocultoConLugar")
            $(`#t${numeroForm} tr.mainBody td.cajaOrigen`).removeClass("oculto")
            $(`#t${numeroForm} th.cajaOrigen`).removeClass("oculto")
            $(fila).removeAttr("origen")
            $(`td.cuentaOrigen,
                td.cuentaOrigen input`, fila).removeClass("oculto").removeClass("ocultoConLugar")
            $(`#t${numeroForm} tr.mainBody td.cuentaOrigen`).removeClass("oculto")
            $(`#t${numeroForm} th.cuentaOrigen`).removeClass("oculto")
        }
    }

    $(`#t${numeroForm}`).on("change", ".divSelectInput[name=cajaOrigen], .divSelectInput[name=cuentaOrigen]", ocultarOrigen)

    function ocultarDestino(e) {

        let fila = $(e.target).parents("tr")
        let name = e.target.name
        let valor = e.target.value
        fila.attr("destino", name)
        let cajasAbiertas = $(`#t${numeroForm} tr.mainBody:not(.last):not([destino=cuentaDestino])`)
        let cuentasAbiertas = $(`#t${numeroForm} tr.mainBody:not(.last):not([destino=cajaDestino])`)


        if (name == "cajaDestino") {

            if (cuentasAbiertas.length > 0) {
                $(`td.cuentaDestino,
                    td.cuentaDestino input`, fila).addClass("ocultoConLugar")

            } else {

                $(`#t${numeroForm} td.cuentaDestino`).addClass("oculto")
                $(`#t${numeroForm} th.cuentaDestino`).addClass("oculto")
                $(`#t${numeroForm} .selecSimulado`).removeClass("ubicado")

            }


        } else {
            $(`td.cuentaDestino,
                 td.cuentaDestino .inputSelect`, fila).removeClass("oculto").removeClass("ocultoConLugar")
            $(`#t${numeroForm} th.cuentaDestino`).removeClass("oculto")
            $(`#t${numeroForm} tr.mainBody.last td.cuentaDestino`).removeClass("oculto")
            $(`#t${numeroForm} .selecSimulado`).removeClass("ubicado")
        }

        if (name == "cuentaDestino") {

            if (cajasAbiertas.length > 0) {
                $(`td.cajaDestino,
                     td.cajaDestino .inputSelect`, fila).addClass("ocultoConLugar")

            } else {
                $(`#t${numeroForm} td.cajaDestino`).addClass("oculto")
                $(`#t${numeroForm} th.cajaDestino`).addClass("oculto")
                $(`#t${numeroForm} .selecSimulado`).removeClass("ubicado")

            }

        } else {
            $(`td.cajaDestino,
                td.cajaDestino .inputSelect`, fila).removeClass("oculto").removeClass("ocultoConLugar")
            $(`#t${numeroForm} th.cajaDestino`).removeClass("oculto")
            $(`#t${numeroForm} tr.mainBody.last td.cajaDestino`).removeClass("oculto")
            $(`#t${numeroForm} .selecSimulado`).removeClass("ubicado")
        }
        if (valor == "") {
            $(`td.cajaDestino,
                td.cajaDestino .inputSelect`, fila).removeClass("oculto").removeClass("ocultoConLugar")
            $(`#t${numeroForm} tr.mainBody td.cajaDestino`).removeClass("oculto")
            $(`#t${numeroForm} th.cajaDestino`).removeClass("oculto")
            $(fila).removeAttr("destino")
            $(`td.cuentaDestino,
                td.cuentaDestino .inputSelect`, fila).removeClass("oculto").removeClass("ocultoConLugar")
            $(`#t${numeroForm} tr.mainBody td.cuentaDestino`).removeClass("oculto")
            $(`#t${numeroForm} th.cuentaDestino`).removeClass("oculto")
        }
    }
    $(`#t${numeroForm}`).on("change", ".divSelectInput[name=cajaDestino], .divSelectInput[name=cuentaDestino]", ocultarDestino)

    function devolverOcultos(e) {

        let fila = $(e.target).parents("tr")

        if ($(`#t${numeroForm} th.cuentaOrigen`).hasClass("oculto")) {
            $(`td.cuentaOrigen`, fila).removeClass("oculto");
            $(`#t${numeroForm} th.cuentaOrigen`).removeClass("oculto");
            $(`#t${numeroForm} td.cuentaOrigen.oculto,
                #t${numeroForm} td.cuentaOrigen.oculto .inputSelect`).addClass("ocultoConLugar").removeClass("oculto");
            $(`#t${numeroForm} .selecSimulado`).removeClass("ubicado")
        }
        if ($(`#t${numeroForm} th.cajaOrigen`).hasClass("oculto")) {
            $(`td.cajaOrigen`, fila).removeClass("oculto");
            $(`#t${numeroForm} th.cajaOrigen`).removeClass("oculto");
            $(`#t${numeroForm} td.cajaOrigen.oculto,
                #t${numeroForm} td.cajaOrigen.oculto .inputSelect`).addClass("ocultoConLugar").removeClass("oculto");
            $(`#t${numeroForm} .selecSimulado`).removeClass("ubicado")

        }
        if ($(`#t${numeroForm} th.cajaDestino`).hasClass("oculto")) {

            $(`td.cajaDestino`, fila).removeClass("oculto");

            $(`#t${numeroForm} th.cajaDestino`).removeClass("oculto");
            $(`#t${numeroForm} td.cajaDestino.oculto,
                #t${numeroForm} td.cajaDestino.oculto input`).addClass("ocultoConLugar").removeClass("oculto");
            $(`#t${numeroForm} .selecSimulado`).removeClass("ubicado")
        }
        if ($(`#t${numeroForm} th.cuentaDestino`).hasClass("oculto")) {

            $(`td.cuentaDestino`, fila).removeClass("oculto");
            $(`#t${numeroForm} th.cuentaDestino`).removeClass("oculto");

            $(`#t${numeroForm} td.cuentaDestino.oculto,
                #t${numeroForm} td.cuentaDestino.oculto .inputSelect`).addClass("ocultoConLugar").removeClass("oculto");
            $(`#t${numeroForm} .selecSimulado`).removeClass("ubicado")

        }
    }
    $(`#t${numeroForm}`).on("dblclick", "table.movimientosInternos input.position, table.compuestoDeposito input.position", devolverOcultos) // 

    function borraRenglon(e) {

        let cuentasAbiertas = $(`#t${numeroForm} tr.mainBody[origen=cuentaOrigen]`)
        let cajasAbiertas = $(`#t${numeroForm} tr.mainBody[origen=cajaOrigen]`)
        let cuentasAbiertas2 = $(`#t${numeroForm} tr.mainBody[destino=cuentaDestino]`)
        let cajasAbiertas2 = $(`#t${numeroForm} tr.mainBody[destino=cajaDestino]`)

        if (cuentasAbiertas.length == 0) {

            $(`#t${numeroForm} th.cuentaOrigen, 
                #t${numeroForm} td.cuentaOrigen`).addClass("oculto")
        }
        if (cajasAbiertas.length == 0) {

            $(`#t${numeroForm} th.cajaOrigen,
                #t${numeroForm} td.cajaOrigen`).addClass("oculto")
        }
        if (cajasAbiertas2.length == 0) {

            $(`#t${numeroForm} th.cajaDestino, 
                #t${numeroForm} td.cajaDestino`).addClass("oculto")
        }
        if (cuentasAbiertas2.length == 0) {

            $(`#t${numeroForm} th.cuentaDestino, 
                #t${numeroForm} td.cuentaDestino`).addClass("oculto")
        }
    }
    $(`#t${numeroForm}`).on("click", `td.delete span`, borraRenglon)

    if ($(`#t${numeroForm} input._id`).val().length > 0) {

        let filas = $(`#t${numeroForm} tr.mainBody:not(.last)`)

        let origenCajaAbierta = 0
        let origenCuentaAbierta = 0
        let destinoCajabierta = 0
        let destinoCuentaAbierta = 0

        $.each(filas, (indice, value) => {

            if ($(`.inputSelect.cajaOrigen`, value).val() != "") {

                $(value).attr("origen", "cajaOrigen")
                origenCajaAbierta++
            } else {
                $(value).attr("origen", "cuentaOrigen")
                origenCuentaAbierta++
            }

            if ($(`.inputSelect.cajaDestino`, value).val() != "") {

                $(value).attr("destino", "cajaDestino")
                destinoCajabierta++
            } else {

                $(value).attr("destino", "cuentaDestino")
                destinoCuentaAbierta++
            }
        })

        if (origenCajaAbierta > 0) {

            $(`#t${numeroForm} tr[origen=cuentaOrigen] td.cajaOrigen,
               #t${numeroForm} tr[origen=cuentaOrigen] td.cajaOrigen input`).addClass("ocultoConLugar")

        } else {
            $(`#t${numeroForm} th.cajaOrigen,
              #t${numeroForm} td.cajaOrigen`).addClass("oculto")
        }
        if (origenCuentaAbierta > 0) {

            $(`#t${numeroForm} tr[origen=cajaOrigen] td.cuentaOrigen,
               #t${numeroForm} tr[origen=cajaOrigen] td.cuentaOrigen input`).addClass("ocultoConLugar")

        } else {
            $(`#t${numeroForm} td.cuentaOrigen,
               #t${numeroForm} th.cuentaOrigen`).addClass("oculto")
        }

        if (destinoCajabierta > 0) {

            $(`#t${numeroForm} tr[destino=cuentaDestino] td.cajaDestino,
               #t${numeroForm} tr[destino=cuentaDestino] td.cajaDestino input`).addClass("ocultoConLugar")

        } else {
            $(`#t${numeroForm} th.cajaDestino,
               #t${numeroForm} td.cajaDestino`).addClass("oculto")
        }
        if (destinoCuentaAbierta > 0) {

            $(`#t${numeroForm} tr[destino=cajaDestino] td.cuentaDestino,
                 #t${numeroForm} tr[destino=cajaDestino] td.cuentaDestino input`).addClass("ocultoConLugar")

        } else {
            $(`#t${numeroForm} td.cuentaDestino,
               #t${numeroForm} th.cuentaDestino`).addClass("oculto")
        }

    }
}
function convierteMoneda(objeto, numeroForm) {

    function monedaConvertida(e) {

        let value = $(e.target).parents("tr")
        let importeTipoPago = stringANumero($("input.importeOrigen", value).val());
        let tipoCambioTipoPago = stringANumero($("input.tipoCambioOrigen", value).val());
        let tipoCambioDestino = stringANumero($(`input.tipoCambioDestino`, value).val());
        if (importeTipoPago != 0 && tipoCambioDestino != 0) {
            let importeDestino = Number((importeTipoPago * tipoCambioTipoPago) / tipoCambioDestino);

            $("input.importeDestino", value).val(numeroAString(importeDestino.toFixed(2))).attr("tabindex", "-1").trigger("input");
        }
    }
    $(`#t${numeroForm}`).on("change", "input.importeOrigen, input.tipoCambioOrigen, input.tipoCambioDestino", monedaConvertida)
}
function tipoCambioPesos(objeto, numeroForm) {

    function basePesos(e) {
        let value = $(e.target).parents("tr")
        let monedaOrigen = $(`input.monedaOrigen`, value).val();
        let monedaDestino = $(`input.monedaDestino`, value).val();

        if (monedaOrigen == "Pesos") {
            $(`input.tipoCambioOrigen`, value).val(1).trigger("input").trigger("change");
        }
        if (monedaDestino == "Pesos") {
            $(`input.tipoCambioDestino`, value).val(1).trigger("input").trigger("change");
        }
    }
    $(`#t${numeroForm}`).on("change", "input.monedaOrigen, input.monedaDestino", basePesos)

}
function ocultarHermanosFormulario(objeto, numeroForm, atributoUno, atributoDos) {

    function ocultarOrigen(e) {
        let valorCampo = e.target.value
        let nombreCampo = e.target.name

        if (valorCampo != "") {
            if (nombreCampo == atributoDos) {
                $(`#t${numeroForm} div.fo.${atributoUno}`).addClass("oculto")
                $(`#t${numeroForm} div.fo.${atributoUno} .inputSelect`).removeClass("requerido")
                $(`#t${numeroForm} div.fo.${atributoDos}`).removeClass("oculto")
                $(`#t${numeroForm} div.fo.${atributoDos} .inputSelect`).addClass("requerido")

            } else {
                $(`#t${numeroForm} div.fo.${atributoUno}`).removeClass("oculto")
                $(`#t${numeroForm} div.fo.${atributoUno} .inputSelect`).addClass("requerido")
                $(`#t${numeroForm} div.fo.${atributoDos}`).addClass("oculto")
                $(`#t${numeroForm} div.fo.${atributoDos} .inputSelect`).removeClass("requerido")
            }
        } else {
            $(`#t${numeroForm} div.fo.${atributoUno}`).removeClass("oculto")
            $(`#t${numeroForm} div.fo.${atributoUno} .inputSelect`).addClass("requerido")
            $(`#t${numeroForm} div.fo.${atributoDos}`).removeClass("oculto")
            $(`#t${numeroForm} div.fo.${atributoDos} .inputSelect`).addClass("requerido")

        }

    }

    $(`#t${numeroForm}`).on("change", `.divSelectInput[name=${atributoDos}], .divSelectInput[name=${atributoUno}]`, ocultarOrigen)

    if ($(`#t${numeroForm} input._id`).val() != "") {
        if ($(`#t${numeroForm} .divSelectInput[name=${atributoDos}]`).val() != "") {
            $(`#t${numeroForm} .divSelectInput[name=${atributoDos}]`).trigger("change")

        } else {
            $(`#t${numeroForm} .divSelectInput[name=${atributoUno}]`).trigger("change")
        }
    }

}
function estadoAnticipo(objeto, numeroForm) {

    function cambiaEstado(e) {

        let saldo = stringANumero($(`#t${numeroForm} input[name=saldo]`).val())
        let estadoInput = $(`#t${numeroForm} input[name=estado]`);

        if (saldo == 0) {
            estadoInput.val("Cerrado");
        } else if (saldo < 0) {
            estadoInput.val("Saldo a favor");
        } else {
            estadoInput.val("Abierto");
        }
        estadoInput.trigger("change");
    }
    $(`#t${numeroForm}`).on("change", `input.importe, input.importeTotal`, cambiaEstado)
}
function estadoFacturacionRemito(objeto, numeroForm) {
    let empresaSel = $(`.empresaSelect`).html().trim()
    let empresaSelecta = Object.values(consultaPestanas.empresa).find(e => e.name == empresaSel); // obtiene la primera clave del objeto
    if (empresaSelecta.ingresaStock == "Facturacion") {
        $(`#t${numeroForm} input.estado`).val("Directo")

    } else {
        const comparaciones = {
            compuestoFacturaCompras: "remitoIngreso",
            remitoIngreso: "compuestoFacturaCompras"
        };
        function normalizarCantidad(valor) {
            if (!valor) return 0;
            return parseFloat(valor.toString().replace(/\./g, "").replace(",", ".")) || 0;
        }
        function normalizarUnidad(valor) {
            if (!valor) return "";
            return valor.toString().trim().toUpperCase().replace(/\./g, "");
        }
        function cambiaEstado(e) {

            let estadoInput = $(`#t${numeroForm} input[name=estado]`);
            estadoInput.val("Pendiente");

            let fila = $(e.target).closest("tr");
            let numeroFila = fila.attr("q");
            let coleccionPartida = $(e.target).closest("table").attr("compuesto");
            let cantidades = normalizarCantidad($(`input[name=cantidad], input[name=cantidadRemito]`, fila).val());
            let unidadesMedida = normalizarUnidad($(`input[name=unidadesMedida], input[name=unidadesMedidaRemito]`, fila).val());
            let filaDestino = $(`#t${numeroForm} [compuesto=${comparaciones[coleccionPartida]}] tr.mainBody[q="${numeroFila}"]:not(.last)`);

            if (filaDestino.length) {
                let cantidadFila = normalizarCantidad($("input[name=cantidad], input[name=cantidadRemito]", filaDestino).val());
                let unidadMedidaFila = normalizarUnidad($("input[name=unidadesMedida], input[name=unidadesMedidaRemito]", filaDestino).val());

                if (cantidadFila === cantidades && unidadMedidaFila === unidadesMedida) {
                    filaDestino.attr("estado", "Aprobado");
                    fila.attr("estado", "Aprobado");
                } else {
                    filaDestino.attr("estado", "Pendiente");
                    fila.attr("estado", "Pendiente");
                }
            }
            let filasColeccionDestino = $(`#t${numeroForm} [compuesto=${comparaciones[coleccionPartida]}] tr.mainBody:not(.last)`);
            let todasAprobadas = true;
            filasColeccionDestino.each((i, filaDest) => {
                if ($(filaDest).attr("estado") == "Pendiente") {
                    todasAprobadas = false;
                }
            });

            if (todasAprobadas && filasColeccionDestino.length > 0) {
                estadoInput.val("Aprobado");
            } else {
                estadoInput.val("Pendiente");
            }
        }

        $(`#t${numeroForm}`).on("change", `input[name=cantidad], input[name=cantidadRemito], input[name=unidadesMedida], input[name=unidadesMedidaRemito]`, cambiaEstado);
    }

}
function sorteableTablas(objeto, numeroForm) {
    let tablas = document.querySelectorAll(`#t${numeroForm} table tbody`)

    for (const tabla of tablas) {

        new Sortable(tabla, {
            animation: 150,
            handle: 'td', // arrastrás desde cualquier celda
            filter: '', // NO mover estas filas
            preventOnFilter: false,
            draggable: 'tr.mainBody:not(.last)',
            onEnd: function (evt) {

                // Obtener la tabla contenedora
                let tabla = evt.item.closest("table");

                // Seleccionar las filas tr.mainBody que no tengan clase 'last'
                let filas = tabla.querySelectorAll("tr.mainBody:not(.last)");

                let index = 0;
                for (const fila of filas) {

                    // Setear atributo q al <tr>
                    fila.setAttribute("q", index);

                    // Setear atributo q a todos los <td> dentro del <tr>
                    const celdas = fila.querySelectorAll("td");
                    for (const td of celdas) {
                        td.setAttribute("q", index);
                    }

                    // Buscar input con clase "position" y setear el valor
                    const input = fila.querySelector("input.position");
                    if (input) {
                        input.value = index;
                    }

                    index++;
                }
            }
        });
    }
}
function reAsingnarQfilas(objeto, numeroForm, table) {

    let venta = $(`#t${numeroForm} table.${table} tr.mainBody:not(.last)`)

    $.each(venta, (index, val) => {

        val.setAttribute("q", index);

        const celdas = val.querySelectorAll("td");
        for (const td of celdas) {
            td.setAttribute("q", index);
        }

        const input = val.querySelector("input.position");
        if (input) {
            input.value = index;
        }
    })
}
function estadoSegunOperacion(objeto, numeroForm) {
    function asignarEstado(e) {
        let operacion = $(e.target).val().trim()
        if (operacion == "Ajuste") {
            $(`#t${numeroForm} input.estadoFacturacion`).val("Ajuste").trigger("change")
        } else {
            $(`#t${numeroForm} input.estadoFacturacion`).val("Pendiente").trigger("change")
        }
    }
    $(`#t${numeroForm}`).on("change", `.inputSelect.operacionStock`, asignarEstado)
    $(`#t${numeroForm} .tablaCompuesto.movimientoStock`).on(`dblclick`, `tr.last td.vacio`, () => {
        $(`#t${numeroForm} .inputSelect.operacionStock`).trigger("change")
    })
}
function remitosPendientes(objeto, numeroForm) {

    let remitoPendiente = "";
    function cartelRemito(e) {
        $(`#t${numeroForm} .cartelComplemento.remitoIngreso`).remove()
        remitoPendiente = $(e.target).parents("tr");
        let preFiltros = {
            proveedor: $(`#t${numeroForm} input.divSelectInput[name="proveedor"]`).val(),
            estadoFacturacion: "Pendiente"
        }

        const filtros = `&filtros=${JSON.stringify(preFiltros)}`
        fetch(`/get?base=stock${filtros}`)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                cartelComplementoConCortina(objeto, numeroForm, { bloques: 2, claseCartel: "remitoIngreso" })

                let titulo = "<div><h4>Movimientos pendientes</h4></div>"
                $(titulo).appendTo(`#t${numeroForm} .bloque0`)
                let cuerpoPrincipal = ""
                cuerpoPrincipal += `<table>`
                cuerpoPrincipal += `<tr class="titulosTable">`
                cuerpoPrincipal += `<th class="oculto">ID</th><th class="oculto">IdUnWind</th><th>Fecha</th><th>Remito</th><th>Cantidad</th><th>Unidad</th><th>Producto</th><th>Almacen</th><th class="oculto">EstadoFacturacion</th>`
                cuerpoPrincipal += `</tr>`
                $.each(data, (indice, value) => {

                    cuerpoPrincipal += `<tr class="filaTable">`
                    cuerpoPrincipal += `<td class="oculto idComprobante">${value._id}</td><td class="oculto idColeccionUnWind">${value._idColeccionUnWind}</td><td class="fecha" fechaFormateada="${dateNowAFechaddmmyyyy(value.fecha, "y-m-d")}">${dateNowAFechaddmmyyyy(value.fecha, "d/m/y")}</td> <td class ="remito">${value.remito}</td><td class ="cantidad">${value.cantidad}</td><td class ="unidadesMedida">${consultaPestanas?.unidadesMedida?.[value.unidadesMedida]?.name || ""}</td><td class ="productoRemito">${consultaPestanas?.producto?.[value.producto]?.name || ""}</td><td class ="almacen">${consultaPestanas?.almacen?.[value.almacen]?.name || ""}</td><td class="oculto estadoFacturacion">${value.estadoFacturacion}</td>`
                    cuerpoPrincipal += `</tr>`
                })
                $(cuerpoPrincipal).appendTo(`#t${numeroForm} .bloque1`)

                $(`#t${numeroForm} table.remitoIngreso tr.mainBody:not(.last)`).each((indice, elemento) => {
                    const idComprobante = $(elemento).find('td.idComprobante input').val();
                    const idColeccionUnWind = $(elemento).find('td.idColeccionUnWind input').val();
                    $(`#t${numeroForm} .cartelComplemento.remitoIngreso tr.filaTable`).filter(function () {

                        return $(this).find('td.idComprobante')?.html()?.trim() === idComprobante && $(this).find('td.idColeccionUnWind')?.html()?.trim() === idColeccionUnWind
                    }).addClass('oculto');
                });

            })
            .catch(error => console.error('Error de red:', error));
    }
    function seleccionarMovimiento(e) {

        $(e.currentTarget).toggleClass(`seleccionado`)
        $(e.currentTarget).siblings().removeClass(`seleccionado`)
    }
    $(`#t${numeroForm}`).on("click", ".remitoIngreso tr.filaTable", seleccionarMovimiento)
    $(`#t${numeroForm}`).on("click", "table.remitoIngreso tr:not(.last) input:not(.transparente):not([name='importeaCobrar'])", cartelRemito)
    $(`#t${numeroForm}`).on("click", ".remitoIngreso .okBoton", (e) => {
        let filaSeleccionada = $(`#t${numeroForm} .remitoIngreso tr.seleccionado`);
        if (filaSeleccionada.length > 0) {
            $.each(filaSeleccionada, (indice, value) => {
                $("input.remito", remitoPendiente).val($("td.remito", value).html()?.trim()).addClass("transparenteformt");
                $("input.cantidadRemito", remitoPendiente).val($("td.cantidad", value).html()?.trim()).trigger("change").addClass("transparenteformt");
                $("input.unidadesMedidaRemito", remitoPendiente).val($("td.unidadesMedida", value).html()?.trim()).trigger("change").addClass("transparenteformt");
                $("input.productoRemito", remitoPendiente).val($("td.productoRemito", value).html()?.trim()).trigger("change").addClass("transparenteformt");
                $("input.almacenRemito", remitoPendiente).val($("td.almacen", value).html()?.trim()).trigger("change").addClass("transparenteformt");
                $("input.idComprobante", remitoPendiente).val($("td.idComprobante", value).html()?.trim());
                $("input.idColeccionUnWind", remitoPendiente).val($("td.idColeccionUnWind", value).html()?.trim());
                $("input.estadoFacturacion", remitoPendiente).val("Facturado");

                $(`#t${numeroForm} .remitoIngreso .closePop`).trigger(`click`);
            });
        }
    });

}
function fechaFacturacion(objeto, numeroForm) {
    let fechaStr = $(`#t${numeroForm} input.fecha`).val()
    let diasFacturacion = caracteristicaEmpresa.diasFacturacion
    let id = $(`#t${numeroForm} input._id`).val()

    if (id == "") {

        let partes = fechaStr.split("-")
        let fecha = new Date(partes[0], partes[1] - 1, partes[2]) // yyyy, mm, dd

        fecha.setDate(fecha.getDate() + diasFacturacion)

        let fechaFormateada = dateNowAFechaddmmyyyy(fecha, "d/m/y")
        let partes2 = fechaFormateada.split("/")
        fechaFormateada = partes2[2] + "-" + partes2[1] + "-" + partes2[0]

        $(`#t${numeroForm} input.fechaVencimiento`).val(fechaFormateada).trigger("blur")

    }
}
function consultaStock(objeto, numeroForm) {

    let stockData = {};
    async function obtenerStock() {
        let detalleFiltroAtributos = {};

        if (objeto.empresa != false) {
            detalleFiltroAtributos = Object.assign(detalleFiltroAtributos, empresaFiltro);
        }
        let anoActual = obtenerAno(new Date());
        let mesActual = obtenerMes(new Date());
        let periodoActual = `${anoActual}${mesActual}`;
        console.log(periodoActual)
        detalleFiltroAtributos.periodo = periodoActual;
        detalleFiltroAtributos.name = "Existencias";

        const filtros = `&filtros=${JSON.stringify(detalleFiltroAtributos)}`;
        const sort = `&sort=_id:-1`;
        const limit = `&limit=1`;

        return await fetch(`/get?base=acumulador${filtros}${sort}${limit}`)
            .then(response => response.json())
            .then(data => {

                $.each(data, (indice, value) => {
                    let clave = `${value.producto}_${value.unidadesMedida}`;
                    stockData[clave] = value.cantidadTotal;

                });

            })
            .catch(error => console.error("Error de red:", error));
    }
    const configTabla = {
        movimientoStock: {
            tabla: "movimientoStock",
            inputCantidad: "cantidadSalidas",
            inputUnidad: "unidadesMedida"
        },
        detalleProducto: {
            tabla: "detalleProducto",
            inputCantidad: "cantidadProducto",
            inputUnidad: "unidadesMedidaProducto"
        }
    };
    function obtenerTipoDesdeEvento(e) {
        let tabla = $(e.target).closest("table").attr("compuesto");
        return tabla

    }
    function consultarStock(e) {

        let operacion = $(`#t${numeroForm} .inputSelect.operacionStock`).val();
        if (operacion == "Ajuste") return; // permite ajustar al negativo
        console.log(operacion)

        let tipo = obtenerTipoDesdeEvento(e);
        if (!tipo) return;

        let tablaSelect = configTabla[tipo];

        let fila = $(e.target).closest("tr");
        let numeroFila = fila.attr("q");

        let cantidadInput = $(`#t${numeroForm} table.${tablaSelect.tabla} tr[q="${numeroFila}"] input.${tablaSelect.inputCantidad}`);
        let cantidad = stringANumero(cantidadInput.val()) || 0;

        let unidadMedida = $(`#t${numeroForm} table.${tablaSelect.tabla} tr[q="${numeroFila}"] .divSelectInput[name='${tablaSelect.inputUnidad}']`).val();
        let productoSelect = $(`#t${numeroForm} table.${tablaSelect.tabla} tr[q="${numeroFila}"] .divSelectInput[name='producto']`).val();

        if (!productoSelect || !unidadMedida) return;

        let clave = `${productoSelect}_${unidadMedida}`;
        let cantidadStock = stockData[clave] ?? 0;
        let disponiblesInput = $(`#t${numeroForm} table.${tablaSelect.tabla} tr[q="${numeroFila}"] input.disponibles`);
        let disponibles = stringANumero(disponiblesInput.val()) || 0;
        let unidadesQuiebre = consultaPestanas.producto[productoSelect].unidadesMedida || [];
        let quiebresPermitidos = consultaPestanas.producto[productoSelect].quiebrePermitido || [];
        let cantidadQuiebre = quiebresPermitidos[unidadesQuiebre.indexOf(unidadMedida)] ?? 0;
        let stockDisponible = disponibles;
        console.log(cantidad)
        console.log(disponibles)
        console.log(cantidadStock)
        console.log(cantidadQuiebre)
        if ((cantidad > disponibles)) {
            let cartel = cartelInforUnaLinea(
                "Supera la cantidad disponible: " + stockDisponible,
                "❌",
                { cartel: "infoChiquito rojo", close: "ocultoSiempre" }
            );
            $(cartel).appendTo(`#bf${numeroForm}`);
            removeCartelInformativo(objeto, numeroForm);

            setTimeout(() => cantidadInput.removeClass("validado"), 200);
        } else {

            cantidadInput.addClass("validado");
        }


    }
    /* function validarProducto(e) {
 
         let tipo = obtenerTipoDesdeEvento(e);
         if (!tipo) return;
 
         let tablaSelect = configTabla[tipo];
         let filaActual = $(e.target).closest("tr");
         let producto = $(".divSelectInput[name='producto']", filaActual).val();
         let unidad = $(`.divSelectInput[name='${tablaSelect.inputUnidad}']`, filaActual).val()
         let repetido = false
 
         $.each($(`#t${numeroForm} table.${tablaSelect.tabla} .divSelectInput[name="producto"]`), (indice, value) => {
             let fila = $(value).closest("tr");
             let otroProducto = $(".divSelectInput[name='producto']", fila).val();
             let otraUnidad = $(`.divSelectInput[name='${tablaSelect.inputUnidad}']`, fila).val()
 
             if (fila[0] != filaActual[0] && producto == otroProducto && unidad == otraUnidad) {
                 repetido = true;
                 return false;
             }
         });
 
         if (repetido && producto != "" && unidad != "") {
             let cartel = cartelInforUnaLinea("No puede repetir producto y unidad", "❌", { cartel: "infoChiquito rojo", close: "ocultoSiempre" });
             $(cartel).appendTo(`#bf${numeroForm}`);
             removeCartelInformativo(objeto, numeroForm);
             filaActual.find("input.producto").removeClass("validado");
             ;
         }
     }*/
    $(`#t${numeroForm}`).on("change", "table.movimientoStock .divSelectInput[name='producto'], table.detalleProducto .divSelectInput[name='producto']", async function (e) {

        let productoSelect = $(this).val();
        if (productoSelect) {
            await obtenerStock()
            consultarStock(e);
        }
    }
    );

    $(`#t${numeroForm}`).on("blur", "table.movimientoStock input.cantidadSalidas, table.detalleProducto input.cantidadProducto", consultarStock);
    $(`#t${numeroForm}`).on("change", "table.movimientoStock .divSelectInput[name='unidadesMedida'],table.detalleProducto .divSelectInput[name='unidadesMedidaProducto']", consultarStock);
    // $(`#t${numeroForm}`).on("change", "table.movimientoStock .divSelectInput[name='producto'],table.detalleProducto .divSelectInput[name='producto'], table.movimientoStock .divSelectInput[name='unidadesMedida'],table.detalleProducto .divSelectInput[name='unidadesMedidaProducto']", validarProducto);

}
function salidaStock(objeto, numeroForm) {

    let ingresoPendiente = "";

    function cartelIngresos(e) {
        let operacionCab = $(`#t${numeroForm} .inputSelect.operacionStock`).val();
        console.log(operacionCab)
        if (operacionCab == "Ajuste") return; // permite ajustar al negativo

        ingresoPendiente = $(e.target).parents("tr");

        const idProducto = $(".divSelectInput[name='producto']", ingresoPendiente).val();

        if (!idProducto) return;

        let productoFila = $(".divSelectInput[name='producto']", ingresoPendiente).val();
        let operacionInput = $(`#t${numeroForm} .inputSelect.operacionStock`).val();
        let operacion = "Ajuste"
        console.log(operacionInput)
        if (operacionInput == "Salida") {
            operacion = "Entrada"
        }

        let preFiltros = {
            operacionStock: operacion,
            estado: ["Ingresado", "Salida parcial"],
            producto: productoFila

        }

        const filtros = `&filtros=${JSON.stringify(preFiltros)}`
        fetch(`/get?base=stock${filtros}`)
            .then(response => response.json())
            .then(data => {

                cartelComplementoConCortina(objeto, numeroForm, { bloques: 2, claseCartel: "movimientoStock" })

                let titulo = "<div><h4>Movimientos pendientes</h4></div>"
                $(titulo).appendTo(`#t${numeroForm} .bloque0`)
                let cuerpoPrincipal = ""
                cuerpoPrincipal += `<table>`
                cuerpoPrincipal += `<tr class="titulosTable">`
                cuerpoPrincipal += `<th class="oculto">ID</th><th>Fecha</th><th>Producto</th><th>Unidad</th><th>Cantidad</th><th>Almacen</th><th>Disponibles</th><th>Vencimiento</th>`
                cuerpoPrincipal += `</tr>`
                $.each(data, (indice, value) => {

                    cuerpoPrincipal += `<tr class="filaTable">`
                    cuerpoPrincipal += `<td class="oculto idComprobante"> ${value._id} </td><td class="fecha" fechaFormateada="${dateNowAFechaddmmyyyy(value.fecha, "y-m-d")}">${dateNowAFechaddmmyyyy(value.fecha, "d/m/y")}</td><td class="producto">${consultaPestanas?.producto?.[value.producto]?.name || ""}</td><td class="unidadesMedida">${consultaPestanas?.unidadesMedida?.[value.unidadesMedida]?.name || ""}</td><td class ="cantidad">${value.cantidad}</td><td class="almacen">${consultaPestanas?.almacen?.[value.almacen]?.name || ""}</td><td class="disponibles">${value.disponibles}</td><td class="fechaVencimientoProducto" fechaFormateada="${dateNowAFechaddmmyyyy(value.fecha, "y-m-d")}">${dateNowAFechaddmmyyyy(value.fecha, "d/m/y")}</td>`//<td class="almacen">${value.almacen}</td>`//<td class="moneda">${consultaPestanas?.moneda?.[value.moneda]?.name || ""}</td><td class="importe">${numeroAString(value.importe || 0)}</td><td class="oculto importema"> ${value.importema} </td><td class="oculto importemb"> ${value.importemb} </td><td class="oculto tipoCambio"> ${value.tipoCambio} </td><td class="saldoComprobante">${numeroAString(value.saldoComprobante || 0)}</td>`
                    cuerpoPrincipal += `</tr>`
                })
                $(cuerpoPrincipal).appendTo(`#t${numeroForm} .bloque1`)

                $(`#t${numeroForm} table.movimientoStock tr.mainBody:not(.last)`).each((indice, elemento) => {
                    const idComprobante = $(elemento).find('td.idComprobante input').val();
                    $(`#t${numeroForm} .cartelComplemento.movimientoStock tr.filaTable`).filter(function () {
                        return $(this).find('td.idComprobante')?.html()?.trim() === idComprobante;
                    }).addClass('oculto');
                });
            })
            .catch(error => console.error('Error de red:', error));
    }
    function seleccionarMovimiento(e) {

        $(e.currentTarget).toggleClass(`seleccionado`)
        $(e.currentTarget).siblings().removeClass(`seleccionado`)
    }
    $(`#t${numeroForm}`).on("click", ".movimientoStock tr.filaTable", seleccionarMovimiento)
    $(`#t${numeroForm}`).on("change", "table.movimientoStock .divSelectInput[name='producto']", cartelIngresos)
    $(`#t${numeroForm}`).on("click", ".movimientoStock .okBoton", (e) => {

        let filaSeleccionada = $(`#t${numeroForm} .movimientoStock tr.seleccionado`);

        if (filaSeleccionada.length > 0) {
            $.each(filaSeleccionada, (indice, value) => {

                $("input.producto", ingresoPendiente).val($("td.producto", value).html().trim()).trigger("input").addClass("transparente");
                $("input.unidadesMedida", ingresoPendiente).val($("td.unidadesMedida", value).html().trim()).trigger("change").addClass("transparente");
                $("input.cantidad", ingresoPendiente).val($("td.cantidad", value).html().trim()).trigger("input").addClass("transparente");
                $("input.disponibles", ingresoPendiente).val($("td.disponibles", value).html().trim()).trigger("input").addClass("transparente");;
                $("input.fechaVencimientoProducto", ingresoPendiente).val($("td.fechaVencimientoProducto", value).attr(`fechaFormateada`)).trigger("input").addClass("transparente");
                $("input.idComprobante", ingresoPendiente).val($("td.idComprobante", value).html()?.trim()).trigger("change");
                $(`#t${numeroForm} .movimientoStock .closePop`).trigger(`click`);
            });
        }
    });

}
function completaConCodigo(objeto, numeroForm) {


    function completarAtributos(e) {
        let fila = $(e.target).closest("tr");
        let numeroFila = fila.attr("q");
        let codigoDeBarras = ($(`#t${numeroForm} table.movimientoStock tr[q="${numeroFila}"] input.codigoDeBarras`).val() || "").trim();

        if (codigoDeBarras.length != 13) {
            return
        } else {

            let productos = Object.values(consultaPestanas.producto);

            let productoEncontrado = productos.find(e => String(e.codigoDeBarras).trim() == codigoDeBarras
            );


            if (!productoEncontrado) {
                console.log("No se encontró producto");
                return;
            }


            let primerUnidadDeMedida = productoEncontrado.unidadesMedida[0];
            let tr = $(`#t${numeroForm} table.movimientoStock tr[q="${numeroFila}"]`);

            tr.find("input.cantidad").val(1).trigger("input");
            tr.find('input.unidadesMedida').val(consultaPestanas.unidadesMedida[primerUnidadDeMedida].name).trigger("change");
            tr.find('input.producto').val(productoEncontrado.name).trigger("change");

            let entidad = objeto.accion
            if (entidad == "salidaInventario") {
                $(`#t${numeroForm} input[name="operacionStock"]`).val("Salida").trigger("change");

            } else if (entidad == "entradaInventario") {
                $(`#t${numeroForm} input[name="operacionStock"]`).val("Entrada").trigger("change");
            }

        }

    }

    $(`#t${numeroForm}`).on("change", "table.movimientoStock input.codigoDeBarras", completarAtributos);

}
function ajustesSalida(objeto, numeroForm) {

    function ocultarAtributosAjustes(e) {
        let operacionCab = $(`#t${numeroForm} .inputSelect.operacionStock`).val();
        if (operacionCab == "Ajuste") {
            $(`#t${numeroForm} td.disponibles`).addClass("oculto");
            $(`#t${numeroForm} th.disponibles`).addClass("oculto");
            $(`#t${numeroForm} td.cantidadSalidas`).addClass("oculto");
            $(`#t${numeroForm} th.cantidadSalidas`).addClass("oculto");
        } else {
            $(`#t${numeroForm} td.disponibles`).removeClass("oculto");
            $(`#t${numeroForm} th.disponibles`).removeClass("oculto");
            $(`#t${numeroForm} td.cantidadSalidas`).removeClass("oculto");
            $(`#t${numeroForm} th.cantidadSalidas`).removeClass("oculto");
        }
    }
    $(`#t${numeroForm}`).on("change", ".inputSelect.operacionStock", ocultarAtributosAjustes);

}