
function obtenerEmpresaEmisoraActiva() {
    let empresaNombreSeleccionada = $(`.navegacionSupHomeLog .tituloEmpresa .empresaSelect`).first().text().trim()
        || $(`.empresaSelect`).first().text().trim()

    return Object.values(consultaPestanas?.empresa || {}).find(e => e.name == empresaNombreSeleccionada)
}
function condicionImpositivaNormalizada(condicion = "") {
    return condicion.toString().replace(/\s+/g, "").toLowerCase()
}
function empresaEsMonotributo(empresaEmisora) {
    let condicion = condicionImpositivaNormalizada(empresaEmisora?.condicionImpositiva)
    return condicion.includes("monotributo") || condicion.includes("monotributista") || condicion == "6"
}
function fijarComprobanteCFijoMonotributo(objeto, numeroForm) {
    if (objeto?.accion != "facturasEmitidas") return

    let father = $(`#t${numeroForm}`)
    const empresaEmisora = obtenerEmpresaEmisoraActiva()

    father.off("focusin.monotributoTipoComprobante", ".inputSelect.tipoComprobante")
    father.off("change.monotributoTipoComprobante", ".inputSelect.tipoComprobante")
    father.off("input.monotributoTipoComprobante", ".inputSelect.tipoComprobante")

    if (!empresaEsMonotributo(empresaEmisora)) return

    const aplicarRestriccion = () => {
        let selectoresTipoComprobante = $(`.selectCont.tipoComprobante`, father)
        if (selectoresTipoComprobante.length == 0) return

        $.each(selectoresTipoComprobante, (indice, value) => {
            let selector = $(value)
            let inputTipoComprobante = $(`.inputSelect.tipoComprobante`, selector)

            if (inputTipoComprobante.length == 0) return

            if (inputTipoComprobante.val() != "Letra C") {
                inputTipoComprobante.val("Letra C").trigger("change")
            }
            inputTipoComprobante.removeAttr("readonly").addClass("validado")
        })
    }

    aplicarRestriccion()
    ;[80, 200, 500].forEach((delay) => {
        setTimeout(aplicarRestriccion, delay)
    })

    father.on("focusin.monotributoTipoComprobante", ".inputSelect.tipoComprobante", aplicarRestriccion)

    father.on("change.monotributoTipoComprobante", ".inputSelect.tipoComprobante", aplicarRestriccion)

    father.on("input.monotributoTipoComprobante", ".inputSelect.tipoComprobante", (e) => {
        if (e.target.value != "Letra C") {
            e.target.value = "Letra C"
        }
    })
}
function monedaBaseEmpresaEmitirFactura(objeto, numeroForm) {
    if (objeto?.accion != "facturasEmitidas") return
    if ($(`#t${numeroForm} input._id`).val() != "") return

    const aplicarMonedaBase = () => {
        let empresaEmisora = obtenerEmpresaEmisoraActiva()
        let monedaBaseEmpresa = (empresaEmisora?.monedaBase || "Pesos").toString().trim()
        if (monedaBaseEmpresa == "") monedaBaseEmpresa = "Pesos"

        let monedaCatalogo = Object.values(consultaPestanas?.moneda || {}).find((m) =>
            (m?.name || "").toString().trim().toLowerCase() == monedaBaseEmpresa.toLowerCase()
        )
        let monedaDefecto = monedaCatalogo?.name || monedaBaseEmpresa

        let inputMoneda = $(`#t${numeroForm} .inputSelect.moneda`).first()
        if (inputMoneda.length == 0) return

        if ((inputMoneda.val() || "").toString().trim().toLowerCase() != monedaDefecto.toLowerCase()) {
            inputMoneda.val(monedaDefecto).trigger("change")
        }
    }

    aplicarMonedaBase()
    ;[50, 180, 400].forEach((delay) => setTimeout(aplicarMonedaBase, delay))
}
function comprobanteFunc(valor, objeto, numeroForm) {

    let valorLetra = ""
    let empresaEmisora = obtenerEmpresaEmisoraActiva()
    if (empresaEsMonotributo(empresaEmisora)) {
        return "Letra C"
    }

    switch (condicionImpositivaNormalizada(empresaEmisora?.condicionImpositiva)) {
        case "responsableinscripto":

            let consultaCliente = consultaPestanas?.cliente?.[valor]?.condicionImpositiva || ""

            switch (consultaCliente) {
                case `Responsable Inscripto`:

                    valorLetra = "Letra A"
                    break
                default:

                    valorLetra = "Letra B"
            }

            break;
    }

    return valorLetra
}

