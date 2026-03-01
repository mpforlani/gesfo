let variablesModeloTesoreria = {
    chequesTercero: {
        atributos: {
            names: [
                T({ nombre: "numeroDeCheque", clase: "textoCentrado requerido" }),
                F({ nombre: "fecha", clase: "requerido" }),
                F({ nombre: "vencimientoCheque", clase: "requerido" }),
                P({ nombre: "moneda", clase: "requerido", width: "diez" }),
                N({ nombre: "tipoCambio", clase: "requerido", oculto: "oculto" }),
                I({ nombre: "importe", clase: "requerido" }),
                P({ nombre: "cliente", clase: "requerido" }),
                T("bancoCheque"),
                PPE({ nombre: "estado", clase: "soloLectura textoCentrado transparente", opciones: ["En cartera", "Endosado", "Depositado"], valorInicial: "En cartera" }),
                F({ nombre: "fechaDeposito", clase: "soloLectura transparente" }),
                T({ nombre: "cuentasBancarias", clase: "soloLectura transparente" }),
                adjunto,],
            titulos: [`Número`, `Fecha`, `Vencimiento`, `Moneda`, `TC`, `Importe`, `Cliente`, `Banco cheque`, `Estado`, `Depósito`, `Cuenta/Caja Destino`, `Adjunto`],
            cabeceraAbm: {
                select: [
                    {
                        atributo: PPE({ nombre: "estado", opciones: ["En cartera", "Endosado", "Depositado"], clase: "textoCentrado doceWidth" }),
                        titulo: "Estado"
                    },
                    {
                        atributo: P({ nombre: "cliente", clase: "textoCentrado diezWidth" }),
                        titulo: "Cliente"
                    },
                ],
            },
            limiteCabecera: true,
            eliminar: true,
            deshabilitar: false,
        },
        formInd: {
            inputRenglones: [5, 5, 4, 4],
        },
        funcionesPropias: {
            inicio: {
                cabeceraFiltroAbm: [cabeceraFiltroAbm],
            },
            finalAbm: {
                rellenoAbmEstado: [rellenoAbmEstado, "estado", { encartera: "azulLetra", depositado: "verdeLetra", endosado: "naranjaLetra" }],
                rellenoAbmFechaVenc: [rellenoAbmFechaVenc, "estado", { encartera: "rojoLetra" }, "vencimientoCheque"]
            },
            cargar: {
                noEditarFormSelect: [noEditarFormSelect, P("tipoPago")],
                cobroChequesTerceros: [cobroChequesTerceros]
            },
            formularioIndiv: {
                filtroAsociativo: [filtroAsociativo, "cuentasBancarias", "bancos", "cuentasBancarias"],
            },
        },
        pest: `Cheques de terceros`,
        accion: `chequesTercero`,
        multimoneda: true,
        type: "transaccion",
    },
    depositoCheques: {
        atributos: {
            names: [
                NS("numerador"),
                F({ nombre: "fecha", clase: "requerido" }),
                compuestoDeposito,
                I("importeTotal")],
            titulos: [`Número`, `Fecha depósito`, `compuestoDeposito`, `Importe Total`],
            eliminar: true,
            deshabilitar: false,
        },
        formInd: {
            inputRenglones: [3, `compuesto`, 1],
        },
        funcionesPropias: {
            cargar: {
                //noEditarFormSelect: [noEditarFormSelect, tipoPago],
            },
        },
        totalizadores: {
            formulario: {
                type: "totalizadorCabecera",
                total: ["importeTotal"],
                cantidad: false,
                digitosPositivos: ["importeTipoPago"],
                trigger: ["importeTipoPago"],
            },
        },
        desencadenaColeccion: {
            destino: {
                type: "condicionSegunFuncion",
                funcionCondicion: [desencadenanteSegunAtributo, { atributo: "cajaDestino", destino: "cajas" }, { atributo: "cuentaDestino", destino: "cuentas" }],
                identificador: "destino", //este atributo va cuando tiene opciones a fin de crear el atributoId Ref
                coleccionOrigen: compuestoDeposito,
                eliminarDesencadenate: ["cajaDestino", "cuentaDestino"],//Si cambia este atributo se elimina el desencadenate
                opciones: {
                    cuentas: {
                        destino: "saldosBancos",
                        nombre: "Movimientos Bancarios",
                        atributosColeccion: {
                            cambiarAtributos: {

                                cuentaDestino: "cuentasBancarias",
                                importeTipoPago: "importe",
                                importeTipoPagomb: "importemb",
                                importeTipoPagoma: "importema",
                                importeTipoPagoma: "importema",
                                monedaTipoPago: "moneda",
                                tipoCambioTipoPago: "tipoCambio",
                            },
                            funcion: {
                                bancos: [buscarAtributosParamentricos, "bancos", P({ nombre: "cuentaDestino", origen: "cuentasBancarias" })]
                            },
                            valorFijo: {
                                itemsBancos: "Deposito Cheques",
                            },
                            delete: { numerador: "numerador" },
                        },
                        grabarEnOrigen: { Número: "numerador" },
                        grabarEnOrigenColeccion: { Número: "numerador" },
                        grabarEnDestino: { Número: "numerador" },
                    },
                    cajas: {
                        destino: "saldosCajas",
                        nombre: "Movimientos Cajas",
                        atributosColeccion: {
                            cambiarAtributos: {

                                cajaDestino: "cajas",
                                importeTipoPago: "importe",
                                importeTipoPagomb: "importemb",
                                importeTipoPagoma: "importema",
                                importeTipoPagoma: "importema",
                                monedaTipoPago: "moneda",
                                tipoCambioTipoPago: "tipoCambio",

                            },
                            valorFijo: {
                                itemsCajas: "Deposito Cheques",
                            },
                            delete: { numerador: "numerador" },
                        },
                        grabarEnOrigen: { Número: "numerador" },
                        grabarEnOrigenColeccion: { Número: "numerador" },
                        grabarEnDestino: { Número: "numerador" },
                    },

                },
            },
        },
        imputarcoleccion: {
            chequesTercero: {
                type: "directo",
                coleccionOrigen: compuestoDeposito,
                identificador: "chequesTercero",
                eliminarDesencadenate: ["tipoPago"],//Si cambia este atributo se elimina el desencadenate
                destino: "chequesTercero",
                nombre: "Valores en cartera",
                destino: "chequesTercero",
                atributoImputables: {
                    valorFijo: {
                        estado: "Depositado",
                    },
                    funcion: {
                        _id: [buscarIdPorAtributoUnico, "numeroDeCheque"],
                        cuentasBancarias: [elegirDestino, { origen: "cajas", valor: "cajaDestino" }, { origen: "cuentasBancarias", valor: "cuentaDestino" }]
                    },
                    cambioNombre: {
                        fechaDeposito: "fecha",
                    },
                    grabarEnOrigen: { Número: "numerador" },
                    grabarEnOrigenColeccion: { Número: "numeroDeCheque" },
                    grabarEnDestino: { Número: "numerador" },
                },
                grabarEnDestino: { Número: "numeroDeCheque", empresaAtribut: "empresaAtribut" },
                grabarEnOrigenColeccion: { Número: "numeroDeCheque" }, //se pone primer el atributo en el origen segundo en el destino
            },
        },
        pestanas: [P("cliente")],
        pest: `Deposito de cheques`,
        accion: `depositoCheques`,
        multimoneda: false,
        type: "maestra",

    },
    saldosBancos: {
        atributos: {
            names: [
                NS("numerador"),
                FH(),
                P({ nombre: "bancos", clase: "textoCentrado requerido" }),
                P({ nombre: "cuentasBancarias", clase: "textoCentrado requerido" }),
                PM({ nombre: "itemsBancos", clase: "requerido" }),
                P({ nombre: "moneda", clase: "requerido textoCentrado", width: "diez" }),
                N({ nombre: "tipoCambio", clase: "requerido" }),
                I({ nombre: "importe", clase: "requerido textoCentrado" }),
                I({ nombre: "saldoCalculado" }),
                adjunto,
                TA("descripcionCompleto"),],
            titulos: [
                `Num`, `Fecha`, `Bancos`, `Cuentas`, `Item`, `Moneda`, `TC`, `Importe`, `Saldo`, `Adjuntos`, `Descripción`],
            cabeceraAbm: {
                select: [
                    {
                        atributo: P({ nombre: "cuentasBancarias", clase: "textoCentrado doceWidth" }),
                        titulo: "Cuenta"
                    },
                    {
                        atributo: P({ nombre: "moneda", clase: "textoCentrado condicionSaldo diezWidth", valorInicial: "Pesos" }),
                        titulo: "Moneda"
                    },
                ],
                div: [
                    {
                        atributo: I({ nombre: "saldoInicial", clase: "textoCentrado transparente bord" }),
                        titulo: "Saldo inicial"
                    },
                    {
                        atributo: I({ nombre: "saldoFinal", clase: "textoCentrado transparente bord" }),
                        titulo: "Saldo final"
                    },
                ],
            },
            limiteCabecera: true,
            eliminar: true,
            deshabilitar: false,
            sort: { fecha: 1 }
        },
        formInd: {
            inputRenglones: [5, 6, 5, 5],
        },
        funcionesPropias: {
            inicio: {
                cabeceraFiltroAbm: [cabeceraFiltroAbm],
            },
            finalAbm: {
                asignacionSaldosCabecera: [asignacionSaldosCabeceraCC, "saldosBancos", "cuentasBancarias", "saldosBancos"],
                asignacionSaldosCabeceraD: [asignacionSaldosCabeceraCC, "saldosBancosTotal", "cuentasBancarias", "saldosBancosTotal"],
                asignarValorDesdeCabecera: [asignarValorDesdeCabecera],
                atributoSaldoAbm: [atributoSaldoAbm, "saldoCalculado", "importe"],
                filtroAsociativo: [filtroAsociativo, "cuentasBancarias", "bancos", "cuentasBancarias"],
                itemsNegativos: [itemsNegativos, "itemsBancos"]
            },
            formularioIndiv: {
                cabeceraFormIndividual: [cabeceraFormIndividual],
                filtroAsociativo: [filtroAsociativo, "cuentasBancarias", "bancos", "cuentasBancarias"],
                ocultarElementos: [ocultarElementos, ["saldoCalculado"]],
                itemsNegativos: [itemsNegativos, "itemsBancos"]
            },
        },
        key: "numerador",
        pest: `Movimientos Bancos`,
        accion: `saldosBancos`,
        empresa: true,
        multimoneda: true,
        type: "transaccion",
        acumulador: {
            saldosBancos: {
                nombre: "Cuentas bancarias por moneda y fecha",
                atributosSuma: {
                    importe: `importe`,
                    importemb: `importemb`,
                    importema: `importema`,
                },
                atributos: {
                    moneda: "moneda",
                    cuentasBancarias: "cuentasBancarias"
                },
            },
            saldosBancosTotal: {
                nombre: "Cuentas bancarias fecha",
                atributosSuma: {
                    importe: `importe`,
                    importemb: `importemb`,
                    importema: `importema`,
                },
                atributos: {
                    moneda: "moneda",
                },
            },
        }
    },
    itemsBancos: {
        atributos: {
            names: [
                T({ nombre: "name", clase: "requerido" }),
                PPE({ nombre: "tipoItems", clase: "requerido", opciones: ["Ingresos", "Egresos"] }),
                habilitado
            ],
            titulos: [`Nombre`, `Tipo`],
            eliminar: false,
            deshabilitar: true,
        },
        key: `name`,
        pest: `Items Bancos`,
        accion: `itemsBancos`,
        type: "parametrica",
    },
    cotizacionMonedaExtranjera: {
        tablas: {
            cotizacion: {
                atributos: [
                    T({ nombre: "moneda" }),
                    F("fecha"),
                    N("compra"),
                    N("venta")
                ],
                titulos: ["Moneda", "Fecha", "Compra", "Venta"],
                type: "cotizacionMonedaExtranjera",
                datos: "cotizaciones",
                entidad: "cotizacionMonedaExtranjera",
                clases: {
                    table: ["white"]
                },
            },
        },
        cabeceraCont: {
            //  parametrica: [{ atributo: P("moneda"), titulo: "Moneda" }],
            parametricaDef: {
                moneda: {
                    nombre: "moneda",
                    titulo: "Moneda",
                    type: "cabecera",
                    clases: ["function"],
                    select: {
                        opciones: {
                            titulos: [`Dolar`, `Euro`, `Todas`],
                            valores: [`Dolar`, `Euro`, ""]
                        },
                        inicio: {
                            titulo: "Todas",
                            valores: ""
                        }
                    },
                    function: [monedaCotis, []],
                }
            },
            fecha: [Date.now(), -30],

        },
        pest: `Cotizacion Moneda Extranjera`,
        accion: `cotizacionMonedaExtranjera`,

    },
    transferencia: {
        atributos: {
            names: [
                NS("numerador"),
                FH(),
                P({ nombre: "moneda", clase: "requerido", width: "diez" }),
                N({ nombre: "tipoCambio", clase: "requerido" }),
                movimientosInternos,
                I("importeTotal")
            ],
            titulos: ['Numero', `Fecha`, `Moneda`, `Tipo de Cambio`, `movimientosInternos`, `Importe`],
            valorInicial: {
                select: {
                    moneda: `Pesos`,
                },
            },
            eliminar: true,
            deshabilitar: false,
        },
        formInd: {
            inputRenglones: [5, `compuesto`, 1],
        },
        desencadenaColeccion: {
            origen: {
                type: "condicionSegunFuncion",
                funcionCondicion: [desencadenanteSegunAtributo, { atributo: "cajaOrigen", destino: "cajas" }, { atributo: "cuentaOrigen", destino: "cuentas" }],
                identificador: "origen", //este atributo va cuando tiene opciones a fin de crear el atributoId Ref
                coleccionOrigen: movimientosInternos,
                eliminarDesencadenate: ["cajaOrigen", "cuentaOrigen"],//Si cambia este atributo se elimina el desencadenate
                opciones: {
                    cuentas: {
                        destino: "saldosBancos",
                        nombre: "Movimientos Bancarios",
                        atributosColeccion: {
                            cambiarSigno: ["importe", "importema", "importemb"],
                            cambiarAtributos: {
                                cuentasBancarias: "cuentaOrigen"
                            },
                            funcion: {
                                bancos: [buscarAtributosParamentricos, "bancos", P({ nombre: "cuentaOrigen", origen: "cuentasBancarias" })]
                            },
                            valorFijo: {
                                itemsBancos: "Movimientos Internos",
                            },
                            delete: { numerador: "numerador" },
                        },
                        grabarEnOrigen: { Número: "numerador" },
                        grabarEnOrigenColeccion: { Número: "numerador" },
                        grabarEnDestino: { Número: "numerador" },
                    },
                    cajas: {
                        destino: "saldosCajas",
                        nombre: "Movimientos Cajas",
                        atributosColeccion: {
                            cambiarSigno: ["importe", "importema", "importemb"],
                            cambiarAtributos: {
                                cajas: "cajaOrigen"
                            },
                            valorFijo: {
                                itemsCajas: "Movimientos Internos",
                            },
                            delete: { numerador: "numerador" },
                        },
                        grabarEnOrigen: { Número: "numerador" },
                        grabarEnOrigenColeccion: { Número: "numerador" },
                        grabarEnDestino: { Número: "numerador" },
                    },

                },
            },
            destino: {
                type: "condicionSegunFuncion",
                funcionCondicion: [desencadenanteSegunAtributo, { atributo: "cajaDestino", destino: "cajas" }, { atributo: "cuentaDestino", destino: "cuentas" }],
                identificador: "destino", //este atributo va cuando tiene opciones a fin de crear el atributoId Ref
                coleccionOrigen: movimientosInternos,
                eliminarDesencadenate: ["cajaDestino", "cuentaDestino"],//Si cambia este atributo se elimina el desencadenate
                opciones: {
                    cuentas: {
                        destino: "saldosBancos",
                        nombre: "Movimientos Bancarios",
                        atributosColeccion: {
                            cambiarAtributos: {
                                cuentasBancarias: "cuentaDestino"
                            },
                            funcion: {
                                bancos: [buscarAtributosParamentricos, "bancos", P({ nombre: "cuentaDestino", origen: "cuentasBancarias" })]
                            },
                            valorFijo: {
                                itemsBancos: "Movimientos Internos",
                            },
                            delete: { numerador: "numerador" },
                        },
                        grabarEnOrigen: { Número: "numerador" },
                        grabarEnOrigenColeccion: { Número: "numerador" },
                        grabarEnDestino: { Número: "numerador" },
                    },
                    cajas: {
                        destino: "saldosCajas",
                        nombre: "Movimientos Cajas",
                        atributosColeccion: {
                            cambiarAtributos: {
                                cajas: "cajaDestino"
                            },
                            valorFijo: {
                                itemsCajas: "Movimientos Internos",
                            },
                            delete: { numerador: "numerador" },
                        },
                        grabarEnOrigen: { Número: "numerador" },
                        grabarEnOrigenColeccion: { Número: "numerador" },
                        grabarEnDestino: { Número: "numerador" },
                    },

                },
            },
        },
        totalizadores: {
            formulario: {
                type: "totalizadorCabecera",
                total: ["importeTotal"],
                cantidad: false,
                digitosPositivos: ["importe"],
                trigger: ["importe"],
            },
        },
        key: "numerador",
        pest: `Movimientos Internos`,
        accion: `transferencia`,
        multimoneda: true,
        type: "maestra"
    },
    liquidacionMoneda: {
        atributos: {
            names: [
                NS("numerador"),
                FH(),
                P({ nombre: "cajas", clase: "requerido" }),
                P({ nombre: "cuentasBancarias", clase: "requerido" }),
                TA("observaciones"),
                liquidacionMonedas,
            ],
            titulos: ['Numero', `Fecha`, `Cajas`, `Cuentas`, `Observaciones`, `liquidacionMonedas`],
            eliminar: true,
            deshabilitar: false,
        },
        formInd: {
            inputRenglones: [5, `compuesto`, 1],
        },
        funcionesPropias: {
            formularioIndiv: {
                ocultarHermanosFormulario: [ocultarHermanosFormulario, `cajas`, `cuentasBancarias`],
            },
        },
        desencadenaColeccion: {
            origen: {
                type: "condicionSegunFuncion",
                funcionCondicion: [desencadenanteSegunAtributo, { atributo: "cajas", destino: "cajas" }, { atributo: "cuentasBancarias", destino: "cuentas" }],
                identificador: "origen", //este atributo va cuando tiene opciones a fin de crear el atributoId Ref
                coleccionOrigen: liquidacionMonedas,
                eliminarDesencadenate: ["cajas", "cuentaBancarias"],//Si cambia este atributo se elimina el desencadenate
                opciones: {
                    cuentas: {
                        destino: "saldosBancos",
                        nombre: "Movimientos Bancarios",
                        atributosColeccion: {
                            cambiarAtributos: {
                                moneda: "monedaOrigen",
                                tipoCambio: "tipoCambioOrigen",
                            },
                            cambiarAtributosYSigno: {
                                importe: "importeOrigen"
                            },
                            funcion: {
                                bancos: [buscarAtributosParamentricos, "bancos", P({ nombre: "cuentasBancarias", origen: "cuentasBancarias" })]
                            },
                            valorFijo: {
                                itemsBancos: "Liquidacion Monedas",
                            },
                            delete: { numerador: "numerador" },
                        },
                        grabarEnOrigen: { Número: "numerador" },
                        grabarEnOrigenColeccion: { Número: "numerador" },
                        grabarEnDestino: { Número: "numerador" },
                    },
                    cajas: {
                        destino: "saldosCajas",
                        nombre: "Movimientos Cajas",
                        atributosColeccion: {
                            cambiarAtributos: {
                                moneda: "monedaOrigen",
                                tipoCambio: "tipoCambioOrigen",
                            },
                            cambiarAtributosYSigno: {
                                importe: "importeOrigen"
                            },
                            valorFijo: {
                                itemsCajas: "Liquidacion Monedas",
                            },
                            delete: { numerador: "numerador" },
                        },
                        grabarEnOrigen: { Número: "numerador" },
                        grabarEnOrigenColeccion: { Número: "numerador" },
                        grabarEnDestino: { Número: "numerador" },
                    },

                },
            },
            destino: {
                type: "condicionSegunFuncion",
                funcionCondicion: [desencadenanteSegunAtributo, { atributo: "cajas", destino: "cajas" }, { atributo: "cuentasBancarias", destino: "cuentas" }],
                identificador: "destino", //este atributo va cuando tiene opciones a fin de crear el atributoId Ref
                coleccionOrigen: liquidacionMonedas,
                eliminarDesencadenate: ["cajas", "cuentaBancarias"],//Si cambia este atributo se elimina el desencadenate
                opciones: {
                    cuentas: {
                        destino: "saldosBancos",
                        nombre: "Movimientos Bancarios",
                        atributosColeccion: {
                            cambiarAtributos: {
                                moneda: "monedaDestino",
                                importe: "importeDestino",
                                tipoCambio: "tipoCambioDestino",
                            },
                            funcion: {
                                bancos: [buscarAtributosParamentricos, "bancos", P({ nombre: "cuentasBancarias", origen: "cuentasBancarias" })]
                            },
                            valorFijo: {
                                itemsBancos: "Liquidacion Monedas",
                            },
                            delete: { numerador: "numerador" },
                        },
                        grabarEnOrigen: { Número: "numerador" },
                        grabarEnOrigenColeccion: { Número: "numerador" },
                        grabarEnDestino: { Número: "numerador" },
                    },
                    cajas: {
                        destino: "saldosCajas",
                        nombre: "Movimientos Cajas",
                        atributosColeccion: {
                            cambiarAtributos: {
                                moneda: "monedaDestino",
                                importe: "importeDestino",
                                tipoCambio: "tipoCambioDestino",
                            },
                            valorFijo: {
                                itemsCajas: "Liquidacion Monedas",
                            },
                            delete: { numerador: "numerador" },
                        },
                        grabarEnOrigen: { Número: "numerador" },
                        grabarEnOrigenColeccion: { Número: "numerador" },
                        grabarEnDestino: { Número: "numerador" },
                    },

                },
            },
        },
        key: "numerador",
        pest: `Liquidacion Monedas`,
        accion: `liquidacionMoneda`,
        multimoneda: false,
        type: "maestra"
    },
    moneda: {
        atributos: {
            names:
                [T({ nombre: "name", clase: "requerido" }),
                T({ nombre: `abrev`, clase: "textoCentrado" }),
                    habilitado],
            titulos: [`Nombre`, `$`],
            eliminar: false,
            deshabilitar: true,
        },
        key: "name",
        pest: `Moneda`,
        accion: `moneda`,
        type: "parametrica",
        empresa: false,

    },
    tipoPago: {
        atributos: {
            names: [T({ nombre: "name", clase: "requerido" }), CH("admCheque"), CH("admCajas"), CH("admBancos"), habilitado],
            titulos: [`Nombre`, `Inventario`, `Cajas`, `Bancos`],
            eliminar: false,
            deshabilitar: true,
        },
        key: "name",
        pest: `Forma de Pago`,
        accion: `tipoPago`,
        type: "parametrica",
        empresa: false
    },
    bancos: {
        atributos: {
            names: [T({ nombre: "name", clase: "requerido" }), habilitado],
            titulos: [`Nombre`],
            eliminar: false,
            deshabilitar: true,
        },
        key: "name",
        pest: `Bancos`,
        accion: `bancos`,
        type: "parametrica"
    },
    itemsCajas: {
        atributos: {
            names: [
                T({ nombre: "name", clase: "requerido" }),
                PPE({ nombre: "tipoItems", opciones: ["Ingresos", "Egresos"] }),
                habilitado
            ],
            titulos: [`Nombre`, `Tipo`],
            eliminar: false,
            deshabilitar: true,
        },
        key: `name`,
        pest: `Items Cajas`,
        accion: `itemsCajas`,
        type: "parametrica",
    },
    saldosCajas: {
        atributos: {
            names: [
                NS("numerador"),
                FH(),
                P({ nombre: "cajas", clase: "requerido " }),
                PM({ nombre: "itemsCajas", clase: "textoCentrado" }),
                P({ nombre: "moneda", clase: "requerido", width: "diez" }),
                N({ nombre: "tipoCambio", clase: "requerido" }),
                I({ nombre: "importe", clase: "requerido textoCentrado" }),
                I({ nombre: "saldoCalculado" }),
                adjunto,
                TA("descripcionCompleto")],
            titulos: [
                `Num`, `Fecha`, `Cajas`, `Item`, `Moneda`, `TC`, `Importe`, `Saldo`, `Adjuntos`, `Descripción`],
            cabeceraAbm: {
                select: [
                    {
                        atributo: P({ nombre: "cajas", clase: "textoCentrado diezWidth" }),
                        titulo: "Cajas",
                    },
                    {
                        atributo: P({ nombre: "moneda", clase: "textoCentrado condicionSaldo diezWidth", valorInicial: "Pesos" }),
                        titulo: "Moneda"
                    },
                ],
                div: [
                    {
                        atributo: I({ nombre: "saldoInicial", clase: "textoCentrado transparente bord" }),
                        titulo: "Saldo inicial"
                    },
                    {
                        atributo: I({ nombre: "saldoFinal", clase: "textoCentrado transparente bord" }),
                        titulo: "Saldo final"
                    },
                ],

            },
            limiteCabecera: true,
            eliminar: true,
            deshabilitar: false,
            sort: { fecha: 1 }
        },
        funcionesPropias: {
            inicio: {
                cabeceraFiltroAbm: [cabeceraFiltroAbm],
            },
            finalAbm: {
                asignacionSaldosCabecera: [asignacionSaldosCabeceraCC, "saldosCajas", "cajas", "saldosCajas"],
                asignacionSaldosCabeceraD: [asignacionSaldosCabeceraCC, "saldosCajasTotal", "cajas", "saldosCajasTotal"],
                asignarValorDesdeCabeceraE: [asignarValorDesdeCabecera],//Revisar
                atributoSaldoAbm: [atributoSaldoAbm, "saldoCalculado", "importe"],
                itemsNegativos: [itemsNegativos, "itemsCajas"]
            },
            formularioIndiv: {
                cabeceraFormIndividual: [cabeceraFormIndividual],
                ocultarElementos: [ocultarElementos, ["saldoCalculado"]],
                itemsNegativos: [itemsNegativos, "itemsCajas"]
            },
        },
        key: "numerador",
        pest: `Movimientos Cajas`,
        accion: `saldosCajas`,
        multimoneda: true,
        type: "transaccion",
        acumulador: {
            saldosCajas: {
                nombre: "Cajas por moneda y fecha",
                atributosSuma: {
                    importe: `importe`,
                    importemb: `importemb`,
                    importema: `importema`,
                },
                atributos: {
                    moneda: "moneda",
                    cajas: "cajas"
                },
            },
            saldosCajasTotal: {
                nombre: "Cajas fecha",
                atributosSuma: {
                    importe: `importe`,
                    importemb: `importemb`,
                    importema: `importema`,
                },
                atributos: {
                    moneda: "moneda",
                },
            },
        }
    },
    cajas: {
        atributos: {
            names: [T({ nombre: "name", clase: "requerido" }), habilitado],
            titulos: [`Nombre`],
            eliminar: false,
            deshabilitar: true,
        },

        key: "name",
        pest: `Cajas`,
        accion: `cajas`,
        type: "parametrica"
    },
    cuentasBancarias: {
        atributos: {
            names: [
                T({ nombre: `name`, width: "veinte", clase: "requerido" }),
                T({ nombre: `texto`, width: "quince", clase: "requerido" }),
                T({ nombre: `textoDos`, width: "veinte", clase: "requerido" }),
                T({ nombre: `textoTres`, width: "veinte", clase: "requerido" }),
                T({ nombre: `textoCuatro`, width: "quince" }),
                P({ nombre: "bancos", clase: "requerido" }),
                habilitado],

            titulos: [`Nombre`, `Cuentas`, `CBU`, `Alias`, `Sucursal`, `Bancos`],
            eliminar: false,
            deshabilitar: true,
        },
        validaciones: ["bancos"],
        key: "nombre",
        pest: `Cuentas Bancarias`,
        accion: `cuentasBancarias`,
        type: "parametrica"
    },
    impuestoDefinicion: {
        atributos: {
            names: [P("agrupadorImpuesto"), T({ nombre: `name`, clase: "primeraMayusOracion", width: "veinte", validacion: "textoMayuscula" }), N(`tasa`), habilitado],
            titulos: [`Tipo Impuesto`, `Nombre`, `Tasa %`],
            eliminar: false,
            deshabilitar: true,
        },
        validaciones: ["agrupadorImpuesto", "name", "tasa"],
        pest: `Tipo impuesto`,
        accion: `impuestoDefinicion`,
        type: "parametrica",
    },
    agrupadorImpuesto: {
        atributos: {
            names: [T({ nombre: `name`, clase: "primeraMayusOracion", width: "veinte", validacion: "textoMayuscula" }), habilitado],
            titulos: [`Nombre`],
            eliminar: false,
            deshabilitar: true,
        },
        validaciones: ["name"],
        pest: `Agrupador Impuesto`,
        accion: `agrupadorImpuesto`,
        type: "parametrica"
    },
}