const equivalenciaAtributos = {//Este lo uso cuando muevo valor  desde cotizaciones logistica

    detalleFlete: {
        importeCotizacion: "importeFlete",
        comisionCotizacion: "importeCincoFlete",
        importeCuatroCotizacion: "importeDosFlete",
        importeCincoCotizacion: "importeTresFlete",
        importeOchoCotizacion: "importeCuatroFlete"
    },
    caractProd: {
        importeCotizacion: "importeCaracProd",
        comisionCotizacion: "importeDosCaracProd",
        importeCuatroCotizacion: "importeTresCaracProd",
        importeCincoCotizacion: "importeCuatroCaracProd",
        importeOchoCotizacion: "importeCincoCaracProd"
    }
}
const comparaAtributos = {
    cantidadFlete: "cantidadCotizacion",
    importeFlete: "importeCotizacion",
    importeCincoFlete: "comisionCotizacion",
    importeDosFlete: "importeDosCotizacion",
    importeTresFlete: "importeCincoCotizacion",
    importeCuatroFlete: "importeSeisCotizacion"
};
const textoCompletar = {

    importacion: {
        maritimo: {
            fcl: (date) => {
                return `Validez ${addDay(date, 10, 0, 0, `d/m/y`)}. Sujeto disponibilidad equipo y espacio al momento de solicitar la reserva con la naviera cotizada. TT 48 días (aproximado). 7 días libres en destino. TC BNA fecha de arribo/cobro.`
            },
            lcl: (date) => {
                return `Validez ${addDay(date, 10, 0, 0, `d/m/y`)}. Para carga general, NO IMO y apilable. Salidas semanales - Servicio directo o servicio vía XXXXXX (transbordo) - TT 48 días (aproximado) TC BNA fecha de arribo/cobro.`
            }
        },
        aereo: {
            default: (date) => { return `Validez ${addDay(date, 10, 0, 0, `d/m/y`)}. Para carga general, NO IMO y apilable.` },
        },
        terrestre: {
            fcl: () => { return "" },
            lcl: (date) => { return `Validez ${addDay(date, 10, 0, 0, `d/m/y`)}. Para carga general, NO IMO y apilable.` }
        }

    },
    exportacion: {
        maritimo: {
            fcl: (date) => { return `Validez ${addDay(date, 10, 0, 0, `d/m/y`)}.. Sujeto a disponibilidad naviera cotizada al momento de solicitar la reserva (Booking).` },
            lcl: (date) => { return `Validez ${addDay(date, 10, 0, 0, `d/m/y`)}. Para carga general, NO IMO y apilable.` }
        },
        aereo: {
            default: () => { return "" },
        },
        terrestre: {
            fcl: () => { return "" },
            lcl: (date) => { return `Validez ${addDay(date, 10, 0, 0, `d/m/y`)}. Para carga general, NO IMO y apilable.` }
        }
    }
}
function opcionesTransp(objeto, numeroForm) {

    let diasbledInput = $(`#t${numeroForm} input._id`).attr(`disabled`)
    const tipoCarga = () => {

        let valor = $(`#t${numeroForm} .inputSelect.tipoTransporte`).val().trim().toLowerCase()
        $(`#t${numeroForm} table.cotizacionLogistica tr`).removeAttr("tableorigen")

        if (valor == "aereo") {

            $(`#t${numeroForm} table[compuesto=caractProd],
                #t${numeroForm} table[compuesto=cotizacionLogistica],
                #t${numeroForm} `).attr("transp", "aereo")

            $(`#t${numeroForm} table[compuesto=caractProd] tr:not(.last) td.cantidadSeisCaractProd`).attr("unidadMedida", "kilos")
            $(`#t${numeroForm} table[compuesto=caractProd] div.totalColec div.totalCaractProdDoscantidad`).attr("unidadMedida", "kilos")

            $(`.tamanoContenedor,
                .tipoContenedor`, $(`#t${numeroForm} table[compuesto=detalleFlete]`)).removeClass("oculto")
            $(`#t${numeroForm} div.fo.maritima h2`).html("Aerolinea")

        } else if (valor == "terrestre") {

            $(`#t${numeroForm} div.fo.diasLibres input,
               #t${numeroForm} div.fo.contenedor input,
               #t${numeroForm} div.fo.maritima input,
                #t${numeroForm} div.fo.MBLMAWB input`).val("")

            $(`#t${numeroForm} table[compuesto=caractProd],
                #t${numeroForm} table[compuesto=cotizacionLogistica],
                #t${numeroForm} `).attr("transp", "terrestre")


            $(`#t${numeroForm} table[compuesto=caractProd] tr:not(.last) td.cantidadSeisCaractProd`).attr("unidadMedida", "kilos")
            $(`#t${numeroForm} table[compuesto=caractProd] div.totalColec div.totalCaractProdDoscantidad`).attr("unidadMedida", "kilos")


            $(`.tamanoContenedor,
               .tipoContenedor`, $(`#t${numeroForm} table[compuesto=detalleFlete]`)).addClass("oculto")
            $(`#t${numeroForm} .divSelectInput[name=tipoCarga]`).removeClass("noOculta")

        } else {
            $(`#t${numeroForm} div.fo.maritima h2`).html("Maritima")
            $(`.tamanoContenedor,
               .tipoContenedor`, $(`#t${numeroForm} table[compuesto=detalleFlete]`)).removeClass("oculto")

            $(`#t${numeroForm} table[compuesto=caractProd],
                #t${numeroForm} table[compuesto=cotizacionLogistica],
                #t${numeroForm} `).attr("transp", "maritimo")


            $(`#t${numeroForm} .divSelectInput[name=tipoCarga]`).removeClass("noOculta")

            if (diasbledInput != "disabled") {


                $(`#t${numeroForm} div.fo.contenedor,
                   #t${numeroForm} div.fo.maritima`).removeAttr("oculto")

            }
        }
        $(`#t${numeroForm} a.pestana:visible:first`).trigger("click")
    }

    $(`#t${numeroForm}`).on(`change`, `.inputSelect.tipoTransporte`, tipoCarga)

    const inicioAsignacionFlete = (e) => {

        let itemsVentas = $(`#t${numeroForm} table.cotizacionLogistica tr.mainBody:not(.last)`);

        $.each(itemsVentas, (indice, value) => {

            let valorItem = $(`.inputSelect.itemVenta`, value).val()
            $(value).attr(`itemVenta`, valorItem.replace(/\s+/g, "").toLowerCase())
        })
        $(`#t${numeroForm} table.cotizacionLogistica tr[itemventa=""]`).removeAttr("itemventa");

        let seguros = $(`#t${numeroForm} table.cotizacionLogistica tr.mainBody[itemventa*="seguro"]`)

        $.each(seguros, (indice, value) => {

            $(`input.unidadesMedida,
               input.cantidadCotizacion`, value).addClass("transparente soloLectura")
        })

        let tablaDetalle = $(`#t${numeroForm} table.active`)
        let filasDetalle = $(`tr.mainBody:not(.last)`, tablaDetalle)
        let fletesVendidos = $(`#t${numeroForm} table.cotizacionLogistica tr[itemventa^="flete"]`)

        if (tablaDetalle.attr("compuesto") != "caractProd") {

            $.each(fletesVendidos, (indice, value) => {

                let encontro = false;
                let index = 0

                while (encontro == false && index < filasDetalle.length) {

                    let truesFalse = [];

                    $.each(comparaAtributos, (i, v) => {

                        truesFalse.push(($(`input.${i}`, filasDetalle[index]).val() || 0) == ($(`input.${v}`, value).val() || 0));
                    });

                    if (truesFalse.length > 0 && !(truesFalse.includes(false))) {

                        let id = $(value).parents("table").attr("id");

                        $(filasDetalle[index]).attr("tableDestino", id).attr("qdestino", $(value).attr("q"));
                        $(value).attr("tableorigen", tablaDetalle.attr("compuesto")).attr("qorigen", $(filasDetalle[index]).attr("q"));

                        encontro = true;
                    }
                    index++
                }
            })
        }
    }

    if (diasbledInput == "disabled") {

        $(`#t${numeroForm} .inputSelect.tipoTransporte`).trigger("change")
        $(`#t${numeroForm} .inputSelect.tipoCarga`).trigger("change")
        let tipoOperacion = $(`#t${numeroForm} .inputSelect.tipoOperacion`)
        let tipoCarga = $(`#t${numeroForm} .inputSelect.tipoCarga`)

        $(`#t${numeroForm} table[compuesto=cotizacionLogistica]`).attr("carga", tipoCarga.val())
        $(`#t${numeroForm} table[compuesto=cotizacionLogistica]`).attr("tipo", tipoOperacion.val())

        inicioAsignacionFlete()
    }

}
function tipoFlete(objeto, numeroForm) {

    let father = `#t${numeroForm}`
    let tipoTransporte = {
        aereo: "Aéreo",
        maritimo: "Oceánico",
        terrestre: "Terrestre"
    }

    let tipoOperacion = {
        nacional: "Nacional"
    }

    const flet = (e) => {

        let tipoCarga = $(`.inputSelect.tipoCarga`, father).val()

        let cotizacion = $(`table.cotizacionLogistica`)
        let diasbledInput = $(`input._id`, father).attr(`disabled`)

        if (tipoCarga.toLowerCase() == "fcl") {

            $(`#t${numeroForm}`).attr("tipoCarga", "FCL")
            $(`#t${numeroForm} table[compuesto=caractProd]`).removeClass("seleccionada").addClass(`notValid`)
            $(`#t${numeroForm} table[compuesto=detalleFlete]`).addClass("seleccionada").removeClass(`notValid`)
            $(`#t${numeroForm} table[compuesto=cotizacionLogistica]`).attr("carga", "FCL")

            if (diasbledInput != "disabled") {

                $(`tr.cotizacionLogistica.mainBody:not( :first, .last)`, cotizacion).remove()
                $(`input:not(.soloLectura):not(.positioncotizacionLogistica):not(.idColCotizacionGemela):not(.valorInicial)`, cotizacion).val("").trigger("input")
            }

        } else if (tipoCarga.toLowerCase() == "lcl") {

            $(`#t${numeroForm}`).attr("tipoCarga", "LCL")
            $(`#t${numeroForm} table[compuesto=caractProd]`).addClass("seleccionada").removeClass(`notValid`)
            $(`#t${numeroForm} table[compuesto=detalleFlete]`).removeClass("seleccionada").addClass(`notValid`)
            $(`#t${numeroForm} table[compuesto=cotizacionLogistica]`).attr("carga", "LCL")

            $(`#t${numeroForm} div.fo.MBLMAWB input,
                #t${numeroForm} div.fo.diasLibres input`).val("")


            if (diasbledInput != "disabled") {

                $(`table.cotizacionLogistica tr .inputSelect.itemVenta:not(:disabled)`, father).valt("")
                $(`table.cotizacionLogistica tr td.comisionCotizacion`, father).attr("ocultoconlugar", true)

                $(`tr.cotizacionLogistica.mainBody:not( :first, .last)`, cotizacion).remove()
                $(`input:not(.soloLectura):not(.positioncotizacionLogistica):not(.idColCotizacionGemela):not(.valorInicial)`, cotizacion).val("").trigger("input")


            }
        }
        $(`#t${numeroForm} a.pestana:visible:first`).trigger("click")
    }
    const fatherUndefinedLCL = (e) => {

        let trsQ = $(`tr.mainBody:not(.last)`, $(e.target).parents("table"))

        let itemVentatot = $(`#t${numeroForm} table.cotizacionLogistica tr[itemventa^="flete"]`)

        let filaItem = ""
        if (trsQ.length == 1) {

            let caracteristicasVentas = $(e.target).parents("tr")
            let qCaract = caracteristicasVentas.attr("q")

            if (itemVentatot.length == 0) {

                filaItem = $(`#t${numeroForm} table.cotizacionLogistica:first tr.mainBody:not(.last):not([itemventa])`)//primer tr vacio o sin item de venta seleccionada
                let transporte = $(`#t${numeroForm} .divSelectInput[name=tipoTransporte]`).val()//Tipo de transporte
                let tipoOperacionVar = $(`#t${numeroForm} .divSelectInput[name=tipoOperacion]`).val()//Tipo de operación

                $(`.selectCont.itemVenta .inputSelect`, filaItem).valt(`Flete ${tipoTransporte?.[consultaPestanas?.tipoTransporte?.[transporte]?.name.toLowerCase()]} ${tipoOperacion?.[consultaPestanas?.tipoOperacion?.[tipoOperacionVar]?.name.toLowerCase()] || "Internacional"}`)

                filaItem.attr("tableorigen", "caractProd").attr("qorigen", qCaract)
                caracteristicasVentas.attr("tableodestino", $(`#t${numeroForm} table.cotizacionLogistica:first`).attr("id")).attr("qdestino", itemVentatot.attr("q"))

            } else if (itemVentatot.length == 1) {

                itemVentatot.attr("tableorigen", "caractProd").attr("qorigen", qCaract)
                caracteristicasVentas.attr("tableodestino", itemVentatot.parents("table").attr("id")).attr("qdestino", itemVentatot.attr("q"))
                filaItem = itemVentatot[0]


            } else if (itemVentatot.length > 1) {

                itemVentatot.attr("tableorigen", "noFllow")
                caracteristicasVentas.attr("tableodestino", "noFllow")
                filaItem = undefined

            }
        } else {
            if (itemVentatot.length > 1) {

                itemVentatot.attr("tableorigen", "noFllow")
                caracteristicasVentas.attr("tableodestino", "noFllow")
                filaItem = undefined

            } else {

                $(`#t${numeroForm} table.cotizacionLogistica tr[itemventa^="flete"]`).attr("tableorigen", "caractProd").attr("qorigen", "doble")
                trsQ.attr("tableodestino", itemVentatot.parents("table").attr("id")).attr("qdestino", "doble")
                filaItem = $(`#t${numeroForm} table.cotizacionLogistica tr[itemventa^="flete"]`)
            }

        }

        return filaItem

    }//Eta la uso para filas que encuentren padre

    const completarFleteLCL = (e) => {

        let qOrigen = $(e.target).parents("tr").attr("q")
        let fatherObjetivo = $$(`#t${numeroForm} tr[tableorigen=caractProd][qorigen="${qOrigen}"]`) || fatherUndefinedLCL(e)

        let metroCubicosTodos = $(`#t${numeroForm} tr.mainBody:not(.last) input.cantidadCincoCaractProd`)
        let todosPesos = $(`#t${numeroForm} tr.mainBody:not(.last) input.cantidadSeisCaractProd`)
        let transporte = $(`#t${numeroForm} .divSelectInput[name=tipoTransporte]`).val()
        let peso = 0
        let metroCubicos = 0
        //////////////
        let unidadesMedida = ""

        $.each(todosPesos, (indice, value) => {

            peso += stringANumero($(value).val())
            metroCubicos += stringANumero($(metroCubicosTodos[indice]).val())
        })

        if (tipoTransporte?.[consultaPestanas?.tipoTransporte?.[transporte]?.name?.toLowerCase()] == "Aéreo") {

            if (metroCubicos > peso) {

                unidadesMedida = "Kilos Volumetricos"
                $(`input.cantidadCotizacion`, fatherObjetivo || $()).val(numeroAString(Math.max(1, metroCubicos))).trigger("input")

            } else {

                unidadesMedida = `Kilos`
                $(`input.cantidadCotizacion`, fatherObjetivo || $()).val(numeroAString(Math.max(1, peso))).trigger("input")

            }

        } else if (tipoTransporte?.[consultaPestanas?.tipoTransporte?.[transporte]?.name?.toLowerCase()] == "Oceánico") {

            if (metroCubicos > (parseFloat(peso) / 1000)) {

                unidadesMedida = `M3`
                $(`input.cantidadCotizacion`, fatherObjetivo || $()).val(numeroAString(Math.max(1, metroCubicos))).trigger("input")

            }
            else {

                unidadesMedida = `Toneladas`
                $(`input.cantidadCotizacion`, fatherObjetivo || $()).val(numeroAString(Math.max(1, (parseFloat(peso) / 1000)))).trigger("input")
            }
        }

        $(`.selectCont.unidadesMedida .inputSelect`, fatherObjetivo || $()).valt(unidadesMedida)

    }
    $(`#t${numeroForm}`).on("click", `.cartelOpcionesColeccion .opcion.fila.pegar`, (e) => {//Corrige  father 

        let transporte = $(`#t${numeroForm} .inputSelect.tipoCarga`).val()
        if (transporte != "FCL") {
            setTimeout(() => {
                $(`#t${numeroForm} tr[itemventa^="flete"]`).removeAttr("tableorigen").removeAttr("qorigen", "doble")
            }, 1000)
        }

    })
    const completarFleteLCLTerrestre = (e) => {

        let qOrigen = $(e.target).parents("tr").attr("q")
        let fatherObjetivo = $$(`#t${numeroForm} tr[tableorigen=caractProd][qorigen="${qOrigen}"]`) || fatherUndefinedLCL(e)

        ////////////////////////////
        let unidadesMedida = `Unidades`

        $(`#t${numeroForm} tr[itemventa^="flete"] .selectCont.unidadesMedida .inputSelect`).valt(unidadesMedida)

        let contidadNumeroTot = $(`#t${numeroForm} input.cantidadCaractProd`)
        let contidadNumero = 0

        $.each(contidadNumeroTot, (indice, value) => {

            contidadNumero += stringANumero($(value).val())
        })

        $(`input.cantidadCotizacion`, fatherObjetivo || $()).val(numeroAString(contidadNumero || "")).trigger("input")
        $(`.inputSelect.cantidadCotizacion`, fatherObjetivo || $()).val(numeroAString(contidadNumero || "")).trigger("input")

    }
    const completarFleteFCL = (e) => {

        let parentsTarget = $(e.target).parents("tr")

        let asignadoCotis = parentsTarget.attr("qdestino")
        let tableDes = parentsTarget.attr("tableDestino") || ""
        let tablasearch = `#${tableDes}`
        let q = asignadoCotis

        let name = e.target.name

        if (asignadoCotis == undefined) {

            let filaOrigin = $(e.target).parents("tr").attr("q")
            let tableorigen = $(e.target).parents("table").attr("compuesto")
            let itemVentatot = $(`table.cotizacionLogistica:first .inputSelect.itemVenta:not(:disabled)`, father)
            let index = 0
            let vacioEncontrado = false

            while (index < itemVentatot.length && vacioEncontrado == false) {

                if ($(itemVentatot[index]).val().trim() == "") {

                    q = $(itemVentatot[index]).parents("tr").attr("q")

                    $(itemVentatot[index]).parents("tr").attr("tableorigen", tableorigen).attr("qorigen", filaOrigin)
                    tableDes = $(itemVentatot[index]).parents("table").attr("id")
                    parentsTarget.attr("qdestino", q).attr("tableDestino", tableDes)
                    tablasearch = `#${tableDes}`

                } else {

                    $(`#t${numeroForm} table.cotizacionLogistica:first tr.last td.vacio:first`).trigger("dblclick")
                    let filaNueva = $(`table.cotizacionLogistica:first .inputSelect.itemVenta:not(:disabled):last`, father)

                    q = filaNueva.parents("tr").attr("q")

                    tableDes = filaNueva.parents("table").attr("id")
                    filaNueva.parents("tr").attr("tableorigen", tableorigen).attr("qorigen", filaOrigin)

                    parentsTarget.attr("qdestino", q).attr("tableDestino", tableDes)
                    vacioEncontrado = true
                    tablasearch = `:first`

                }
                index++;
            }
        }

        const transporte = $(`.divSelectInput[name=tipoTransporte]`, father).val()
        const tipoOperacionVar = $(`.divSelectInput[name=tipoOperacion]`, father).val()
        const itemVenta = `Flete ${tipoTransporte?.[consultaPestanas?.tipoTransporte?.[transporte]?.name?.toLowerCase()]} ${tipoOperacion?.[consultaPestanas?.tipoOperacion?.[tipoOperacionVar]?.name?.toLowerCase()] || "Internacional"}`

        $(`#t${numeroForm} .cotizacionLogistica${tablasearch} tr[q=${q}] .selectCont.itemVenta .inputSelect`).val(itemVenta).addClass("valorPorFuncion")
        $(`#t${numeroForm} .cotizacionLogistica${tablasearch} tr[q=${q}]:not([itemventa=${itemVenta.replace(/\s+/g, "").toLowerCase()}]) .selectCont.itemVenta .inputSelect`).trigger("change")

        if (tipoTransporte?.[consultaPestanas?.tipoTransporte?.[transporte]?.name?.toLowerCase()] == "Terrestre") {


            $(`#t${numeroForm} .cotizacionLogistica${tablasearch} tr[q=${q}] .selectCont.unidadesMedida .inputSelect`).valt(`Vehículos`)
            $(`#t${numeroForm} .cotizacionLogistica${tablasearch} tr[q=${q}] .selectCont.impuestoDefinicion .inputSelect`).valt(`Exento`)

        } else {

            $(`#t${numeroForm} .cotizacionLogistica${tablasearch} tr[q=${q}] .selectCont.unidadesMedida .inputSelect`).valt(`Contenedores`)
            $(`#t${numeroForm} .cotizacionLogistica${tablasearch} tr[q=${q}] .selectCont.impuestoDefinicion .inputSelect`).valt(`Exento`)

        }

        let fatherObjetivo = $(`table.cotizacionLogistica${tablasearch} tr[q=${q}]`, father)
        //////////////

        let moneda = $(`.inputSelect.moneda`, parentsTarget).val()
        $(`.selectCont.monedaComp .inputSelect`).valt(moneda)

        let importeCompletar = $(`input.${name}`, parentsTarget).val()

        $(`input.${comparaAtributos[name]}`, fatherObjetivo).val(importeCompletar).trigger("input")

    }
    const completarDesdeCotis = (e) => {

        let tabla = $(e.target).parents("tr").attr("tableorigen")
        let fila = $(e.target).parents("tr").attr("qorigen")

        let filaModificar = $(`#t${numeroForm} table.${tabla} tr[q=${fila}]`)
        let valor = $(e.target).val()

        let name = $(e.target).attr("name")

        $(`input[name=${equivalenciaAtributos[tabla][name]}]`, filaModificar).val(valor).trigger("input")

    }
    const reasignarSeguimiento = (e) => {

        let tablaFleteNombre = $(`#t${numeroForm} table.seleccionada`).attr("compuesto")
        let tablaFlete = $(`#t${numeroForm} table.${tablaFleteNombre}`)
        let fletesVendidos = $(`tr.mainBody:not(.last)`, tablaFlete)
        let itemsVentas = $(`#t${numeroForm} table.cotizacionLogistica tr.mainBody:not(.last)`)

        $.each(fletesVendidos, (indice, value) => {

            let encontro = false
            let index = 0

            while (encontro == false && index < itemsVentas.length) {

                let truesFalse = []

                $.each(comparaAtributos, (i, v) => {

                    truesFalse.push(($(`input.${i}`, value).val() || 0) == ($(`input.${v}`, itemsVentas[index]).val() || 0));

                })

                if (!(truesFalse.includes(false))) {
                    encontro = true

                    let id = $(itemsVentas[index]).parents("table").attr("id")
                    $(value).attr("tableDestino", id).attr("qdestino", $(itemsVentas[index]).attr("q"))
                    $(itemsVentas[index]).attr("tableorigen", tablaFleteNombre).attr("qorigen", $(value).attr("q"))

                }
                index++
            }

            if (!encontro) {
                $(`td.delete span`, value).trigger("click")
            }
        })
    }
    const itemVentas = (e) => {

        let contenedor = $(e.target).parents(".selectCont")
        let valorItem = $(`.inputSelect`, contenedor).val().toLowerCase()

        let father = $(e.target).parents(`tr`)
        if (father.attr("itemventa")?.startsWith("seguro")) {

            $(`.inputSelect.unidadesMedida `, father).removeAttr("readonly").removeClass("transparente").valt("")
            $(`input.cantidadCotizacion`, father).val("").removeClass(`validado`).removeAttr("readonly").removeClass("transparente")
            $(`input.importeCincoCotizacion `, father).removeClass(`validado`).removeAttr("readonly").removeClass("transparente")

        }
        father.attr(`itemVenta`, valorItem.replace(/\s+/g, ""))

        switch (valorItem) {

            case `seguro`:
            case `seguro internacional`:

                $(`.inputSelect.unidadesMedida `, father).prop("readonly", true).addClass("transparente").valt("Unidades")
                $(`input.cantidadCotizacion`, father).val(1).addClass(`validado`).prop("readonly", true).addClass("transparente")

                if ($(`#t${numeroForm} table.cotizacionLogistica`).hasClass("active")) {

                    $(`#t${numeroForm} tr[itemventa^="seguro"]:not(.cartelActivo) input:first`).trigger(`dblclick`)
                }
                break;
            case `gastos naviera exento`:
            case `gastos naviera gravado`:

                compltarGastosNaviera(objeto, numeroForm, e)
                break;
            case `desconsolidacion`:

                compltarGastosDesconsolidado(objeto, numeroForm, e)
                break;
            case `handling`:

                compltarGastosHandling(objeto, numeroForm, e)
                break;
            case `sim`:

                compltarGastosSim(objeto, numeroForm, e)
                break;
            case `gastos aerolínea`:

                gastosAerolinea(objeto, numeroForm, e)
                break;
            case `flete oceánico internacional`:

                martimoInternacional(objeto, numeroForm, e)

                break;
            case `flete terrestre internacional`:

                gastosTerrestre(objeto, numeroForm, e)

                break;
            case `flete aéreo internacional`:

                gastosAereos(objeto, numeroForm, e)

                break;
            case `documentación`:

                compltarGastosDocumentación(objeto, numeroForm, e)

                break;
            case ``:

                father.removeAttr(`itemVenta`)

                break;
            default:

                $(`input:not(.total)`, father)
                $(`input.cantidadCotizacion.valorIniciado`, father).removeClass("valorIniciado")
                $(`input.importeDosCotizacion`, father).removeClass("anuladoCalculo")
                $(`.inputSelect.unidadesMedida`, father).trigger("change")

                break;

        }
    }
    //Estos objeto son para la proxima funcion de seguro
    const inicioSeguro = () => {

        const itemsVentas = $(`${father} .cotizacionLogistica .inputSelect.itemVenta:not(:disabled)`)

        $.each(itemsVentas, (indice, value) => {

            const itemVenta = $(value).val()
            const fahterTr = $(value).parents("tr")

            if (itemVenta?.includes("seguro")) {

                $(`input.importeDosCotizacion`, fahterTr).addClass("anuladoCalculo")

            }
        })
        seguroManual(objeto, numeroForm)
    }
    const chequeFilaNuevaColeccionCarat = (e) => {
        let father = $(e.target).parents("tr")
        let unidadDeMedidaSeis = $(`#t${numeroForm} table.caractProd tr.mainBody:first td.cantidadSeisCaractProd`).attr("unidadmedida")

        $(`td.cantidadSeisCaractProd`, father).attr("unidadmedida", unidadDeMedidaSeis)
    }
    function completarTexto() {

        if ($(`#t${numeroForm} input._id`).val() == "") {

            const tipoOper = $(`#t${numeroForm} .inputSelect.tipoOperacion`).val()?.toLowerCase()
            const tipoTransp = $(`#t${numeroForm} .inputSelect.tipoTransporte`).val()?.toLowerCase()
            const tipoCargar = $(`#t${numeroForm} .inputSelect.tipoCarga`)?.val()?.toLowerCase() || "default"

            const texto = textoCompletar?.[tipoOper]?.[tipoTransp]?.[tipoCargar]?.(Date.now()) || ""

            $(`#t${numeroForm} textarea.observacionesCompleto`).val(texto)
        }


    }
    function reasginarPadreFila(e) {

        let tabla = $(`#t${numeroForm} table.active`).attr("id")
        let tr = $(`#t${numeroForm} table.active tr.pegado`)
        let q = tr.attr("q")

        let tablaOrigen = tr.attr("tableorigen")
        let qOrigen = tr.attr("qorigen")

        $(`#t${numeroForm} table.${tablaOrigen} tr[q=${qOrigen}]`).attr("qdestino", q).attr("tabledestino", tabla)
    }

    inicioSeguro()
    $(`#t${numeroForm}`).on("change", `.divSelectInput[name=tipoCarga]`, flet)
    blurChange(`#t${numeroForm}`, `table.caractProd:not([transp="terrestre"]) input`, completarFleteLCL)
    blurChange(`#t${numeroForm}`, `table.detalleFlete input`, completarFleteFCL)
    blurChange(`#t${numeroForm}`, `table.caractProd[transp="terrestre"] input`, completarFleteLCLTerrestre)

    $(`#t${numeroForm}`).on("dblclick", `table.caractProd input.idColec`, chequeFilaNuevaColeccionCarat)
    $(`#t${numeroForm}`).on("change", `tr:not(.last) .divSelectInput[name=itemVenta]`, itemVentas)//Ojo aca le pongo item venta en el tr

    blurChange(father, `table.cotizacionLogistica tr[tableorigen] input`, completarDesdeCotis)
    $(`#t${numeroForm}`).on("click", `table.cotizacionLogistica tr:not(.cop)[tableorigen] td.delete span`, reasignarSeguimiento)//reasginaseguimiento desdpues de borrar desde cotis
    //Estas son la de autocompletar que me paso Lucho último
    $(`#t${numeroForm}[nombre=cotizacionesLogistica]`).on("change", `.divSelectInput[name=tipoOperacion], .divSelectInput[name=tipoCarga], .divSelectInput[name=tipoTransporte]`, completarTexto)
    $(`#t${numeroForm}[nombre=cotizacionesLogistica]`).on("change", `.divSelectInput[name=tipoTransporte]`, completarTexto)
    //autocompletar
    $(`#t${numeroForm}`).on(`input`, `table.cotizacionLogistica[transp=maritimo][carga=FCL] tr[itemventa=documentación] input.cantidadCotizacion, tr[itemventa="fleteiceánicointernacional"] input.cantidadCotizacion`, (e) => { compltarGastosNaviera(objeto, numeroForm, e) })
    $(`#t${numeroForm}`).on(`input`, `table.cotizacionLogistica[transp=maritimo][carga=FCL] tr[itemventa=documentación] input.cantidadCotizacion`, (e) => {
        compltarGastosHandling(objeto, numeroForm, e)
        compltarGastosSim(objeto, numeroForm, e)
    })

    $(`#t${numeroForm}`).on(`input`, `table.caractProd[transp=maritimo] input.cantidadCincoCaractProd, table.caractProd[transp=maritimo] input.cantidadSeisCaractProd`, (e) => { compltarGastosDesconsolidado(objeto, numeroForm, e) })
    $(`#t${numeroForm}`).on(`input`, `table.cotizacionLogistica[transp=aereo] tr[itemventa=documentación] input.cantidadCotizacion`, (e) => { gastosAerolinea(objeto, numeroForm, e) })

    $(`#t${numeroForm}`).on(`click`, `.opcion.fila.pegar`, reasginarPadreFila)


}
async function destinosOper(objeto, numeroForm) {
    consultaPestanas.pais == undefined && await consultasPestanaIndividual("pais")
    let argentina = Object.values(consultaPestanas.pais).find(e => e.name.trim().toLowerCase() == "argentina")

    const destinos = (e) => {

        $(`div.origenDestino .opciones`).removeClass(`ocultoOper`)

        let valor = $(e.target).val().toLowerCase()

        let val = Object.values(consultaPestanas.ciudad).filter(element => {

            return element.pais == argentina._id && element.habilitado.trim() == "true";
        });

        switch (valor) {

            case `importacion`:

                $(`#t${numeroForm} div.destinoSbc .opciones`).addClass(`ocultoOper`)
                $(`#t${numeroForm} div.destinoSbc .opciones:first`).removeClass(`ocultoOper`)

                $.each(val, (indice, value) => {

                    $(`#t${numeroForm} div.destinoSbc .opciones[valuestring="${value.name}"]`).removeClass(`ocultoOper`)
                })
                if ($(`#t${numeroForm} div.destinoSbc .opciones:not(.ocultoOper)`).length < 10) {
                    $(`#t${numeroForm} div.destinoSbc .opcionesSelectDiv`).removeClass("scroll")

                } else {
                    $(`#t${numeroForm} div.destinoSbc .opcionesSelectDiv`).addClass("scroll")
                }
                $.each(val, (indice, value) => {

                    $(`#t${numeroForm} div.ciudad .opciones[valuestring="${value.name}"]`).addClass(`ocultoOper`)
                })
                if ($(`#t${numeroForm} div.ciudad .opciones:not(.ocultoOper)`).length < 10) {
                    $(`#t${numeroForm} div.ciudad .opcionesSelectDiv`).removeClass("scroll")

                } else {
                    $(`#t${numeroForm} div.ciudad .opcionesSelectDiv`).addClass("scroll")
                }
                $(`#t${numeroForm} table[compuesto=cotizacionLogistica]`).attr("tipo", "importacion")

                $(`#t${numeroForm} table.cotizacionLogistica,
                   #t${numeroForm} a.cotizacionLogistica`).removeClass("oculto")
                if ($(`#t${numeroForm} input.textoDos`).val() == "Sin tarifa") {

                    $(`#t${numeroForm} input.textoDos`).val("Estimada")
                }
                break;
            case `exportacion`:

                $(`#t${numeroForm} div.ciudad .opciones`).addClass(`ocultoOper`)
                $(`#t${numeroForm} div.ciudad .opciones:first`).removeClass(`ocultoOper`)

                $.each(val, (indice, value) => {

                    $(`#t${numeroForm} div.ciudad .opciones[valuestring="${value.name}"]`).removeClass(`ocultoOper`)
                })
                if ($(`#t${numeroForm} div.ciudad .opciones:not(.ocultoOper)`).length < 10) {
                    $(`#t${numeroForm} div.ciudad .opcionesSelectDiv`).removeClass("scroll")

                } else {
                    $(`#t${numeroForm} div.ciudad .opcionesSelectDiv`).addClass("scroll")
                }
                $(`#t${numeroForm} table.cotizacionLogistica,
                   #t${numeroForm} a.cotizacionLogistica`).removeClass("oculto")
                if ($(`#t${numeroForm} input.textoDos`).val() == "Sin tarifa") {

                    $(`#t${numeroForm} input.textoDos`).val("Estimada")
                }
                $.each(val, (indice, value) => {


                    $(`#t${numeroForm} div.destinoSbc .opciones[valuestring="${value.name}"]`).addClass(`ocultoOper`)
                })
                if ($(`#t${numeroForm} div.destinoSbc .opciones:not(.ocultoOper)`).length < 10) {
                    $(`#t${numeroForm} div.destinoSbc .opcionesSelectDiv`).removeClass("scroll")

                } else {
                    $(`#t${numeroForm} div.destinoSbc .opcionesSelectDiv`).addClass("scroll")
                }
                $(`#t${numeroForm} table[compuesto=cotizacionLogistica]`).attr("tipo", "exportacion")
                break;
            case `nacional`:

                $(`#t${numeroForm} div.origenDestino .opciones`).addClass(`ocultoOper`)

                $(`div.origenDestino .opciones:first,
                   div.transbordo .opciones:first,
                   div.destinoSbc .opciones:first`, $(`#t${numeroForm}`)).removeClass(`ocultoOper`)

                $.each(val, (indice, value) => {

                    $(`div.origenDestino .opciones[valuestring="${value.name}"],
                    div.transbordo .opciones[valuestring="${value.name}"]
                    div.destinoSbc .opciones[valueString="${value.name}"]`, $(`#t${numeroForm}`)).removeClass(`oculto`)
                })
                $(`#t${numeroForm} table.cotizacionLogistica,
                   #t${numeroForm} a.cotizacionLogistica`).removeClass("oculto")
                if ($(`#t${numeroForm} input.textoDos`).val() == "Sin tarifa") {

                    $(`#t${numeroForm} input.textoDos`).val("Estimada")
                }

                break;
            case `internacional`:
                $(`#t${numeroForm} table.cotizacionLogistica,
                   #t${numeroForm} a.cotizacionLogistica`).addClass("oculto")
                $(`#t${numeroForm} input.textoDos`).val("Sin tarifa")

                break;
            default:

                $(`#t${numeroForm} table.cotizacionLogistica,
                   #t${numeroForm} a.cotizacionLogistica`).removeClass("oculto")
                if ($(`#t${numeroForm} input.textoDos`).val() == "Sin tarifa") {

                    $(`#t${numeroForm} input.textoDos`).val("Estimada")
                }

                break;
        }
    }

    $(`#t${numeroForm}`).on(`change`, `.inputSelect.tipoOperacion`, destinos)

}
function comisionEnTarifaFlete(objeto, numeroForm) {

    const activeComision = (e) => {

        let father = $(e.target).parents("tr")

        let valor = consultaPestanas?.itemVenta?.[$(e.target).val()]?.name

        if (/\bflete\b/i.test(valor)) {

            $(`input.comisionCotizacion`, father).parents("td").removeAttr("ocultoConLugar")
        } else {

            $(`input.comisionCotizacion`, father).parents("td").attr("ocultoConLugar", true)
        }
    }

    $(`#t${numeroForm}`).on("change", `input.divSelectInput[name=itemVenta]`, activeComision)

    let comisionCotizacion = $(`#t${numeroForm} .inputSelect.itemVenta`)

    $.each(comisionCotizacion, (indice, value) => {

        if (/\bflete\b/i.test($(value).val())) {

            $(`td.comisionCotizacion`, $(value).parents("tr")).removeAttr("ocultoConLugar")
        }
    })

    $(`#t${numeroForm} th.comisionCotizacion `).removeAttr("ocultoconlugar")
}
function valorInicialCertificado(objeto, numeroForm) {

    const chequearCertificacion = (e) => {

        let fatherFila = $(e.target).parents("tr")
        let valor = consultaPestanas.itemVenta[$(e.target).val()]

        if (valor?.logico == true) {

            $(`input.certificado`, fatherFila).val("No certificado")

        } else {

            $(`input.certificado`, fatherFila).val("No certifica")
        }
    }

    $(`#t${numeroForm}`).on(`change`, `.divSelectInput[name=itemVenta]`, chequearCertificacion)
}
function completarReferenciaCert(objetoEnviar, objetoDestino) {

    let array = new Array

    array.push(`Consignee: ${consultaPestanas.cliente[objetoEnviar.cliente]?.name}`)
    array.push(`Procedencia: ${consultaPestanas.ciudad[objetoEnviar.ciudad]?.name}`)
    array.push(`Buque de embarque: ${objetoEnviar.textoTres}`)
    consultaPestanas.ciudad[objetoEnviar.transbordo]?.name != undefined && array.push(`Transbordo: ${consultaPestanas.ciudad[objetoEnviar.transbordo]?.name}`)

    array.push(`Buque de arribo: ${objetoEnviar.textoCuatro}`)
    array.push(`Destino: ${consultaPestanas.ciudad[objetoEnviar.destinoSbc]?.name}`)

    $.each(objetoEnviar.itemVenta, (indice, value) => {

        let elementoPushear = `${consultaPestanas.itemVenta[value]?.name}: ${consultaPestanas.moneda[objetoEnviar.monedaComp[indice]].name} ${objetoEnviar.importeSeisCotizacion[indice]}`

        array.push(elementoPushear)

    })

    objetoEnviar.listaDesplegableTexto = array

}
function seguroManual(objeto, numeroForm) {

    const targetPorcentual = {

        //costoPorcentual: "costoNominal",
        ventaPorcentual: "ventaNominal"
    }
    const targetNominal = {

        //costoNominal: "costoPorcentual",
        ventaNominal: "ventaPorcentual"
    }
    const porcentDefault = {
        //seguro: "0,1157",
        //segurointernacional: "0,3",
    }
    const minimoDefault = {
        seguro: 65,
        segurointernacional: 100,
    }

    let valorDePorcentVenta = ""
    let valorCompra = ""
    let valorDeMrs = ""

    const seguroManualCartel = (e) => {

        tablaPadre = $(e.target).parents("table").attr("ordatr")
        let filaFather = $(e.target).parents("tr")
        let importeVentaMrs = $(`#t${numeroForm} table.cotizacionLogistica.active tr[itemventa^="seguro"] input.importeCincoCotizacion`).val()
        let importeVentFinal = $(`#t${numeroForm} table.cotizacionLogistica.active tr[itemventa^="seguro"] input.importeSeisCotizacion`).val()

        valorDePorcentVenta = importeVentaMrs.length > 0 && importeVentFinal.length > 0 ? (stringANumero(importeVentFinal) > 65 ? numeroAString((stringANumero(importeVentFinal) / stringANumero(importeVentaMrs)) * 100) : "") : "0,4"

        valorCompra = $(`#t${numeroForm} table.cotizacionLogistica.active tr[itemventa^="seguro"] input.importeDosCotizacion`).val()

        type = $(`#t${numeroForm} inputSelect.tipoCarga`).val()
        let mrs = $(`#t${numeroForm} table.cotizacionLogistica.active tr[itemventa^="seguro"] input.importeCotizacion`)

        let tipoSeg = consultaPestanas.itemVenta[$(`.divSelectInput[name=itemVenta]`, filaFather).val()].name.toLowerCase()
        let arrayTipoSeg = tipoSeg?.split(" ")

        valorDeMrs = mrs.val()

        let porcentEstimado = stringANumero(valorCompra) / stringANumero(valorDeMrs)
        let porcentajeCompra = isNaN(porcentEstimado) ? "" : (porcentEstimado * 100)?.toFixed(4)
        let cleaned = numeroAStringCuatroDec(porcentajeCompra);

        //Eliminar el punto decimal si no hay decimales significativos
        if (cleaned == "") {

            cleaned = porcentDefault[arrayTipoSeg[0] + (arrayTipoSeg[1]?.toLowerCase() || "")]
        }
        ///Cartel Complemento

        cartelComplementoConCortina(objeto, numeroForm, { claseCartel: "seguroManual" })

        let bloqueCero = `<table>`
        bloqueCero += `<tr class="titulos">
        <th class="thFila" width="diez">Valor Mercaderia</th>
        <th class="thFila" width="diez">Venta porcentual</th>
        <th class="thFila" width="diez">Venta nominal</th>
        <th class="thFila" width="diez">Minimo</th>
        </tr>`//Ciero TR

        bloqueCero += `<tr class="filas filaInput">
        <td class="tdFila" width="diez"><input class="inputDetalleSeguro" name="valorMercaderia" value="${valorDeMrs}" /></td>
        <td class="tdFila seguro" width="diez"><input class="inputDetalleSeguro" name="ventaPorcentual" value="${valorDePorcentVenta}" /></td>
        <td class="tdFila nominal" width="diez"><input class="inputDetalleSeguro" name="ventaNominal" value="${importeVentFinal}" /></td>
        <td class="tdFila nominal" width="diez"><input class="inputDetalleSeguro" minimoObj="${arrayTipoSeg[0] + (arrayTipoSeg[1]?.toLowerCase() || "")}" name="minimo" value="${minimoDefault[arrayTipoSeg[0] + (arrayTipoSeg[1]?.toLowerCase() || "")]}" /></div>
        </tr>`//Cierro TR
        bloqueCero += `</table>`//Cierro table

        $(bloqueCero).appendTo($(`#t${numeroForm} .cartelComplemento .bloque0`))

        $(e.target).parents("tr").addClass("cartelActivo")

        $(`#t${numeroForm} .inputDetalleSeguro[name="valorMercaderia"]`).trigger("focus");
    }

    $(`#t${numeroForm}`).on(`focus`, `tr[itemventa^="seguro"]:not(.cartelActivo) input:not(.inputSelect):not(.porcentaje):not(.cantidadCotizacion)`, seguroManualCartel)

    const calcularPorcentaje = (e) => {

        let valorDelPorcentaje = $(e.target).val()
        valorDeMrs = $(`#t${numeroForm} .seguroManual input[name="valorMercaderia"]`).val()

        let valorTotal = (valorDelPorcentaje * stringANumero(valorDeMrs)) / 100

        $(`#t${numeroForm} .seguroManual input[name="${targetPorcentual[e.target.name]}"]`).val(numeroAString(valorTotal))
    }

    $(`#t${numeroForm}`).on("input", `.seguroManual td.seguro input`, calcularPorcentaje)

    const valorNominal = (e) => {

        let valorNominal = $(e.target).val()
        valorDeMrs = $(`#t${numeroForm} .seguroManual input[name="valorMercaderia"]`).val()
        let valorPorcentaje = (stringANumero(valorNominal) / valorDeMrs) * 100

        $(`#t${numeroForm} .seguroManual input[name="${targetNominal[e.target.name]}"]`).val(numeroAString(valorPorcentaje.toFixed(4)))
    }

    $(`#t${numeroForm}`).on("input", `.seguroManual td.nominal input`, valorNominal)

    const valorGralSegunMRS = (e) => {

        let porentCompra = $(`#t${numeroForm} .seguroManual input[name="costoPorcentual"]`).val()
        let porentVta = $(`#t${numeroForm} .seguroManual input[name="ventaPorcentual"]`).val()
        let valorMRS = $(`#t${numeroForm} .seguroManual input[name="valorMercaderia"]`).val()

        if (porentCompra != "" && valorMRS > 0) {

            let valorSeg = valorMRS * stringANumero(porentCompra) / 100

            $(`#t${numeroForm} .seguroManual input[name="costoNominal"]`).val(numeroAString(valorSeg))
        }
        if (porentVta != "" && valorMRS > 0) {

            let valorSeg = (valorMRS * stringANumero(porentVta)) / 100

            $(`#t${numeroForm} .seguroManual input[name="ventaNominal"]`).val(numeroAString(valorSeg))
        }
    }

    $(`#t${numeroForm}`).on("input", `.seguroManual input[name="valorMercaderia"]`, valorGralSegunMRS)
    formatoNumeroSepMil(numeroForm, `input[name="valorMercaderia"]`)
    formatoNumeroSepMilCuatroDec(numeroForm, `.seguroManual  input[name="costoPorcentual"], input[name="ventaPorcentual"]`)

    const valoresConfirmados = (e) => {

        let valorMercaderiaFinal = $(`#t${numeroForm} .seguroManual input[name="valorMercaderia"]`).val()
        let ventaNominal = $(`#t${numeroForm} .seguroManual input[name="ventaNominal"]`).val()
        let ventaMinimo = $(`#t${numeroForm} .seguroManual input[name="minimo"]`).val()
        let minimoObj = $(`#t${numeroForm} .seguroManual input[name="minimo"]`).attr("minimoobj")

        if (stringANumero(ventaNominal) < stringANumero(ventaMinimo)) {

            ventaNominal = ventaMinimo
        }

        $(`#t${numeroForm} table.cotizacionLogistica.active tr[itemventa^="seguro"] input.importeCotizacion`).val(valorMercaderiaFinal).trigger("input")
        $(`#t${numeroForm} table.cotizacionLogistica.active tr[itemventa^="seguro"] input.importeCincoCotizacion`).val(valorMercaderiaFinal).trigger("input")
        $(`#t${numeroForm} table.cotizacionLogistica.active tr[itemventa^="seguro"] input.importeSeisCotizacion`).val(ventaNominal).trigger("input")
        $(`#t${numeroForm} table.cotizacionLogistica.active tr[itemventa="seguro"] input.importeDosCotizacion`).val(valorMercaderiaFinal * 0.01157).trigger("input")
        $(`#t${numeroForm} table.cotizacionLogistica.active tr[itemventa="segurointernacional"] input.importeDosCotizacion`).val(valorMercaderiaFinal * 0.03).trigger("input")

        minimoDefault[minimoObj] = ventaMinimo

        $(`#t${numeroForm} tr[itemventa^="seguro"]`).removeClass("cartelActivo")
        $(`#t${numeroForm} .seguroManual .closePop`).trigger("click")

    }

    $(`#t${numeroForm}`).on("click", `.seguroManual span.okBoton`, valoresConfirmados)

    $(`#t${numeroForm}`).on("click", `.cartelComplemento.seguroManual .closePop`, (e) => {

        $(`#t${numeroForm} tr[itemventa^="seguro"]`).removeClass("cartelActivo")

    })
}
function PesoOTamano(objeto, numeroForm) {

    $(`#t${numeroForm} input.importeCincoCaracProd,
       #t${numeroForm} input.importeTresCaracProd`).addClass("total").prop("readonly", true)

}
function ocultarTotal(objeto, numeroForm) {

    let chequeoItem = () => {

        const totalDolares = {
            0: $(`#t${numeroForm} table.cotizacionLogistica td.totales[moneda=Dolar]`).parents("tr"),
            1: $(`#t${numeroForm} div.fo.importeDolares.total`)
        }
        const totalEuros = {

            0: $(`#t${numeroForm} table.cotizacionLogistica td.totales[moneda=Euro]`).parents("tr"),
            1: $(`#t${numeroForm} div.fo.importeEuro.total`)
        }

        let monedas = $(`#t${numeroForm} table.cotizacionLogistica .inputSelect.monedaComp`)
        let monedaVentas = {
            dolar: 0,
            euro: 0
        }
        let accions = {
            0: (selector) => { selector[0].addClass("oculto"); selector[1].addClass("oculto") },
            1: (selector) => { selector[0].removeClass("oculto"); selector[1].removeClass("oculto") }
        }

        totalEuros[0].addClass("oculto")
        totalEuros[1].addClass("oculto")

        $.each(monedas, (indice, value) => {

            monedaVentas[$(value).val().toLowerCase()]++

        })

        let numeroDol = Math.min(1, monedaVentas.dolar)
        let numeroEuro = Math.min(1, parseFloat(monedaVentas.euro))

        accions[numeroDol](totalDolares)
        accions[numeroEuro](totalEuros)

    }
    chequeoItem()

    $(`#t${numeroForm}`).on("change", `.divSelectInput[name="monedaComp"]`, chequeoItem)

}
function descripcionOperFact(objeto, numeroForm) {

    let atributoReturn = `Operación: ${objeto.numeradorRef[0]} ${objeto.textoRef[0]} `

    if (objeto.idColCotizacionGemela[0]?.length > 0) {

        atributoReturn += `Documento: ${objeto.idColCotizacionGemela[0]} `
    }
    if (objeto.textoOcho?.length > 0) {

        atributoReturn += `Shipper: ${objeto.textoOcho} `
    }
    if (objeto.referenciaCliente?.length > 0) {

        atributoReturn += `Referencia Cliente: ${objeto.referenciaCliente}`
    }

    return atributoReturn.trim()
}
function verRentabilidad(objeto, numeroForm) {

    const armadoTabla = (e) => {

        let filasVentas = $(`#t${numeroForm} table.cotizacionLogistica tr.mainBody:not(.last)`)
        //cartelComplemento

        cartelComplementoConCortina(objeto, numeroForm, { bloques: 2, botonConfirmar: "oculto" })

        let totales = new Object
        let bloqueCero = `<div class="titulo"><h3>Rentabilidad Estimada</h3></div>`
        $(bloqueCero).appendTo(`#t${numeroForm} .cartelComplemento .bloque0`)

        let bloqueUno = `<table class="celdasSeparadas">`
        bloqueUno += `<tr class="titulos"><th class="borderBottom">Item</th><th class="borderBottom">Costo Bruto</th><th class="borderBottom">Venta Bruta</th><th class="borderBottom">Resultado</th><th class="borderBottom">%</th></tr>`

        $.each(filasVentas, (indice, value) => {

            bloqueUno += `<tr>`
            let costo = stringANumero($(`input.importeDosCotizacion`, value).val())
            let venta = stringANumero($(`input.importeSeisCotizacion`, value).val())
            let moneda = $(`.inputSelect.monedaComp`, value).val()
            let resultado = venta - costo

            totales[moneda] = totales[moneda] || new Object
            totales[moneda].costo = (totales[moneda]?.costo || 0) + costo
            totales[moneda].venta = (totales[moneda]?.venta || 0) + venta

            bloqueUno += `<td class="left widthAuto">${$(`.inputSelect.itemVenta`, value).val() || ""}</td>`
            bloqueUno += `<td width="siete" moneda=${moneda}>${numeroAString(costo)}</td>`
            bloqueUno += `<td width="siete" moneda=${moneda}>${numeroAString(venta)}</td>`
            bloqueUno += `<td width="siete" moneda=${moneda}>${numeroAString(resultado || "")}</td>`

            bloqueUno += `<td>${((Number(resultado || 1)) / (venta || 1) * 100).toFixed(2)}</td>`

            bloqueUno += `</tr>`//Cierre TR

        })
        let claseTotal = "primero"
        $.each(totales, (indice, value) => {

            let resulTot = value.venta - value.costo

            bloqueUno += `<tr class="total ${claseTotal}">`
            bloqueUno += `<td class="left">Total ${indice}</td>`
            bloqueUno += `<td moneda=${indice}>${numeroAString(value.costo)}</td>`
            bloqueUno += `<td moneda=${indice}>${numeroAString(value.venta)}</td>`
            bloqueUno += `<td moneda=${indice}>${numeroAString(resulTot || "")}</td>`
            bloqueUno += `<td>${((Number(resulTot || 1)) / (value.venta || 1) * 100).toFixed(2)}</td>`
            bloqueUno += `</tr>`//Cierre TR

        })

        bloqueUno += `</table>`//Cierre Tabla

        $(bloqueUno).appendTo(`#t${numeroForm} .cartelComplemento .bloque1`)
    }

    $(`#t${numeroForm}`).on("dblclick", `td.totales.importeCuatroCotizacion`, armadoTabla)
    $(`#t${numeroForm} td.totales.importeCuatroCotizacion`).addClass("objetivoClick")



}
function numeroDeDocumentoFormInd(objeto, numeroForm) {

    let valor = consultaGet[numeroForm].idColCotizacionGemela[0]

    $(`#t${numeroForm} div.listaInputs`).addClass("oculto")

    let input = `<input class="form" value="${valor}" diasbled/>`
    $(input).appendTo(`#t${numeroForm} div.fo.listaDesplegableTexto`);

}
function numeroDeDocumentoAbm(objeto, numeroForm) {

    $(`#t${numeroForm} .idColCotizacionGemela`).removeAttr("oculto")

}
function hacerCabeceraAtrColec(objetoEnviar, atributoOrigen) {//Esta la uso en desencadenante de certificar

    return objetoEnviar[atributoOrigen][0]
}
function compltarGastosNaviera(objeto, numeroForm, e) {

    const gastos = {
        importacion: {
            maritimo: {
                FCL: completarMaritimaFCL,
                LCL: () => { }

            },
        },
        exportacion: {
            maritimo: {
                FCL: completarMaritimaFCL,
                LCL: () => { }
            }
        },
    }

    function completarMaritimaFCL(e) {

        let table = $(e.target).parents("table")
        const containers = $(`#t${numeroForm} table.detalleFlete tr:not(.last) input.cantidadFlete`)

        let cantidadContainer = 0
        $.each(containers, (indice, value) => {

            cantidadContainer += stringANumero($(value).val() || 0)

        })

        $(`tr[itemventa=gastosnavieraexento] input.cantidadCotizacion`, table).valIn(cantidadContainer)
        $(`tr[itemventa=gastosnavieraexento] input.cantidadCotizacion`, table).valIn(cantidadContainer)
        $(`tr[itemventa=gastosnavieraexento] .inputSelect.unidadesMedida`, table).val("Contenedores").trigger(`change`)
        $(`tr[itemventa=gastosnavieraexento] .inputSelect.unidadesMedida`, table).val("Contenedores").trigger(`change`)

    }
    let tipoOperacion = $(`#t${numeroForm} .inputSelect.tipoOperacion`).val().toLowerCase()
    let tipoTransporte = $(`#t${numeroForm} .inputSelect.tipoTransporte`).val().toLowerCase()
    let tipoCarga = $(`#t${numeroForm} .inputSelect.tipoCarga`).val()
    gastos?.[tipoOperacion]?.[tipoTransporte]?.[tipoCarga]?.(e)
}
function compltarGastosHandling(objeto, numeroForm, e) {

    const gastos = {
        importacion: {
            maritimo: {
                //  FCL: completarGastosImpoFCL,
                LCL: completarGastosImpoCincuenta
            },
            terrestre: {
                FCL: completarGastosImpoCincuenta,
                LCL: completarGastosImpoCincuenta
            },
            aereo: {
                LCL: completarGastosImpoCien
            }

        },
        exportacion: {
            maritimo: {
                FCL: completarGastosImpoFCL,
                LCL: completarGastosImpoCincuenta
            },
            terrestre: {
                FCL: completarGastosImpoCincuenta,
                LCL: completarGastosImpoCincuenta
            },
            aereo: {
                FCL: completarGastosImpoCien,
                LCL: completarGastosImpoCien
            }
        }
    }

    function completarGastosImpoFCL(e) {

        let table = $(e.target).parents("table")
        const documentación = $(`tr[itemventa="documentación"]:not(.last) input.cantidadCotizacion`, table)

        let cantidadDocumentos = 0

        $.each(documentación, (indice, value) => {

            cantidadDocumentos = Number(cantidadDocumentos) + stringANumero($(value).val() || 0)
        })

        /*   let importeDocumento = cantidadDocumentos * 100
           let costoDoc = cantidadDocumentos * 80
   
           $(`tr[itemventa=Handling] input.cantidadCotizacion`, table).val(1).trigger("input")
           $(`tr[itemventa=Handling] input.importeCotizacion`, table).val(costoDoc).trigger("input")
           $(`tr[itemventa=Handling] input.importeCincoCotizacion`, table).val(importeDocumento).trigger("input")*/

    }
    function completarGastosImpoCincuenta(e) {

        let table = $(e.target).parents("table")
        //$(`tr[itemventa=Handling] input.cantidadCotizacion`, table).valIn(1)
        /*  $(`tr[itemventa=Handling] input.importeCotizacion`, table).valIn(40)
          $(`tr[itemventa=Handling] input.importeCincoCotizacion`, table).valIn(50)*/

    }
    function completarGastosImpoCien(e) {

        let table = $(e.target).parents("table")
        //$(`tr[itemventa=Handling] input.cantidadCotizacion`, table).valIn(1)
        /*   $(`tr[itemventa=Handling] input.importeCotizacion`, table).valIn(80)
           $(`tr[itemventa=Handling] input.importeCincoCotizacion`, table).valIn(100)*/

    }

    let tipoOperacion = $(`#t${numeroForm} .inputSelect.tipoOperacion`).val().toLowerCase()
    let tipoTransporte = $(`#t${numeroForm} .inputSelect.tipoTransporte`).val().toLowerCase()
    let tipoCarga = $(`#t${numeroForm} .inputSelect.tipoCarga`).val() || "LCL"
    gastos?.[tipoOperacion]?.[tipoTransporte]?.[tipoCarga]?.(e)
}
function compltarGastosSim(objeto, numeroForm, e) {

    const gastos = {
        importacion: {
            maritimo: {
                FCL: completarGastosImpoFCL,
                LCL: () => { }
            },
            aereo: {
                FCL: () => { },
                LCL: completarGastos,
                "": completarGastos
            }

        },
        exportacion: {
            maritimo: {
                FCL: completarGastosImpoFCL,
                LCL: () => { }
            },
        }
    }

    let table = $(e.target).parents("table")
    function completarGastosImpoFCL(e) {
        let table = $(e.target).parents("table")
        const documentación = $(`#t${numeroForm} table.cotizacionLogistica tr[itemventa="documentación"]:not(.last) input.cantidadCotizacion`)

        let cantidadDocumentos = 0

        $.each(documentación, (indice, value) => {

            cantidadDocumentos = Number(cantidadDocumentos) + stringANumero($(value).val() || 0)

        })

        /* let importeDocumento = cantidadDocumentos * 50
         let costo = cantidadDocumentos * 35
 
         $(`tr[itemventa=SIM] input.cantidadCotizacion`, table).valIn(1)
         $(`tr[itemventa=SIM] input.importeCotizacion`, table).valIn(costo)
         $(`tr[itemventa=SIM] input.importeCincoCotizacion`, table).valIn(importeDocumento)*/

    }
    function completarGastos(e) {
        let table = $(e.target).parents("table")
        // $(`tr[itemventa=SIM] input.cantidadCotizacion`, table).valIn(1)
        /*$(`tr[itemventa=SIM] input.importeCotizacion`, table).valIn(50)
        $(`tr[itemventa=SIM] input.importeCincoCotizacion`, table).valIn(70)*/

    }

    let tipoOperacion = $(`#t${numeroForm} .inputSelect.tipoOperacion`).val().toLowerCase()
    let tipoTransporte = $(`#t${numeroForm} .inputSelect.tipoTransporte`).val().toLowerCase()
    let tipoCarga = $(`#t${numeroForm} .inputSelect.tipoCarga`).val() || "LCL"
    gastos?.[tipoOperacion]?.[tipoTransporte]?.[tipoCarga]?.(e)
}
function compltarGastosDocumentación(objeto, numeroForm, e) {

    const gastos = {
        importacion: {
            maritimo: {
                FCL: () => { },
                LCL: completarGastosImpoLCL
            },
            aereo: {
                LCL: triggerDocumentaciónAreo
            },
        },
        exportacion: {
            maritimo: {
                FCL: () => { },
                LCL: completarGastosImpoLCL
            },
            aereo: {
                LCL: triggerDocumentaciónAreo
            },
        }
    }
    let fatherTR = $(e.target).parents("tr")
    let cantdidadDoc = $(`input[name="listaDesplegableTexto"]`, fatherTR).length

    $(`input.cantidadCotizacion `, fatherTR).val(cantdidadDoc).trigger(`change`)
    $(`.inputSelect.unidadesMedida`, fatherTR).val(`Documentos`).trigger(`change`)

    function completarGastosImpoLCL(e) {
        let table = $(e.target).parents("table")
        //$(`tr[itemventa=documentación] input.cantidadCotizacion`, table).valIn(1)
        /*$(`tr[itemventa=documentación] input.importeCotizacion`, table).valIn(25)
        $(`tr[itemventa=Documentos] input.importeCincoCotizacion`, table).valIn(50)*/

    }

    function triggerDocumentaciónAreo(e) {

        let table = $(e.target).parents("table")

        if ($(`#t${numeroForm} tr[itemventa=gastosaerolinea]`).length == 0) {

            $(`tr.last td.vacio`, table).trigger("dblclick")

            let q = $(`tr.mainBody:not([itemventa]):first`, table).attr("q")

            $(`tr[q=${q}] .inputSelect.itemVenta`, table).val(`Gastos Aerolínea`).trigger(`change`)
            $(`tr[q=${q}] .inputSelect.unidadesMedida`, table).val(`Unidades`).trigger(`change`)

            let gastos = $(`#t${numeroForm} tr[itemventa="gastosaerolinea"]`);
            let flete = $(`#t${numeroForm} tr[itemventa*="flete"]`);

            gastos.insertAfter(flete);
            reAsingnarQfilas(objeto, numeroForm, "cotizacionLogistica ")
        }
    }

    let tipoOperacion = $(`#t${numeroForm} .inputSelect.tipoOperacion`).val().toLowerCase()
    let tipoTransporte = $(`#t${numeroForm} .inputSelect.tipoTransporte`).val().toLowerCase()
    let tipoCarga = $(`#t${numeroForm} .inputSelect.tipoCarga`).val() || "LCL"

    gastos?.[tipoOperacion]?.[tipoTransporte]?.[tipoCarga]?.(e)
}
function gastosAerolinea(objeto, numeroForm, e) {

    let table = e.target.closest("table")
    const gastos = {
        importacion: {
            aereo: {
                FCL: () => { },
                LCL: completarGastosAereoImpo,
            },
        },
        exportacion: {
            aereo: {
                FCL: () => { },
                LCL: completarGastosAereoExpo
            },
        }
    }

    function completarGastosAereoImpo(e) {

        let table = $(e.target).parents("table")
        const documentación = $(`tr[itemventa="documentación"]:not(.last) input.cantidadCotizacion`, table)

        let cantidadDocumentos = 0

        $.each(documentación, (indice, value) => {

            cantidadDocumentos = cantidadDocumentos + stringANumero($(value).val() || 0)
        })

        let importeDocumento = cantidadDocumentos * 170

        // $(`tr[itemventa=GastosAerolínea] input.cantidadCotizacion`, table).valIn(1)
        /* $(`tr[itemventa=GastosAerolínea] input.importeCotizacion`, table).valIn(importeDocumento)
         $(`tr[itemventa=GastosAerolínea] input.importeCincoCotizacion`, table).valIn(importeDocumento)*/
    }
    function completarGastosAereoExpo(e) {
        let table = $(e.target).parents("table")
        const documentación = $(`tr[itemventa="documentación"]:not(.last) input.cantidadCotizacion`, table)
        let cantidadDocumentos = 0

        $.each(documentación, (indice, value) => {

            cantidadDocumentos += stringANumero($(value).val() || 0)
        })

        let importeDocumento = cantidadDocumentos * 55

        //$(`tr[itemventa=GastosAerolínea] input.cantidadCotizacion`, table).valIn(1)
        /* $(`tr[itemventa=GastosAerolínea] input.importeCotizacion`, table).valIn(importeDocumento)
         $(`tr[itemventa=GastosAerolínea] input.importeCincoCotizacion`, table).valIn(importeDocumento)*/

    }
    let tipoOperacion = $(`#t${numeroForm} .inputSelect.tipoOperacion`).val().toLowerCase()
    let tipoTransporte = $(`#t${numeroForm} .inputSelect.tipoTransporte`).val().toLowerCase()
    let tipoCarga = $(`#t${numeroForm} .inputSelect.tipoCarga`).val() || "LCL"

    gastos?.[tipoOperacion]?.[tipoTransporte]?.[tipoCarga || "LCL"]?.(e)
}
function compltarGastosDesconsolidado(objeto, numeroForm, e) {
    let table = $(e.target).parents("table")
    const gastos = {
        importacion: {
            maritimo: {

                LCL: completarDesconsolidado
            },
        },
        exportacion: {
            maritimo: {

                LCL: completarDesconsolidado
            }
        },
    }
    function completarDesconsolidado() {

        let toneladas = $(`#t${numeroForm} input.cantidadSeisCaractProd`)
        let totalTon = 0
        let metrosCubicos = $(`#t${numeroForm} input.cantidadCincoCaractProd`)
        let totalMetCub = 0

        $.each(toneladas, (indice, value) => {

            totalTon += stringANumero($(value).val() || 0)
        })
        $.each(metrosCubicos, (indice, value) => {

            totalMetCub += stringANumero($(value).val() || 0)
        })

        let desc = (totalTon / 1000) / totalMetCub * 30
        let descFinal = Math.min(Math.max(desc, 30), 300)

        $(`tr[itemventa=desconsolidacion] input.importeCincoCotizacion`, table).trigger("change")

        //$(`tr[itemventa=Desconsolidacion] input.cantidadCotizacion`, table).valIn(1)
        /* $(`tr[itemventa=Desconsolidacion] input.importeCotizacion`, table).valIn(descFinal / 2)
         $(`tr[itemventa=Desconsolidacion] input.importeCincoCotizacion`, table).valIn(descFinal)*/

    }

    let tipoOperacion = $(`#t${numeroForm} .inputSelect.tipoOperacion`).val().toLowerCase()
    let tipoTransporte = $(`#t${numeroForm} .inputSelect.tipoTransporte`).val().toLowerCase()
    let tipoCarga = $(`#t${numeroForm} .inputSelect.tipoCarga`).val()
    gastos?.[tipoOperacion]?.[tipoTransporte]?.[tipoCarga]?.(e)

}
function martimoInternacional(objeto, numeroForm, e) {

    let tablefather = e.target.closest("table")
    let itemVenta = $(`tr[itemVenta=seguro]`, tablefather)

    if (itemVenta.length == 0 && $(`#t${numeroForm} .inputSelect.seguro`).val() != "NO TOMA") {

        if ($(`tr[itemventa=seguro]`, tablefather).length == 0) {
            $(`tr.last td.vacio`, tablefather).trigger("dblclick")
            let itemVenta = Object.values(consultaPestanas.itemVenta).find(e => e.name.toLowerCase() == "seguro")
            $(`tr.mainBody:not([itemventa]):first .inputSelect.itemVenta`, tablefather).valt(itemVenta?.name)
            let unidades = Object.values(consultaPestanas.unidadesMedida).find(e => e.name.toLowerCase() == "unidades")
            $(`tr.mainBody:not([itemventa]):first .inputSelect.unidadesMedida`, tablefather).val(unidades?.name).trigger(`change`)
        }
    } else {

        itemVenta.insertAfter(`tr[itemVenta="fleteoceánicointernacional"]:last`, tablefather)
    }

    let tipoCarga = $(`#t${numeroForm} .inputSelect.tipoCarga`).val()

    if (tipoCarga == "LCL") {
        let q = $(`tr.mainBody:not([itemventa]):first`, tablefather).attr("q")

        if (($(`#t${numeroForm} .inputSelect.incoterm`).val() == "EXW" || $(`#t${numeroForm} .inputSelect.incoterm`).val() == "FCA") && $(`tr[itemventa=gastosexterior]`, tablefather).length == 0) {
            if ($(`tr[itemventa=gastosexterior]`, tablefather).length == 0) {
                $(`tr.last td.vacio`, tablefather).trigger("dblclick")
                let itemVenta = Object.values(consultaPestanas.itemVenta).find(e => e.name.toLowerCase() == "gastos exterior")
                $(`tr[q=${parseFloat(q)}] .inputSelect.itemVenta`, tablefather).val(itemVenta?.name).trigger(`change`)
                let unidades = Object.values(consultaPestanas.unidadesMedida).find(e => e.name.toLowerCase() == "unidades")
                $(`tr[q=${parseFloat(q)}] .inputSelect.unidadesMedida`, tablefather).val(unidades?.name).trigger(`change`)

                q++
            }
        }
        if ($(`tr[itemventa=desconsolidacion]`, tablefather).length == 0) {

            $(`tr.last td.vacio`, tablefather).trigger("dblclick")
            let itemVenta = Object.values(consultaPestanas.itemVenta).find(e => e.name.toLowerCase() == "desconsolidacion")
            $(`tr[q=${q}] .inputSelect.itemVenta`, tablefather).val(itemVenta?.name).trigger(`change`)
            let unidades = Object.values(consultaPestanas.unidadesMedida).find(e => e.name.toLowerCase() == "unidades")
            $(`tr[q=${q}] .inputSelect.unidadesMedida`, tablefather).val(unidades?.name).trigger(`change`)
            q++
        }

        if ($(`tr[itemventa=handling]`, tablefather).length == 0) {

            $(`tr.last td.vacio`, tablefather).trigger("dblclick")
            let itemVenta = Object.values(consultaPestanas.itemVenta).find(e => e.name.toLowerCase() == "handling")
            $(`tr[q=${parseFloat(q)}] .inputSelect.itemVenta`, tablefather).val(itemVenta?.name).trigger(`change`)
            let unidades = Object.values(consultaPestanas.unidadesMedida).find(e => e.name.toLowerCase() == "unidades")
            $(`tr[q=${parseFloat(q)}] .inputSelect.unidadesMedida`, tablefather).val(unidades?.name).trigger(`change`)
        }

        let seguro = $(`#t${numeroForm} tr[itemventa*="seguro"]`);
        let ultimaItemVenta = $(`#t${numeroForm} tr[itemventa]`).last();
        seguro.insertAfter(ultimaItemVenta)
        reAsingnarQfilas(objeto, numeroForm, "cotizacionLogistica")
        let filaGex = $(`tr[itemventa=gastosexterior]`, tablefather)
        if (filaGex.length > 0) {
            let primerItemVenta = $(`#t${numeroForm} tr[itemventa]`).first();
            filaGex.insertBefore(primerItemVenta)
        }
    } else {
        let q = $(`tr.mainBody:not([itemventa]):first`, tablefather).attr("q")
        if (($(`#t${numeroForm} .inputSelect.incoterm`).val() == "EXW" || $(`#t${numeroForm} .inputSelect.incoterm`).val() == "FCA") && $(`tr[itemventa=gastosexterior]`, tablefather).length == 0) {
            if ($(`tr[itemventa=gastosexterior]`, tablefather).length == 0) {
                $(`tr.last td.vacio`, tablefather).trigger("dblclick")
                let itemVenta = Object.values(consultaPestanas.itemVenta).find(e => e.name.toLowerCase() == "gastos exterior")
                $(`tr[q=${parseFloat(q)}] .inputSelect.itemVenta`, tablefather).val(itemVenta?.name).trigger(`change`)
                let unidades = Object.values(consultaPestanas.unidadesMedida).find(e => e.name.toLowerCase() == "unidaeds")
                $(`tr[q=${parseFloat(q)}] .inputSelect.unidadesMedida`, tablefather).val(unidades?.name).trigger(`change`)

                q++
            }
        }
        if ($(`tr[itemventa=gastosnavieraexento]`, tablefather).length == 0) {


            $(`tr.last td.vacio`, tablefather).trigger("dblclick")
            let unidades = Object.values(consultaPestanas.unidadesMedida).find(e => e.name.toLowerCase() == "contenedores")
            $(`tr[q=${parseFloat(q)}] .inputSelect.unidadesMedida`, tablefather).val(unidades?.name).trigger(`change`)
            let itemVenta = Object.values(consultaPestanas.itemVenta).find(e => e.name.toLowerCase() == "gastos naviera exento")
            $(`tr[q=${parseFloat(q)}] .inputSelect.itemVenta`, tablefather).val(itemVenta?.name).trigger(`change`)

            q++
        }
        if ($(`tr[unidadesMedida=documentación]`, tablefather).length == 0) {

            $(`tr.last td.vacio`, tablefather).trigger("dblclick")
            let cantdidadDoc = $(`#t${numeroForm} input[name="listaDesplegableTexto"]`).length
            $(`tr[q=${parseFloat(q)}] input.cantidadCotizacion `, tablefather).val(cantdidadDoc).trigger(`change`)
            let unidades = Object.values(consultaPestanas.unidadesMedida).find(e => e.name.toLowerCase() == "documentos")
            $(`tr[q=${parseFloat(q)}] .inputSelect.unidadesMedida`, tablefather).val(unidades?.name).trigger(`change`)
            let itemVenta = Object.values(consultaPestanas.itemVenta).find(e => e.name.toLowerCase() == "documentación")
            $(`tr[q=${parseFloat(q)}] .inputSelect.itemVenta`, tablefather).val(itemVenta?.name).trigger(`change`)

            q++
        }
        if ($(`tr[itemventa=handling]`, tablefather).length == 0) {

            $(`tr.last td.vacio`, tablefather).trigger("dblclick")
            let itemVenta = Object.values(consultaPestanas.itemVenta).find(e => e.name.toLowerCase() == "handling")
            $(`tr[q=${parseFloat(q)}] .inputSelect.itemVenta`, tablefather).val(itemVenta?.name).trigger(`change`)
            let unidades = Object.values(consultaPestanas.unidadesMedida).find(e => e.name.toLowerCase() == "unidades")
            $(`tr[q=${parseFloat(q)}] .inputSelect.unidadesMedida`, tablefather).val(unidades?.name).trigger(`change`)

            q++
        }
        if ($(`tr[itemventa=sim]`, tablefather).length == 0) {

            $(`tr.last td.vacio`, tablefather).trigger("dblclick")
            $(`tr[q=${parseFloat(q)}] .inputSelect.itemVenta`, tablefather).val(`SIM`).trigger(`change`)
            let unidades = Object.values(consultaPestanas.unidadesMedida).find(e => e.name.toLowerCase() == "unidades")
            $(`tr[q=${parseFloat(q)}] .inputSelect.unidadesMedida`, tablefather).val(unidades?.name).trigger(`change`)

            q++
        }

        let seguro = $(`#t${numeroForm} tr[itemventa*="seguro"]`);
        let ultimaItemVenta = $(`#t${numeroForm} tr[itemventa]`).last();
        seguro.insertAfter(ultimaItemVenta)

        reAsingnarQfilas(objeto, numeroForm, "cotizacionLogistica")
        let filaGex = $(`tr[itemventa=gastosexterior]`, tablefather)
        if (filaGex.length > 0) {
            let primerItemVenta = $(`#t${numeroForm} tr[itemventa]`).first();
            filaGex.insertBefore(primerItemVenta)
        }
    }


}
function gastosTerrestre(objeto, numeroForm, e) {

    let table = e.target.closest("table")
    let origen = $(`#t${numeroForm} .divSelectInput[name="ciudad"]`).val()
    let paisOrigen = consultaPestanas.ciudad[origen]?.pais

    let q = $(` tr.mainBody:not([itemventa]):first`, table).attr("q")

    if (paisOrigen == "Brasil") {
        if ($(`tr[itemventa=segurointernacional]`, table).length == 0) {
            $(`tr.last td.vacio`, table).trigger("dblclick")
            let itemVenta = Object.values(consultaPestanas.itemVenta).find(e => e.name.toLowerCase() == "seguro internacional")
            $(`tr[q=${q}] .inputSelect.itemVenta`, table).valt(itemVenta?.name)
            q++
        }


    } else {
        if ($(`tr[itemventa=seguro]`, table).length == 0 && $(`#t${numeroForm} .inputSelect.seguro`).val() != "NO TOMA") {
            $(`tr.last td.vacio`, table).trigger("dblclick")
            let itemVenta = Object.values(consultaPestanas.itemVenta).find(e => e.name.toLowerCase() == "seguro")
            $(`tr[q=${q}] .inputSelect.itemVenta`, table).valt(itemVenta?.name)
            q++
        }
    }

    if ($(`tr[itemventa=handling]`, table).length == 0) {

        $(`tr.last td.vacio`, table).trigger("dblclick")
        let itemVenta = Object.values(consultaPestanas.itemVenta).find(e => e.name.toLowerCase() == "handling")
        $(`tr[q=${parseFloat(q)}] .inputSelect.itemVenta`, table).val(itemVenta?.name).trigger(`change`)
        let unidades = Object.values(consultaPestanas.unidadesMedida).find(e => e.name.toLowerCase() == "unidades")

        $(`tr[q=${parseFloat(q)}] .inputSelect.unidadesMedida`, table).val(unidades?.name).trigger(`change`)
    }
    let seguro = $(`#t${numeroForm} tr[itemventa*="seguro"]`);
    let ultimaItemVenta = $(`#t${numeroForm} tr[itemventa]`).last();
    seguro.insertAfter(ultimaItemVenta)
    reAsingnarQfilas(objeto, numeroForm, "cotizacionLogistica")
}
function gastosAereos(objeto, numeroForm, e) {

    let table = e.target.closest("table")
    let tipoOperacion = $(`#t${numeroForm} .inputSelect.tipoOperacion`).val()
    let q = $(`tr.mainBody:not([itemventa]):first`, table).attr("q")

    //Seguro
    if ($(`tr[itemventa="seguro"]`, table).length == 0 && $(`#t${numeroForm} .inputSelect.seguro`).val() != "NO TOMA") {

        $(`tr.last td.vacio`, table).trigger("dblclick")
        let itemVenta = Object.values(consultaPestanas.itemVenta).find(e => e.name.toLowerCase() == "seguro")
        $(`tr[q=${q}] .inputSelect.itemVenta`, table).valt(itemVenta?.name)
        q++
    }

    //Handling
    if ($(`tr[itemventa="handling"]`, table).length == 0) {

        $(`tr.last td.vacio`, table).trigger("dblclick")
        let itemVenta = Object.values(consultaPestanas.itemVenta).find(e => e.name.toLowerCase() == "handling")
        $(`tr[q=${parseFloat(q)}] .inputSelect.itemVenta`, table).val(itemVenta?.name).trigger(`change`)
        let unidades = Object.values(consultaPestanas.unidadesMedida).find(e => e.name.toLowerCase() == "unidades")
        $(`tr[q=${parseFloat(q)}] .inputSelect.unidadesMedida`, table).val(unidades?.name).trigger(`change`)
        q++
        let seguro = $(`#t${numeroForm} tr[itemventa*="seguro"]`);
        let ultimaItemVenta = $(`#t${numeroForm} tr[itemventa]`).last();
        seguro.insertAfter(ultimaItemVenta)
        reAsingnarQfilas(objeto, numeroForm, "cotizacionLogistica")
    }

    if (($(`#t${numeroForm} .inputSelect.incoterm`).val() == "EXW" || $(`#t${numeroForm} .inputSelect.incoterm`).val() == "FCA") && $(`tr[itemventa=gastosexterior]`, table).length == 0) {
        if ($(`tr[itemventa=gastosexterior]`, table).length == 0) {
            $(`tr.last td.vacio`, table).trigger("dblclick")
            let itemVenta = Object.values(consultaPestanas.itemVenta).find(e => e.name.toLowerCase() == "gastos exterior")
            $(`tr[q=${parseFloat(q)}] .inputSelect.itemVenta`, table).val(itemVenta?.name).trigger(`change`)
            let unidades = Object.values(consultaPestanas.unidadesMedida).find(e => e.name.toLowerCase() == "unidades")
            $(`tr[q=${parseFloat(q)}] .inputSelect.unidadesMedida`, table).val(unidades?.name).trigger(`change`)
            let filaGex = $(`tr[itemventa=gastosexterior]`, table)
            if (filaGex.length > 0) {
                let primerItemVenta = $(`#t${numeroForm} tr[itemventa]`).first();
                filaGex.insertBefore(primerItemVenta)
            }
            q++
        }
    }

    if (tipoOperacion == "IMPORTACION") {
        if ($(`tr[itemventa="sim"]`, table).length == 0) {

            $(`tr.last td.vacio`, table).trigger("dblclick")
            $(`tr[q=${parseFloat(q)}] .inputSelect.itemVenta`, table).val(`SIM`).trigger(`change`)
            $(`tr[q=${parseFloat(q)}] .inputSelect.unidadesMedida`, table).val(`Unidades`).trigger(`change`)
            q++
            let seguro = $(`#t${numeroForm} tr[itemventa*="seguro"]`);
            let ultimaItemVenta = $(`#t${numeroForm} tr[itemventa]`).last();
            seguro.insertAfter(ultimaItemVenta)
            reAsingnarQfilas(objeto, numeroForm, "cotizacionLogistica")
            let filaGex = $(`tr[itemventa=gastosexterior]`, table)
            if (filaGex.length > 0) {
                let primerItemVenta = $(`#t${numeroForm} tr[itemventa]`).first();
                filaGex.insertBefore(primerItemVenta)
            }
        }

    }

}
function metrosCubicosAereos(objeto, numeroForm) {

    const mult = {
        aereo: 167
    }
    const metros = function () {

        let tot = 1
        let father = $(this).parents("tr")

        let trans = $(`#t${numeroForm} .inputSelect.tipoTransporte`).val().toLowerCase()
        $.each(["cantidadCaractProd", "cantidadDosCaractProd", "cantidadTresCaractProd", "cantidadCuatroCaractProd"], (indice, value) => {

            let digito = stringANumero($(`input.${value}`, father).val() || 1)

            tot *= digito
        })

        $(`input.cantidadCincoCaractProd.total`, father).val(numeroAString(tot * (mult[trans] || 1))).trigger('input')

    }

    $(`#t${numeroForm}`).on(`input`, `input.metros`, metros)
    $(`#t${numeroForm}`).on(`input`, `input.cantidadCaractProd`, metros)
    $(`#t${numeroForm} input.cantidadCincoCaractProd`).addClass("total").attr("readonly", true).attr("tabindex", -1)

    $(`#t${numeroForm}`).on("dblclick", "table.caractProd input.position", (e) => {

        let tr = $(e.target).parents("tr")
        $(`input.cantidadCincoCaractProd`, tr).addClass("total").attr("readonly", true).attr("tabindex", -1)
    })
}
function agregarAttrItemVentaEdit(objeto, numeroForm) {

    $(`#bf${numeroForm}`).on(`click`, `span.editBoton:not(enEspera)`, () => {

        let itemVenta = $(`#t${numeroForm} table.cotizacionLogistica tr.mainBody:not(.last)`)

        $.each(itemVenta, (ind, val) => {

            let valorItem = $(`.inputSelect.itemVenta `, val).val()
            $(val).attr(`itemVenta`, valorItem.replace(/\s+/g, "").toLowerCase())

        })
    })
}
function totlizadorImporteDosCotizacion(objeto, numeroForm) {

    const compraPorUnit = (e) => {

        let tipoDeImpo = $(`#t${numeroForm} .inputSelect.tipoCarga`).val()
        let fila = $(e.target).parents("tr")

        let cantidad = stringANumero($(`input.cantidadCotizacion`, fila).val() || 0)
        let importeCotizacion = stringANumero($(`input.importeCotizacion`, fila).val() || 0)
        let digPosSinCantiad = stringANumero($(`input.comisionCotizacion`, fila).val() || 0)
        let total = 0

        if (tipoDeImpo == "FCL") {

            total = cantidad * ((importeCotizacion || 0) + (digPosSinCantiad || 0))
        } else {


            total = (cantidad * importeCotizacion) + digPosSinCantiad
        }

        $(`input.importeDosCotizacion`, fila).val(numeroAString(total)).trigger("input")

    }
    $(`#t${numeroForm} input.importeDosCotizacion`).addClass("total").attr("readonly", true).attr("tabindex", -1)

    $(`#t${numeroForm}`).on("input", `tr:not([itemventa^="seguro"]) input.importeCotizacion, tr:not([itemventa^="seguro"]) input.cantidadCotizacion, tr:not([itemventa^="seguro"]) input.comisionCotizacion`, compraPorUnit)

    $(`#t${numeroForm}`).on("dblclick", `[class^="position"]`, (e) => {

        let fila = $(e.target).parents("tr")

        $(`input.importeDosCotizacion`, fila).addClass("total").attr("readonly", true).attr("tabindex", -1)

    })
}
function calculoTimeTransit(objeto, numeroForm) {

    function timeTransit(e) {

        let fechaSalida = new Date($(`#t${numeroForm} input.fechaDos`).val())
        let fechaLlegada = new Date($(`#t${numeroForm} input.fechaTres`).val())

        let diferenciaMs = fechaLlegada - fechaSalida;
        let diferenciaDias = diferenciaMs / (1000 * 60 * 60 * 24);

        if (!isNaN(diferenciaDias)) {

            $(`#t${numeroForm} input.transitTime`).val(diferenciaDias)
        }
    }

    $(`#t${numeroForm}`).on("blur", `input.fechaDos, input.fechaTres`, timeTransit)
}
function calculoDelay(objeto, numeroForm) {

    function primerArribo(e) {

        if ($(`#t${numeroForm} input.firstArribal`).val() == "") {

            $(`#t${numeroForm} input.firstArribal`).val($(e.target).val())

        } else if ($(e.target).val() == "1111-11-11") {

            $(`#t${numeroForm} input.firstArribal`).val("")

        }
    }

    $(`#t${numeroForm}`).on("blur", `input.fechaTres`, primerArribo)

    function calcularDelay(e) {

        let fechaLlegadaInicial = new Date($(`#t${numeroForm} input.firstArribal`).val() || $(`#t${numeroForm} input.fechaTres`).val())
        let fechaLlegada = new Date($(`#t${numeroForm} input.fechaTres`).val())

        let diferenciaMs = fechaLlegada - fechaLlegadaInicial;
        let diferenciaDias = diferenciaMs / (1000 * 60 * 60 * 24);

        $(`#t${numeroForm} input.delay`).val(diferenciaDias)

    }

    $(`#t${numeroForm}`).on("blur", `input.fechaTres`, calcularDelay)
}
function incotermAtributoExtra(objeto, numeroForm) {

    $(`#t${numeroForm} .inputSelect.incoterm`).on("change", (e) => {

        let valor = $(e.currentTarget).val()

        if (valor == "EXW" || valor == "FCA") {

            $(`#t${numeroForm} div.fo.recepcion`).removeAttr("oculto")

        } else {
            $(`#t${numeroForm} div.fo.recepcion`).attr("oculto", true)

        }
    })
    if ($(`#t${numeroForm} input._id`).val() != "") {

        $(`#t${numeroForm} .inputSelect.incoterm`).trigger("change")

    }
}
function multiModal(objeto, numeroForm) {

    $(`#t${numeroForm}`).on("change", `.inputSelect.tipoOperacion`, (e) => {

        let valor = $(e.currentTarget).val()

        if (valor == "MULTIMODAL") {

            $(`#t${numeroForm} div.fo.tipoTransporteDos`).removeAttr("oculto")
        } else {

            $(`#t${numeroForm} div.fo.tipoTransporteDos`).attr("oculto", true)
        }
    })
    $(`#t${numeroForm}`).on("change", `.inputSelect.tipoCarga`, (e) => {

        let valor = $(e.currentTarget).val()
        let valorTipoOpera = $(`#t${numeroForm} .inputSelect.tipoOperacion`).val()

        if (valor == "FCL" && valorTipoOpera == "MULTIMODAL") {

            $(`#t${numeroForm} div.fo.multimodalFCL`).removeAttr("oculto")
        } else {

            $(`#t${numeroForm} div.fo.multimodalFCL`).attr("oculto", true)
        }
    })
    if ($(`#t${numeroForm} input._id`).val() != "") {

        $(`#t${numeroForm} .inputSelect.tipoOperacion`).trigger("change")
        $(`#t${numeroForm} .inputSelect.tipoCarga`).trigger("change")

    }
}
function filtrosSbcOperaciones(objeto, numeroForm, atributo) {

    let valorCabecera = $(`#bf${numeroForm} .inputSelect.${atributo}`).val()

    if (valorCabecera == "Abiertas") {

        return "Estimado"
    } else if (valorCabecera == "Cerradas") {
        return "Confirmado"

    } else {

        return { $in: ["Estimado", "Confirmado"] }
    }
}
function filtrosSbcOperacionesCotis(objeto, numeroForm, atributo) {

    let valorCabecera = $(`#bf${numeroForm} .inputSelect.${atributo}`).val()

    if (valorCabecera == "Ingresadas") {

        return "Ingresado"

    } else if (valorCabecera == "Aprobadas") {
        return "Aprobado"

    } else if (valorCabecera == "Rechazadas") {

        return "Rechazado"

    } else {

        return { $in: ["Ingresado", "Aprobado", "Rechazado"] }
    }
}
function resetearTarifa(objeto, numeroForm) {

    let valor = $(`#t${numeroForm} .inputSelect.tipoOperacion`).val()

    if (valor.toLowerCase() == "internacional") {

        return "Sin tarifa"

    } else {

        return "Estimada"
    }
}
function filtrosLengthUno(objeto, numeroForm, atributo, condiciones) {

    const estadosRet = {
        abiertas: () => {

            return { $or: [{ estado: "" }, { estado: { $exists: false } }] }
        },
        cerradas: () => {
            return { $nor: [{ estado: "" }, { estado: { $exists: false } }] }
        }

    }

    let valor = $(`#bf${numeroForm} .inputSelect.${atributo}`)?.val()?.toLowerCase()
    let filtro = estadosRet[valor]?.() || {}

    return filtro

}
async function calcularTipoCambioSeguroDolar(toma) {

    let fecha = toma

    let fechaReg = dateAnteriorFechaSemana(fecha, "y-m-d")
    let fechaTr = fechaReg.split("-")
    let fechBar = `${Number(fechaTr[2]).toString()}${Number(fechaTr[1]).toString()}${fechaTr[0]}`


    let cotis = ""
    let intetos = 0

    while (!cotis && intetos < 7) {

        let consulta = cotisConsultadas?.dolar?.[fechBar] || await consutaTipoCambio(["Dolar"], { hasta: fechaReg })

        if (cotisConsultadas?.dolar?.[fechBar]) {

            cotis = cotisConsultadas?.dolar?.[fechBar]

        } else {

            fechaReg = dateAnteriorFechaSemana(fechaReg, "y-m-d")
            fechaTr = fechaReg.split("-")
            fechBar = `${Number(fechaTr[2]).toString()}${Number(fechaTr[1]).toString()}${fechaTr[0]}`
        }

        intetos++
    }

    return cotis?.venta || ""

}
function completarToma(objeto, numeroForm) {

    async function completar(e) {

        let valor = $(`#t${numeroForm} input.toma`).val()
        let moneda = $(`#t${numeroForm} .divSelectInput[name="moneda"]`).val()

        if (valor.length > 0 && moneda.length > 0) {

            let monedaDef = $(`#t${numeroForm} .inputSelect.moneda`).val().toLowerCase()
            monedaDef = monedaDef.charAt(0).toUpperCase() + monedaDef.slice(1)

            let fechaReg = dateAnteriorFechaSemana(valor, "y-m-d")

            let fechaTr = fechaReg.split("-")
            let fechBar = `${Number(fechaTr[2]).toString()}${Number(fechaTr[1]).toString()}${fechaTr[0]}`

            let cotis = ""
            let intetos = 0

            while (!cotis && intetos < 7) {


                let consulta = cotisConsultadas?.[monedaDef.toLowerCase()]?.[fechBar] || await consutaTipoCambio([monedaDef], { hasta: fechaReg })

                if (cotisConsultadas?.[monedaDef.toLowerCase()]?.[fechBar]) {

                    cotis = cotisConsultadas?.[monedaDef.toLowerCase()]?.[fechBar]

                } else {

                    fechaReg = dateAnteriorFechaSemana(fechaReg, "y-m-d")
                    fechaTr = fechaReg.split("-")
                    fechBar = `${Number(fechaTr[2]).toString()}${Number(fechaTr[1]).toString()}${fechaTr[0]}`
                }

                intetos++
            }

            $(`#t${numeroForm} input.tc`).val(cotis?.venta)
            let importeFacturar = $(`#t${numeroForm} input.importeFacturar`).val()

            if (monedaDef.toLowerCase() == "dolar") {

                $(`#t${numeroForm} input.importe`).val(importeFacturar)

            } else {

                let cotizacionUsd = await calcularTipoCambioSeguroDolar(valor)
                let totalPesos = stringANumero(importeFacturar) * Number(cotis.venta)
                let totaUSd = totalPesos / Number(cotizacionUsd)

                $(`#t${numeroForm} input.importe`).val(totaUSd.toFixed(2)).trigger("input")

            }
        }
    }

    $(`#t${numeroForm}`).on("change", "input.toma", completar)

}
function completarTomaReporte(objeto, numeroForm) {

    async function completar(e) {

        let parent = $(e.target).parents("tr")
        let valor = $(`input.toma`, parent).val()
        let moneda = $(`td.moneda`, parent).text()

        if (valor.length > 0 && moneda.length > 0) {

            let monedaDef = moneda.toLowerCase()
            monedaDef = monedaDef.charAt(0).toUpperCase() + monedaDef.slice(1)

            let fechaReg = dateAnteriorFechaSemana(valor, "y-m-d")

            let fechaTr = fechaReg.split("-")
            let fechBar = `${Number(fechaTr[2]).toString()}${Number(fechaTr[1]).toString()}${fechaTr[0]}`

            let cotis = ""
            let intetos = 0

            while (!cotis && intetos < 7) {

                let consulta = cotisConsultadas?.[monedaDef.toLowerCase()]?.[fechBar] || await consutaTipoCambio([monedaDef], { hasta: fechaReg })

                if (cotisConsultadas?.[monedaDef.toLowerCase()]?.[fechBar]) {

                    cotis = cotisConsultadas?.[monedaDef.toLowerCase()]?.[fechBar]

                } else {

                    fechaReg = dateAnteriorFechaSemana(fechaReg, "y-m-d")
                    fechaTr = fechaReg.split("-")
                    fechBar = `${Number(fechaTr[2]).toString()}${Number(fechaTr[1]).toString()}${fechaTr[0]}`
                }

                intetos++
            }

            $(`input.tc`, parent).val(cotis?.venta)
            let importeFacturar = $(`td.importeFacturar`, parent).text()

            if (monedaDef.trim().toLowerCase() == "dolar") {

                $(`input.importe`, parent).val(importeFacturar)

            } else {

                let cotizacionUsd = await calcularTipoCambioSeguroDolar(valor)
                let totalPesos = stringANumero(importeFacturar) * Number(cotis.venta)
                let totaUSd = totalPesos / Number(cotizacionUsd)

                $(`input.importe`, parent).val(totaUSd.toFixed(2)).trigger("input")

            }
        }
    }

    $(`#t${numeroForm}`).on("change", "input.toma", completar)

}
///Impresion
function monedaImporteSeguro(data, item) {

    let objeto = new Object()
    let index = data.itemVenta.findIndex(e => consultaPestanas?.itemVenta?.[e]?.name?.toLowerCase()?.startsWith("seguro"));

    objeto.moneda = data.monedaComp[index]
    objeto.importe = data.importeSeisCotizacion[index]
    objeto.importeAsegurar = data.importeCincoCotizacion[index]

    return objeto[item]
}
function seguroDescripcionImpresion(data) {

    let index = data.itemVenta.findIndex(e => consultaPestanas?.itemVenta?.[e]?.name?.toLowerCase()?.startsWith("seguro"));
    let venta = data.importeSeisCotizacion[index]
    let moneda = consultaPestanas?.moneda?.[data.monedaComp[index]]?.name?.toLowerCase()
    const objetoMinimo = {
        euro: "EUR 60 + IVA",
        dolar: "USD 65 + IVA",
    }

    let texto = ""
    if (index > -1 && !venta) {

        texto += `<div class="unRenglon"><p class="fsCeroNueve">Seguro 0,4 % sobre el valor asegurado, ${objetoMinimo[moneda] || "USD 65 + IVA"}</p></div>`

    }
    return texto
}
function refOperacionLogisticaPrim(data) {//Solo impresion de logistica, porque es demasiada especifica, tenia que pasar infinidad de parametros

    let tipoCarga = data.tipoCarga
    let tipoCargaDef = consultaPestanas?.tipoCarga?.[tipoCarga]?.name || "LCL"
    const type = {
        Marítimo: "- LCL"

    }

    let texto = ""
    let tipoOperacion = consultaPestanas?.tipoOperacion?.[data?.tipoOperacion]?.name
    let tipoTransporte = consultaPestanas?.tipoTransporte?.[data?.tipoTransporte]?.name

    if (tipoCargaDef == "FCL") {

        texto += `<div class="unRenglon"><p class="bold fsUno">${tipoOperacion} - ${tipoTransporte} - FCL</p></div>`

    } else if ((tipoCargaDef == "LCL")) {


        texto += `<div class="unRenglon"><p class="bold fsUno">${tipoOperacion} - ${tipoTransporte} ${type[tipoTransporte] || ""}</p></div>`
    }

    return texto
}
function refOperacionLogisticaSeg(data) {//Solo impresion de logistica, porque es demasiada especifica, tenia que pasar infinidad de parametros

    let tipoCarga = data.tipoCarga
    let tipoCargaDef = consultaPestanas?.tipoCarga?.[tipoCarga]?.name || "LCL"

    const contenedor = {
        1: "CONTENEDOR",
        2: "CONTENEDORES",
    }
    const vehiculos = {
        1: "VEHICULO",
        2: "VEHICULOS",
    }
    const pallet = {
        1: "BULTO",
        2: "BULTOS",
    }
    const pesoMedida = {
        Aéreo: "KG VOL"
    }
    const type = {
        Marítimo: "- LCL"
    }

    let texto = `<div>`
    let tipoTransporte = consultaPestanas?.tipoTransporte?.[data?.tipoTransporte]?.name

    if (tipoCargaDef == "FCL") {

        let tipoContenedor = data.cantidadFlete
        let cantidadFlete = data.cantidadFlete
        let tamanoContenedor = data.tamanoContenedor

        if (tipoTransporte == "TERRESTRE" && cantidadFlete.length > 0) {

            $.each(cantidadFlete, (indice, valor) => {

                texto += `<div class="unRenglon"><p>${cantidadFlete?.[indice]}&nbsp</p><p>${vehiculos[Math.min(2, cantidadFlete?.[indice])] || ""} Completo/s</div>`

            })

        } else {

            $.each(tipoContenedor, (indice, valor) => {

                if (valor > 0) {
                    texto += `<div class="unRenglon"><p class="fsUno">${cantidadFlete?.[indice]}&nbsp</p><p class="fsUno">${contenedor[Math.min(2, cantidadFlete?.[indice])] || ""}&nbsp</p><p class="fsUno">${consultaPestanas.tipoContenedor?.[valor]?.name || ""}  de ${consultaPestanas.tamanoContenedor?.[tamanoContenedor[indice]]?.name || ""}</p></div>`
                }
            })
        }


    } else if ((tipoCargaDef == "LCL")) {

        let caract = data.cantidadSeisCaractProd
        $.each(caract, (indice, value) => {

            let cantidad = data.cantidadCaractProd
            let cantidadDos = data.cantidadDosCaractProd
            let cantidadTres = data.cantidadTresCaractProd
            let cantidadCuatro = data.cantidadCuatroCaractProd
            let cantidadCinco = data.cantidadCincoCaractProd
            let cantidadSeis = data.cantidadSeisCaractProd

            if (cantidad[indice] > 0) {

                texto += `<div><div class="flex rightContenido"><p class="fsUno">${cantidad[indice]}&nbsp</p><p class="fsUno">${pallet[Math.min(2, cantidad[indice])] || ""} &nbsp</p><p class="fsUno">Peso:&nbsp</p><p class="fsUno">${cantidadSeis[indice]} kg</p></div>`;
                if (cantidadDos[indice] > 0 && cantidadTres[indice] > 0 && cantidadCuatro[indice] > 0) {

                    texto += `<div class="flex rightContenido"><p class="fsUno">Medidas:&nbsp</p><p class="fsUno"> ${cantidadDos[indice]} M * ${cantidadTres[indice]} M * ${cantidadCuatro[indice]} M</p></div>`
                }

                texto += `<div class="flex rightContenido"><p class="fsUno">Volumen Total:&nbsp</p><p class="fsUno"> ${cantidadCinco[indice]} ${pesoMedida[tipoTransporte] || "M3"}</p></div></div>`

            }

        })
    }
    /*texto += `<div class="unRenglon"><p class="bold fsUno">DOCUMENTO:&nbsp</p><p class="fsUno"> ${data.listaDesplegableTexto[0]}</p> </div>`
    texto += `</div>`*/


    texto += `</div>`

    return texto
}
function origenImp(data) {

    let texto = ""
    let origen = data.ciudad
    let origenString = consultaPestanas.ciudad[origen].name

    texto += `<div class="unRenglon"><p class="fsUno bold">ORIGEN:&nbsp</p><p class="fsUno">${origenString}</p></div>`

    return texto
}
function destinoImp(data) {

    let texto = ""
    let destino = data.destinoSbc
    let destinoString = consultaPestanas.ciudad[destino].name

    texto += `<div class="unRenglon"><p class="fsUno bold">DESTINO:&nbsp</p><p class="fsUno">${destinoString}</p></div>`

    return texto
}
function cotisOperacion(data, objeto, numeroForm) {//Solo impresion de logistica, porque es demasiada especifica, tenia que pasar infinidad de parametros

    let itemVenta = data.itemVenta
    let cuerpo = "";

    $.each(itemVenta, (indice, valor) => {

        let monedas = {
            Dolar: "USD",
            Euro: "EUR"
        }

        let tipoTransporte = data.tipoTransporte
        let tipoOperacion = consultaPestanas.tipoOperacion[data.tipoOperacion].name
        let unidadesMedida = data.unidadesMedida
        let tip = ""
        let unidad = data.cantidadCotizacion
        let moneda = data.monedaComp
        let bruto = data.importeSeisCotizacion

        const nombreItemVenta = consultaPestanas?.itemVenta?.[valor]?.name || "";
        if (tipoOperacion == ("Importacion" || "Exportacion" || "internacional")) {
            tip = "Internacional"
        } else {
            tip = "Nacional"
        }
        if (nombreItemVenta.includes("Flete")) {

            cuerpo += `<p>${consultaPestanas?.itemVenta?.[valor]?.name} ${consultaPestanas?.tipoTransporte?.[tipoTransporte]?.name} ${tip} ${unidad[indice]} ${consultaPestanas.unidadesMedida[unidadesMedida[indice]].name} ${monedas[consultaPestanas.moneda[moneda[indice]].name]} ${numeroAString(bruto[indice] || "")}</p>`;

        } else if (nombreItemVenta.includes("Seguro")) {
            cuerpo += `<p>${consultaPestanas?.itemVenta?.[valor]?.name} ${unidad?.[indice]} ${consultaPestanas?.unidadesMedida?.[unidadesMedida?.[indice]]?.name} del valor de la mercaderia ${monedas[consultaPestanas.moneda[moneda[indice]].name]} ${numeroAString(bruto[indice] || "")} + IVA</p>`;

        } else {
            cuerpo += `<p>${consultaPestanas?.itemVenta?.[valor]?.name} ${monedas?.[consultaPestanas?.moneda?.[moneda?.[indice]]?.name]} ${numeroAString(bruto?.[indice] || "")} + IVA</p>`;
        }
    })

    return cuerpo
}