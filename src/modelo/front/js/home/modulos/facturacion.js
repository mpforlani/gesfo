
function comprobanteFunc(valor, objeto, numeroForm) {

    let valorLetra = ""
    let empresaSeleccionada = $(`.empresaSelect`).text()
    let empresaEmisora = Object.values(consultaPestanas.empresa).find(e => e.name == empresaSeleccionada);

    switch (empresaEmisora.condicionImpositiva) {
        case `Monotributista`:

            valorLetra = "Letra C"
            break
        case "Responsable Inscripto":

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

            $(`#t${numeroForm} .inputSelect.tipoComprobante`).val(val).trigger("change")
        }

    }

    $(`#t${numeroForm}`).on(`change`, `.inputSelect.cliente`, letraComp)

}
function calculaImpuestossoloIVa(objeto, numeroForm) {

    const tasaDeImpuestosSegunProducto = (e) => {

        let prodSeleccionado = $("td.itemVenta .divSelectInput", $(e.target).parents("tr")).val()

        let fila = $(e.target).parents("tr")
        let impuestosProductos = consultaPestanas.itemVenta[prodSeleccionado]?.impuestoDefinicion
        let ivaImpuesto = impuestosProductos?.find(e => consultaPestanas?.agrupadorImpuesto?.[consultaPestanas?.impuestoDefinicion?.[e]?.agrupadorImpuesto]?.name == "IVA")
        let tasaIvaPrd = consultaPestanas?.impuestoDefinicion?.[ivaImpuesto]?.tasa || ""

        $(`input.porcentaje`, fila).val(numeroAString(tasaIvaPrd)).trigger("input")
    }

    $(`#t${numeroForm}`).on("change", `.divSelectInput[name=itemVenta]`, tasaDeImpuestosSegunProducto)

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
        function consultaItem(e) {

            let item = $(e.target).val();
            if (consultaPestanas.itemCompra[item]?.concepto == "Producto") {
                cabeceraB.removeClass("ocultoSiempre");
                $(`#t${numeroForm} input.estado`).val("Pendiente")

            } else {
                cabeceraB.addClass("ocultoSiempre");
                $(`#t${numeroForm} input.estado`).val("Directo")
            };
        }
        $(`#t${numeroForm}`).on(`change`, `.divSelectInput[name="itemCompra"]`, consultaItem)
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