function letraCodigoComprobante(objeto, numeroForm) {

    let letraComp = (e) => {
        if (e.target.value != "") {
            let valorCliente = e.target.closest(".selectCont")
            let valorId = $(`.divSelectInput`, valorCliente).val()

            let val = comprobanteFunc(valorId, objeto, numeroForm)
            if ((val || "").trim() == "" && objeto?.accion == "facturasEmitidas") {
                val = "Letra C"
            }

            if ((val || "").trim() != "") {
                $(`#t${numeroForm} .inputSelect.tipoComprobante`).val(val).trigger("change")
            }
        }

    }

    $(`#t${numeroForm}`).off(`change.letraCodigoComprobante`, `.inputSelect.cliente`)
    $(`#t${numeroForm}`).on(`change.letraCodigoComprobante`, `.inputSelect.cliente`, letraComp)

}
function calculaImpuestossoloIVa(objeto, numeroForm) {
    const father = $(`#t${numeroForm}`)
    const selectorItemFactura = `.divSelectInput[name=itemVenta], .divSelectInput[name=itemCompra], .inputSelect.itemVenta, .inputSelect.itemCompra`
    const selectorTipoComprobante = `.inputSelect.tipoComprobante, .divSelectInput[name=tipoComprobante]`
    const selectorPorcentaje = `table.compuestoFacturaVentas tr.mainBody:not(.last) input.porcentaje,
        table.compuestoFacturaCompras tr.mainBody:not(.last) input.porcentaje`
    const selectorImpuestoFact = `table.compuestoFacturaVentas tr.mainBody:not(.last) input.impuestoFactVentas,
        table.compuestoFacturaCompras tr.mainBody:not(.last) input.impuestoFactVentas`

    const esLetraC = () => {
        let visible = ($(`#t${numeroForm} .inputSelect.tipoComprobante`).first().val() || "").toString().trim().toLowerCase()
        let interno = ($(`#t${numeroForm} .divSelectInput[name=tipoComprobante]`).first().val() || "").toString().trim().toLowerCase()
        return visible == "letra c" || visible == "c" || interno == "letra c" || interno == "c"
    }
    const limpiarIvaFila = (fila) => {
        $(`input.porcentaje`, fila).val("")
        $(`input.impuestoFactVentas`, fila).val("").trigger("input")
    }

    const tasaDeImpuestosSegunProducto = (e) => {

        let fila = $(e.target).parents("tr")
        let prodSeleccionado = $(`.divSelectInput[name=itemVenta], .divSelectInput[name=itemCompra]`, fila).first().val()
        let impuestosProductos = consultaPestanas?.itemVenta?.[prodSeleccionado]?.impuestoDefinicion || consultaPestanas?.itemCompra?.[prodSeleccionado]?.impuestoDefinicion
        let ivaImpuesto = impuestosProductos?.find(e => consultaPestanas?.agrupadorImpuesto?.[consultaPestanas?.impuestoDefinicion?.[e]?.agrupadorImpuesto]?.name == "IVA")
        let tasaIvaPrd = consultaPestanas?.impuestoDefinicion?.[ivaImpuesto]?.tasa || ""

        if (esLetraC()) {
            limpiarIvaFila(fila)
            return
        }

        $(`input.porcentaje`, fila).val(numeroAString(tasaIvaPrd)).trigger("input")
    }

    father.off("change.calculaImpuestossoloIVa", selectorItemFactura)
    father.off("change.calculaImpuestossoloIVa", selectorTipoComprobante)
    father.off("input.calculaImpuestossoloIVa", selectorPorcentaje)
    father.off("input.calculaImpuestossoloIVa", selectorImpuestoFact)

    father.on("change.calculaImpuestossoloIVa", selectorItemFactura, tasaDeImpuestosSegunProducto)
    father.on("change.calculaImpuestossoloIVa", selectorTipoComprobante, (e) => {
        let esLetraCComprobante = esLetraC()
        let porcentajes = $(`#t${numeroForm} table.compuestoFacturaVentas tr.mainBody:not(.last) input.porcentaje,
            #t${numeroForm} table.compuestoFacturaCompras tr.mainBody:not(.last) input.porcentaje`)

        $.each(porcentajes, (indice, value) => {
            if (esLetraCComprobante) {
                $(value).val("")
            }
            $(value).trigger("input")
        })

        if (!esLetraCComprobante) {
            $(`#t${numeroForm} .divSelectInput[name=itemVenta], #t${numeroForm} .divSelectInput[name=itemCompra]`).trigger("change")
        } else {
            let filas = $(`#t${numeroForm} table.compuestoFacturaVentas tr.mainBody:not(.last),
                #t${numeroForm} table.compuestoFacturaCompras tr.mainBody:not(.last)`)
            $.each(filas, (indice, tr) => {
                limpiarIvaFila($(tr))
            })
        }
    })
    father.on("input.calculaImpuestossoloIVa", selectorPorcentaje, (e) => {

        if (!esLetraC()) return

        if ((e.target.value || "").toString().trim() != "") {
            $(e.target).val("").trigger("input")
        }
    })
    father.on("input.calculaImpuestossoloIVa", selectorImpuestoFact, (e) => {

        if (!esLetraC()) return
        if ((e.target.value || "").toString().trim() == "") return
        $(e.target).val("").trigger("input")
    })

}
function calculaImpuestos(objeto, numeroForm, atributo, datos) {

    let base = datos?.base
    let impuestoIva = datos?.iva
    let impuestos = new Object
    let otrosImpuestos = new Object

    const calculoIVA = (e, ivaImp, tasaIva) => {

        let fila = $(e.target).parents("tr")

        let baseImpuesto = $(`input.${base.nombre || base}`, fila).val()
        let porcenta = tasaIva

        let impuestoCal = stringANumero(baseImpuesto) * (porcenta / 100)

        $(`input.${impuestoIva.nombre || impuestoIva}`, fila).val(numeroAString(impuestoCal))



    }
    const calculoImpuestos = (e, impuestoSel, nameImp) => {

        let fila = $(e.target).parents("tr")
        let orden = $(e.target).attr("ord")

        let baseImpuesto = $(`input.${base.nombre || base}`, fila).val()
        let porcenta = impuestoSel?.tasa

        let impuestoCal = stringANumero(baseImpuesto) * (porcenta / 100)
        otrosImpuestos[orden] = new Object

        impuestos[nameImp][impuestoSel._id] = impuestos?.[nameImp]?.[impuestoSel._id] || new Object
        impuestos[nameImp][impuestoSel._id][orden] = {
            baseImpuesto,
            impuestoCal
        }

        otrosImpuestos[orden][nameImp] = impuestoCal
        let totalImp = 0

        $.each(otrosImpuestos[orden], (indice, value) => {

            totalImp += value
        })

        $(`input.otrosImpuestos`, fila).val(numeroAString(totalImp)).trigger("input")

        //  armadoPestanaImpuesto(nameImp, baseImpuesto, porcenta, impuestoSel)

    }
    const tasaDeImpuestosSegunProducto = (e) => {

        let prodSeleccionado = $("td.itemVenta .divSelectInput", $(e.target).parents("tr")).val()

        let impuestosProductos = consultaPestanas.itemVenta[prodSeleccionado]?.impuestoDefinicion || null

        let fila = $(e.target).parents("tr")

        $.each(impuestosProductos, (indice, value) => {

            switch (consultaPestanas?.agrupadorImpuesto?.[consultaPestanas?.impuestoDefinicion?.[value]?.agrupadorImpuesto]?.name) {
                case "IVA":

                    let tasaIva = consultaPestanas.impuestoDefinicion[value].tasa

                    let ivaImp = consultaPestanas.impuestoDefinicion[value]

                    $(`input.porcentaje`, fila).val(numeroAString(tasaIva))

                    calculoIVA(e, ivaImp, tasaIva)
                    break;
                case "Ingresos brutos":

                    let nameImp = consultaPestanas.agrupadorImpuesto[consultaPestanas.impuestoDefinicion[value].agrupadorImpuesto].name
                    impuestos[nameImp] = impuestos[nameImp] || new Object
                    let ingresoBrutoSel = consultaPestanas.impuestoDefinicion[value]

                    calculoImpuestos(e, ingresoBrutoSel, nameImp)

                    break;
                case undefined:
                    //Aca pongo undefined que no haga nada, porque en la definición de la impuesto producto, en el market, si elegis ninguno, el primer item del la colección
                    // es "", entonces  pongo que caigan aca los que tiene array[0]="" porque no se define ningún elemento
                    break;
                default:

                    let nameImpDefault = consultaPestanas?.agrupadorImpuesto?.[consultaPestanas?.impuestoDefinicion?.[value]?.agrupadorImpuesto]?.name
                    impuestos[nameImpDefault] = impuestos[nameImpDefault] || new Object
                    let ingresoBrutoSelD = consultaPestanas.impuestoDefinicion[value]
                    calculoImpuestos(e, ingresoBrutoSelD, nameImpDefault)

                    break;
            }
        })

        armadoPestanaImpuesto(e)
    }
    const armadoPestanaImpuesto = (e) => {

        let deleteBotones = $(`#t${numeroForm} table.impuestosVentas td.delete`)
        let impuestos = new Object

        $.each(deleteBotones, (indice, value) => {

            $(`span`, value).trigger("click")
        })

        let itemsVentas = $(`#t${numeroForm} table.compuestoFacturaVentas tr.mainBody:not(.last)`)

        $.each(itemsVentas, (indice, value) => {

            let itemVenta = $(`.divSelectInput[name=itemVenta]`, value).val()
            let baseImporte = stringANumero($(`input.${base.nombre || base}`, value).val() || 0)
            let impuestoDefinicion = consultaPestanas?.itemVenta?.[itemVenta]?.impuestoDefinicion

            if (impuestoDefinicion != undefined) {

                $.each(impuestoDefinicion, (ind, val) => {

                    let dataImpuestos = consultaPestanas.impuestoDefinicion[val] || undefined

                    if (dataImpuestos != undefined) {

                        impuestos[dataImpuestos.name] = { tasa: dataImpuestos.tasa };
                        impuestos[dataImpuestos.name].base = Number(impuestos[dataImpuestos.name].base || 0) + Number(baseImporte)

                    }

                })
            }
        })

        if (Object.values(impuestos).length > 1) {

            let keys = Object.keys(impuestos)
            let values = Object.values(impuestos)

            let tableFilaUno = $(`#t${numeroForm} table[compuesto=impuestosVentas] tr.mainBody:first`)

            $(`.inputSelect.impuestoDefinicion`, tableFilaUno).val(keys[0]).trigger("change")

            $(`input.baseImpuestosVentas`, tableFilaUno).val(values[0].base).trigger("input").trigger("blur")
            $(`input.tasaImpositiva`, tableFilaUno).val(values[0].tasa).trigger("input").trigger("blur")
            //$(`input.impuesto`, tableFilaUno).val(values[0].base * values[0].tasa / 100).trigger("input").trigger("blur")*/

            let idTabla = $(`#t${numeroForm} table.impuestosVentas`).attr("id").slice(2)
            delete impuestos[keys[0]]

            let ord = 1
            $.each(impuestos, (indice, value) => {

                editarCompuestoFormInd(objeto, numeroForm, idTabla, $(`td.impuestoDefinicion `, $(`#t${numeroForm} table.impuestosVentas tr.last`)), (ord))
                let filaTable = $(`#t${numeroForm} table.impuestosVentas tr.mainBody:not(.last):last`)

                $(`.inputSelect.impuestoDefinicion`, filaTable).val(indice).trigger("change")
                $(`input.baseImpuestosVentas`, filaTable).val(value.base).trigger("input").trigger("blur")
                $(`input.tasaImpositiva`, filaTable).val(value.tasa).trigger("input").trigger("blur")
                //$(`input.impuesto`, filaTable).val(value.base * value.tasa / 100).trigger("input").trigger("blur")*/
                ord++

            })
        }
    }

    $(`#t${numeroForm}`).on("change", `table.compuestoFacturaVentas input.precioUnitario, .divSelectInput[name=${atributo.nombre}]`, tasaDeImpuestosSegunProducto)

}
function mostrarPestanaProducto(objeto, numeroForm) {

    const cabeceraA = $(`#t${numeroForm} a.detalleProducto`);
    const pestanaA = $(`#t${numeroForm} table.detalleProducto table.detalleProducto`);

    let empresaSel = $(`.empresaSelect`).html().trim()
    let empresaSelecta = Object.values(consultaPestanas.empresa).find(e => e.name == empresaSel); // obtiene la primera clave del objeto

    if (empresaSelecta.bajaStock != "Facturacion") {

        cabeceraA.addClass("ocultoSiempre");
        pestanaA.addClass("ocultoSiempre");
        $(`#t${numeroForm} table.detalleProducto input.requerido`).removeClass("requerido");
        $(`#t${numeroForm} a.compuestoFacturaVentas`).trigger("click")

    };

}
function mostrarPestanaProductoProveedores(objeto, numeroForm) {

    const cabeceraA = $(`#t${numeroForm}:not([tabla="vistaPrevia"]) a.detalleProducto`);
    const pestanaA = $(`#t${numeroForm}:not([tabla="vistaPrevia"]) table.detalleProducto`);
    const cabeceraB = $(`#t${numeroForm}:not([tabla="vistaPrevia"]) a.remitoIngreso`);
    cabeceraB.addClass("ocultoSiempre");

    let id = $(`#t${numeroForm} input._id`).val()
    if (id.length > 0) {
        cabeceraB.removeClass("ocultoSiempre");
    }
    let empresaSel = $(`.empresaSelect`).html().trim()
    let empresaSelecta = Object.values(consultaPestanas.empresa).find(e => e.name == empresaSel); // obtiene la primera clave del objeto
    if (empresaSelecta.ingresaStock != "Facturacion") {
        cabeceraA.addClass("ocultoSiempre");
        pestanaA.addClass("ocultoSiempre");
        $(`table.detalleProducto input.requerido`).removeClass("requerido");

        $(`div.cabeceraCol.${numeroForm} a.compuestoFacturaCompras:not([tabla="vistaPrevia"] a.compuestoFacturaCompras)`).trigger("click");
        function esItemCompraProducto(item) {
            const itemLimpio = (item || "").toString().trim();
            if (itemLimpio == "") return false;
            const itemPorId = consultaPestanas?.itemCompra?.[itemLimpio];
            if (itemPorId) {
                return (itemPorId?.concepto || "").toString().trim().toLowerCase() == "producto";
            }
            const itemPorNombre = Object.values(consultaPestanas?.itemCompra || {}).find((it) => (it?.name || "").toString().trim() == itemLimpio);
            return (itemPorNombre?.concepto || "").toString().trim().toLowerCase() == "producto";
        }
        function consultaItem() {
            let hayItemProducto = false;
            $(`#t${numeroForm} table.compuestoFacturaCompras tr.mainBody:not(.last)`).each((indice, fila) => {
                let itemFila = $(`.divSelectInput[name="itemCompra"], input[name="itemCompra"]`, fila).val();
                if (esItemCompraProducto(itemFila)) {
                    hayItemProducto = true;
                    return false;
                }
            });

            let tieneId = (($(`#t${numeroForm} input._id`).val() || "").toString().trim().length > 0);
            if (hayItemProducto || tieneId) {
                cabeceraB.removeClass("ocultoSiempre");
            } else {
                cabeceraB.addClass("ocultoSiempre");
            }

            if (hayItemProducto) {
                if ($(`#t${numeroForm} input.estado`).val() == "Directo") {
                    $(`#t${numeroForm} input.estado`).val("Pendiente")
                }
            } else {
                if ($(`#t${numeroForm} input.estado`).val() != "Aprobado") {
                    $(`#t${numeroForm} input.estado`).val("Directo")
                }
            }
        }
        $(`#t${numeroForm}`).off(`change.mostrarPestanaProductoProveedores`, `.divSelectInput[name="itemCompra"]`)
        $(`#t${numeroForm}`).on(`change.mostrarPestanaProductoProveedores`, `.divSelectInput[name="itemCompra"]`, consultaItem)
        consultaItem()
    }
    if (empresaSelecta.ingresaStock == "Facturacion") {
        cabeceraB.addClass("ocultoSiempre");

    }
}
function copiaDetalleProducto(objeto, numeroForm) {

    let empresaSel = $(`.empresaSelect`).html().trim()
    let empresaSelecta = Object.values(consultaPestanas.empresa).find(e => e.name == empresaSel); // obtiene la primera clave del objeto

    if (empresaSelecta.bajaStock == "Facturacion") {

        const equivalencias = {
            cantidadProducto: "cantidad",
            unidadesMedidaProducto: "unidadesMedida",
            importeProducto: "precioUnitario"
        }
        const atributosDestino = {
            compuestoFacturaVentas: "itemVenta",
            compuestoFacturaCompras: "itemCompra"

        }

        const entidadDestino = {
            facturasEmitidas: "compuestoFacturaVentas",
            facturasProveedores: "compuestoFacturaCompras",
            facturacionOrdenSalida: "compuestoFacturaVentas",
            facturacionOrdenEntrada: "compuestoFacturaCompras"

        }

        function copiaProducto(e) {

            let fila = $(e.target).parents("tr")
            let numeroFila = fila.attr("q")
            let nombreEntidad = $(`#t${numeroForm}`).attr("nombre")
            let tablaDestino = $(`#t${numeroForm} table.${entidadDestino[nombreEntidad]}`)
            let nombreTabla = entidadDestino[nombreEntidad]

            if ($(`tr[q="${numeroFila}"]:not(.last)`, tablaDestino)[0] == undefined) {

                $(`tr.last td.vacio`, tablaDestino).trigger("dblclick")
            }
            if (e.target.name == `producto`) {

                let productoSeleccionado = $(e.target).val()
                let itemProducto = Object.values(consultaPestanas.producto).find(e => e.name == productoSeleccionado.trim())
                let itemDestino = itemProducto?.[atributosDestino[nombreTabla]]

                $(`tr[q=${numeroFila}] .divSelectInput[name=${atributosDestino[nombreTabla]}]`, tablaDestino).val(itemDestino).trigger("change")
                $(`tr[q=${numeroFila}] .inputSelect.${atributosDestino[nombreTabla]}`, tablaDestino).addClass("transparenteformt").trigger("change")
            }
            else {

                $(`tr[q=${numeroFila}] input.${equivalencias[e.target.name]}`, tablaDestino).val(e.target.value).trigger("input").addClass("transparenteformt").trigger("change")
            }
        }

        $(`#t${numeroForm}`).on("change", `table.detalleProducto input:not(.divSelectInput)`, copiaProducto)

    }
}
function completarCamposTipoCambio(objeto, numeroForm) {

    function leyenda(e) {

        let moneda = $(`#t${numeroForm} .inputSelect.moneda`).val().toLowerCase()
        let tipoDeCambio = $(`#t${numeroForm} input.tipoCambio`).val()
        let total = $(`#t${numeroForm} input.importeTotal`).val()

        if (moneda != "pesos" && moneda != "") {

            $(`#t${numeroForm} div.fo.tipoCambioPesos,
               #t${numeroForm} div.fo.cancelacion `).removeAttr("oculto")
            $(`#t${numeroForm} div.fo.tipoCambioPesos`).html(`<div class="texto"><p>El total del comprobantes expresado en moneda de curso legal -Pesos Argentinos- consideransose un tipo de cambio consignado de ${tipoDeCambio} asciende:</div><div class="importePesos"> <p>$ ${numeroAString(Number(stringANumero(tipoDeCambio)) * Number(stringANumero(total)))}</p></div>`)

            $(`#t${numeroForm} div.fo.tipoCambioPesos`).addClass("flex")

        } else {

            $(`#t${numeroForm} div.fo.tipoCambioPesos,
               #t${numeroForm} div.fo.cancelacion `).attr("oculto", "true")
        }
    }

    $(`#t${numeroForm}`).on("change", ".inputSelect.moneda, input.tipoCambio", "input.importeTotal", leyenda)
    $(`#t${numeroForm} .inputSelect.moneda`).trigger("change")
}
function cuentaBcaria(objeto, numeroForm) {

    let _id = $(`#t${numeroForm} input._id`).val()

    if (_id == "") {

        let empresa = $(`.empresaSelect`).text()
        let empresaSelect = Object.values(consultaPestanas.empresa).find(e => e.name == empresa)
        let cuenta = consultaPestanas.cuentasBancarias?.[empresaSelect.cuentasBancarias]?.name
        $(`#t${numeroForm} .inputSelect.cuentasBancariasPago`).val(cuenta).trigger("change")
    }
}
function nombreOperacionComprobanteElectronico(comprobante = "") {

    switch ((comprobante || "").toString().replace(/\s+/g, "").toLowerCase()) {
        case "notadedebito":
            return "notaDebito"
        case "notadecredito":
            return "notaCredito"
        default:
            return "facturasEmitidas"
    }
}
function comprobanteElectronicoEsNota(comprobante = "") {

    let operacion = nombreOperacionComprobanteElectronico(comprobante)
    return operacion == "notaDebito" || operacion == "notaCredito"
}
function empresaFacturaElectronicaActiva() {

    let empresaActiva = obtenerEmpresaEmisoraActiva() || empresaSeleccionada || {}
    return empresaActiva?.electronica === true || empresaActiva?.electronica == "true"
}
function fechaComprobanteAsociadoFormateada(fecha = "") {

    let fechaTexto = (fecha || "").toString()

    if (fechaTexto.includes("T")) {
        fechaTexto = fechaTexto.split("T")[0]
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(fechaTexto)) {
        return `${fechaTexto.slice(8, 10)}/${fechaTexto.slice(5, 7)}/${fechaTexto.slice(0, 4)}`
    }

    if (/^\d{8}$/.test(fechaTexto)) {
        return `${fechaTexto.slice(6, 8)}/${fechaTexto.slice(4, 6)}/${fechaTexto.slice(0, 4)}`
    }

    return fechaTexto
}
function referenciaComprobanteAsociado(valor = {}) {

    let tipo = [valor?.comprobante, valor?.tipoComprobante].filter(Boolean).join(" ").trim()
    let ptoVta = (valor?.ancla || "").toString().trim()
    let numero = (valor?.numerador || "").toString().trim()
    let fecha = fechaComprobanteAsociadoFormateada(valor?.fecha || valor?.date || "")
    let importe = valor?.importeTotal === undefined || valor?.importeTotal === ""
        ? ""
        : `$ ${numeroAString(Number(stringANumero(valor?.importeTotal || 0)))}`

    return [tipo, [ptoVta, numero].filter(Boolean).join("-"), fecha, importe].filter(Boolean).join(" ")
}
function comprobanteAsociadoElectronico(objeto, numeroForm) {
    if (objeto?.accion != "facturasEmitidas") return

    const father = $(`#t${numeroForm}`)
    const origenNotasElectronicas = `facturasEmitidasNotasElectronicas${numeroForm}`

    const renderizarComprobanteAsociado = async () => {
        if (!consultaPestanas?.facturasEmitidas || !consultaPestanasConOrden?.facturasEmitidas || consultaPestanasConOrden?.facturasEmitidas?.length == 0) {
            await consultasPestanaIndividual("facturasEmitidas", false)
        }

        let contenedor = $(`div.fo.comprobanteAsociado`, father)
        if (contenedor.length == 0) return

        $.each(consultaPestanasConOrden?.facturasEmitidas || [], (indice, value) => {
            if (!value) return
            value.referenciaAsociada = referenciaComprobanteAsociado(value)
            if (consultaPestanas?.facturasEmitidas?.[value._id]) {
                consultaPestanas.facturasEmitidas[value._id].referenciaAsociada = value.referenciaAsociada
            }
        })

        let comprobante = $(`.inputSelect.comprobante`, father).first().val() || ""
        let tipoComprobante = $(`.inputSelect.tipoComprobante`, father).first().val() || ""
        let cliente = $(`.divSelectInput[name=cliente]`, father).first().val() || ""
        let empresa = $(`input.empresa`, father).first().val() || empresaSeleccionada?._id || obtenerEmpresaEmisoraActiva()?._id || ""
        let idActual = $(`input._id`, father).first().val() || ""
        let comprobanteAsociadoActual = $(`.divSelectInput[name=comprobanteAsociado]`, father).first().val() || ""
        let debeMostrar = empresaFacturaElectronicaActiva() && comprobanteElectronicoEsNota(comprobante)

        consultaPestanas[origenNotasElectronicas] = {}
        consultaPestanasConOrden[origenNotasElectronicas] = []

        $.each(consultaPestanasConOrden?.facturasEmitidas || [], (indice, value) => {
            if (!value || value._id == idActual) return
            if ((value?.CAE || "").toString().trim() == "") return
            if ((value?.empresa || "") != empresa) return
            if (cliente == "" || (value?.cliente || "") != cliente) return
            if (tipoComprobante == "" || (value?.tipoComprobante || "") != tipoComprobante) return
            if ((value?.comprobante || "").toString().trim() != "Factura electronica") return

            let referenciaAsociada = value.referenciaAsociada || referenciaComprobanteAsociado(value)
            let opcionComprobanteAsociado = {
                _id: value._id,
                name: referenciaAsociada,
                referenciaAsociada,
                cliente: value.cliente,
                empresa: value.empresa,
                comprobante: value.comprobante,
                tipoComprobante: value.tipoComprobante,
                CAE: value.CAE,
                ancla: value.ancla,
                numerador: value.numerador,
                fecha: value.fecha,
                date: value.date,
                importeTotal: value.importeTotal
            }

            consultaPestanas[origenNotasElectronicas][value._id] = opcionComprobanteAsociado
            consultaPestanasConOrden[origenNotasElectronicas].push(opcionComprobanteAsociado)
        })

        if (!consultaPestanas[origenNotasElectronicas][comprobanteAsociadoActual]) {
            comprobanteAsociadoActual = ""
        }

        let tabIndex = $(`.inputSelect.comprobanteAsociado`, father).first().attr("tabindex") || 1
        let nuevoSelector = prestanaFormIndividual(
            objeto,
            numeroForm,
            P({ nombre: "comprobanteAsociado", origen: origenNotasElectronicas, pestRef: "referenciaAsociada", width: "veinte" }),
            comprobanteAsociadoActual,
            tabIndex,
            { clase: "form" }
        )

        $(`.selectCont.comprobanteAsociado`, contenedor).remove()
        $(nuevoSelector).appendTo(contenedor)

        if (debeMostrar) {
            contenedor.removeAttr("oculto")
            $(`.inputSelect.comprobanteAsociado`, contenedor).addClass("requerido")
        } else {
            contenedor.attr("oculto", "true")
            $(`.inputSelect.comprobanteAsociado`, contenedor).val("").removeClass("requerido validado")
            $(`.divSelectInput[name=comprobanteAsociado]`, contenedor).val("")
        }
    }

    const actualizar = () => {
        setTimeout(() => {
            renderizarComprobanteAsociado()
        }, 0)
    }

    father.off("change.comprobanteAsociadoElectronico", ".inputSelect.comprobante")
    father.off("change.comprobanteAsociadoElectronico", ".inputSelect.tipoComprobante")
    father.off("change.comprobanteAsociadoElectronico", ".inputSelect.cliente")
    father.off("change.comprobanteAsociadoElectronico", ".divSelectInput[name=cliente]")

    father.on("change.comprobanteAsociadoElectronico", ".inputSelect.comprobante", actualizar)
    father.on("change.comprobanteAsociadoElectronico", ".inputSelect.tipoComprobante", actualizar)
    father.on("change.comprobanteAsociadoElectronico", ".inputSelect.cliente", actualizar)
    father.on("change.comprobanteAsociadoElectronico", ".divSelectInput[name=cliente]", actualizar)

    renderizarComprobanteAsociado()
    ;[80, 200, 500].forEach((delay) => setTimeout(renderizarComprobanteAsociado, delay))
}
function validarNotaCreditoNoMayorComprobanteAsociado(objeto, numeroForm) {
    if (objeto?.accion != "facturasEmitidas") {
        return { validado: true, mensaje: "" }
    }

    let comprobante = $(`#t${numeroForm} .inputSelect.comprobante`).first().val() || ""
    if ((comprobante || "").toString().trim() != "Nota de credito") {
        return { validado: true, mensaje: "" }
    }

    let comprobanteAsociadoId = $(`#t${numeroForm} .divSelectInput[name=comprobanteAsociado]`).first().val() || ""
    if (comprobanteAsociadoId == "") {
        return { validado: true, mensaje: "" }
    }

    let comprobanteAsociado = consultaPestanas?.facturasEmitidas?.[comprobanteAsociadoId]
    if (!comprobanteAsociado) {
        return { validado: true, mensaje: "" }
    }

    let importeNotaCredito = Number(stringANumero($(`#t${numeroForm} input.importeTotal`).first().val() || 0))
    let importeComprobanteAsociado = Number(stringANumero(comprobanteAsociado?.importeTotal || 0))

    if (importeNotaCredito > importeComprobanteAsociado) {
        return { validado: false, mensaje: "La nota de credito no puede ser mayor al importe del comprobante asociado" }
    }

    return { validado: true, mensaje: "" }
}
