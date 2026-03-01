let variablesModeloLogistica = {
    cotizacionesLogistica: {
        atributos: {
            names: [
                NS("numerador"),
                P("cliente"),
                FH(),
                P("tipoOperacion"),
                P("tipoTransporte"),
                P({ nombre: "tipoCarga", width: "siete" }),
                P({ nombre: "ciudad", ocultCond: [{ atributo: "logico", valor: "true" }] }),
                LA("transbordo"),
                P({ nombre: "destinoSbc", origen: "ciudad", ocultCond: [{ atributo: "logico", valor: "true" }] }),
                P("incoterm"),
                PPE({ nombre: "seguro", opciones: ["SI", "NO TOMA", "PENDIENTE", "RECLAMADO"] }),
                caractProd, detalleFlete, cotizacionLogistica,
                IMD("importeDolares"), IME("importeEuro"), adjunto,
                T({ nombre: "estado", clase: "textoCentrado transparente soloLectura", valorInicial: "Ingresado" }),
                TF(`observacionesCompleto`)],
            titulos: [`Num`, `Cliente`, `Fecha`, `Operacion`, `Transporte`, `Carga`, `Origen`, `Transbordo`, `Destino`, `Incoterm`, `Seguro`, `caractProd`, `detalleFlete`, `cotizacionLogistica`, `Total USD`, `Total EUR`, `Adjuntos`, `Estado`, `Observaciones`],
            limiteCabecera: true,
            cabeceraAbm: {
                select: [
                    {
                        atributo: PPE({ nombre: "estado", opciones: ["Ingresadas", "Aprobadas", "Rechazadas"], clase: "recrear doceWidth" }),
                        titulo: "Estado",
                    }],
                ocultaFecha: "Ingresadas",
                valorInicial: {
                    estado: "Ingresadas"
                }
            },
            eliminar: true,
            deshabilitar: false,
        },
        formInd: {
            titulos: [`Num`, `Cliente`, `Fecha`, `Operacion`, `Transporte`, `Carga`, `Origen`, `Transbordo`, `Destino`, `Incoterm`, `Seguro`, "cotizacionLogistica", `detalleFlete`, `caractProd`, `Total USD`, `Total EUR`, `Adjuntos`, `Estado`, `Obsrevaciones`],//3
            inputRenglones: [5, 6, `compuesto`, 4, 3],
            impresion: {
                titulo: "Cotización",
                alargar: true,
                bloques: {
                    cabeceraRenglon: {
                        clases: "full borderNone",
                        componentes: {
                            0: {
                                type: [cabeceraDelgadaLogo, ["Cotizacion", "/img/logoComp.png", { tamanoImg: "seisRem" }]],

                            },
                        }
                    },
                    fecha: {
                        clases: "full margin-bot-uno margin-top-uno",
                        componentes: {
                            0: {
                                type: [numFecha, ["N°", { numero: ["numerador"], fecha: F() }, { date: "fechaStandarImpresion fsUno", numero: "numeroStandarImpresion fsTrece" }]],
                            },
                        }
                    },
                    segundaLinea: {
                        clases: "full notMargin",
                        componentes: {
                            0: {
                                type: [infoReferencia, ["cliente", ["name"], ["SEÑOR(ES)"], { titulo: "bold fsUno", info: "mayuscula fsUno" }]],
                                class: `flex column`

                            },
                        }
                    },
                    terceraLinea: {
                        clases: "full notMargin",
                        componentes: {
                            0: {
                                type: [infoReferenciaColec, ["cliente", ["calle", "numero", P({ nombre: "ciudadDir", origen: "ciudad" })], "DIRECCION", { titulo: "bold fsUno", info: "fsUno" }]],
                                class: `flex`
                            },
                        }
                    },
                    cuartaLinea: {
                        clases: "full margin-bot-uno",
                        componentes: {
                            0: {
                                type: [infoReferencia, [P("cliente"), ["documento"], ["DOCUMENTO"], { titulo: "bold fsUno", info: "fsUno" }]],
                                class: `izquierda`
                            },
                        }
                    },
                    quintaLinea: {
                        clases: "full",
                        componentes: {
                            0: {
                                type: [refOperacionLogisticaPrim, []],
                                class: `bold`,
                            },
                        }
                    },
                    sextoRenglon: {
                        clases: "mediaCol flex margin-bot-uno",
                        componentes: {
                            0: {
                                type: [refOperacionLogisticaSeg, []],
                                class: `widthCuarentaPorc`,
                            },
                        }
                    },
                    sepRen: {
                        clases: "mediaCol flex",
                        componentes: {
                            0: {
                                type: [origenImp, []],
                                class: `widthCuarentaPorc`
                            },
                            1: {
                                type: [destinoImp, []],
                            },
                        }
                    },
                    seguro: {
                        clases: "full",
                        componentes: {
                            0: {
                                type: [seguroDescripcionImpresion, []],
                                class: ``
                            },
                        }
                    },
                    octRen: {
                        clases: "full margin-top-uno alargar",
                        componentes: {
                            0: {

                                type: [itemsComprobantesDiv, [[
                                    N({ nombre: "cantidadCotizacion", clase: "textoCentrado centroVertical", width: "cinco" }),
                                    P({ nombre: "unidadesMedida", clase: "centroVertical", width: "diez" }),
                                    P({ nombre: "itemVenta", clase: "centroVertical", width: "quince" }),
                                    P({ nombre: "monedaComp", clase: "textoCentrado centroVertical monedaTabla", origen: "moneda", width: "siete" }),
                                    I({ nombre: "importeSeisCotizacion", clase: "textoCentrado centroVertical", width: "cinco" })],
                                    cotizacionLogistica, { filas: "renglonMarcado", titulo: "mayuscula fsUno textoCentrado", celda: "fsUno padding-top-med padding-bot-med mayusculaPrimerLetra" }]]

                            }
                        }
                    },
                    novRen: {
                        clases: "full flex end",
                        componentes: {
                            0: {
                                type: [totalitemsporMon, [{
                                    moneda: "monedaComp", atributos: [{ atr: "importeSeisCotizacion", titulo: "Bruto" }, { atr: "importeSieteCotizacion", titulo: "IVA" }, { atr: "importeOchoCotizacion", titulo: "Neto" }]
                                }, { celda: "fsDoce", titulo: "nowrap bold fsDoce" }]],
                                class: `totalTable`
                            },
                        }
                    },
                    decRen: {
                        clases: "full flex end padding-bot-uno",
                        componentes: {
                            0: {
                                type: [numeroALetrasImporteSegunMoneda, [P("importeOchoCotizacion"), "fsOnce"]],
                                class: "RobotoItalic darkGreyColor"
                            },
                        },
                    },
                    decPrimRen: {
                        clases: "full margin-top-dos",
                        componentes: {
                            0: {
                                class: `textoSecundario`,
                                type: [returnUnAtributo, [TA("observacionesCompleto")]]
                            }
                        }
                    },

                },
                funciones: {
                    ocultarTotalesYFilasVacios: [ocultarTotalesYFilasVacios]
                }
            },
        },
        funcionesPropias: {
            inicio: {
                cabeceraFiltroAbm: [cabeceraFiltroAbm]
            },
            formularioIndiv: {
                tipoFlete: [tipoFlete],
                destinosOper: [destinosOper],
                opcionesTransp: [opcionesTransp],
                ocultoSiempre: [ocultoSiempre, ["facturado", "certificado"]],
                anularCalculoManual: [anularCalculoManual, "cantidadCincoCaractProd"],
                ocultarElementosColeccion: [ocultarElementosColeccion, ["proveedor"]]
            },
        },
        totalizadores: {
            importeBase: {
                type: "totalizadorCabecera",
                total: ["importeDolares"],
                digitosPositivos: ["totalDolaresimporteOchoCotizacion"],
                trigger: ["totalDolaresimporteOchoCotizacion"]
            },
            importeBaseEuro: {
                type: "totalizadorCabecera",
                total: ["importeEuro"],
                digitosPositivos: ["totalEurosimporteOchoCotizacion"],
                trigger: ["totalEurosimporteOchoCotizacion"]
            }
        },
        emailAtributo: "cliente",
        pestanas: [P("agrupadorImpuesto"), P("impuestoDefinicion")],
        filtros: {
            estado: [filtrosSbcOperacionesCotis, "estado"]
        },
        validaciones: ["cliente", "tipoCarga", "fecha", "tipoOperacion", "tipoTransporte", "ciudad", "destinoSbc"],
        key: "numerador",
        pest: `Cotizaciones`,
        pestIndividual: `Ingreso Cotizaciones`,
        accion: `cotizacionesLogistica`,
        type: "maestra"
    },
    operacionesLogistica: {
        atributos: {
            names: [
                NS("numerador"),
                FH(),
                P("cliente"),
                T(`textoOcho`),//Shipper
                P({ nombre: "tipoOperacion", width: "quince" }),
                P({ nombre: "tipoTransporte", width: "diez" }),
                P({ nombre: "tipoTransporteDos", origen: "tipoTransporte", oculto: "oculto" }),
                P({ nombre: "tipoCarga", width: "siete" }),
                P({ nombre: "ciudad", ocultCond: [{ atributo: "logico", valor: "true" }] }),
                P({ nombre: "destinoSbc", origen: "ciudad", ocultCond: [{ atributo: "logico", valor: "true" }] }),
                LAP("agenteComex"),
                P("incoterm"),
                P({ nombre: "recepcion", origen: "ciudad", oculto: "oculto" }),
                P("despachante"),
                //////////////////////////////////////////
                LA({ nombre: "listaDesplegableTexto", clase: "absolute" }),
                T("MBLMAWB"),
                P("maritima"),
                T("textoTres"),//Transporte de embarque
                F(`fechaDos`),//Fecha de embarque
                LA("transbordo"),
                LA({ nombre: "atrriboTransbordo", clase: "textoCentrado", subType: "date", width: "doce" }),
                LA({ nombre: "salidaTransbordo", clase: "textoCentrado", subType: "date", width: "doce" }),
                T(`textoCuatro`),//Transporte de arribo
                F("fechaTres"),//Fecha de arribo
                PPE({ nombre: "seguro", valorInicial: "PENDIENTE", opciones: ["SI", "NO TOMA", "PENDIENTE", "RECLAMADO", "PEND DOC", "ANULADO",] }),
                T({ nombre: `diasLibres`, clase: "textoCentrado", width: "siete" }),
                caractProd, detalleFlete, cotizacionLogistica,
                IMD("importeDolares"),
                IME("importeEuro"),
                T({ nombre: "estado", clase: "textoCentrado soloLectura transparente", valorInicial: "Estimado" }),
                T({ nombre: "textoDos", clase: "textoCentrado soloLectura transparente", valorInicial: "Estimada" }),
                T({ nombre: "textoSiete", clase: "textoCentrado soloLectura transparente", valorInicial: "Estimado" }),
                adjunto,
                TF(`observacionesCompleto`),
                N({ nombre: "transitTime", oculto: "oculto" }),
                F({ nombre: "firstArribal", oculto: "oculto" }),
                N({ nombre: "delay", oculto: "oculto" }),
                T({ nombre: "textoCinco", clase: "textoCentrado soloLectura", oculto: "oculto", valorInicial: "ingresado" })],
            titulos: [`Num`, `Fecha`, `Cliente`, "Shipper", `Operacion`, `Transporte`, "Transporte Comp", `Carga`, `Origen`, `Destino`, `Agente`, `Incoterm`, "Recepción", `Despachante`, `Documentos`, "MBL/MAWB", `Maritima`, `Transporte embarque`, "Embarque", `Lugar Transbordo`, "Arribo Transbordo", "Salida Transbordo", `Transporte Arribo`, "Arribo", "Seguro", `Días libres`, `caractProd`, `detalleFlete`, `cotizacionLogistica`, `Total USD`, `Total EUR`, `Embarque`, `Tarifa`, "Arribo", `Adjuntos`, `Observaciones`, "Transit Time", "firstArribal", "delay", "textoCinco"],
            limiteCabecera: true,
            cabeceraAbm: {
                select: [
                    {
                        atributo: PPE({ nombre: "estado", opciones: ["Abiertas", "Cerradas"], clase: "recrear doceWidth" }),
                        titulo: "Estado",
                    }],
                ocultaFecha: "Abiertas",
                valorInicial: {
                    estado: "Abiertas"
                }
            },
            eliminar: true,
            deshabilitar: false,
        },
        formInd: {
            inputRenglones: [5, 6, 5, `compuesto`, 6, 3],
            impresion: {
                titulo: "Operacion",
                alargar: true,
                bloques: {
                    cabeceraRenglon: {
                        clases: "full borderNone",
                        componentes: {
                            0: {
                                type: [cabeceraDelgadaLogo, ["Operacion", "/img/logoComp.png", { tamanoImg: "seisRem" }]],

                            },
                        }
                    },
                    primerRenglon: {
                        clases: "full margin-bot-uno margin-top-uno",
                        componentes: {
                            0: {
                                type: [numFecha, ["N°", { numero: ["numerador", "ancla"], fecha: F() }, { date: "fechaStandarImpresion fsUno", numero: "numeroStandarImpresion fsTrece" }]],
                                class: `flex column`
                            },

                        }
                    },
                    segundoRenglon: {
                        clases: "full notMargin",
                        componentes: {
                            0: {
                                type: [infoReferencia, ["cliente", ["name"], ["SEÑOR(ES)"], { titulo: "bold fsUno", info: "mayuscula fsUno" }]],
                                class: `flex column`

                            },
                        }
                    },
                    terceraRenglon: {
                        clases: "full notMargin",
                        componentes: {
                            0: {
                                type: [infoReferenciaColec, ["cliente", ["calle", "numero", P({ nombre: "ciudadDir", origen: "ciudad" })], "DIRECCION", { titulo: "bold fsUno", info: "fsUno" }]],
                                class: `flex`
                            },
                        }
                    },
                    cuartoRenglon: {
                        clases: "full margin-bot-uno",
                        componentes: {
                            0: {
                                type: [infoReferencia, [P("cliente"), ["documento"], ["DOCUMENTO"], { titulo: "bold fsUno", info: "fsUno" }]],
                                class: `izquierda`
                            },
                        }
                    },
                    quintoRenglon: {
                        clases: "full",
                        componentes: {
                            0: {
                                type: [refOperacionLogisticaPrim, []],
                                class: `bold`,
                            },
                        }
                    },
                    sextoRenglon: {
                        clases: "mediaCol flex margin-bot-uno",
                        componentes: {
                            0: {
                                type: [refOperacionLogisticaSeg, []],
                                class: `widthCuarentaPorc`,
                            },
                            1: {
                                type: [returnUnAtributoTituloArray, [{ nombre: "listaDesplegableTexto", titulo: "DOCUMENTO" }, { titulo: "fsUno bold", info: "fsUno" }]],

                            },
                        }
                    },
                    sepRen: {
                        clases: "mediaCol flex",
                        componentes: {
                            0: {
                                type: [origenImp, []],
                                class: `widthCuarentaPorc`
                            },
                            1: {
                                type: [destinoImp, []],
                            },
                        }
                    },
                    salida: {
                        clases: "mediaCol flex",
                        componentes: {
                            0: {
                                type: [returnUnAtributoFechaTitulo, [{ titulo: "SALIDA", atributo: "fechaDos" }, { titulo: "fsUno bold", info: "fsUno" }]],
                                class: `widthCuarentaPorc unRenglon notMargin`
                            },
                            1: {
                                type: [returnUnAtributoFechaTitulo, [{ titulo: "ARRIBO", atributo: "fechaTres" }, { titulo: "fsUno bold", info: "fsUno" }]],
                                class: `unRenglon`
                            },
                        }
                    },
                    octRen: {
                        clases: "full margin-top-uno alargar",
                        componentes: {
                            0: {

                                type: [itemsComprobantesDiv, [[
                                    N({ nombre: "cantidadCotizacion", clase: "textoCentrado centroVertical", width: "tres" }),
                                    P({ nombre: "unidadesMedida", clase: "centroVertical", width: "diez" }),
                                    P({ nombre: "itemVenta", clase: "centroVertical", width: "quince" }),
                                    P({ nombre: "monedaComp", clase: "textoCentrado centroVertical monedaTabla", origen: "moneda", width: "siete" }),
                                    I({ nombre: "importeSeisCotizacion", clase: "textoCentrado centroVertical", width: "cinco" })],
                                    cotizacionLogistica, { filas: "renglonMarcado", titulo: "mayuscula fsUno", celda: "fsUno padding-top-med padding-bot-med mayusculaPrimerLetra" }]]

                            }
                        }
                    },
                    novRen: {
                        clases: "full flex end",
                        componentes: {
                            0: {
                                type: [totalitemsporMon, [{
                                    moneda: "monedaComp", atributos: [{ atr: "importeSeisCotizacion", titulo: "Bruto" }, { atr: "importeSieteCotizacion", titulo: "IVA" }, { atr: "importeOchoCotizacion", titulo: "Neto" }]
                                }, { celda: "fsDoce", titulo: "nowrap bold fsDoce" }]],
                                class: `totalTable`
                            },
                        }
                    },
                    decRen: {
                        clases: "full flex end padding-bot-uno",
                        componentes: {
                            0: {
                                type: [numeroALetrasImporteSegunMoneda, [P("importeOchoCotizacion"), "fsOnce"]],
                                class: "RobotoItalic darkGreyColor"
                            },
                        },
                    },
                    decPrimRen: {
                        clases: "full margin-top-dos",
                        componentes: {
                            0: {
                                class: `textoSecundario`,
                                type: [returnUnAtributo, [TA("observacionesCompleto")]]
                            }
                        }
                    },

                },
                funciones: {
                    ocultarTotalesYFilasVacios: [ocultarTotalesYFilasVacios],
                    paddingDocumento: [paddingDocumento],
                }
            },
        },
        funcionesPropias: {
            inicio: {
                cabeceraFiltroAbm: [cabeceraFiltroAbm],
            },
            formularioIndiv: {
                tipoFlete: [tipoFlete],
                opcionesTransp: [opcionesTransp],
                destinosOper: [destinosOper],
                insertarColeccionesGemelas: [insertarColeccionesGemelas, "cotizacionLogistica", "listaDesplegableTexto"],
                chequearOcultoValor: [chequearOcultoValor, "tipoCarga", "FCL", "diasLibres"],
                valorInicialCertificado: [valorInicialCertificado],
                anularCalculoManual: [anularCalculoManual, "cantidadCincoCaractProd"],
                calculoTimeTransit: [calculoTimeTransit],
                calculoDelay: [calculoDelay],
                agregarClase: [agregarClase, ".renglon.3", "borderTopDos margin-top-uno padding-top-uno"],
                incotermAtributoExtra: [incotermAtributoExtra],
                multiModal: [multiModal]
            },
        },
        totalizadores: {
            importeBase: {
                type: "totalizadorCabecera",
                total: ["importeDolares"],
                digitosPositivos: ["totalDolaresimporteOchoCotizacion"],
                trigger: ["totalDolaresimporteOchoCotizacion"]
            },
            importeBaseEuro: {
                type: "totalizadorCabecera",
                total: ["importeEuro"],
                digitosPositivos: ["totalEurosimporteOchoCotizacion"],
                trigger: ["totalEurosimporteOchoCotizacion"]
            }
        },
        enviar: {
            subject: "Reporte de Operación",
            emailAtributo: ["cliente"],
        },
        desencadenante: {
            seguro: {
                identificador: "segurosComex",
                type: "condicionSegunFuncion",
                funcionCondicion: [alMenosUnValor, ["seguro", "SI", "PENDIENTE", "PEND DOC", "RECLAMDO"]],
                opciones: {
                    0: {
                        destino: "segurosComex",
                        nombre: "Seguros Cliente",
                        atributos: {
                            cambiarAtributos: {
                                embarque: "fechaDos",
                                origenRegistro: "numerador",
                                documento: "listaDesplegableTexto",
                            },
                            funcion: {
                                moneda: [monedaImporteSeguro, "moneda"],
                                importeFacturar: [monedaImporteSeguro, "importe"],
                                importeAsegurar: [monedaImporteSeguro, "importeAsegurar"],

                            },
                            delete: {

                                numerador: "numerador"
                            },
                        },
                        grabarEnOrigen: { Número: "numerador" },
                        grabarEnDestino: { Número: "numerador" }
                    }
                }
            }
        },
        desencadenaColeccionAgrupado: {
            gastosAgente: {
                nombre: "Gastos Agentes",//este es en la referencia
                identificador: "gastosAgente",//con este se generan los idcol
                atributosMain: ["proveedor", "monedaComp"],
                coleccionOrigen: cotizacionLogistica,//ESto automatiza id Col
                atributosIndice: {
                    suma: {
                        importe: "importeCuatroCotizacion"
                    }
                },//Aca cuando va el indice donde eta la moneda en la colección
                atributosFusion: {
                    cambiarAtributos: {
                        moneda: "monedaComp",
                        origenRegistro: "numerador",
                        arribo: "fechaTres",
                        documento: "listaDesplegableTexto"
                    },
                    delete: {
                        numerador: "numerador",
                        estado: "estado"
                    },
                },
                destino: "gastosAgentes",
                nombre: "Gastos Agentes",
                funcionesFusion: {
                    importe: [redondearImporteMayorDesen, "importe"]
                },
                grabarEnOrigenColeccion: { Número: "numerador" },
                //se pone primer el atributo en el origen segundo en el destino
                grabarEnDestino: { Número: "numerador" },

            },
        },
        filtros: {
            textoSiete: [filtrosSbcOperaciones, "estado"]
        },
        validaciones: ["cliente", "tipoCarga", "fecha", "tipoOperacion", "tipoTransporte", "ciudad", "destinoSbc"],
        pestanas: [P("agrupadorImpuesto"), P("impuestoDefinicion"), P("agenteComex")],
        key: "numerador",
        pest: `Operaciones`,
        pestIndividual: `Ingresar Operaciones`,
        accion: `operacionesLogistica`,
        type: "maestra",
    },
    certificadosLogistica: {
        atributos: {
            names: [NS("numerador"),
            FH(),
            T("texto"),
            TF({ nombre: "observacionesCompleto", clase: "ajustable" }),
            LA({ nombre: "listaDesplegableTexto", width: "treinta" }),
            TF({ nombre: "observacionesRectanculo", clase: "ajustable" })],
            titulos: [`Número`, `Fecha`, "Documento", `Cabecera`, `Referencia`, `Firma`],
            limiteCabecera: true,
            editar: false,
            eliminar: true,
            deshabilitar: false
        },
        formInd: {
            inputRenglones: [3, 1, 1, 1],
            alargar: true,
            impresion: {
                titulo: "Certificación",
                bloques: {
                    cabeceraRenglon: {
                        clases: "full",
                        componentes: {
                            0: {
                                type: [cabeceraDelgadaLogo, ["Certificacion", "/img/logoComp.png", { tamanoImg: "seisRem" }]],

                            },
                        }
                    },
                    fecha: {
                        clases: "full margin-bot-uno margin-top-uno",
                        componentes: {
                            0: {
                                type: [numFecha, ["N°", { numero: ["numerador"], fecha: F() }, { date: "fsUno", numero: "numeroStandarImpresion fsTrece" }]],
                            },
                        }
                    },
                    segundoRenglon: {
                        clases: "full margin-bot-uno margin-top-uno",
                        componentes: {
                            0: {
                                type: [returnUnAtributoTitulo, [{ titulo: "Documento", nombre: "texto" }, { titulo: "fsUno bold", info: "fsUno" }]],
                                class: `paddingTres`
                            },
                        }
                    },
                    tercerRenglon: {
                        clases: "full margin-bot-uno margin-top-uno",
                        componentes: {
                            0: {
                                type: [returnUnAtributo, [TF({ nombre: "observacionesCompleto", clase: "ajustable" }), "fsUno"]],
                                class: "justificado "
                            },
                        }
                    },
                    cuartoRenglon: {
                        clases: "full margin-bot-uno margin-top-uno",
                        componentes: {
                            0: {
                                type: [enumeracionItems, [LA("listaDesplegableTexto"), { info: "fsUno", titulo: "fsUno bold" }]],
                                class: "left paddingBotTopDos margin-left-tres"
                            },
                        }
                    },
                    ultimoRenglon: {
                        clases: "full paddingBotUno",
                        componentes: {
                            0: {
                                type: [returnUnAtributo, [TF({ nombre: "observacionesRectanculo", clase: "ajustable" }), "fsUno"]],
                                class: "left"
                            },
                        }
                    },
                    pieRenglon: {
                        clases: "notMargin",
                        componentes: {
                            0: {
                                type: [cabeceraDelgadaLogo, []],
                            },
                        }
                    },
                }
            },
        },
        funcionesPropias: {
            formularioIndiv: {
                removerOcultoBoton: [removerOcultoBoton, "deleteBoton"],
                despleglarListaInicio: [despleglarListaInicio],
            },
        },
        enviar: {
            subject: "Reporte de Certificados SBC Logistica",
            emailAtributo: ["cliente"],
        },
        key: `numerador`,
        pest: `Certificados`,
        pestIndividual: `Certificados`,
        accion: `certificadosLogistica`,
        type: "transaccional",
    },
    tipoOperacion: {
        atributos: {
            names: [T({ nombre: "name", clase: "requerido" }), habilitado],
            titulos: [`Operacion`],
            eliminar: false,
            deshabilitar: true,
        },
        key: {
            atributo: T({ nombre: "name", clase: "requerido" }),
            nombre: `nombre`,
        },
        pest: `Tipo Operacion`,
        accion: `tipoOperacion`,
        type: "parametrica"
    },
    tipoTransporte: {
        atributos: {
            names: [T({ nombre: "name", clase: "requerido" }), habilitado],
            titulos: [`Transporte`],
            eliminar: false,
            deshabilitar: true,
        },

        key: {
            atributo: T({ nombre: "name", clase: "requerido" }),
            nombre: `nombre`,
        },
        pest: `Tipo de Transoprte`,
        accion: `tipoTransporte`,
        type: "parametrica"
    },
    tipoContenedor: {
        atributos: {
            names: [T({ nombre: "name", width: "quince", clase: "requerido" }), habilitado],
            titulos: [`Unidad`],
            eliminar: false,
            deshabilitar: true,
        },
        pest: `Tipo de contenedor`,
        accion: `tipoContenedor`,
        type: "parametrica"
    },
    tamanoContenedor: {
        atributos: {
            names: [T({ nombre: "name", width: "cinco", clase: "requerido textoCentrado" }), habilitado],
            titulos: [`Tamaño`],
            eliminar: false,
            deshabilitar: true,
        },
        pest: `Tamaño de contenedor`,
        accion: `tamanoContenedor`,
        type: "parametrica"
    },
    tipoCarga: {
        atributos: {
            names: [T({ nombre: "name", clase: "requerido" }), habilitado],
            titulos: [`Tipo`],
            eliminar: false,
            deshabilitar: true,
        },
        pest: `Tipo de Carga`,
        accion: `tipoCarga`,
        type: "parametrica"
    },
    despachante: {
        atributos: {
            names: [NS("numerador"),
            T({ nombre: `name`, with: "quince" }),
            T({ nombre: `documento`, clase: `formatoNumeroDni` }),
            PPE({ nombre: "condicionImpositiva", opciones: ["Responsable Inscripto", "Monotributo", "Consumidor Final", "Exento"] }),
            P("ciudad"),
            TA("observaciones"),
                contacto, direcciones, habilitado],
            titulos: ['Numero', 'Nombre ', `DNI/CUIT`, `Condición Impositiva`, `Ciudad`, `Observaciones`, `contacto`, "direcciones"],
            clases: {
                telefono: ["textoCentrado"],
                documento: ["textoCentrado", "formatoNumeroDni"],
                num: ["textoCentrado"],
                name: ["primeraMayusOracion"]
            },
            eliminar: false,
            deshabilitar: true
        },
        formInd: {
            inputRenglones: [4, 2, `compuesto`, 2],
        },
        funcionesPropias: {
            formularioIndiv: {
                entidadesEmailFuncion: [entidadesEmailFuncion],
            },
        },
        validaciones: ["name"],
        pest: `Despachantes`,
        accion: `despachante`,
        type: "parametrica",
    },
    agenteComex: {
        atributos: {
            names: [NS("numerador"),
            T({ nombre: `name`, with: "quince" }),
            T({ nombre: `documento`, clase: `formatoNumeroDni` }),
            PPE({ nombre: "condicionImpositiva", opciones: ["Responsable Inscripto", "Monotributo", "Consumidor Final", "Exento"] }),
            P("ciudad"),
            TA("observaciones"),
                contacto, direcciones, habilitado],
            titulos: ['Numero', 'Nombre ', `DNI/CUIT`, `Condición Impositiva`, `Ciudad`, `Observaciones`, `contacto`, "direcciones"],
            clases: {
                telefono: ["textoCentrado"],
                documento: ["textoCentrado", "formatoNumeroDni"],
                num: ["textoCentrado"],
                name: ["primeraMayusOracion"]
            },
            eliminar: false,
            deshabilitar: true
        },
        formInd: {
            inputRenglones: [4, 2, `compuesto`, 2],
        },
        validaciones: ["name"],
        pest: `Agente`,
        accion: `agenteComex`,
        type: "parametrica",
    },
    maritima: {
        atributos: {
            names: [NS("numerador"),
            T({ nombre: `name`, with: "quince" }),
            T({ nombre: `documento`, clase: `formatoNumeroDni` }),
            PPE({ nombre: "condicionImpositiva", opciones: ["Responsable Inscripto", "Monotributo", "Consumidor Final", "Exento"] }),
            P("ciudad"),
            TA("observaciones"),
                contacto, direcciones, habilitado],
            titulos: ['Numero', 'Nombre ', `DNI/CUIT`, `Condición Impositiva`, `Ciudad`, `Observaciones`, `contacto`, "direcciones"],
            clases: {
                telefono: ["textoCentrado"],
                documento: ["textoCentrado", "formatoNumeroDni"],
                num: ["textoCentrado"],
                name: ["primeraMayusOracion"]
            },
            eliminar: false,
            deshabilitar: true
        },
        formInd: {
            inputRenglones: [4, 2, `compuesto`, 2],
        },
        validaciones: ["name"],
        pest: `Maritima`,
        accion: `maritima`,
        type: "parametrica",
    },
    incoterm: {
        atributos: {
            names: [T({ nombre: "name", clase: "requerido" }), habilitado],
            titulos: [`Tipo`],
            eliminar: false,
            deshabilitar: true,
        },
        pest: `Incoterm`,
        accion: `incoterm`,
        type: "parametrica"
    },
    segurosComex: {
        atributos: {
            names: [
                NS("numerador"),
                T({ nombre: "origenRegistro", width: "siete" }),//Nunca usar solo origen, rompe desencadenante
                T("referenciaCliente"),
                P("cliente"),
                F("fecha"),
                F(`embarque`),
                F("toma"),
                P("incoterm"),
                P("moneda"),
                I("importeAsegurar"),
                N("tc"),
                I("importe"),
                I("importeFacturar"),
                T("documento"),
                T("MBLMAWB")],
            titulos: ["Numero", "Origen", "Referencia", "Cliente", "Fecha", "Embarque", "Toma", "Incoterm", "Moneda", "Monto Asegurar", "TC", "Importe Usd", "Facturar", "Documento", "MBL/MAWB"],
            deshabilitar: false
        },
        funcionesPropias: {
            formularioIndiv: {
                modificarDesencadenado: [modificarDesencadenado, ["tc", "referenciaCliente", "toma", "importe"]],
                completarToma: [completarToma]
                //tc: [calcularTipoCambioSeguro],
                //importe: [importeUsd]

            },
        },
        pest: `Seguros`,
        accion: `segurosComex`,
    },
    gastosAgentes: {
        atributos: {
            names: [
                NS("numerador"),
                T({ nombre: "origenRegistro", width: "siete" }),//Nunca usar solo origen, rompe desencadenante
                F("fecha"),
                P("proveedor"),
                LA("documento"),
                T("MBLMAWB"),
                F("arribo"),
                P("moneda"),
                I("importe"),
                T("estado"),
                F("pago")],
            titulos: ["Numerador", "Origen", "Fecha", "Prvoeedor", "Documento", "MBL/MAWB", "Arribo", "Moneda", "Importe", "Estado", "Pago"],
            cabeceraAbm: {
                select: [
                    {
                        atributo: PPE({ nombre: "estado", opciones: ["Abiertas", "Cerradas"], clase: "recrear doceWidth" }),
                        titulo: "Estado",
                    }],
                ocultaFecha: "Abiertas",
                valorInicial: {
                    estado: "Abiertas"
                }
            },
            deshabilitar: false,
            crear: false
        },
        funcionesPropias: {
            inicio: {
                cabeceraFiltroAbm: [cabeceraFiltroAbm],
            },
            formularioIndiv: {
                ocultoFormInd: [ocultoFormInd, "origenRegistro"],
                modificarDesencadenado: [modificarDesencadenado, ["estado", "pago"]],
            }
        },
        filtrosComp: {
            filtrosLengthUno: [filtrosLengthUno, "estado", { abierto: "or", cerrado: "nor" }],
        },
        pest: `Gastos Agentes`,
        accion: `gastosAgentes`,
    }
}
let variablesModeloLogisticaTransformar = {
    cotPendientes: {
        pest: `Aprobar Cotizaciones`,
        pestIndividual: `Aprobar Cotizaciones`,
        accion: `cotizacionesLogistica`,
        child: {
            operacionesLogistica: {
                destino: "operacionesLogistica",
                identificador: "cotizacionChildOperacion",
                nombre: "Operaciones Logistica",
                entidadOrigen: `Cotizaciones`,
                atributos: {
                    valorFijo: {
                        listaDesplegableTexto: "",
                        estado: "Estimado",
                        textoDos: "Estimada",
                        textoSiete: "Estimado",
                        textoCinco: "Ingresado",
                    },
                    funcion: {
                        texto: [obtenerAnoDosDigitos],
                        fecha: [fechaInicialHoyDesencadenante],
                    },
                },
                grabarEnOrigen: { Número: "numerador" },
                grabarEnDestino: { Número: "numerador" },
            }
        },
        type: "aprobar",
        fechaRegistros: addDay(Date.now(), -10, 0, 0, `y-m-d`),
        filtros: {
            estado: [filtroValorIgual, "Ingresado"],
        },
        atributosModificadosAlEnviar: {
            confirmar: {
                cabecera: {
                    estado: "Aprobado",
                },
            },
            rechazar: {
                cabecera: {
                    estado: "Rechazado",
                }
            }
        },
        modificarPostAprob: "noModificable",
        typeHistorial: "Aprobó cotización"
    },
    cotRechazado: {
        atributos: {
            limiteCabecera: true,
        },
        pest: `Cotizaciones Rechazadas`,
        accion: `cotizacionesLogistica`,
        type: "aprobar",
        fechaRegistros: addDay(Date.now(), -10, 0, 0, `y-m-d`),
        filtros: {
            estado: [filtroValorIgual, "Rechazado"],
        },
        botones: {
            aprobar: "Revertir",
            acciones: ["eliminarBotonDesaprobar"]
        },
        atributosModificadosAlEnviar: {
            confirmar: {
                cabecera: {
                    estado: "Ingresado"
                }
            }
        },
        typeHistorial: "Reversion rechazo" //Esto se usa para el tipo de acción en el historial en el momento de aprobar antes de enviar
    },
    confirmarEmbarq: {
        funcionesPropias: {
            finalAbm: {
                cambiarUbicacionAtributo: [cambiarUbicacionAtributo, { fechaDos: 2, textoTres: 2 }]
            },
        },
        pest: `Confirmar embarque`,
        pestIndividual: `Confirmar embarque`,
        accion: `operacionesLogistica`,
        type: "aprobar",
        botones: {
            aprobar: "Confirmar",
        },
        fechaRegistros: addDay(Date.now(), -10, 0, 0, `y-m-d`),
        filtros: {
            estado: [filtroValorIgual, "Estimado"],
            textoCinco: [filtroValorDistino, "Rechazado"]
        },
        atributosConfirmadosEnForm: {
            cabecera: {
                fechaDos: F(`fechaDos`),
                textoTres: T("textoTres"),
            }
        },
        atributosModificadosAlEnviar: {
            confirmar: {
                cabecera: {
                    estado: "Confirmado",
                    textoCinco: "Aprobado"
                },
            },
            rechazar: {
                cabecera: {
                    textoCinco: "Rechazado",
                    estado: "Rechazado",
                }
            }
        },
        modificarPostAprob: "modificableParcial",
        modificableParcial: [habilitarFormExcepto, { atributos: [F(), P("cliente"), T("textoOcho"), P("agente"), P({ nombre: "ciudad" }), P({ nombre: "destinoSbc", origen: "ciudad" }), T("textoTres"), P("maritima"), F(`fechaDos`), P("tipoOperacion"), P("tipoTransporte"), T("tipoCarga"), T("tipoTransporteDos")] }],
        typeHistorial: "Confirmó embarque"
    },
    confTarifa: {
        pest: `Confirmar tarifa`,
        pestIndividual: `Confirmar tarifa`,
        accion: `operacionesLogistica`,
        type: "aprobar",
        botones: {
            aprobar: "Confirmar",
        },
        fechaRegistros: addDay(Date.now(), -10, 0, 0, `y-m-d`),
        validaciones: ["cliente", "tipoCarga", "tipoOperacion", "tipoTransporte", "ciudad", "destinoSbc", "itemVenta", "unidadesMedida", "monedaComp", "importeCotizacion", "importeCincoCotizacion", "cantidadCotizacion"],
        filtros: {
            textoDos: [filtroValorIgual, "Estimada"],
            textoCinco: [filtroValorDistino, "Rechazado"]
        },
        atributosModificadosAlEnviar: {
            confirmar: {
                cabecera: {
                    textoDos: "Confirmada",
                    textoCinco: "Aprobado"
                },
            },
            rechazar: {
                cabecera: {
                    textoDos: "Rechazado",
                    textoCinco: "Rechazado"
                }
            }
        },
        modificar: true,
        modificarPostAprob: "modificableParcial",
        modificableParcial: [bloquearFormExcepto, [F("fechaTres"), LA({ nombre: "atrriboTransbordo", subType: "date" }), T("textoCuatro"), LA("transbordo"), LA({ nombre: "salidaTransbordo" }),], ["cotizacionLogistica "]],
        typeHistorial: "Confirmó tarifa"
    },
    avisoArribo: {
        funcionesPropias: {

            finalAbm: {
                cambiarUbicacionAtributo: [cambiarUbicacionAtributo, { fechaTres: 2, textoCuatro: 2 }]
            },
        },
        validaciones: ["fechaTres", "textoCuatro"],
        pest: `Aviso de arribo`,
        pestIndividual: `Aviso de arribo`,
        accion: `operacionesLogistica`,
        type: "aprobar",
        botones: {
            aprobar: "Confirmar",
        },
        fechaRegistros: addDay(Date.now(), -10, 0, 0, `y-m-d`),
        filtros: {
            textoSiete: [filtroValorIgual, "Estimado"],//Arribo estimado
            textoCinco: [filtroValorDistino, "Rechazado"],//Operacion total diferente a rechazada
            estado: [filtroValorIgual, "Confirmado"],//
            textoDos: [filtroValorDistino, "Estimada"]

        },
        atributosConfirmadosEnForm: {
            cabecera: {
                fechaTres: F(`fechaTres`),
                textoCuatro: T("textoCuatro"),
            }
        },
        atributosModificadosAlEnviar: {
            confirmar: {
                cabecera: {
                    textoSiete: "Confirmado",
                    textoCinco: "Aprobado",
                },
            },
            rechazar: {
                cabecera: {
                    textoSiete: "Rechazado",
                    textoCinco: "Rechazado",
                }
            }
        },
        modificarPostAprob: "modificableParcial",
        modificableParcial: [bloquearFormExcepto, [], ["cotizacionLogistica "]],
        typeHistorial: "Aviso de arribo"
    },
    operacionRechazada: {
        atributos: {
            limiteCabecera: true,
        },
        pest: `Operaciones Rechazadas`,
        accion: `operacionesLogistica`,
        type: "aprobar",
        fechaRegistros: addDay(Date.now(), -10, 0, 0, `y-m-d`),
        botones: {
            aprobar: "Revertir",
            acciones: ["eliminarBotonDesaprobar"]
        },
        filtros: {
            textoCinco: [filtroValorIgual, "Rechazado"],

        },
        atributosModificadosAlEnviar: {
            confirmar: {
                cabecera: {
                    textoCinco: "Ingresado",
                    estado: "Estimado",
                    textoDos: resetearTarifa,
                    textoSiete: "Estimado",
                }
            }
        },
        modificar: "noModificable",
    },
    resetearConfirmaciones: {
        atributos: {
            limiteCabecera: true,
        },
        pest: `Resetear confirmaciones`,
        pestIndividual: `Resetear confirmaciones`,
        accion: `operacionesLogistica`,
        type: "aprobar",
        botones: {
            aprobar: "Quitar confirmaciones",
            acciones: ["eliminarBotonDesaprobar"]

        },
        fechaRegistros: addDay(Date.now(), -10, 0, 0, `y-m-d`),
        filtros: {
            textoCinco: [filtroValorIgual, "Aprobado"]

        },
        atributosModificadosAlEnviar: {
            confirmar: {
                cabecera: {
                    textoCinco: "Ingresado",
                    estado: "Estimado",
                    textoDos: "Estimada",
                    textoSiete: "Estimado"
                },
            }
        },
    },
    certificarItem: {
        atributos: {
            names: [T({ nombre: "_idColeccionUnWind", oculto: "oculto" })],
            titulos: ["_idColeccionUnWind"],
            posicion: [999],
            deleteItem: [0],
            abmCompuesto: {
                cotizacionLogistica: {
                    atributos: ["idColCotizacionGemela", "cantidadCotizacion", "unidadesMedida", "itemVenta", "monedaComp", "importeOchoCotizacion"],
                    titulos: ["Documento", "Cantidad", "Medida", "Item", "Moneda", "Importe"]
                }
            },
            ocultoDef: ["listaDesplegableTexto"],
            crear: false
        },
        formInd: {
            type: "unWind",//esto lo uso para generar el formualrio individual, puede ser doble, indvidual o unWind, ya que apra generar el registro individual debe matcher array e id
            titulos: ["_idColeccionUnWind"],
            inputRenglones: [8, 3, 2, `compuesto`, 4, 1, 6],
            ordenFormu: [-3, 999],
        },
        funcionesPropias: {
            formularioIndiv: {
                numeroDeDocumentoFormInd: [numeroDeDocumentoFormInd]
            },
            finalAbm: {
                cambiarUbicacionAtributo: [cambiarUbicacionAtributo, { itemVenta: 3, monedaComp: 3, importeOchoCotizacion: 3, idColCotizacionGemela: 2 }],
                numeroDeDocumentoAbm: [numeroDeDocumentoAbm]
            },
        },
        pest: `Certificar items`,
        pestIndividual: `Certificar items`,
        accion: `operacionesLogistica`,
        desencadenaAgrupado: {
            certificadosLogistica: {
                destino: "certificadosLogistica",
                identificador: "certificadosLogistica",
                nombre: "Certificados",
                fusionColec: "cotizacion",
                typeDestino: "childColec",
                atributosFusion: {
                    cliente: "cliente",
                    ciudad: "ciudad",
                    transbordo: "transbordo",
                    destinoSbc: "destinoSbc",
                    textoTres: "textoTres",
                    textoCuatro: "textoCuatro"
                },
                atributosConcatenar: [Object.keys(cotizacionLogistica.componentes)].flat(),
                atributos: {
                    funcion: {
                        texto: [hacerCabeceraAtrColec, "idColCotizacionGemela"],
                        observacionesCompleto: [completarCabeceraCert],
                        observacionesRectanculo: [completarFirma]
                    },

                },
                formacionFuncionesAtributosFinal: {
                    completarReferenciaCert: [completarReferenciaCert]
                },//Esto lo formo para despues de los atributos, toma solo el atributo y ahi mismo odifica el objeto mirar
                grabarEnOrigen: [{ titulo: "Num", nombre: "numerador" }],
                atributoGrabarColec: "certificado",// Este es disinto en confirmaod al enviar pone el numeo de comprobante en el atributo facturado
                grabarEnDestino: [{ titulo: "Num", nombre: "numerador" }],
                eliminar: true

            }
        },
        type: "aprobarColección",
        botones: {
            aprobar: "Certificar",
        },
        atributoMultipleMenu: [P("cliente"), P("ciudad"), "idColCotizacionGemela"],//Limita como se filtra el abm
        datos: "unWind",
        coleccionPlancha: {
            0: {
                coleccion: cotizacionLogistica,
                key: `itemVenta`
            },
        },
        fechaRegistros: addDay(Date.now(), -10, 0, 0, `y-m-d`),
        atributosModificadosAlEnviar: {
            confirmar: {
                cabecera: {
                    textoCinco: "Certificado"
                }
            },
            rechazar: {
                coleccion: {
                    certificado: "Rechazado"
                }
            }
        },
        filtrosUnWind: {
            cabecera: {
                estado: [filtroValorIgual, "Confirmado"],//confirmación de embarque
                textoDos: [filtroValorIgual, "Confirmada"],//comfirmación de tarira

            }, coleccion: {
                itemVenta: [filtroAtributoCompuestoDistintoCondicion, "itemVenta", "logico", false],
                certificado: [filtroValorIgual, "No certificado"],
            },

        }
    },
    rechazoCertificarItem: {
        atributos: {
            names: [T({ nombre: "_idColeccionUnWind", oculto: "oculto" })],
            titulos: ["_idColeccionUnWind"],
            posicion: [999],
            deleteItem: [0],
            abmCompuesto: {
                cotizacionLogistica: {
                    atributos: ["idColCotizacionGemela", "cantidadCotizacion", "unidadesMedida", "itemVenta", "monedaComp", "importeOchoCotizacion"],
                    titulos: ["Documento", "Cantidad", "Medida", "Item", "Moneda", "Importe"]
                }
            },
            limiteCabecera: true,
            ocultoDef: ["listaDesplegableTexto"],
            crear: false
        },
        formInd: {
            type: "unWind",//esto lo uso para generar el formualrio individual, puede ser doble, indvidual o unWind, ya que apra generar el registro individual debe matcher array e id
            titulos: ["_idColeccionUnWind"],
            inputRenglones: [8, 3, 2, `compuesto`, 4, 1, 6],
            ordenFormu: [-3, 999],
        },
        pest: `Rechazo certificación`,
        pestIndividual: `Rechazo certificación`,
        accion: `operacionesLogistica`,
        type: "aprobarColección",
        botones: {
            aprobar: "Revertir",
            acciones: ["eliminarBotonDesaprobar"]
        },
        datos: "unWind",
        coleccionPlancha: {
            0: {
                coleccion: cotizacionLogistica,
                key: `itemVenta`
            },
        },
        fechaRegistros: addDay(Date.now(), -10, 0, 0, `y-m-d`),
        atributosModificadosAlEnviar: {
            confirmar: {
                coleccion: {
                    certificado: "No certificado",
                },
            }
        },
        filtrosUnWind: {
            cabecera: {
                estado: [filtroValorIgual, "Confirmado"],//confirmación de embarque
                textoDos: [filtroValorIgual, "Confirmada"],//comfirmación de tarira
                textoSiete: [filtroValorIgual, "Confirmado"],//Aviso de arribo

            }, coleccion: {
                certificado: [filtroValorIgual, "Rechazado"],
            }
        }

    },
}