let variablesModeloPagosCobros = {
  facturasEmitidas: {
    atributos: {
      names: [
        P({ nombre: "cliente", clase: "requerido", width: "veinte" }),
        FH(),
        PPE({ nombre: "comprobante", width: "quince", clase: "requerido", opciones: ["Factura", "Factura de Credito", "Nota de debito", "Nota de credito"] }),
        PPE({ nombre: "tipoComprobante", width: "diez", clase: "requerido", opciones: ["Letra A", "Letra B", "Letra C", "Letra M", "Letra E", "Letra T"] }),
        NCT({ nombre: "numeradorFactura", trigger: ["tipoComprobante", "comprobante"], width: "quince", valorInicialAncla: [valorFijoNum, "0001"], orden: "reves", funcion: { formatoDigitosExtra: [formatoDigitosExtra, 8] } }),
        P({ nombre: "moneda", width: "doce", clase: "requerido" }),
        N({ nombre: "tipoCambio", width: "diez", clase: "requerido" }),
        F({ nombre: "fechaVencimiento", clase: "requerido" }),
        detalleProducto,
        compuestoFacturaVentas,
        compuestoMedioPagos,
        I({ nombre: "importeTotal", clase: "soloLectura transparente" }),
        P({ nombre: "cuentasBancariasPago", origen: "cuentasBancarias" }),
        TF("descripcionCompleto"),
        TD({ nombre: "tipoCambioPesos", texto: "", oculto: "oculto" }),
        TD({ nombre: "cancelacion", oculto: "oculto", texto: "El tipo de cambio de este documento es exclusivamente para efectos fiscales, la cancelación deberá realizarse al tipo de cambio del día efectivo de pago" }),
        adjunto,
        //Atributos Electronica
        //T({ nombre: "CAE", clase: "transparente soloLectura textoCentrado" }),
        //F({ nombre: "vtocae", clase: "transparente soloLectura" }),
      ],
      titulos: ["Cliente", `Fecha`, `Comprobante`, `Letra`, "Numero", `Moneda`, `TC`, `Vencimiento`, `detalleProducto`, `compuestoFacturaVentas`, `compuestoMedioPagos`, `Importe`, "Cuenta Bancaria", `Observaciones`, "", "", `Adjuntos`, `CAE`, `Vto CAE`],
      limiteCabecera: true,
      editar: false,
      eliminar: false,
      deshabilitar: false,
      valorInicial: {
        select: {
          tipoPago: "Cuenta corriente"
        }
      }
    },
    formInd: {
      inputRenglones: [5, 3, `compuesto`, 3, 6],
      impresion: {
        titulo: "Factura",
        alargar: true,
        bloques: {
          cabeceraRenglon: {
            clases: "notMargin",
            componentes: {
              0: {
                type: [cabeceraStandar],
                class: "cabeceraImpresion",

              },
            }
          },
          primerRenglon: {
            clases: "full centerContenido",
            componentes: {
              0: {
                type: [letraComprobanteFiscal, []],
                class: `tituloSecundario`,
              },
            },
          },
          segundoRenglon: {
            clases: "medioCol borderNone margin-top-uno",
            componentes: {
              0: {
                type: [soloLogoEmpresa, ["/img/logoComp.png", "seisRem"]],
                class: `flex center alignCenter column`

              },
              1: {
                type: [numFechaTituloMediano, ["N°", { numero: ["ancla", "numerador"], fecha: F() }]],
                class: `flex center alignCenter column`
              },
            }
          },
          segundoRenglonb: {
            clases: "medioCol paddingTopBotCeroCinco",
            componentes: {
              0: {
                type: [dataFiscal],

              },
              1: {
                type: [dataFiscalDos],
                class: `flex center alignCenter column`
              },
            }
          },
          tercerRenglon: {
            clases: "medioCol borderNone paddingTopCeroCinco",
            componentes: {
              0: {
                type: [infoReferenciaMayuscula, [P("cliente"), ["name"], ["Señor(es)"]]],
                class: `izquierda`
              },

              1: {
                type: [infoReferenciaMayusculaCuit, [P("cliente")]],
                class: `izquierda`
              },
            }
          },
          cuartoRenglon: {
            clases: "medioCol ",
            componentes: {
              0: {
                type: [infoReferenciaMayuscula, [P("cliente"), ["condicionImpositiva"], ["Condición Impositiva"]]],
                class: `izquierda`
              },
            }
          },
          cuartoRenglonD: {
            clases: "full paddingBotceroCinco flex centerContenido",
            componentes: {
              0: {
                type: [infoReferenciaMayusculacuentaEmpresa],
                class: `flex `
              },
            }
          },
          cuartoRenglonB: {
            clases: "full paddingBotceroCinco centerContenido",
            componentes: {
              0: {
                type: [returnUnAtributoSelectColec, [{ atributo: P({ nombre: "tipoPago" }), titulo: "Condición de venta" }]],

              },
            }
          },
          cuartoRenglonC: {
            clases: "full paddingTopBotCeroCinco centerContenido",
            componentes: {
              0: {
                type: [returnUnAtributo, ["descripcionCompleto"]],

              },

            }
          },
          quintoRenglon: {
            clases: "full alargar",
            componentes: {
              0: {
                type: [
                  itemsComprobantes,
                  [
                    [
                      N({ nombre: "cantidad", clase: "textoCentrado centroVertical", width: "tres" }),
                      P({ nombre: "itemVenta", clase: "centroVertical", width: "quince" }),
                      I({ nombre: "precioUnitario", clase: "textoCentrado centroVertical", width: "cinco" }),
                      N({ nombre: "porcentaje", clase: "textoCentrado centroVertical", width: "tres" }),
                      I({ nombre: "otrosImpuestos", clase: "textoCentrado centroVertical", width: "cinco" }),
                      I({ nombre: "subtotalVentas", clase: "textoCentrado centroVertical", width: "siete" }),
                    ],
                    compuestoFacturaVentas,
                  ],
                ],
              },
            },
          },
          sextoRenglon: {
            clases: "full flex end paddingTopBotCeroCinco",
            componentes: {
              0: {
                type: [totalitemsPorTasa, [{
                  base: { atr: "importeNeto", titulo: "Neto" },
                  impuesto: { atr: "impuestoFactVentas", titulo: "IVA" },
                  otroImpuesto: { atr: "otrosImpuestos", titulo: "Impuestos" },
                  total: { atr: "importeTotal", titulo: "Total" }
                }]],
                class: `totalTable`
              },
            }
          },
          septimoRenglon: {
            clases: "full paddingTopBotCeroCinco",
            componentes: {
              0: {
                type: [numeroALetrasImporte, [P("moneda"), I("importeTotal")]],
                class: ""
              },
            },
          },
          octavoRenglon: {
            clases: "full paddingTopBotCeroCinco",
            componentes: {
              0: {
                type: [datoDosDiv, ["tipoCambioPesos", "torcido", { 0: "80porc", 1: "20porc" }, { 1: "derecha verticalEnd" }]],
                class: `flex`
              },
            },
          },
          novenoRenglon: {
            clases: "full paddingTopBotCeroCinco",
            componentes: {
              0: {
                type: [datoDiv, ["cancelacion", "torcido"]],
                class: `flex`
              },
            },
          },
          pieRenglon: {
            clases: "notMargin pieImpresion",
            componentes: {
              0: {
                type: [pieStandar],


              },
            }
          },
        },
      },
    },
    funcionesPropias: {
      formularioIndiv: {
        letraCodigoComprobante: [letraCodigoComprobante],
        mostrarPestanaProducto: [mostrarPestanaProducto],
        fechaFacturacion: [fechaFacturacion],
        completarCamposTipoCambio: [completarCamposTipoCambio],
        valoresInicialesMediosPagos: [valoresInicialesMediosPagos, "importeTotal"],
        cuentaBcaria: [cuentaBcaria],
        consultaStock: [consultaStock],
        //cambiarBoton: [cambiarBoton, `okBoton`, iOkFacturaElec],
        //cambiarBotonD: [cambiarBoton, `okfPlus`, okPlusElectronica],
        //botonEnviarelectronica: [botonEnviarelectronica]
      },
    },
    desencadenante: {
      cuentaCorrienteCliente: {
        identificador: ["cuentaCorrienteCliente"],
        type: "condicionSegunFuncion",
        funcionCondicion: [almenosUnCtaCtte],
        opciones: {
          cuentaCorriente: {
            destino: "cuentaCorrienteClientes",
            nombre: "Cuentas Corrientes",
            atributos: {
              valorFijo: {
                estado: "Pendiente",
                movimientoDestino: "Facturas emitidas",
              },
              cambiarAtributos: {
                importe: "importeTotal",
                importemb: "importeTotalmb",
                importema: "importeTotalma",
              },
              funcion: {
                saldoComprobante: [saldoComprobanteFact],
                numComprobante: [convertirDosAUnAtr, ["ancla", "numerador"]],
                refEnviar: [crearREfEnviar, "string", ["tipoComprobante", "ancla", "numerador"]],
              },
            },
            grabarEnOrigen: { Número: "numerador" },
            grabarEnDestino: { Número: "refEnviar" }
          }
        }
      }
    },
    desencadenaColeccion: {
      detalleProducto: {
        type: "condicionSegunFuncion",
        coleccionOrigen: detalleProducto,
        identificador: ["detalleProducto"],
        eliminarDesencadenate: ["producto"],//Si cambia este atributo se elimina el desencadenate
        funcionCondicion: [facturaStock, "bajaStock"],
        opciones: {
          facturacion: {
            destino: "stock",
            nombre: "Inventario",
            atributosColeccion: {
              cambiarAtributos: {
                unidadesMedida: "unidadesMedidaProducto",
                almacen: "almacenProducto"
              },
              cambiarAtributosYSigno: {
                cantidad: "cantidadProducto"
              },
              funcion: {
                marca: [buscarAtributosParamentricos, "marca", "producto"],
                refEnviar: [crearREfEnviar, "string", ["ancla", "numerador"]],
              },
              valorFijo: {
                operacionStock: "Salida",
              },

            },
            grabarEnOrigen: { Número: "numerador" },
            grabarEnOrigenColeccion: { Número: "numerador" }, //se pone primer el atributo en el origen segundo en el destino
            grabarEnDestino: { Número: "refEnviar" },
          }
        },

      },
      mediosPagos: {
        type: "condicionSegunFuncion",
        identificador: ["mediosPagos"], //este atributo siempre se crean atributos identificadores de los desencadenantes (hoja: variablesIniciales, func: agregarIdDesenCompononentesObjetos)
        eliminarDesencadenate: ["tipoPago"],//Si cambia este atributo se elimina el desencadenate
        coleccionOrigen: compuestoMedioPagos,
        funcionCondicion: [seleccionDesencadenanteMedioPago],
        opciones: {
          transferencia: {
            destino: "saldosBancos",
            nombre: "Movimientos Bancarios",
            atributosColeccion: {
              cambiarAtributos: {
                importe: "importeTipoPago",
                importemb: "importeTipoPagomb",
                importema: "importeTipoPagoma",
                moneda: "monedaTipoPago",
                tipoCambio: "tipoCambioTipoPago"
              },
              funcion: {
                bancos: [buscarAtributosParamentricos, "bancos", "cuentasBancarias"]
              },
              valorFijo: {
                itemsBancos: "Facturas emitidas",
              },
              delete: { numerador: "numerador" },
            },
            grabarEnOrigenColeccion: { Número: "numerador" }, //se pone primer el atributo en el origen segundo en el destino
            grabarEnDestino: { Número: "numerador" },

          },
          chequeDeTercero: {
            destino: "chequesTercero",
            nombre: "Valores en cartera",
            atributosCabecera: {},
            atributosColeccion: {
              cambiarAtributos: {
                importe: "importeTipoPago",
                importemb: "importeTipoPagomb",
                importema: "importeTipoPagoma",
                moneda: "monedaTipoPago",
                tipoCambio: "tipoCambioTipoPago"
              },
              valorFijoPestana: {
                tipoPago: `Cheques de terceros`,
              },
              valorFijo: {
                estado: "En cartera",
              },
              delete: { cuentasBancarias: "cuentasBancarias" },
              deleteVacio: { bancos: "bancos" },
            },
            grabarEnOrigenColeccion: { Número: "numeroDeCheque" },
            grabarEnDestino: { Número: "numerador" },
          },
          efectivo: {
            destino: "saldosCajas",
            nombre: "Movimientos Cajas",
            atributosCabecera: {},
            atributosColeccion: {
              cambiarAtributos: {
                importe: "importeTipoPago",
                importemb: "importeTipoPagomb",
                importema: "importeTipoPagoma",
                moneda: "monedaTipoPago",
                tipoCambio: "tipoCambioTipoPago"
              },
              valorFijo: {
                itemsCajas: `Facturas emitidas`,
              },
              delete: { cuentasBancarias: "cuentasBancarias", bancos: "bancos", numerador: "numerador" },
            },
            grabarEnOrigenColeccion: { Número: "numerador" }, //se pone primer el atributo en el origen segundo en el destino, y siempre primero el id
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
        digitosPositivos: ["subtotalVentas"],
        trigger: ["subtotalVentas"],
      },
    },
    pestanas: [P("agrupadorImpuesto"), P("impuestoDefinicion"), P("provincia"), P("ciudad"),],//Provincia y ciudad lo necesito para la impresion
    key: "numeradorFactura",
    pest: `Facturas emitidas`,
    pestIndividual: `Emitir facturas`,
    accion: `facturasEmitidas`,
    multimoneda: true,
    type: "transaccion",
    empresa: true,
  },
  cobrosRecibidos: {
    atributos: {
      names: [
        NS("numerador"),
        FH(),
        P({ nombre: "cliente", clase: "requerido" }),
        P({ nombre: "moneda", clase: "requerido", width: "diez" }),
        N({ nombre: "tipoCambio", clase: "requerido" }),
        CH({ nombre: "items", oculto: "ocultoAbm" }),
        cobrosCtaCte,
        compuestoReciboCobros,
        compuestoMedioPagos,
        I("importeTotal"),
        TF("descripcionCompleto"),
        adjunto,
      ],
      titulos: [`Numero`, `Fecha`, `Cliente`, `Moneda`, `TC`, `Items`, `cobrosCtaCte`, `compuestoReciboCobros`, `compuestoMedioPagos`, `Importe`, "Obrservaciones", `Adjunto`],
      limiteCabecera: true,
      eliminar: true,
      deshabilitar: false,
      valorInicial: {
        select: {
          tipoPago: "Efectivo"
        }
      }
    },
    formInd: {
      inputRenglones: [6, `compuesto`, 3, 6],
      impresion: {
        titulo: "Recibo",
        alargar: true,
        bloques: {
          cabeceraRenglon: {
            clases: "notMargin",
            componentes: {
              0: {
                type: [cabeceraStandar, ["Cobros"]],
                class: "cabeceraImpresion",

              },
            }
          },
          primerRenglon: {
            clases: "full centerContenido",
            componentes: {
              0: {
                type: [retunrTextoDeParametro, [[`<div class="letra">X</div>`]]],
                class: `tituloSecundario`,
              },
            },
          },
          segundoRenglon: {
            clases: "medioCol borderNone margin-bot-uno margin-top-uno",
            componentes: {
              0: {
                type: [numFecha, ["N°", { numero: ["numerador"], fecha: F() }]],
                class: `flex end column`
              },
              1: {
                type: [soloLogoEmpresa, ["/img/logo_transparent_background.png"]],
                class: `rightContenido padding-right-tres`
              },
            }
          },
          tercerRenglon: {
            clases: "medioCol borderNone",
            componentes: {
              0: {
                type: [infoReferencia, [P("cliente"), ["name"], ["Señor(es)"]]],
                class: `izquierda`
              },
              1: {
                type: [infoReferencia, [P("cliente"), ["documento"], ["Documento"]]],
                class: `derecha rightContenido`
              },
            }
          },
          cuartoRenglon: {
            clases: "medioCol borderNone",
            componentes: {
              0: {
                type: [infoReferencia, [P("cliente"), ["direccion"], ["Dirección"]]],
                class: `izquierda`
              },
              1: {
                type: [infoReferenciaMoneda, []],
                class: `derecha rightContenido`,
              },
            }
          },
          quintoRenglon: {
            clases: "full alargar",
            componentes: {
              0: {
                type: [
                  elegirCompuesto,
                  [
                    compuestoReciboCobros, cobrosCtaCte
                  ],
                ],
              },
            },
          },
          sextoRenglon: {
            clases: "full flex end",
            componentes: {
              0: {
                type: [returnUnAtributoTituloNumero, [{ titulo: "Total", nombre: "importeTotal" }]],
                class: `totalTable`
              },
            }
          },
          septimoRenglon: {
            clases: "full",
            componentes: {
              0: {
                type: [numeroALetrasImporte, [P("moneda"), I("importeTotal")]],
                class: ``
              },
            },
          },
          octavoRenglon: {
            clases: "full",
            componentes: {
              0: {
                type: [totalitemsporTipoPago, [{ tipoPago: "tipoPago", atributos: [{ atr: "importeTipoPago", titulo: "Medios de pago:" }] }]],
                class: `izquierda`
              },

            },

          },
          novenoRenglon: {
            clases: "full",
            componentes: {
              0: {
                type: [retunrTextoDeParametro, [["<h5>Observaciones:</h5>"]]],
                class: `izquierda`
              },
            },
          },
          decimoRenglon: {
            clases: "medioCol centerVertical",
            componentes: {
              0: {

                type: [retunrTextoDeParametro, [["<h5>Firma:</h5>"]]],
                class: `izquierda`
              },
              1: {

                type: [retunrTextoDeParametro, [["<h5>Aclaración:</h5>"]]],
                class: `derecha`
              },
            },
          },
          pieRenglon: {
            clases: "notMargin pieImpresion",
            componentes: {
              0: {
                type: [pieStandar],


              },
            }
          },
        },

      },
    },
    funcionesPropias: {
      formularioIndiv: {
        valoresInicialesMediosPagos: [valoresInicialesMediosPagos, "importeTotal"],
        mostrarPestana: [mostrarPestana, "compuestoReciboCobros", "cobrosCtaCte"],
        validarImporteCtaCte: [validarImporteCtaCte, "importeaCobrar"]
      },
    },
    totalizadores: {
      formulario: {
        type: "totalizadorCabecera",
        total: ["importeTotal"],
        cantidad: false,
        digitosPositivos: ["subTotal", "importeaCobrar"],
        trigger: ["subTotal", "importeaCobrar"],
      },
    },
    key: "numerador",
    pest: `Cobranzas recibidas`,
    pestIndividual: `Orden de cobro`,
    accion: `cobrosRecibidos`,
    desencadenaColeccion: {
      mediosPagos: {
        identificador: "mediosPagos",
        atributosMain: ["tipoPago"],
        type: "condicionSegunFuncion",
        //este atributo siempre se crean atributos identificadores de los desencadenantes (hoja: variablesIniciales, func: agregarIdDesenCompononentesObjetos)
        //eliminarDesencadenate: ["tipoPago"],//Si cambia este atributo se elimina el desencadenate
        coleccionOrigen: compuestoMedioPagos,
        funcionCondicion: [seleccionDesencadenanteMedioPago],
        opciones: {
          transferencia: {
            destino: "saldosBancos",
            nombre: "Movimientos Bancarios",
            atributosColeccion: {
              cambiarAtributos: {
                importe: "importeTipoPago",
                importemb: "importeTipoPagomb",
                importema: "importeTipoPagoma",
                moneda: "monedaTipoPago",
                tipoCambio: "tipoCambioTipoPago"
              },
              funcion: {
                bancos: [buscarAtributosParamentricos, "bancos", "cuentasBancarias"]
              },
              valorFijo: {
                itemsBancos: "Cobros recibidos",
                estado: ""
              },
              delete: { numerador: "numerador" },
            },
            grabarEnOrigenColeccion: { Número: "numerador" }, //se pone primer el atributo en el origen segundo en el destino
            grabarEnDestino: { Número: "numerador" },

          },
          chequeDeTercero: {
            destino: "chequesTercero",
            nombre: "Valores en cartera",
            atributosCabecera: {},
            atributosColeccion: {
              cambiarAtributos: {
                importe: "importeTipoPago",
                importemb: "importeTipoPagomb",
                importema: "importeTipoPagoma",
                moneda: "monedaTipoPago",
                tipoCambio: "tipoCambioTipoPago"
              },
              valorFijoPestana: {
                tipoPago: `Cheques de terceros`,
              },
              valorFijo: {
                estado: "En cartera",
              },
              delete: { cuentasBancarias: "cuentasBancarias" },
              deleteVacio: { bancos: "bancos" },
            },
            grabarEnOrigenColeccion: { Número: "numeroDeCheque" },
            grabarEnDestino: { Número: "numerador" },
          },
          efectivo: {
            destino: "saldosCajas",
            nombre: "Movimientos Cajas",
            atributosCabecera: {},
            atributosColeccion: {
              cambiarAtributos: {
                importe: "importeTipoPago",
                importemb: "importeTipoPagomb",
                importema: "importeTipoPagoma",
                moneda: "monedaTipoPago",
                tipoCambio: "tipoCambioTipoPago"
              },
              valorFijo: {
                itemsCajas: `Cobros recibidos`,
              },
              delete: { cuentasBancarias: "cuentasBancarias", bancos: "bancos", numerador: "numerador" },
            },
            grabarEnOrigenColeccion: { Número: "numerador" }, //se pone primer el atributo en el origen segundo en el destino, y siempre primero el id
            grabarEnDestino: { Número: "numerador" },
          },
        },
      },
    },
    desencadenante: {
      cuentaCorrienteCliente: {
        identificador: ["cuentaCorrienteClientes"],
        type: "condicionSegunFuncion",
        nombre: "Cuentas corrientes",
        origen: "cobrosRecibidos",
        funcionCondicion: [almenosUnFiscal, "importeaCobrar"],
        opciones: {
          true: {
            destino: "cuentaCorrienteClientes",
            nombre: "Cobros de cuentas corrientes",
            atributos: {
              cambiarAtributos: {
                comprobanteOP: "numComprobante",
                numComprobante: "numerador",
              },
              valorFijo: {
                movimientoDestino: "Orden de cobro",
                tipoComprobante: "",
                estado: "",
                saldoComprobante: "",
              },
              funcion: {
                importe: [importeParcial, "importeaCobrar"],
                importemb: [importeParcial, "importeaCobrarmb"],
                importema: [importeParcial, "importeaCobrarma"],
              },
              delete: { numerador: "numerador" },
            },
            grabarEnDestino: { Número: "numerador" },
            grabarEnOrigen: { Número: "numerador" }
          }
        }
        //se pone primer el atributo en el origen segundo en el destino
      },
    },
    imputarcoleccion: {
      cuentaCorriente: {
        type: "condicionSegunFuncion",
        coleccionOrigen: cobrosCtaCte,
        identificador: "cuentaCorriente",
        //identificador: ["cuentaCorrienteClientes"],
        //eliminarDesencadenate: ["numerador"],//Si cambia este atributo se elimina el desencadenate
        funcionCondicion: [almenosUnFiscal, "importeaCobrar"],
        opciones: {
          true: {
            destino: "cuentaCorrienteClientes",
            nombre: "Cuentas corrientes clientes",
            destino: "cuentaCorrienteClientes",
            atributoImputables: {
              funcion: {
                estado: [pagoParcialString, "importeaCobrar", { parcial: "Pago parcial", cerrado: "Cerrado", }],
                saldoComprobante: [pagoParcialImporte, "importeaCobrar", "saldoComprobante"]
              },
              cambioNombre: {
                _id: "idComprobante",
                comprobanteOP: "numerador",
              },
              delete: { numerador: "numerador" },

            },
            grabarEnDestino: { Número: "numerador" },
            grabarEnOrigenColeccion: { Número: "numerador" }, //se pone primer el atributo en el origen segundo en el destino

          }
        }
      },
    },
    empresa: true,
    multimoneda: true,
    type: "transaccion",
  },
  cliente: {
    atributos: {
      names: [
        NS("numerador"),
        T({ nombre: `name`, width: "veinte", clase: "requerido primeraMayusOracion" }),
        PPE({ nombre: "DocTipo", opciones: ["CUIT", "DNI", "Consumidor Final"] }),
        T({ nombre: `documento`, clase: "formatoNumeroDni" }),
        PPE({ nombre: "condicionImpositiva", opciones: ["Responsable Inscripto", "Monotributo", "Consumidor Final", "Exento"] }),
        P("listasPrecios"),
        TA("observaciones"),
        contacto,
        direcciones,
        habilitado,
      ],
      titulos: [
        "Numero", "Nombre ", "Tipo Documento", `DNI/CUIT`, `Condición Impositiva`, `Tipo de precio`, `Observaciones`, `contacto`, "direcciones",
      ],
      clases: {
        telefono: ["textoCentrado"],
      },
      eliminar: false,
      deshabilitar: true,
    },
    formInd: {
      inputRenglones: [4, 3, `compuesto`, 2],
    },
    funcionesPropias: {
      formularioIndiv: {
        entidadesEmailFuncion: [entidadesEmailFuncion],
        formatoDocumento: [formatoDocumento, "documento"],
        formatoTelefono: [formatoTelefono, "telefonoContacto"],
      }
    },
    key: "name",
    pest: `Clientes`,
    accion: `cliente`,
    type: "parametrica",
  },
  itemVenta: {
    //Item de venta tiene un rubro para la facturación
    atributos: {
      names: [
        T({ nombre: "name", width: "veinte", clase: "requerido" }),
        PPE({ nombre: "concepto", opciones: ["Servicio", "Producto"] }),
        coleccionImpuestoProducto,
        habilitado,
      ],
      titulos: [`Item`, `Concepto`, `coleccionImpuestoProducto`],
      eliminar: false,
      deshabilitar: true,
    },
    formInd: {
      inputRenglones: [2, "compuesto", 5],
    },
    key: "name",
    sort: { name: 1 },
    pest: `Items Venta`,
    pestIndividual: `Alta Items Venta`,
    accion: `itemVenta`,
    type: "parametrica",
  },
  pagosRealizados: {
    atributos: {
      names: [
        NS("numerador"),
        FH(),
        P({ nombre: "proveedor", clase: "requerido" }),
        P({ nombre: "moneda", clase: "requerido", width: "diez" }),
        N({ nombre: "tipoCambio", clase: "requerido" }),
        CH({ nombre: "items", oculto: "ocultoAbm" }),
        pagosCtaCte,
        itemsPagosSinFactura,
        compuestoMedioPagos,
        I("importeTotal"),
        TF("descripcionCompleto"),
        adjunto,
      ],
      titulos: ["Numero", `Fecha`, "Proveedor", `Moneda`, `TC`, `Items`, `pagosCtaCte`, `itemsPagosSinFactura`, `compuestoMedioPagosConChequeTercero`, `Total`, `Observaciones`, `Adjuntos`],
      limiteCabecera: true,
      valorInicial: {
        select: {
          tipoPago: "Efectivo"
        }
      },
      eliminar: true,
      deshabilitar: false,

    },
    formInd: {
      inputRenglones: [6, `compuesto`, 2, 6],
      impresion: {
        titulo: "Orden de Pago",
        alargar: true,
        bloques: {
          cabeceraRenglon: {
            clases: "notMargin",
            componentes: {
              0: {
                type: [cabeceraStandar, ["Pagos"]],
                class: "cabeceraImpresion",

              },
            }
          },
          primerRenglon: {
            clases: "medioCol borderNone margin-bot-uno margin-top-uno",
            componentes: {
              0: {
                type: [numFecha, ["N°", { numero: ["numerador"], fecha: F() }]],
                class: `flex end column`
              },
              1: {
                type: [soloLogoEmpresa, ["/img/logo_transparent_background.png"]],
                class: `rightContenido padding-right-tres`
              },
            }
          },
          segundoRenglon: {
            clases: "medioCol borderNone",
            componentes: {
              0: {
                type: [infoReferencia, [P("proveedor"), ["name"], ["Señor(es)"]]],
                class: `izquierda`
              },
            }
          },
          tercerRenglon: {
            clases: "medioCol borderNone",
            componentes: {
              0: {
                type: [infoReferencia, [P("proveedor"), ["documento"], ["Documento/CUIT"]]],
                class: `izquierda`
              },
              1: {
                type: [infoReferenciaMoneda, []],
                class: `derecha rightContenido`,
              },
            }
          },
          cuartoRenglon: {
            clases: "full alargar",
            componentes: {
              0: {
                type: [
                  elegirCompuesto,
                  [
                    itemsPagosSinFactura, pagosCtaCte
                  ],
                ],
              },
            },
          },
          quintoRenglon: {
            clases: "full flex end",
            componentes: {
              0: {
                type: [returnUnAtributoTituloNumero, [{ titulo: "Total", nombre: "importeTotal" }]],
                class: `totalTable`
              },
            }
          },
          sextoRenglon: {
            clases: "full",
            componentes: {
              0: {
                type: [numeroALetrasImporte, [P("moneda"), I("importeTotal")]],
                class: ``
              },
            },
          },
          septimoRenglon: {
            clases: "full",
            componentes: {
              0: {
                type: [totalitemsporTipoPago, [{ tipoPago: "tipoPago", atributos: [{ atr: "importeTipoPago", titulo: "Medios de pago:" }] }]],
                class: `izquierda`
              },

            },

          },
          octavoRenglon: {
            clases: "full",
            componentes: {
              0: {
                type: [retunrTextoDeParametro, [["<h5>Observaciones:</h5>"]]],
                class: `izquierda`
              },
            },
          },
          novenoRenglon: {
            clases: "medioCol centerVertical",
            componentes: {
              0: {

                type: [retunrTextoDeParametro, [["<h5>Firma:</h5>"]]],
                class: `izquierda`
              },
              1: {

                type: [retunrTextoDeParametro, [["<h5>Aclaración:</h5>"]]],
                class: `derecha`
              },
            },
          },
          pieRenglon: {
            clases: "notMargin pieImpresion",
            componentes: {
              0: {
                type: [pieStandar],


              },
            }
          },
        },

      },
    },
    funcionesPropias: {
      formularioIndiv: {
        valoresInicialesMediosPagos: [valoresInicialesMediosPagos, "importeTotal"],
        pagarConChequesEnCartera: [pagarConChequesEnCartera],
        mostrarPestana: [mostrarPestana, "itemsPagosSinFactura", "pagosCtaCte"],
        validarImporteCtaCte: [validarImporteCtaCte, "importeaPagar"]
      },
    },
    totalizadores: {
      formulario: {
        type: "totalizadorCabecera",
        total: ["importeTotal"],
        cantidad: false,
        digitosPositivos: ["subTotal", "importeaPagar"],
        trigger: ["subTotal", "importeaPagar"],
      },
    },
    key: "numerador",
    pest: `Pagos realizados`,
    pestIndividual: `Orden de Pago`,
    accion: `pagosRealizados`,
    pestanas: [P("cliente")],
    desencadenaColeccion: {
      mediosPagos: {
        type: "condicionSegunFuncion",
        identificador: ["tipoPago"], //este atributo va cuando tiene opciones a fin de crear el atributoId Ref
        coleccionOrigen: compuestoMedioPagos,
        funcionCondicion: [seleccionDesencadenanteMedioPago],
        //eliminarDesencadenate: ["tipoPago"],//Si cambia este atributo se elimina el desencadenate
        opciones: {
          transferencia: {
            destino: "saldosBancos",
            nombre: "Movimientos Bancarios",
            atributosColeccion: {
              cambiarAtributosYSigno: {
                importe: "importeTipoPago",
                importemb: "importeTipoPagomb",
                importema: "importeTipoPagoma"

              },
              cambiarAtributos: {
                monedaTipoPago: "moneda",
                tipoCambioTipoPago: "tipoCambio"

              },
              funcion: {
                bancos: [buscarAtributosParamentricos, "bancos", "cuentasBancarias"]
              },
              valorFijo: {
                itemsBancos: "Pagos realizados",
              },
              delete: { numerador: "numerador" },
            },
            grabarEnOrigen: { Número: "numerador" },
            grabarEnOrigenColeccion: { Número: "numerador" },
            grabarEnDestino: { Número: "numerador" },
          },
          cheque: {
            destino: "saldosBancos",
            nombre: "Movimientos Bancarios",
            atributosCabecera: {},
            atributosColeccion: {
              cambiarAtributosYSigno: {
                importe: "importeTipoPago",
                importemb: "importeTipoPagomb",
                importema: "importeTipoPagoma"
              },
              cambiarAtributos: {
                moneda: "monedaTipoPago",
                tipoCambio: "tipoCambioTipoPago"
              },
              valorFijo: {
                itemsBancos: "Cheques emitidos",

              },
              funcion: {
                bancos: [buscarAtributosParamentricos, "bancos", "cuentasBancarias"]
              },

            },
            grabarEnOrigenColeccion: { Número: "numeroDeCheque" },
            grabarEnDestino: { Número: "numerador" },
          },
          efectivo: {
            destino: "saldosCajas",
            nombre: "Movimientos Cajas",
            atributosColeccion: {
              cambiarAtributosYSigno: {

                importe: "importeTipoPago",
                importemb: "importeTipoPagomb",
                importema: "importeTipoPagoma"
              },
              cambiarAtributos: {
                moneda: "monedaTipoPago",
                tipoCambio: "tipoCambioTipoPago"

              },
              valorFijo: {
                itemsCajas: "Pagos realizados",
              },
              beforeSend: {
                //num: [consultaNumerSoloNumeroYPosteo],
              },
              delete: { numerador: "numerador" },
            },
            grabarEnOrigen: { Número: "numerador" },
            grabarEnOrigenColeccion: { Número: "numerador" },
            grabarEnDestino: { Número: "numerador" },
          },
          cuentaCorriente: {
            destino: "cuentaCorrienteProveedores",
            nombre: "Cuentas corrientes proveedores",
            atributosCabecera: {},
            atributosColeccion: {
              cambiarAtributos: {
                importe: "importeTipoPago",
                importemb: "importeTipoPagomb",
                importema: "importeTipoPagoma",
                moneda: "monedaTipoPago",
                tipoCambio: "tipoCambioTipoPago",

              },
              valorFijo: {
                movimientoDestino: "Compras realizadas",
                estado: "Pendiente",
              },
              delete: { cuentasBancarias: "cuentasBancarias", bancos: "bancos", numerador: "numerador" },
            },
            grabarEnOrigenColeccion: { Número: "numerador" }, //se pone primer el atributo en el origen segundo en el destino, y siempre primero el id
            grabarEnDestino: { Número: "numerador" },
          },
        },
      },
    },
    childColeccion: {
      anticipoFinanciero: {
        type: "condicionSegunFuncion",
        identificador: ["anticipoFinanciero"],
        coleccionOrigen: itemsPagosSinFactura,
        nombre: "Anticipo financiero",
        funcionCondicion: [seleccionAnticipo],
        //eliminarDesencadenante: ["itemCompra"],
        opciones: {
          anticipo: {
            destino: "anticipoFinanciero",
            nombre: "Anticipo Financiero",
            atributosColeccion: {

              cambiarAtributos: {
                tipoCambio: "tipoCambioTipoPago",
                importeTotal: "subTotal",
                importeTotalmb: "subTotalmb",
                importeTotalma: "subTotalma"

              },
              valorFijo: {
                observaciones: "Pagos realizados",
                estado: "Abierto"
              },
              delete: { numerador: "numerador" },
            },
            grabarEnOrigen: { Número: "numerador" },
            grabarEnOrigenColeccion: { Número: "numerador" },
            grabarEnDestino: { Número: "numerador" },
          },
          grabarEnDestino: { Número: "numerador" },
          grabarEnOrigenColeccion: { Número: "numerador" }
        }
      },
    },
    desencadenante: {
      cuentaCorrienteProveedores: {
        identificador: ["cuentaCorrienteProveedores"],
        type: "condicionSegunFuncion",
        nombre: "Cuentas corrientes",
        origen: "pagosRealizados",
        funcionCondicion: [almenosUnFiscal, "importeaPagar"],
        opciones: {
          true: {
            destino: "cuentaCorrienteProveedores",
            nombre: "Pagos a cuentas corrientes",
            atributos: {
              cambiarAtributos: {
                comprobanteOP: "numComprobante",
                numComprobante: "numerador",

              },
              valorFijo: {
                movimientoDestino: "Orden de pago",
                tipoComprobante: "",
                estado: "",
                saldoComprobante: "",
              },
              funcion: {
                importe: [importeParcial, "importeaPagar"],
                importemb: [importeParcial, "importeaPagarmb"],
                importema: [importeParcial, "importeaPagarma"],
              },
              delete: { numerador: "numerador" },
            },
            grabarEnDestino: { Número: "numerador" },
            grabarEnOrigen: { Número: "numerador" }
          }
        }
        //se pone primer el atributo en el origen segundo en el destino
      },
    },
    imputarcoleccion: {
      chequesTercero: {
        type: "condicionSegunFuncion",
        coleccionOrigen: compuestoMedioPagos,
        funcionCondicion: [seleccionDesencadenanteMedioPago],
        identificador: ["tipoPago"],
        //eliminarDesencadenate: ["tipoPago"],//Si cambia este atributo se elimina el desencadenate
        opciones: {
          chequeDeTercero: {
            destino: "chequesTercero",
            nombre: "Valores en cartera",
            destino: "chequesTercero",
            atributoImputables: {
              valorFijo: {
                estado: "Endosado",
              },
              funcion: {
                _id: [buscarIdPorAtributoUnico, "numeroDeCheque"]
              }
            },
            grabarEnOrigen: { Número: "numerador" },
            grabarEnOrigenColeccion: { Número: "numeroDeCheque" },
            grabarEnDestino: { Número: "numerador" },
          },
        },
        grabarEnDestino: { Número: "numeroDeCheque", empresaAtribut: "empresa" },
        grabarEnOrigenColeccion: { Número: "numeroDeCheque" }, //se pone primer el atributo en el origen segundo en el destino
      },
      cuentaCorriente: {
        type: "condicionSegunFuncion",
        coleccionOrigen: pagosCtaCte,
        identificador: "cuentaCorriente",
        eliminarDesencadenate: ["numComprobante"],//Si cambia este atributo se elimina el desencadenate
        funcionCondicion: [almenosUnFiscal, "importeaPagar"],
        opciones: {
          true: {
            destino: "cuentaCorrienteProveedores",
            nombre: "Cuentas corrientes proveedores",
            atributoImputables: {
              funcion: {
                estado: [pagoParcialString, "importeaPagar", { parcial: "Pago parcial", cerrado: "Cerrado", }],
                saldoComprobante: [pagoParcialImporte, "importeaPagar", "saldoComprobante"]
              },
              funcionReverso: {
                saldoComprobante: [reversoImporte],
                estado: [reversoString]
              },
              cambioNombre: {
                _id: "idComprobante",
                comprobanteOP: "numerador",
              },

              delete: { numerador: "numerador" },
              grabarEnOrigen: { Número: "numerador" },
              grabarEnOrigenColeccion: { Número: "numerador" },
              grabarEnDestino: { Número: "numerador" },
            },

            grabarEnDestino: { Número: "numerador" },
            grabarEnOrigenColeccion: { Número: "numerador" }, //se pone primer el atributo en el origen segundo en el destino

          }
        }
      },
    },
    empresa: true,
    multimoneda: true,
    type: "transaccion",

    //Cobros - //12/5 CH
  },
  anticipoFinanciero: {
    atributos: {
      names: [
        NS("numerador"),
        FH(),
        P({ nombre: "proveedor", clase: "requerido" }),
        F({ nombre: "fechaVencimiento" }),
        rendicionGastos,

        P({ nombre: "moneda", clase: "soloLectura" }),
        PPE({ nombre: "estado", clase: "soloLectura transparente textoCentrado", opciones: ["Abierto", "Cerrado", "Saldo a favor"], valorInicial: "Abierto" }),

        I("importeTotal"),
        I("importeGastos"),
        I("saldo"),
        TF("observaciones"),
      ],
      titulos: [
        `Numero`, `Fecha`, `Proveedor`, `Fecha vencimiento`, `rendicionGastos`, `Moneda`, `Estado`, `Total Anticipo`, `Gastos`, `Saldo`, `Observaciones`
      ],
      cabeceraAbm: {
        select: [
          {
            atributo: P({ nombre: "proveedor", clase: "textoCentrado doceWidth" }),
            titulo: "Proveedor"
          },
          {
            atributo: P({ nombre: "moneda", clase: "textoCentrado condicionSaldo diezWidth", valorInicial: "Pesos" }),
            titulo: "Moneda"
          },
        ],
      },
      limiteCabecera: true,
      eliminar: true,
      deshabilitar: false,
      sort: { fecha: 1 },
      crear: false,
    },
    formInd: {
      inputRenglones: [6, `compuesto`, 8, 6],
    },
    funcionesPropias: {
      inicio: {
        cabeceraFiltroAbm: [cabeceraFiltroAbm]
      },
      finalAbm: {
        rellenoAbmEstado: [rellenoAbmEstado, "estado", { cerrado: "azulLetra", saldoafavor: "azulLetra", abierto: "naranjaLetra" }],
        rellenoAbmFechaVenc: [rellenoAbmFechaVenc, "estado", { abierto: "rojoLetra" }, "fechaVencimiento"],
      },
      formularioIndiv: {
        estadoAnticipo: [estadoAnticipo],
      },
    },
    totalizadores: {

      formulario: {
        type: "totalizadorCabecera",
        total: ["importeGastos"],
        cantidad: false,
        digitosPositivos: ["importe"],
        trigger: ["importe"],
      },
      saldo: {
        type: "totalizadorCabecera",
        total: ["saldo"],
        digitosPositivos: ["importeTotal"],
        digitosNegativos: ["importeGastos"],
        trigger: ["importe", "importeGastos", "importeTotal"],
      },
    },

    key: "numerador",
    pest: `Anticipos financieros`,
    accion: `anticipoFinanciero`,
    empresa: true,
    multimoneda: true,
    type: "transaccion",
  },
  cuentaCorrienteClientes: {
    atributos: {
      names: [
        NS("numerador"),
        FH(),
        P({ nombre: "cliente", clase: "requerido" }),
        T({ nombre: "movimientoDestino", clase: "soloLectura" }),
        T({ nombre: "tipoComprobante", width: "ocho" }),
        T({ nombre: "numComprobante", width: "diez" }),
        P({ nombre: "moneda", clase: "requerido", width: "diez" }),
        N({ nombre: "tipoCambio", clase: "requerido", oculto: "oculto" }),
        I({ nombre: "importe", clase: "requerido textoCentrado" }),
        I({ nombre: "saldoComprobante" }),
        PPE({ nombre: "estado", clase: "soloLectura", opciones: ["Pendiente", "Pago Parcial", "Cerrado"] }),
        F({ nombre: "fechaVencimiento" }),
        I({ nombre: "saldoCalculado" }),
        TA("descripcionCompleto"),
        T({ nombre: "comprobanteOP", oculto: "oculto" }),],
      adjunto,
      titulos: [`Num`, `Fecha`, `Cliente`, `Origen`, `Tipo`, `Comprobante`, `Moneda`, `TC`, `Importe`, `Saldo comprobante`, `Estado`, `Fecha vencimiento`, `Saldo`, `Descripción`, `Comprobante OP`, `Adjuntos`],
      cabeceraAbm: {
        select: [
          {
            atributo: P({ nombre: "cliente", clase: "textoCentrado doceWidth" }),
            titulo: "Cliente"
          },
          {
            atributo: P({ nombre: "moneda", clase: "textoCentrado condicionSaldo diezWidth", valorInicial: "Pesos" }),
            titulo: "Moneda",

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
      eliminar: false,
      deshabilitar: false,
      sort: { fecha: 1 },
      crear: false
    },
    formInd: {
      inputRenglones: [5, 6, 2, 6],

    },
    funcionesPropias: {
      inicio: {
        cabeceraFiltroAbm: [cabeceraFiltroAbm],
      },
      finalAbm: {
        asignacionSaldosCabecera: [asignacionSaldosCabeceraCC, "cuentaCorrienteClientes", "cliente", "cuentaCorrienteClientes"],
        asignacionSaldosCabeceraD: [asignacionSaldosCabeceraCC, "cuentaCorrienteClientesTotal", "cliente", "cuentaCorrienteClientesTotal"],
        asignarValorDesdeCabecera: [asignarValorDesdeCabecera],
        atributoSaldoAbm: [atributoSaldoAbm, "saldoCalculado", "importe"],
        //filtroAsociativo: [filtroAsociativo, "cuentasBancarias", "bancos", "cuentasBancarias"],
        itemsNegativos: [itemsNegativos, "itemsBancos"],
        rellenoAbmEstado: [rellenoAbmEstado, "estado", { cerrado: "azulLetra", pendiente: "naranjaLetra", pagoparcial: "naranjaLetra" }],
        rellenoAbmFechaVenc: [rellenoAbmFechaVenc, "estado", { pendiente: "rojoLetra", pagoparcial: "rojoLetra" }, "fechaVencimiento"],
      },
      formularioIndiv: {
        cabeceraFormIndividual: [cabeceraFormIndividual],
        // filtroAsociativo: [filtroAsociativo, "cuentasBancarias", "bancos", "cuentasBancarias"],
        ocultarElementos: [ocultarElementos, ["saldoCalculado"]],
        itemsNegativos: [itemsNegativos, "itemsBancos"],
      },
    },
    key: "numerador",
    pest: `Ctas ctes clientes`,
    accion: `cuentaCorrienteClientes`,
    empresa: true,
    multimoneda: true,
    type: "transaccion",
    acumulador: {
      cuentaCorrienteClientes: {
        nombre: "CtaCteCliente por moneda y fecha",
        atributosSuma: {
          importe: `importe`,
          importemb: `importemb`,
          importema: `importema`,
        },
        atributos: {
          moneda: "moneda",
          cliente: "cliente"
        },
      },
      cuentaCorrienteClientesTotal: {
        nombre: "CtaCteCliente fecha",
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
  cuentaCorrienteProveedores: {
    atributos: {
      names: [
        NS("numerador"),
        FH(),
        P({ nombre: "proveedor", clase: "requerido" }),
        T({ nombre: "movimientoDestino", clase: "soloLectura" }),
        T({ nombre: "tipoComprobante", width: "cinco" }),
        T({ nombre: "numComprobante", width: "diez" }),
        P({ nombre: "moneda", clase: "requerido", width: "diez" }),
        N({ nombre: "tipoCambio", clase: "requerido", oculto: "oculto" }),
        I({ nombre: "importe", clase: "requerido textoCentrado" }),
        I({ nombre: "saldoComprobante" }),
        PPE({ nombre: "estado", clase: "soloLectura", opciones: ["Pendiente", "Pago Parcial", "Cerrado"] }),
        F({ nombre: "fechaVencimiento" }),
        I({ nombre: "saldoCalculado" }),
        TA("descripcionCompleto"),
        T({ nombre: "comprobanteOP", oculto: "oculto" }),],
      adjunto,
      titulos: [`Num`, `Fecha`, `Proveedor`, `Origen`, `Tipo`, `Comprobante`, `Moneda`, `TC`, `Importe`, `Saldo comprobante`, `Estado`, `Fecha vencimiento`, `Saldo`, `Descripción`, `Adjuntos`],
      cabeceraAbm: {
        select: [
          {
            atributo: P({ nombre: "proveedor", clase: "textoCentrado doceWidth" }),
            titulo: "Proveedor"
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
      eliminar: false,
      deshabilitar: false,
      sort: { fecha: 1 },
      crear: false
    },
    formInd: {
      inputRenglones: [5, 6, 2, 6],

    },
    funcionesPropias: {
      inicio: {
        cabeceraFiltroAbm: [cabeceraFiltroAbm],
      },
      finalAbm: {
        asignacionSaldosCabecera: [asignacionSaldosCabeceraCC, "cuentaCorrienteProveedores", "proveedor", "cuentaCorrienteProveedores"],
        asignacionSaldosCabeceraD: [asignacionSaldosCabeceraCC, "cuentaCorrienteProveedoresTotal", "cliente", "cuentaCorrienteProveedoresTotal"],
        asignarValorDesdeCabecera: [asignarValorDesdeCabecera],
        atributoSaldoAbm: [atributoSaldoAbm, "saldoCalculado", "importe"],
        //filtroAsociativo: [filtroAsociativo, "cuentasBancarias", "bancos", "cuentasBancarias"],
        itemsNegativos: [itemsNegativos, "itemsBancos"],
        rellenoAbmEstado: [rellenoAbmEstado, "estado", { cerrado: "azulLetra", pendiente: "naranjaLetra", pagoparcial: "naranjaLetra" }],
        rellenoAbmFechaVenc: [rellenoAbmFechaVenc, "estado", { pendiente: "rojoLetra", pagoparcial: "rojoLetra" }, "fechaVencimiento"],
      },
      formularioIndiv: {
        cabeceraFormIndividual: [cabeceraFormIndividual],
        // filtroAsociativo: [filtroAsociativo, "cuentasBancarias", "bancos", "cuentasBancarias"],
        ocultarElementos: [ocultarElementos, ["saldoCalculado"]],
        itemsNegativos: [itemsNegativos, "itemsBancos"],
      },
    },
    acumulador: {
      cuentaCorrienteProveedores: {
        nombre: "CtaCteProv por moneda y fecha",
        atributosSuma: {
          importe: `importe`,
          importemb: `importemb`,
          importema: `importema`,
        },
        atributos: {
          moneda: "moneda",
          proveedor: "proveedor"
        },
      },
      cuentaCorrienteProveedoresTotal: {
        nombre: "CtaCteProv fecha",
        atributosSuma: {
          importe: `importe`,
          importemb: `importemb`,
          importema: `importema`,
        },
        atributos: {
          moneda: "moneda",
        },
      },
    },
    key: "numerador",
    pest: `Ctas ctes proveedores`,
    accion: `cuentaCorrienteProveedores`,
    empresa: true,
    multimoneda: true,
    type: "transaccion",

  },
  proveedor: {
    atributos: {
      names: [
        NS("numerador"),
        T({ nombre: `name`, width: "veinte", clase: "requerido primeraMayusOracion" }),
        PPE({ nombre: "DocTipo", opciones: ["CUIT", "DNI", "Consumidor Final"] }),
        T({ nombre: `documento`, clase: "formatoNumeroDni" }),
        PPE({ nombre: "condicionImpositiva", opciones: ["Responsable Inscripto", "Monotributo", "Consumidor Final", "Exento"] }),
        P("listasPrecios"),
        TA("observaciones"),
        contacto,
        direcciones,
        habilitado,
      ],
      titulos: [
        "Numero", "Nombre ", "Tipo Documento", `DNI/CUIT`, `Condición Impositiva`, `Tipo de precio`, `Observaciones`, `contacto`, "direcciones",
      ],
      eliminar: false,
      deshabilitar: true,
    },
    formInd: {
      inputRenglones: [4, 2, `compuesto`, 2],
    },
    funcionesPropias: {
      formularioIndiv: {
        formatoDocumento: [formatoDocumento, "documento"],
        formatoTelefono: [formatoTelefono, "telefonoContacto"],
      }
    },
    key: "documento",
    pest: `Proveedor`,
    accion: `proveedor`,
    type: "parametrica",
  },
  itemCompra: {
    atributos: {
      names: [
        NS("numerador"),
        T({ nombre: "name", clase: "requerido" }),
        PPE({ nombre: "concepto", opciones: ["Servicio", "Producto"] }),
        habilitado,
      ],
      titulos: [`Numero`, `Item`, `Concepto`],
      eliminar: false,
      deshabilitar: true,
    },
    key: "name",
    pest: `Item Compra`,
    accion: `itemCompra`,
    type: "parametrica",
  },
  facturasProveedores: {
    atributos: {
      names: [
        P({ nombre: "proveedor", clase: "requerido" }),
        FH(),
        F({ nombre: "fechaVencimiento", clase: "requerido" }),
        PPE({ nombre: "tipoComprobante", width: "diez", clase: "requerido", opciones: ["Letra A", "Letra B", "Letra C", "Letra M", "Letra E", "Letra T"] }),
        T({ nombre: "numComprobante", clase: "textoCentrado requerido" }),
        P({ nombre: "moneda", width: "doce", clase: "requerido" }),
        N({ nombre: "tipoCambio", clase: "requerido" }),
        detalleProducto,
        compuestoFacturaCompras,
        compuestoMedioPagos,
        remitoIngreso,
        I({ nombre: "importeTotal", clase: "soloLectura transparente" }),
        TF("descripcionCompleto"),
        adjunto,
        // PPE({ nombre: "estado", clase: "transparente soloLectura centrado", opciones: ["Aprobado", "Directo", "Pendiente"], valorInicial: "Pendiente" }),

      ],
      titulos: ["Proveedor", `Fecha`, `Fecha vencimiento`, `Letra`, "Numero", `Moneda`, `TC`, "detalleProducto", "compuestoFacturaVentas", "compuestoMedioPagos", "remitoIngreso", `Importe`, `Observaciones`, `Adjuntos`],
      limiteCabecera: true,
      deshabilitar: false,
      valorInicial: {
        select: {
          tipoPago: "Cuenta corriente"
        }
      }
    },
    formInd: {
      inputRenglones: [5, 2, `compuesto`, 4, 6],
    },
    funcionesPropias: {
      cargar: {
        valoresInicialesMediosPagos: [valoresInicialesMediosPagos, "importeTotal"],
        ocultarAtributos: [ocultarAtributos],
      },
      formularioIndiv: {
        letraCodigoComprobante: [letraCodigoComprobante],
        mostrarPestanaProductoProveedores: [mostrarPestanaProductoProveedores],
        estadoFacturacionRemito: [estadoFacturacionRemito],
        formatoFacturas: [formatoFacturas, "numComprobante"],
        //cambiarBoton: [cambiarBoton, `okBoton`, iOkFacturaElec],
        //cambiarBotonD: [cambiarBoton, `okfPlus`, okPlusElectronica],
      },
      finalAbm: {
        rellenoAbmEstado: [rellenoAbmEstado, "estado", { pendiente: "naranjaLetra", directo: "verdeLetra", aprobado: "azulLetra" }],

      }
    },
    desencadenante: {
      cuentaCorrienteProveedores: {
        identificador: "cuentaCorrienteProveedores",
        type: "condicionSegunFuncion",
        funcionCondicion: [almenosUnCtaCtte],
        opciones: {
          cuentaCorriente: {
            destino: "cuentaCorrienteProveedores",
            nombre: "Cuentas Corrientes",
            atributos: {
              valorFijo: {
                estado: "Pendiente",
                movimientoDestino: "Facturas ingresadas",
              },
              cambiarAtributos: {
                importe: "importeTotal",
                importemb: "importeTotalmb",
                importema: "importeTotalma",
              },
              funcion: {
                saldoComprobante: [saldoComprobanteFact],
              },
            },
            grabarEnOrigen: { Número: "numerador" },
            grabarEnDestino: { Número: "numComprobante" }
          }
        }
      }
    },
    desencadenaColeccion: {
      mediosPagos: {
        type: "condicionSegunFuncion",
        identificador: "mediosPagos", //este atributo siempre se crean atributos identificadores de los desencadenantes (hoja: variablesIniciales, func: agregarIdDesenCompononentesObjetos)
        eliminarDesencadenate: ["tipoPago"],//Si cambia este atributo se elimina el desencadenate
        coleccionOrigen: compuestoMedioPagos,
        funcionCondicion: [seleccionDesencadenanteMedioPago],
        opciones: {
          transferencia: {
            destino: "saldosBancos",
            nombre: "Movimientos Bancarios",
            atributosColeccion: {
              cambiarAtributos: {
                importe: "importeTipoPago",
                importemb: "importeTipoPagomb",
                importema: "importeTipoPagoma",
                moneda: "monedaTipoPago",
                tipoCambio: "tipoCambioTipoPago"
              },
              funcion: {
                bancos: [buscarAtributosParamentricos, "bancos", "cuentasBancarias"]
              },
              valorFijo: {
                itemsBancos: "Facturas emitidas",
              },
              delete: { numerador: "numerador" },
            },
            grabarEnOrigenColeccion: { Número: "numerador" }, //se pone primer el atributo en el origen segundo en el destino
            grabarEnDestino: { Número: "numerador" },

          },
          chequeDeTercero: {
            destino: "chequesTercero",
            nombre: "Valores en cartera",
            atributosCabecera: {},
            atributosColeccion: {
              cambiarAtributos: {
                importe: "importeTipoPago",
                importemb: "importeTipoPagomb",
                importema: "importeTipoPagoma",
                moneda: "monedaTipoPago",
                tipoCambio: "tipoCambioTipoPago"
              },
              valorFijoPestana: {
                tipoPago: `Cheques de terceros`,
              },
              valorFijo: {
                estado: "En cartera",
              },
              delete: { cuentasBancarias: "cuentasBancarias" },
              deleteVacio: { bancos: "bancos" },
            },
            grabarEnOrigenColeccion: { Número: "numeroDeCheque" },
            grabarEnDestino: { Número: "numerador" },
          },
          efectivo: {
            destino: "saldosCajas",
            nombre: "Movimientos Cajas",
            atributosCabecera: {},
            atributosColeccion: {
              cambiarAtributos: {
                importe: "importeTipoPago",
                importemb: "importeTipoPagomb",
                importema: "importeTipoPagoma",
                moneda: "monedaTipoPago",
                tipoCambio: "tipoCambioTipoPago"
              },
              valorFijo: {
                itemsCajas: `Facturas emitidas`,
              },
              delete: { cuentasBancarias: "cuentasBancarias", bancos: "bancos", numerador: "numerador" },
            },
            grabarEnOrigenColeccion: { Número: "numerador" }, //se pone primer el atributo en el origen segundo en el destino, y siempre primero el id
            grabarEnDestino: { Número: "numerador" },
          },
        },
      },
      detalleProducto: {
        type: "condicionSegunFuncion",
        coleccionOrigen: detalleProducto,
        identificador: "detalleProducto",
        eliminarDesencadenate: ["producto"],//Si cambia este atributo se elimina el desencadenate
        funcionCondicion: [facturaStock, "ingresaStock"],
        opciones: {
          facturacion: {
            destino: "stock",
            nombre: "Inventario",
            atributosColeccion: {
              cambiarAtributos: {
                unidadesMedida: "unidadesMedidaProducto",
                almacen: "almacenProducto",
                cantidad: "cantidadProducto"
              },
              funcion: {
                marca: [buscarAtributosParamentricos, "marca", "producto"],
              },
              valorFijo: {
                operacionStock: "Entrada",
              },

            },
            grabarEnOrigen: { Número: "numComprobante" },
            grabarEnOrigenColeccion: { Número: "numerador" }, //se pone primer el atributo en el origen segundo en el destino
            grabarEnDestino: { Número: "numComprobante" },
          }
        },

      },
    },
    imputarcoleccion: {
      remitoIngreso: {
        type: "condicionSegunFuncion",
        coleccionOrigen: remitoIngreso,
        identificador: "remitoIngreso",
        eliminarDesencadenate: ["cantidad"],//Si cambia este atributo se elimina el desencadenate
        funcionCondicion: [facturaStock, "ingresaStock"],
        opciones: {
          remito: {
            destino: "stock",
            nombre: "Stock",
            atributoImputables: {
              cambioNombre: {
                comprobanteOP: "numComprobante",
                _id: "idComprobante",
                //q: "idColeccionUnWind",
              },
              valorFijo: {
                estadoFacturacion: "Facturado"
              },

              grabarEnOrigen: { Número: "numerador" },
              grabarEnOrigenColeccion: { Número: "numerador" },
              grabarEnDestino: { Número: "numerador" },
            },
            grabarEnDestino: { Número: "numComprobante" },
            grabarEnOrigenColeccion: { Número: "numComprobante" }, //se pone primer el atributo en el origen segundo en el destino
          },

        },

      },
    },
    totalizadores: {
      formulario: {
        type: "totalizadorCabecera",
        total: ["importeTotal"],
        cantidad: false,
        digitosPositivos: ["subtotalVentas"],
        trigger: ["subtotalVentas"],
      },
    },
    key: "numComprobante",
    pest: `Facturas proveedores`,
    pestIndividual: `Ingresar facturas proveedores`,
    accion: `facturasProveedores`,
    multimoneda: true,
    type: "transaccion",
  },
};
let variablesModeloPagosCobrosTransformar = {
  pendFactOperLogistica: {
    atributos: {
      names: [T({ nombre: "_idColeccionUnWind", oculto: "oculto" })],
      titulos: ["_idColeccionUnWind"],
      posicion: [999],
      deleteItem: [0],
      abmCompuesto: {
        cotizacionLogistica: {
          atributos: ["idColCotizacionGemela", "cantidadCotizacion", "unidadesMedida", "itemVenta", "monedaComp", "importeOchoCotizacion"],
          titulos: ["Documento", "Cantidad", "Medida", "item", "Moneda", "Importe",],
        },
      },
      crear: false,
    },
    formInd: {
      type: "unWind", //esto lo uso para generar el formualrio individual, puede ser doble, indvidual o unWind, ya que apra generar el registro individual debe matcher array e id
      titulos: ["_idColeccionUnWind"],
      inputRenglones: [8, 3, 2, `compuesto`, 4, 1, 4],
      ordenFormu: [-3, 999],
    },
    funcionesPropias: {
      formularioIndiv: {
        ocultarColeccionSegunEstaVacia: [ocultarColeccionSegunEstaVacia, cotizacionLogistica],
      },
      finalAbm: {
        cambiarUbicacionAtributo: [cambiarUbicacionAtributo, {
          cantidadCotizacion: 3, unidadesMedida: 3, itemVenta: 3, monedaComp: 3, importeOchoCotizacion: 3, idColCotizacionGemela: 3
        },
        ],
        numeroDeDocumentoAbm: [numeroDeDocumentoAbm],
      },
    },
    trigger: {//Lo uso para disparar funciones segun valroes iniciales o recibito del desencadenante
      select: ["cliente"]
    },
    pest: `Pendiente de facturar`,
    pestIndividual: `Pendiente de facturar`,
    accion: `operacionesLogistica`,
    desencadenaAgrupado: {
      facturasEmitidas: {
        destino: "facturasEmitidas",
        identificador: "facturasEmitidas",
        nombre: "Facturas Emitidas",
        fusionColec: "cotizacion",
        typeDestino: "childColec",
        atributosFusion: { cliente: "cliente", moneda: "monedaComp", },
        cabeceraAColec: {
          numeradorRef: "numerador",
          textoRef: "ancla",
          textoOcho: "textoOcho",
          referenciaCliente: "referenciaCliente"
        },
        atributosConcatenar: [
          Object.keys(cotizacionLogistica.componentes),
        ].flat(),
        atributos: {
          cambiarAtributos: {
            cantidad: "cantidadCotizacion",
            importeBruto: "importeSeisCotizacion",
            precioUnitario: "importeCincoCotizacion"
          },
          funcion: {
            descripcionCompleto: [descripcionOperFact],
            positioncompuestoFacturaVentas: [chequeLength, "itemVenta"],
          },
        },
        grabarEnOrigen: [{ titulo: "Pto", nombre: "ancla" }, { titulo: "Numero", nombre: "numerador" }],
        atributoGrabarColec: "facturado", // Este es disinto en confirmaod al enviar pone el numeo de comprobante en el atributo facturado
        grabarEnDestino: [{ titulo: "Numero", nombre: "numerador" }],
      },
    },
    atributosModificadosAlEnviar: {
      confirmar: {
        cabecera: {
          textoCinco: "Facturado",
        },
      },
      rechazar: {
        coleccion: {
          facturado: "Rechazado",
        },
        cabecera: {
          textoCinco: "RechazadoFact",
        },
      },
    },
    type: "aprobarColección", //para aprobar hay distintos tipos
    botones: {
      aprobar: "Facturar",
    },
    atributoMultipleMenu: [P("cliente"), "monedaComp", "idColCotizacionGemela"], //Limita como se filtra el abm
    datos: "unWind", //datos del abm
    coleccionPlancha: {
      0: {
        coleccion: cotizacionLogistica,
        key: `itemVenta`,
      },
    },
    fechaRegistros: addDay(Date.now(), -10, 0, 0, `y-m-d`),
    filtrosUnWind: {
      cabecera: {
        estado: [filtroValorIgual, "Confirmado"], //confirmación de embarque
        textoDos: [filtroValorIgual, "Confirmada"], //comfirmación de tarira
        textoSiete: [filtroValorIgual, "Confirmado"], //Aviso de arribo
      },
      coleccion: {
        facturado: [filtroValorIgual, "No Facturado"],
      },
    }
  },
  itemsFactRechazo: {
    atributos: {
      names: [T({ nombre: "_idColeccionUnWind", oculto: "oculto" })],
      titulos: ["_idColeccionUnWind"],
      posicion: [999],
      deleteItem: [0],
      limiteCabecera: true,
      crear: false,
    },
    formInd: {
      titulos: ["_idColeccionUnWind"],
      inputRenglones: [8, 3, 2, `compuesto`, 4, 1, 6],
      ordenFormu: [-3, 999],
    },
    pest: `Items rechazados`,
    pestIndividual: `Items rechazados`,
    accion: `operacionesLogistica`,
    type: "aprobarColección",
    botones: {
      aprobar: "Revertir",
      acciones: ["eliminarBotonDesaprobar"],
    },
    datos: "unWind",
    coleccionPlancha: {
      0: {
        coleccion: cotizacionLogistica,
        key: `itemVenta`,
      },
    },
    fechaRegistros: addDay(Date.now(), -10, 0, 0, `y-m-d`),
    filtros: {
      estado: [filtroValorIgual, "Confirmado"], //confirmación de embarque
      textoDos: [filtroValorIgual, "Confirmada"], //comfirmación de tarira
      textoSiete: [filtroValorIgual, "Confirmado"], //Aviso de arribo
      facturado: [filtroValorIgual, "Rechazado"],
    },
    atributosModificadosAlEnviar: {
      confirmar: {
        coleccion: {
          facturado: "No Facturado",
        },
      },
    },
  },
  facturacionOrdenSalida: {
    atributos: {
      names: [T({ nombre: "_idColeccionUnWind", oculto: "oculto" })],
      titulos: ["_idColeccionUnWind"],
      posicion: [999],
      deleteItem: [0],
      abmCompuesto: {
        movimientoStock: {
          atributos: ["producto", "unidadesMedida", "cantidad", "estadoFacturacion"],
          titulos: ["Producto", "Unidades", "Cantidad", "Estado Facturacion"],
        },
      },
      crear: false,

    },
    pestanas: [P("itemVenta")],
    formInd: {
      type: "unWind", //esto lo uso para generar el formualrio individual, puede ser doble, indvidual o unWind, ya que apra generar el registro individual debe matcher array e id
      titulos: ["_idColeccionUnWind"],
      inputRenglones: [8, 3, 2, `compuesto`, 4, 1, 4],
      ordenFormu: [-3, 999],
    },
    trigger: {//Lo uso para disparar funciones segun valroes iniciales o recibito del desencadenante
      select: ["cliente"]
    },
    pest: `Facturacion OS`,
    pestIndividual: `Facturacion OS`,
    accion: `salidaInventario`,
    desencadenaAgrupado: {
      facturasEmitidas: {
        destino: "facturasEmitidas",
        identificador: "facturasEmitidas",
        nombre: "Facturas Emitidas",
        fusionColec: "movimientoStock",
        typeDestino: "childColec",
        atributosFusion: { cliente: "cliente" },
        cabeceraAColec: {
          numeradorRef: "numerador",
          almacenProducto: "almacen",
        },
        atributosConcatenar: [
          Object.keys(movimientoStock.componentes),
        ].flat(),
        atributos: {
          cambiarAtributos: {
            cantidadProducto: "cantidad",
            unidadesMedidaProducto: "unidadesMedida",
          },
          //delete: { numerador: "numerador" },
          funcion: {
            itemVenta: [consultaAtributo, "producto"],
            positioncompuestoFacturaVentas: [chequeLength, "itemVenta"],
            //refEnviar: [crearREfEnviar, "string", ["tipoComprobante", "ancla", "numerador"]],

          }

        },
        grabarEnOrigen: { Número: "numerador",/* refEnviar*/ },
        atributoGrabarColec: "estadoFacturacion", // Este es disinto en confirmaod al enviar pone el numeo de comprobante en el atributo facturado
        grabarEnDestino: { Número: "numerador" },
      },
    },
    atributosModificadosAlEnviar: {
      confirmar: {
        coleccion: {
          estadoFacturacion: "Facturado",
        },
      },
      rechazar: {
        coleccion: {
          estadoFacturacion: "Rechazado",
        },
      },
    },
    type: "aprobarColección", //para aprobar hay distintos tipos
    botones: {
      aprobar: "Facturar",
    },
    atributoMultipleMenu: [P("cliente")], //Limita como se filtra el abm
    datos: "unWind", //datos del abm
    coleccionPlancha: {
      0: {
        coleccion: movimientoStock,
        key: `producto`,
      },
    },
    fechaRegistros: addDay(Date.now(), -10, 0, 0, `y-m-d`),
    filtrosUnWind: {
      cabecera: {
        operacionStock: [filtroValorIgual, `Salida`], //confirmación de embarque
      },
      coleccion: {
        estadoFacturacion: [filtroValorIgual, `Pendiente`],
      },
    }
  },
  facturacionOrdenEntrada: {
    funcionesPropias: {

    },
    pest: `Facturar entradas`,
    pestIndividual: `Facturar entradas`,
    accion: `stock`,
    type: "aprobar",
    desencadenaAgrupado: {
      facturasProveedores: {
        destino: "facturasProveedores",
        identificador: "facturasProveedores",
        nombre: "Facturas Proveedores",
        typeDestino: "childColec",
        atributosFusion: { cliente: "cliente" },
        cabeceraAColec: {
          numeradorRef: "numerador",
          almacenProducto: "almacen",
        },
        atributos: {
          cambiarAtributos: {
            cantidadProducto: "cantidad",
            unidadesMedidaProducto: "unidadesMedida",
          },
          //delete: { numerador: "numerador" },
          funcion: {
            itemVenta: [consultaAtributo, "producto"],
            // positioncompuestoFacturaVentas: [chequeLength, "itemVenta"],
            //refEnviar: [crearREfEnviar, "string", ["tipoComprobante", "ancla", "numerador"]],

          }

        },
        grabarEnOrigen: { Número: "numerador",/* refEnviar*/ },
        atributoGrabarColec: "comprobanteOP", // Este es disinto en confirmaod al enviar pone el numeo de comprobante en el atributo facturado
        grabarEnDestino: { Número: "numerador" },
      },
    },
    botones: {
      aprobar: "Facturar",
    },
    fechaRegistros: addDay(Date.now(), -10, 0, 0, `y-m-d`),
    filtros: {
      comprobanteOP: [filtroValorIgual, "Pendiente"],
      operacionStock: [filtroValorIgual, "Entrada"]

    },

    atributosModificadosAlEnviar: {
      confirmar: {
        cabecera: {
          comprobanteOP: "numerador",
        },
      },

    },
    //typeHistorial: "Confirmó embarque"
  }
}