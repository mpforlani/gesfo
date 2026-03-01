let variablesModeloInventarios = {
    stock: {
        atributos: {
            names: [NS("numerador"),
            F(),
            P("producto"),
            P("marca"),
            P("unidadesMedida"),
            N("cantidad"),
            PPE({ nombre: "estado", opciones: ["Ingresado", "Salida parcial", "Salida total"] }),

            T({ nombre: "comprobanteOP", oculto: "oculto" }),
            P({ nombre: "operacionStock", oculto: "oculto" }),
            N("disponibles"),
            F({ nombre: "fechaVencimientoProducto" }),
            P({ nombre: "proveedor" }),
            T({ nombre: "remito", clase: "requerido textoCentrado" }),
            PPE({ nombre: "estadoFacturacion", opciones: ["Pendiente", "Facturado"] }),
            P("almacen"),
            ],
            titulos: ["Número", "Fecha", "Producto", "Marca", "Unidad de medida", "Cantidad", "Estado", "Comprobante", "Operación", "Disponibles", "Vencimiento", "Proveedor", "Remito", "Facturacion", "Almacen"],
            crear: false,
            editar: false,
            eliminar: false,
            deshabilitar: true,
            limiteCabecera: true,
            sort: { fecha: 1 },
            cabeceraAbm: {
                select: [
                    {
                        atributo: P({ nombre: "producto", clase: "condicionSaldo doceWidth" }),
                        titulo: "Producto"
                    }, {
                        atributo: P({ nombre: "almacen", clase: "doceWidth" }),
                        titulo: "Almacen"
                    }, {
                        atributo: PPE({ nombre: "estado", opciones: ["Ingresado", "Salida parcial", "Salida total"] }),
                        titulo: "Operación"
                    },
                ],
            },
        },
        funcionesPropias: {
            inicio: {
                cabeceraFiltroAbm: [cabeceraFiltroAbm],
            },
            finalAbm: {
                rellenoAbmEstado: [rellenoAbmEstado, "estado", { salidatotal: "naranjaLetra", ingresado: "azulLetra" }],
                // rellenoAbmFechaVenc: [rellenoAbmFechaVenc, "estado", { pendiente: "rojo", pagoparcial: "rojo" }],
            },
        },
        acumulador: {
            existencia: {
                nombre: "Existencias",
                atributosSuma: {
                    cantidad: "cantidad"
                },
                atributos: {
                    producto: "producto",
                    unidadesMedida: "unidadesMedida",
                    almacen: "almacen"
                },
                atributosSumaAcumulado: {
                    cantidadTotal: "disponibles"
                }
            },
        },
        key: "numerador",
        pest: `Stock`,
        accion: `stock`,
        type: "transaccion"
    },
    entradaInventario: {
        atributos: {
            names: [
                NS("numerador"),
                FH(),
                P({ nombre: "almacen", clase: "requerido" }),
                PPE({ nombre: "operacionStock", opciones: ["Entrada", "Ajuste"], clase: "requerido" }),
                P({ nombre: "proveedor", clase: "requerido" }),
                T({ nombre: "remito", clase: "requerido textoCentrado" }),
                movimientoStock,
                TF("observaciones"),
                adjunto,
            ],
            titulos: ["Número", "Fecha", "Almacen", "Operación", "Proveedor", "Remito Proveedor", `movimientoStock`, "Observaciones", "Adjunto"],
            cabeceraAbm: {
                select: [
                    {
                        atributo: P({ nombre: "almacen", clase: "textoCentrado doceWidth" }),
                        titulo: "Almacen"
                    },

                ],
            },
            limiteCabecera: true,
            eliminar: true,
            deshabilitar: false,
            sort: { fecha: 1 }
        },
        formInd: {
            inputRenglones: [4, 2, `compuesto`, 2, 6],
            impresion: {
                titulo: "Entrada de Inventario",
                alargar: true,
                bloques: {
                    cabeceraRenglon: {
                        clases: "notMargin",
                        componentes: {
                            0: {
                                type: [cabeceraStandar, ["Entrada"]],
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
                                type: [infoReferencia, [P("almacen"), ["name"], ["Almacen"]]],
                                class: `izquierda`
                            },
                            1: {
                                //numero de remito y observaciones
                                type: [returnUnAtributoTitulo, [{ titulo: "Operación", nombre: "operacionStock" }]],
                                class: `derecha rightContenido `
                            }
                        }
                    },
                    tercerRenglon: {
                        clases: "medioCol borderNone",

                        componentes: {
                            0: {
                                type: [infoReferencia, [P("proveedor"), ["name"], ["Proveedor"]]],
                                class: `izquierda`
                            },
                            1: {
                                type: [returnUnAtributoTitulo, [{ titulo: "Remito", nombre: "remito" }]],
                                class: `derecha rightContenido `
                            }

                        }
                    },
                    cuartoRenglon: {
                        clases: "full alargar",
                        componentes: {
                            0: {
                                type: [
                                    itemsComprobantes,
                                    [
                                        [
                                            N({ nombre: "cantidad", clase: "textoCentrado", width: "cinco" }),
                                            P({ nombre: "unidadesMedida", width: "tres" }),
                                            P({ nombre: "producto", clase: "textoCentrado", width: "quince" }),
                                            T({ nombre: "estadoFacturacion", clase: "textoCentrado", width: "ocho" }),
                                            T({ nombre: "descripcion", clase: "textoCentrado", width: "seis" }),

                                        ],
                                        movimientoStock,
                                    ],
                                ],
                            },
                        },
                    },
                    quintoRenglon: {
                        clases: "full",
                        componentes: {
                            0: {
                                type: [retunrTextoDeParametro, [["<h5>Observaciones:</h5>"]]],
                                class: `izquierda`
                            },
                        },
                    },
                    sextoRenglon: {
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
            inicio: {
                cabeceraFiltroAbm: [cabeceraFiltroAbm],
            },
            formularioIndiv: {
                ocultoSiempre: [ocultoSiempre, ["disponibles", "cantidadSalidas"]],
                ocultarIngresoStock: [ocultarIngresoStock],
                estadoSegunOperacion: [estadoSegunOperacion],
                formatoFacturas: [formatoFacturas, "remito"],
                completaConCodigo: [completaConCodigo],

            },

        },
        desencadenaColeccion: {
            movimientoStock: {
                type: "directo",
                coleccionOrigen: movimientoStock,
                identificador: "movimientoStock",
                eliminarDesencadenate: ["producto"],//Si cambia este atributo se elimina el desencadenate
                destino: "stock",
                nombre: "Entradas stock",
                destino: "stock",
                atributosColeccion: {
                    funcion: {
                        marca: [buscarAtributosParamentricos, "marca", "producto"]
                    },
                    valorFijo: {
                        estado: "Ingresado",
                        estadoFacturacion: "Pendiente",
                    },
                    cambiarAtributos: {
                        disponibles: "cantidad"
                    },
                    grabarEnOrigen: { Número: "numerador" },
                    grabarEnOrigenColeccion: { Número: "numerador" },
                    grabarEnDestino: { Número: "numerador" },
                },
                grabarEnDestino: { Número: "numerador" },
                grabarEnOrigenColeccion: { Número: "numerador" }, //se pone primer el atributo en el origen segundo en el destino
            },
        },
        pest: `Ingreso stock`,
        accion: `entradaInventario`,
        empresa: true,
        type: "transaccion",
        multimoneda: false,
        key: "numerador"

    },
    salidaInventario: {
        atributos: {
            names: [
                NS({ nombre: "numerador" }),
                FH(),
                P({ nombre: "almacen", clase: "requerido" }),
                PPE({ nombre: "operacionStock", opciones: ["Ajuste", "Salida"], clase: "requerido" }),
                P({ nombre: "cliente", clase: "requerido" }),
                movimientoStock,
                TF("observaciones"),
                adjunto
            ],
            titulos: ["Número", "Fecha", "Almacen", "Operación", "Cliente", "movimientoStock", "Observaciones", "Adjunto"],
            cabeceraAbm: {
                select: [
                    {
                        atributo: P({ nombre: "almacen", clase: "textoCentrado doceWidth" }),
                        titulo: "Almacen"
                    }],
            },

            limiteCabecera: true,
            eliminar: true,
            deshabilitar: false,
            sort: { fecha: 1 }
        },
        formInd: {
            inputRenglones: [4, 1, `compuesto`, 2, 6],
            impresion: {
                titulo: "Salida de Inventario",
                alargar: true,
                bloques: {
                    cabeceraRenglon: {
                        clases: "notMargin",
                        componentes: {
                            0: {
                                type: [cabeceraStandar, ["Salida"]],
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
                                type: [infoReferencia, [P("almacen"), ["name"], ["Almacen"]]],
                                class: `izquierda`
                            },
                            1: {
                                //numero de remito y observaciones
                                type: [returnUnAtributoTitulo, [{ titulo: "Operación", nombre: "operacionStock" }]],
                                class: `derecha rigthContenido`
                            }
                        }
                    },
                    tercerRenglon: {
                        clases: "medioCol borderNone",

                        componentes: {
                            0: {
                                type: [infoReferencia, [P("cliente"), ["name"], ["Cliente"]]],
                                class: `izquierda`
                            },

                        }
                    },
                    cuartoRenglon: {
                        clases: "full alargar",
                        componentes: {
                            0: {
                                type: [
                                    itemsComprobantes,
                                    [
                                        [
                                            N({ nombre: "cantidad", clase: "textoCentrado", width: "cinco" }),
                                            P({ nombre: "unidadesMedida", width: "tres" }),
                                            P({ nombre: "producto", clase: "textoCentrado", width: "quince" }),
                                            T({ nombre: "estadoFacturacion", clase: "textoCentrado", width: "ocho" }),
                                            T({ nombre: "descripcion", clase: "textoCentrado", width: "seis" }),

                                        ],
                                        movimientoStock,
                                    ],
                                ],
                            },
                        },
                    },
                    quintoRenglon: {
                        clases: "full",
                        componentes: {
                            0: {
                                type: [retunrTextoDeParametro, [["<h5>Observaciones:</h5>"]]],
                                class: `izquierda`
                            },
                        },
                    },
                    sextoRenglon: {
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
            inicio: {
                cabeceraFiltroAbm: [cabeceraFiltroAbm],
                ocultarSalidaStock: [ocultarSalidaStock],
            },
            formularioIndiv: {

                ocultarSalidaStock: [ocultarSalidaStock],
                estadoSegunOperacion: [estadoSegunOperacion],
                consultaStock: [consultaStock],
                salidaStock: [salidaStock],
                completaConCodigo: [completaConCodigo],
                ajustesSalida: [ajustesSalida],
            },
        },
        desencadenaColeccion: {
            ajusteInventario: {
                type: "condicionSegunFuncion",
                coleccionOrigen: movimientoStock,
                identificador: "ajusteInventario",
                destino: "stock",
                nombre: "Ajustes",
                funcionCondicion: [tipoOperacion],
                opciones: {
                    ajuste: {
                        destino: "stock",
                        identificador: "ajuste",
                        nombre: "Ajustes",
                        atributosColeccion: {
                            funcion: {
                                marca: [buscarAtributosParamentricos, "marca", "producto"]
                            },
                            valorFijo: {
                                estado: "Ajuste",
                                estadoFacturacion: "Ajuste",
                            },
                            cambiarAtributos: {
                                disponibles: "cantidad"
                            },
                            grabarEnOrigen: { Número: "numerador" },
                            grabarEnOrigenColeccion: { Número: "numerador" },
                            grabarEnDestino: { Número: "numerador" },
                        },
                        grabarEnDestino: { Número: "numerador" },
                        grabarEnOrigenColeccion: { Número: "numerador" }, //se pone primer el atributo en el origen segundo en el destino
                    }
                },
            }
        },
        imputarcoleccion: {
            salidaInventario: {
                type: "condicionSegunFuncion",
                coleccionOrigen: movimientoStock,
                identificador: "salidaInventario",
                eliminarDesencadenate: ["producto"],//Si cambia este atributo se elimina el desencadenate
                destino: "stock",
                nombre: "Salidas stock",
                funcionCondicion: [tipoOperacion],
                opciones: {
                    salida: {
                        destino: "stock",
                        identificador: "salida",
                        nombre: "Salidas stock",
                        atributoImputables: {
                            funcion: {
                                disponibles: [pagoParcialImporte, "cantidadSalidas", "disponibles"],
                                estado: [pagoParcialString, "cantidadSalidas", { parcial: "Salida parcial", cerrado: "Salida total" }],

                            },
                            cambioNombre: {
                                _id: "idComprobante",
                            },
                        },
                        grabarEnOrigen: { Número: "numerador" },
                        grabarEnOrigenColeccion: { Número: "numerador" },
                        grabarEnDestino: { Número: "numerador" },
                    }
                }

            },
        },
        key: "numerador",
        pest: `Salida stock`,
        accion: `salidaInventario`,
        empresa: true,
        type: "transaccion",
        multimoneda: false,

    },
    listaDeVenta: {
        atributos: {
            names: [
                NS("numerador"),
                F({ nombre: "fecha", clase: "requerido" }),
                P({ nombre: "listasPrecios", clase: "requerido" }),
                preciosInventarios,
                TF("observaciones"),
                habilitado
            ],
            titulos: ["Numero", "Fecha", "Lista", "preciosInventarios", "Observaciones"],
            eliminar: false,
            deshabilitar: true,

        },
        formInd: {
            inputRenglones: [3, `compuesto`, 4],
        },

        key: `numerador`,
        pest: `Listas de ventas`,
        accion: `listaDeVenta`,
        type: "transaccional"
    },
    listaProveedores: {
        atributos: {
            names: [
                NS("numerador"),
                F({ nombre: "fecha", clase: "requerido" }),
                P({ nombre: "proveedor", clase: "requerido" }),
                costosInventarios,
                T("observaciones")
            ],
            titulos: ["Numero", "Fecha", "Proveedor", "costosInventarios", "Observaciones"],
            eliminar: false,
            deshabilitar: true,

        },
        formInd: {
            inputRenglones: [3, "compuesto", 6],
        },
        key: "producto",
        pest: `Listas proveedores`,
        accion: `listaProveedores`,
        type: "transaccion"
    },
    producto: {
        atributos: {
            names: [
                NS("numerador"),
                T({ nombre: "name", clase: "requerido" }),
                P("categoriaProducto"),
                P("marca"),
                P("itemVenta"),
                P("itemCompra"),
                T({ nombre: "codigoDeBarras", clase: "requerido" }),
                costosProducto,
                preciosProducto,
                toleranciaStock,
                quiebreDeStock,
                adjunto,
                TA("descripcion"),
                habilitado,
            ],
            titulos: ["Número", "Nombre", "Categoria", "Marca", "Item de Venta", "Item de Compra", "Codigo de barras", "costosProducto", "preciosProducto", "toleranciaStock", "quiebreDeStock", "Adjunto", "Descripción"],
            eliminar: false,
            deshabilitar: true,
        },
        formInd: {
            inputRenglones: [4, 4, `compuesto`, 2, 6],
        },
        funcionesPropias: {
            formularioIndiv: {
                //precioVenta: [precioVenta],
            }
        },
        key: "name",
        pest: `Productos`,
        accion: `producto`,
        type: "parametrica"
    },
    categoriaProducto: {
        atributos: {
            names: [T({ nombre: "name", clase: "requerido" }), TA("observacionesCompleto"), habilitado],
            titulos: ["Nombre", "Descripción"],
            eliminar: false,
            deshabilitar: true,
        },
        key: "name",
        pest: `Categorias Producto`,
        accion: `categoriaProducto`,
        type: "parametrica"
    },
    subCategoriaProducto: {
        atributos: {
            names: [T({ nombre: "name", clase: "requerido" }), P("categoriaProducto"), TA("observacionesCompleto"), habilitado],
            titulos: ["Nombre", "Categoria", "Descripción"],
            eliminar: false,
            deshabilitar: true,
        },

        pest: `Subcategorias Producto`,
        accion: `subCategoriaProducto`,
        type: "parametrica"
    },
    almacen: {
        atributos: {
            names: [T({ nombre: "name", clase: "requerido" }), TA("observacionesCompleto"), habilitado],
            titulos: ["Nombre", "Descripción"],
            eliminar: false,
            deshabilitar: true,
        },
        key: "name",
        pest: `Almacen`,
        accion: `almacen`,
        type: "parametrica"
    },
    marca: {
        atributos: {
            names: [T({ nombre: "name", clase: "requerido" }), TA("observacionesCompleto"), habilitado],
            titulos: ["Nombre", "Descripción"],
            eliminar: false,
            deshabilitar: true,
        },
        key: "name",
        pest: `Marca`,
        accion: `marca`,
        type: "parametrica"
    },
    operacionStock: {
        atributos: {
            names: [T({ nombre: "name", clase: "requerido" }), TA("observacionesCompleto"), habilitado],
            titulos: ["Nombre", "Descripción"],
            eliminar: false,
            deshabilitar: true,
        },
        pest: `Operaciones`,
        accion: `operacionStock`,
        type: "parametrica"
    },
    /*listasCostos: {
        atributos: {
            names: [
                NS("numerador"),
                F({ nombre: "fecha", clase: "requerido" }),
                P({ nombre: "proveedor", clase: "requerido" }),
                costosInventarios,
                T("observaciones")
            ],
            titulos: ["Numero", "Fecha", "Proveedor", "costosInventarios", "Observaciones"],
            eliminar: false,
            deshabilitar: true,

        },
        formInd: {
            inputRenglones: [3, "compuesto", 6],
        },
        key: "producto",
        pest: `Lista de precios`,
        accion: `listasCostos`,
        type: "transaccion"
    },*/
    listasPrecios: {
        atributos: {
            names: [
                NS("numerador"),
                F({ nombre: "fecha", clase: "requerido" }),
                T({ nombre: "name", clase: "requerido" }),
                T("observaciones"),
                habilitado
            ],
            titulos: ["Numero", "Fecha", "Lista", "Observaciones"],
            eliminar: false,
            deshabilitar: true,

        },
        formInd: {
            inputRenglones: [2, 2, 4],
        },

        key: "producto",
        pest: `Listas de ventas`,
        accion: `listasPrecios`,
        type: "parametrica"
    }
}