let variablesModeloReportes = {
    erroresAbiertos: {
        atributos: {
            //   names: [N("numerador"), F(), P("cliente"), TA("observaciones"), estadoProceso, P("criticidad")],
            titulos: ['Número', `Fecha`, "cliente", "Asunto", "Estado", "Criticidad"],

        },
        filtros: {
            // estadoProceso: [filtroSelectDistinto, "estadoProceso", "Cerrado",],
        },
        entidad: "error",
        pest: `Errores abiertos `,
        accion: `erroresAbiertos`,
    },
    ventasPorMes: {
        atributos: {
            //names: [itemVenta, moneda, mes, ano, importe, importeDos],
            titulos: ['Nombre', "Moneda", "Mes", "Año", "Costo", " Venta"],
        },
        tabla: {
            //atribututosBase: [itemVenta, moneda, mes, ano],
            //atribututosMensuales: [importe, importeDos]
        },
        entidad: "operacionesLogistica",
        pest: `Resultado estimado`,
        accion: `resultadoEstimado`,
        datos: "getUnWindGroup",
        coleccionPlancha: [cotizacionLogistica],
        group: {
            _id: {
                key: `$itemVenta`,
                month: { $month: "$fecha" },
                year: { $year: "$fecha" },
                moneda: "$monedaComp",
            },
            itemVenta: { $first: `$itemVenta` },
            moneda: { $first: `$monedaComp` },
            ano: { $first: { $year: "$fecha" } },
            mes: { $first: { $month: "$fecha" } },
            importe: { $sum: "$importeDosCotizacion" },

        }
    },
    salidaSinFacturar: {
        tablas: {
            salida: {
                atributos: [P("producto"), P({ nombre: "unidadesMedida", clase: "textoCentrado" })],
                titulos: ['Producto', "Unidad"],
                type: "agrupadoMes",
                datos: "getUnWindGroup",
                atributosEnMeses: [N("cantidad")],
                ordenDefault: [P("producto"), "arriba"],
                entidad: "salidaInventario",
                totalHorizontal: true,
                coleccionPlancha: {
                    coleccion: movimientoStock,
                    key: `producto`,
                },
                filtros: {
                    coleccion: {
                        estadoFacturacion: [filtroValorIgual, "Pendiente"],
                    }
                },
                addField: {
                    $addFields: {
                        periodo: {
                            $concat: [
                                { $toString: { $year: "$fecha" } },
                                { $toString: { $month: "$fecha" } }

                            ]
                        }
                    }
                },
                group: [{
                    $group: {
                        _id: {
                            producto: `$producto`,
                            periodo: "$periodo",
                            unidadesMedida: `$unidadesMedida`,
                            estadoFacturacion: { $arrayElemAt: ["$estadoFacturacion", 0] },
                        },
                        producto: { $first: `$producto` },
                        periodo: { $first: "$periodo" },
                        estadoFacturacion: { $first: { $arrayElemAt: ["$estadoFacturacion", 0] } },
                        cantidad: { $sum: { $arrayElemAt: ["$cantidad", 0] } },
                        unidadesMedida: { $first: `$unidadesMedida` },
                    },
                },
                {
                    $group: {
                        _id: {
                            producto: "$_id.producto",
                            unidadesMedida: "$_id.unidadesMedida",
                        },
                        producto: { $first: "$producto" },
                        unidadesMedida: { $first: "$unidadesMedida" },
                        periodos: {
                            $push: {
                                periodo: "$_id.periodo",
                                cantidad: "$cantidad",
                            }
                        },
                        totalHorizontal: { $sum: "$cantidad" } // útil si querés el total
                    }
                }],

                tablaComplemento: {
                    atributos: [T("_id"), N("numerador"), F(), P("cliente"), P("producto"), N("cantidad"), T("estadoFacturacion")],
                    titulos: [`_id`, `Número`, `Fecha`, `Cliente`, `Producto`, `Cantidad`, `Estado`],
                    pestanas: [P("cliente")],
                },
                funcionesPropias: {
                    tabla: {
                        asgregarStickyColumnas: [asgregarStickyColumnas, [P("producto")]],

                    }
                }
            },
            facturacionEstimada: {
                atributos: [P("producto"), P({ nombre: "unidadesMedida", clase: "textoCentrado" })],
                titulos: ['Producto', "Unidad"],
                type: "agrupadoMes",
                datos: "getUnWindGroup",
                atributosEnMeses: [I("totalConPrecio")],
                ordenDefault: [P("producto"), "arriba"],
                entidad: "salidaInventario",
                totalVertical: true,
                totalHorizontal: true,
                coleccionPlancha: {
                    coleccion: movimientoStock,
                    key: `producto`,
                },
                filtros: {
                    coleccion: {
                        estadoFacturacion: [filtroValorIgual, "Pendiente"],
                    }
                },
                addField: {
                    $addFields: {
                        periodo: {
                            $concat: [
                                { $toString: { $year: "$fecha" } },
                                { $toString: { $month: "$fecha" } }

                            ]
                        }
                    }
                },
                group: [{
                    $group: {
                        _id: {
                            producto: `$producto`,
                            periodo: "$periodo",
                            unidadesMedida: { $arrayElemAt: ["$unidadesMedida", 0] },
                            estadoFacturacion: { $arrayElemAt: ["$estadoFacturacion", 0] },
                        },
                        producto: { $first: `$producto` },
                        periodo: { $first: "$periodo" },
                        estadoFacturacion: { $first: { $arrayElemAt: ["$estadoFacturacion", 0] } },
                        cantidad: { $sum: { $arrayElemAt: ["$cantidad", 0] } },
                        unidadesMedida: { $first: { $arrayElemAt: ["$unidadesMedida", 0] } },
                    },
                },
                {
                    $setWindowFields: {
                        partitionBy: { periodo: "$periodo", unidadesMedida: "$unidadesMedida" },
                        output: {
                            totalVertical: {
                                $sum: "$cantidad",
                                window: { documents: ["unbounded", "unbounded"] }
                            },
                            totalDocumentosVert: {
                                $sum: 1,
                                window: { documents: ["unbounded", "unbounded"] }
                            }
                        }
                    }
                },

                {
                    $group: {
                        _id: {
                            producto: "$_id.producto",
                            unidadesMedida: "$_id.unidadesMedida",
                        },
                        producto: { $first: "$producto" },
                        unidadesMedida: { $first: "$unidadesMedida" },
                        periodos: {
                            $push: {
                                periodo: "$_id.periodo",
                                cantidad: "$cantidad",

                            }
                        },
                        totalHorizontal: { $sum: "$cantidad" } // útil si querés el total
                    }
                }],

                crearCampoFront: {
                    totalConPrecio: [valorParametrica, ["producto", "precioInventario", "cantidad", "totalConPrecio"]],
                    totalHorizontal: [valorParametrica, ["producto", "precioInventario", "totalHorizontal", "totalHorizontal"]],
                },
                tablaComplemento: {
                    atributos: [T("_id"), N("numerador"), F(), P("cliente"), P("producto"), N("cantidad"), T("estadoFacturacion")],
                    titulos: [`_id`, `Número`, `Fecha`, `Cliente`, `Producto`, `Cantidad`, `Estado`],
                    pestanas: [P("cliente")],
                },
                funcionesPropias: {
                    tabla: {
                        totalVerticalManual: [totalVerticalManual, ["facturacionEstimada"]],

                    }
                }
            },
        },
        tablasCalculada: {

        },
        cabeceraCont: {

            rango: [],
            botones: [{ boton: iLupaRep }],

        },
        pest: `Salidas sin facturar`,
        accion: `salidaSinFacturar`,

    },
    cobrosPagos: {
        tablas: {
            cobros: {
                atributos: [P("cliente"), P("moneda")],
                titulos: ['Nombre', "Moneda"],
                atributosEnMeses: [I("importe")],
                type: "agrupadoMes",
                datos: "getGroup",
                entidad: "cobrosRecibidos",
                tituloTabla: "Cobros Recibidos",
                totalHorizontal: true,
                totalVertical: true,
                addField: {
                    $addFields: {
                        periodo: {
                            $concat: [
                                { $toString: { $year: "$fecha" } },
                                { $toString: { $month: "$fecha" } }

                            ]
                        }
                    }
                },
                group: [{
                    $group: {
                        _id: {
                            cliente: `$cliente`,
                            periodo: "$periodo",
                            moneda: "$moneda",
                        },
                        cliente: { $first: `$cliente` },
                        moneda: { $first: `$moneda` },
                        periodo: { $first: "$periodo" },
                        importe: { $sum: "$importeTotal" },
                    },
                }, {
                    $setWindowFields: {
                        partitionBy: { periodo: "$periodo", moneda: "$moneda" },
                        output: {
                            totalVertical: {
                                $sum: "$importe",
                                window: { documents: ["unbounded", "unbounded"] }
                            },
                            totalDocumentosVert: {
                                $sum: 1,
                                window: { documents: ["unbounded", "unbounded"] }
                            }
                        }
                    }
                },
                {
                    $group: {
                        _id: {
                            cliente: "$_id.cliente",
                            moneda: "$_id.moneda",
                        },
                        cliente: { $first: "$cliente" },
                        moneda: { $first: "$moneda" },
                        periodos: {
                            $push: {
                                periodo: "$_id.periodo",
                                importe: "$importe",
                                totalVertical: "$totalVertical",
                                totalDocVert: "$totalDocumentosVert"

                            }
                        },
                        totalHorizontal: { $sum: "$importe" }
                    }
                }],
                tablaComplemento: {
                    atributos: [T("_id"), N("numerador"), F(), P("cliente"), P("moneda"), I("importeTotal")],
                    titulos: [`_id`, `Número`, `Fecha`, `Cliente`, `Moneda`, "Total"],
                },
            },
            pagos: {
                atributos: [P("proveedor"), P("moneda")],
                titulos: ['Nombre', "Moneda"],
                atributosEnMeses: [I("importe")],
                type: "agrupadoMes",
                datos: "getGroup",
                entidad: "pagosRealizados",
                tituloTabla: "Pagos Realizados",
                totales: {
                    vertical: {
                        partition: { ano: "$ano", mes: "$mes", moneda: "$moneda" },
                        output: {
                            totalVertical: {
                                $sum: "$importe",
                                window: { documents: ["unbounded", "unbounded"] }
                            },
                        },
                        titulo: ["Total Pagos"]
                    },
                    horizontal: {
                        partition: { cliente: "$proveedor", moneda: "$moneda" },
                        output: {
                            totalHorizontal: {
                                $sum: "$importe",
                                window: { documents: ["unbounded", "unbounded"] }
                            },
                        },
                    }
                },
                group: [{
                    $group: {
                        _id: {
                            key: `$proveedor`,
                            month: { $month: "$fecha" },
                            year: { $year: "$fecha" },
                            moneda: "$moneda",
                        },
                        proveedor: { $first: `$proveedor` },
                        moneda: { $first: `$moneda` },
                        ano: { $first: { $year: "$fecha" } },
                        mes: { $first: { $month: "$fecha" } },
                        importe: { $sum: "$importeTotal" },

                    },
                }],
                tablaComplemento: {
                    atributos: [T("_id"), N("numerador"), F(), P("proveedor"), P("moneda"), I("importeTotal")],
                    titulos: [`_id`, `Número`, `Fecha`, `Cliente`, `Moneda`, "Total"],

                },
            },
        },
        tablasCalculada: {
            resultado: {
                type: "restaTablas",
                tablas: ["cobros", "pagos"],
                atributos: ["total"],
                titulos: ["Resultado Financiero"],
                operacion: "resta"
            },
            cobroPromedio: {
                type: "promedioIntra",
                tablas: ["cobros"],
                atributos: ["total"],
                titulos: ["Cobro Promedio"],
                operacion: "promedio"
            },
            pagosPromedio: {
                type: "promedioIntra",
                tablas: ["cobros"],
                atributos: ["total"],
                titulos: ["Cobro Promedio"],
                operacion: "promedio"
            }
        },
        cabeceraCont: {

            rango: [],
            botones: [{ boton: iLupaRep }],

        },
        pest: `Cobros y pagos`,
        accion: `cobrosPagos`,

    },
    entradasPendientes: {
        tablas: {
            entradasPendientes: {
                atributos:
                    [N("numerador"),
                    F(),
                    P("producto"),
                    P("marca"),
                    P("unidadesMedida"),
                    N("cantidad"),
                    P("almacen"),

                    ],
                titulos: ["Número", "Fecha", "Producto", "Marca", "Unidad de medida", "Cantidad", "Almacen"],
                type: "tipoExtracto",
                entidad: "stock",
                ordenDefault: [F("fecha"), "arriba"],
                filtros: {
                    cabecera: {
                        estadoFacturacion: [filtroValorIgual, ["Pendiente"]],

                    }
                },
                clases: {
                    table: ["trBordes", "white"]
                },
            },

        },
        entidad: "stock",
        cabeceraCont: {
            parametrica: [{ atributo: P("producto"), type: "coleccion", titulo: "Producto" }],
            fecha: [Date.now(), -30],
            botones: [{ boton: iLupaRep }],
        },
        pest: `Entradas sin facturar`,
        accion: `entradasPendientes`,
        consultable: "consultable"

    },
    existencias: {
        tablas: {
            stock: {
                atributos: [P("producto"), P({ nombre: "almacen", clase: "textoCentrado", width: "diez" }), P({ nombre: "unidadesMedida", clase: "textoCentrado", width: "diez" })],
                titulos: ['Producto', "Almacen", "Unidad"],
                type: "agrupadoMes",
                entidad: "acumulador",
                atributosEnMeses: [N("cantidadTotal")],
                datos: "getGroup",
                acumulador: {
                    coleccion: {
                        entidad: [filtroValorIgual, `stock`],
                        name: [filtroValorIgual, `Existencias`]
                    }
                },

                group: [{
                    $group: {
                        _id: {
                            producto: `$producto`,
                            periodo: "$periodo",
                            unidadesMedida: `$unidadesMedida`,
                            almacen: `$almacen`,
                        },
                        producto: { $first: `$producto` },
                        unidadesMedida: { $first: `$unidadesMedida` },
                        almacen: { $first: `$almacen` },
                        periodo: { $first: "$periodo" },
                        cantidad: { $sum: "$cantidad" },
                        cantidadTotal: { $sum: "$cantidadTotal" },
                    },
                }, {
                    $group: {
                        _id: {
                            producto: "$_id.producto",
                            unidadesMedida: "$_id.unidadesMedida",
                            almacen: "$_id.almacen",
                        },
                        producto: { $first: "$producto" },
                        unidadesMedida: { $first: "$unidadesMedida" },
                        almacen: { $first: "$almacen" },
                        periodos: {
                            $push: {
                                periodo: "$_id.periodo",
                                cantidad: "$cantidad",
                                cantidadTotal: "$cantidadTotal",
                            }
                        },


                    }
                }],
                tablaComplemento: {
                    atributos: [T("_id"), N("numerador"), F(), P("producto"), N("cantidad"), P("unidadesMedida"), N("disponibles"), P("almacen"), F("fechaVencimientoProducto")],
                    titulos: [`_id`, `Número`, `Fecha`, `Producto`, `Cantidad`, `Unidad`, `Disponibles`, `Almacen`, `Vencimiento`],
                    datos: "get",
                    entidad: "stock"
                },
                funcionesPropias: {
                    tabla: {
                        ordenarTablasRep: [ordenarTablasRep, ["stock"], "producto"],
                    }

                }

            },
            valorizado: {
                atributos: [P("producto"), P({ nombre: "almacen", clase: "textoCentrado", width: "diez" }), P({ nombre: "unidadesMedida", clase: "textoCentrado", width: "diez" })],
                titulos: ['Producto', "Almacen", "Unidad"],
                type: "agrupadoMes",
                datos: "getGroup",
                atributosEnMeses: [I("totalConPrecio")],
                entidad: "acumulador",
                totalVertical: true,
                totalTitulos: ["Total"],
                acumulador: {
                    coleccion: {
                        entidad: [filtroValorIgual, `stock`],
                        name: [filtroValorIgual, `Existencias`]
                    }
                },
                group: [{
                    $group: {
                        _id: {
                            producto: `$producto`,
                            periodo: "$periodo",
                            unidadesMedida: `$unidadesMedida`,
                            almacen: `$almacen`,
                        },
                        producto: { $first: `$producto` },
                        unidadesMedida: { $first: `$unidadesMedida` },
                        almacen: { $first: `$almacen` },
                        periodo: { $first: "$periodo" },
                        cantidad: { $sum: "$cantidad" },
                        cantidadTotal: { $sum: "$cantidadTotal" },
                    },
                }, {
                    $group: {
                        _id: {
                            producto: "$_id.producto",
                            unidadesMedida: "$_id.unidadesMedida",
                            almacen: "$_id.almacen",
                        },
                        producto: { $first: "$producto" },
                        unidadesMedida: { $first: "$unidadesMedida" },
                        almacen: { $first: "$almacen" },
                        periodos: {
                            $push: {
                                periodo: "$_id.periodo",
                                cantidad: "$cantidad",
                                cantidadTotal: "$cantidadTotal",
                            }
                        },

                    },

                }],
                crearCampoFront: {
                    totalConPrecio: [valorParametrica, ["producto", "costoInventario", "cantidadTotal", "totalConPrecio"]],
                },

                tablaComplemento: {
                    atributos: [T("_id"), N("numerador"), F(), P("producto"), N("cantidad"), P("unidadesMedida"), N("disponibles"), P("almacen"), F("fechaVencimientoProducto"), I("costoInventario")],
                    titulos: [`_id`, `Número`, `Fecha`, `Producto`, `Cantidad`, `Unidad`, `Disponibles`, `Almacen`, `Vencimiento`, `Costo`],
                    datos: "get",
                    entidad: "stock"
                },
                funcionesPropias: {
                    tabla: {
                        totalVerticalManual: [totalVerticalManual, ["valorizado"]],
                        ordenarTablasRep: [ordenarTablasRep, ["valorizado"], "producto"],
                    }
                }
            },
        },
        cabeceraCont: {
            parametrica: [{ atributo: P("producto"), type: "coleccion", titulo: "Producto" }, { atributo: P({ nombre: "almacen" }), type: "coleccion", clases: "margin-left-dos", titulo: "Almacen" }], // ver espacio entre medio
            rango: [],
            botones: [{ boton: iLupaRep },],

        },
        pest: `Existencias`,
        accion: `existencias`,
    },
    anticiposAbiertos: {
        tablas: {
            anticipos: {
                atributos: [
                    N({ nombre: "numerador", clase: "textoCentrado" }),
                    F("fecha"),
                    P("proveedor"),
                    F("fechaVencimiento"),
                    T("observaciones"),
                    P({ nombre: "moneda", clase: "textoCentrado" }),
                    I({ nombre: "importeTotal", clase: "textoCentrado" }),
                    I({ nombre: "importeGastos", clase: "textoCentrado" }),
                    I({ nombre: "saldo", clase: "textoCentrado" }),
                    T({ nombre: "estado", clase: "textoCentrado" })],
                titulos: [`Numero`, `Fecha`, `Proveedor`, `Fecha vencimiento`, `Observaciones`, `Moneda`, `Total Anticipo`, `Gastos`, `Saldo`, `Estado`],
                type: "infoEntidadMasEditTable",
                entidad: "anticipoFinanciero",
                filtros: {
                    cabecera: {
                        estado: [filtroValorIgual, "Abierto"],
                    }
                },
            },

        },
        cabeceraCont: {
            parametrica: [{ atributo: P("proveedor"), type: "cabecera", titulo: "Proveedor" }],
            botones: [{ boton: iLupaRep }],

        },

        pest: `Anticipos abiertos`,
        accion: `anticiposAbiertos`,

    },
    chequesEnCartera: {
        tablas: {
            chequesEnCartera: {
                atributos: [
                    P({ nombre: "cliente" }),
                    I({ nombre: "importe", clase: "textoCentrado" }),
                    T({ nombre: "numeroDeCheque", clase: "textoCentrado" }),
                    F({ nombre: "fecha" }),
                    F({ nombre: "vencimientoCheque" }),
                    P({ nombre: "moneda", clase: "textoCentrado" }),
                    T("bancoCheque")
                ],
                titulos: [`Cliente`, `Importe`, `Número`, `Fecha`, `Vencimiento`, `Moneda`, `Banco cheque`],
                type: "infoEntidadMasEditTable",
                entidad: "chequesTercero",
                ordenDefault: [F("fechaVencimiento"), "arriba"],
                totalVertical: true,
                filtros: {
                    cabecera: {
                        estado: [filtroValorIgual, "En cartera"],
                    }
                },
            },

        },
        cabeceraCont: {
            parametrica: [{ atributo: P("cliente"), type: "coleccion", titulo: "Cliente" }],
            botones: [{ boton: iLupaRep }],

        },
        cabeceraParam: [P({ nombre: "cliente", clase: "treintaWidth" })],
        pest: `Cheques en cartera`,
        accion: `chequesEnCartera`,

    },
    saldosBancosCajas: {
        tablas: {
            saldosCajas: {
                atributos: [P({ nombre: "cajas", width: "veinte" }), P({ nombre: "moneda", clase: "textoCentrado" })],
                titulos: ['Caja', "Moneda"],
                type: "agrupadoMes",
                datos: "getGroup",
                atributosEnMeses: [I("importe")],
                ordenDefault: [P("cajas"), "arriba"],
                entidad: "acumulador",
                acumulador: {
                    coleccion: {
                        entidad: [filtroValorIgual, `saldosCajas`],
                        name: [filtroValorIgual, `Cajas por moneda y fecha`]
                    }
                },
                totalHorizontal: true,
                group: [{
                    $group: {
                        _id: {
                            cajas: "$cajas",
                            moneda: "$moneda",
                            periodo: "$periodo",

                        },
                        cajas: { $first: "$cajas" },
                        moneda: { $first: "$moneda" },
                        importe: { $first: "$importe" },
                        periodo: { $first: "$periodo" },

                    },
                },
                {
                    $group: {
                        _id: {
                            cajas: "$_id.cajas",
                            moneda: "$_id.moneda",
                        },
                        cajas: { $first: "$cajas" },
                        moneda: { $first: "$moneda" },
                        periodos: {
                            $push: {
                                periodo: "$_id.periodo",
                                importe: "$importe",
                                totalVertical: "$totalVertical",
                            }
                        },
                        totalHorizontal: { $sum: "$importe" } // útil si querés el total
                    }
                }],
                tablaComplemento: {
                    atributos: [T("_id"), N("numerador"), F(), P("cajas"), N("importe"), P("moneda")],
                    titulos: [`_id`, `Número`, `Fecha`, `Caja`, `Importe`, `Moneda`],
                    datos: "get",
                    entidad: "saldosCajas"
                },
                funcionesPropias: {
                    tabla: {
                        asgregarStickyColumnas: [asgregarStickyColumnas, [P("cajas")]],

                    },

                }
            },
            saldosBancos: {
                atributos: [P({ nombre: "cuentasBancarias", width: "veinte" }), P({ nombre: "moneda", clase: "textoCentrado" })],
                titulos: ['Cuentas', "Moneda"],
                type: "agrupadoMes",
                datos: "getGroup",
                atributosEnMeses: [I("importe")],
                ordenDefault: [P("cuentasBancarias"), "arriba"],
                entidad: "acumulador",
                totalHorizontal: true,
                acumulador: {
                    coleccion: {
                        entidad: [filtroValorIgual, `saldosBancos`],
                        name: [filtroValorIgual, `Cuentas bancarias por moneda y fecha`]

                    }
                },
                group: [{
                    $group: {
                        _id: {
                            cuentasBancarias: "$cuentasBancarias",
                            moneda: "$moneda",
                            periodo: "$periodo",

                        },
                        cuentasBancarias: { $first: "$cuentasBancarias" },
                        moneda: { $first: "$moneda" },
                        importe: { $first: "$importe" },
                        periodo: { $first: "$periodo" },

                    },
                },

                {
                    $group: {
                        _id: {
                            cuentasBancarias: "$_id.cuentasBancarias",
                            moneda: "$_id.moneda",
                        },
                        cuentasBancarias: { $first: "$cuentasBancarias" },
                        moneda: { $first: "$moneda" },
                        periodos: {
                            $push: {
                                periodo: "$_id.periodo",
                                importe: "$importe",
                                totalVertical: "$totalVertical",
                            }
                        },
                        totalHorizontal: { $sum: "$importe" } // útil si querés el total
                    }
                }],

                tablaComplemento: {
                    atributos: [T("_id"), N("numerador"), F(), P("cuentasBancarias"), N("importe"), P("moneda")],
                    titulos: [`_id`, `Número`, `Fecha`, `Cuenta`, `Importe`, `Moneda`],
                    datos: "get",
                    entidad: "saldosBancos"
                },
                funcionesPropias: {
                    tabla: {
                        asgregarStickyColumnas: [asgregarStickyColumnas, [P("cuentasBancarias")]],

                    },

                }
            },
        },
        tablasCalculada: {

        },
        cabeceraCont: {
            parametrica: [{ atributo: P("moneda"), type: "cabecera", titulo: "Moneda" }],
            rango: [],
            botones: [{ boton: iLupaRep }],

        },
        pest: `Saldos bancos y cajas`,
        accion: `saldosBancosCajas`,


    },
    facturacionMensual: {
        tablas: {
            facturacionMensual: {
                atributos: [P("itemVenta"), P({ nombre: "moneda", clase: "textoCentrado" })],
                titulos: ['Item Venta', "Moneda"],
                type: "agrupadoMes",
                datos: "getUnWindGroup",
                atributosEnMeses: [I("subtotalVentas")],
                ordenDefault: [P("itemVenta"), "arriba"],
                entidad: "facturasEmitidas",
                totalHorizontal: true,
                totalVertical: true,
                coleccionPlancha: {
                    coleccion: compuestoFacturaVentas,
                    key: `itemVenta`,
                },
                addField: {
                    $addFields: {
                        periodo: {
                            $concat: [
                                { $toString: { $year: "$fecha" } },
                                { $toString: { $month: "$fecha" } }

                            ]
                        }
                    }
                },
                group: [
                    {
                        $group: {
                            _id: {
                                itemVenta: "$itemVenta",
                                moneda: "$moneda",
                                periodo: "$periodo",
                            },
                            itemVenta: { $first: "$itemVenta" },
                            moneda: { $first: "$moneda" },
                            periodo: { $first: "$periodo" },
                            subtotalVentas: { $sum: { $arrayElemAt: ["$subtotalVentas", 0] } },
                        },
                    },
                    {
                        $setWindowFields: {
                            partitionBy: { periodo: "$periodo", moneda: "$moneda" },
                            output: {
                                totalVertical: {
                                    $sum: "$subtotalVentas",
                                    window: { documents: ["unbounded", "unbounded"] },
                                },
                                totalDocumentosVert: {
                                    $sum: 1,
                                    window: { documents: ["unbounded", "unbounded"] },
                                },
                            },
                        },
                    },
                    {
                        $group: {
                            _id: {
                                itemVenta: "$_id.itemVenta",
                                moneda: "$_id.moneda",
                                periodo: "$_id.periodo",
                            },
                            itemVenta: { $first: "$itemVenta" },
                            moneda: { $first: "$moneda" },
                            periodo: { $first: "$periodo" },
                            subtotalVentas: { $sum: "$subtotalVentas" }, // consolida duplicados por periodo
                        },
                    },
                    {
                        $group: {
                            _id: {
                                itemVenta: "$_id.itemVenta",
                                moneda: "$_id.moneda",
                            },
                            itemVenta: { $first: "$itemVenta" },
                            moneda: { $first: "$moneda" },
                            periodos: {
                                $push: {
                                    periodo: "$_id.periodo",
                                    subtotalVentas: "$subtotalVentas",
                                    totalVertical: "$totalVertical"
                                },
                            },
                            totalHorizontal: { $sum: "$subtotalVentas" },
                        },
                    },
                ],
                tablaComplemento: {
                    atributos: [T("_id"), N("numerador"), F(), N("cantidad"), P("itemVenta"), I("subtotalVentas"), P("moneda")],
                    titulos: [`_id`, `Número`, `Fecha`, `Cantidad`, `Item Venta`, "Subtotal", `Moneda`],
                    pestanas: [P("itemVenta")],

                },
                funcionesPropias: {
                    tabla: {
                        asgregarStickyColumnas: [asgregarStickyColumnas, [P("itemVenta")]],
                        totalVerticalManual: [totalVerticalManual, ["facturacionMensual"]],
                    },

                }
            },
        },
        tablasCalculada: {

            cobroPromedio: {
                type: "promedioIntra",
                tablas: ["facturacionMensual"],
                atributos: ["subtotalVentas"],
                titulos: ["Facturacion Promedio"],
                operacion: "promedio"
            },

        },
        cabeceraCont: {
            parametrica: [{ atributo: P("moneda"), type: "cabecera", titulo: "Moneda" }],
            rango: [],
            botones: [{ boton: iLupaRep }],

        },

        pest: `Facturacion mensual`,
        accion: `facturacionMensual`,

    },
    movimientosBancos: {
        tablas: {
            extractoBancos: {
                atributos: [

                    F({ nombre: "fecha" }),
                    P({ nombre: "bancos", width: "ocho" }),
                    P("cuentasBancarias"),
                    T({ nombre: "itemsBancos" }),
                    P({ nombre: "moneda", width: "ocho" }),
                    I({ nombre: "importe", clase: "textoCentrado", width: "ocho" }),

                ],
                titulos: [`Fecha`, `Banco`, `Cuenta`, `Concepto`, `Moneda`, `Importe`],
                type: "tipoExtracto",
                entidad: "saldosBancos",
                ordenDefault: [F("fecha"), "arriba"],

            },
        },
        cabeceraCont: {
            parametrica: [{ atributo: P("bancos"), type: "cabecera", titulo: "Bancos" }, { atributo: P("moneda"), type: "cabecera", titulo: "Moneda", clases: "margin-left-dos" }],
            fecha: [Date.now(), -30],
            botones: [{ boton: iLupaRep }],

        },
        pest: `Extracto Bancos`,
        accion: `movimientosBancos`,

    },
    movimientosCajas: {
        tablas: {
            extractoCajas: {
                atributos: [

                    F({ nombre: "fecha" }),
                    P({ nombre: "cajas", width: "ocho" }),
                    T({ nombre: "itemsCajas" }),
                    P({ nombre: "moneda", width: "ocho" }),
                    I({ nombre: "importe", width: "ocho", clase: "textoCentrado" }),

                ],
                titulos: [`Fecha`, `Cajas`, `Concepto`, `Moneda`, `Importe`],
                type: "tipoExtracto",
                entidad: "saldosCajas",
                ordenDefault: [F("fecha"), "arriba"],

            },

        },
        cabeceraCont: {
            parametrica: [{ atributo: P("cajas"), type: "cabecera", titulo: "Cajas" }, { atributo: P("moneda"), type: "cabecera", titulo: "Moneda", clases: "margin-left-dos" }],
            fecha: [Date.now(), -30],
            botones: [{ boton: iLupaRep }],

        },
        pest: `Extracto Cajas`,
        accion: `movimientosCajas`,

    },
    emailLogs: {
        tablas: {
            emails: {
                atributos: [
                    FT("fecha"),
                    P({ nombre: "username", origen: "user", clase: "textoCentrado" }),
                    LAT("para"),
                    LAT("copia"),
                    LAT("copiaOculta"),
                    T("asunto"),
                    T({ nombre: "origen", clase: "textoCentrado" }),
                    T({ nombre: "estado", clase: "textoCentrado" }),],
                titulos: ["Fecha", "De", "Para", "Copia", "Copia Oculta", "Asunto", "Origen", "Estado"],
                datos: "get",
                type: "infoEntidadMasEditTable",
                entidad: "logEmails",// Aca es donde va a buscar la información
                clases: {
                    table: ["trBordes", "white"]
                },
            }
        },
        cabeceraCont: {
            fecha: [Date.now(), -30],
        },
        pest: `Emails enviados`,
        accion: `emailLogs`,
        consultable: "consultable"
    },
    movimientosClientes: {
        tablas: {
            movimientosClientes: {
                atributos: [

                    F({ nombre: "fecha" }),
                    P({ nombre: "cliente", width: "diez" }),
                    T({ nombre: "movimientoDestino" }),
                    T({ nombre: "tipoComprobante" }),
                    T({ nombre: "numComprobante" }),
                    P({ nombre: "moneda", width: "ocho" }),
                    I({ nombre: "importe", width: "ocho", clase: "textoCentrado" }),
                    I({ nombre: "saldoComprobante", clase: "textoCentrado" }),
                    F({ nombre: "fechaVencimiento" }),
                    LAT("comprobanteOP"),
                    T({ nombre: "estado", width: "ocho", clase: "textoCentrado" })],
                titulos: [`Fecha`, `Cliente`, `Concepto`, `Tipo`, `Comprobante`, `Moneda`, `Importe`, `Saldo Comprobante`, `Vencimiento`, `Comprobante OP`, `Estado`],
                type: "tipoExtracto",
                entidad: "cuentaCorrienteClientes",
                ordenDefault: [F("fecha"), "arriba"],
                funcionesPropias: {
                    tabla: {
                        asgregarStickyColumnasTabla: [asgregarStickyColumnasTabla, [P("cliente")]],
                        asignacionSaldosCabecera: [asignacionSaldosCabeceraCC, "cuentaCorrienteClientes", "cliente", "cuentaCorrienteClientes"],
                    },

                },
                clases: {
                    table: ["trBordes", "white"]
                },
            },

        },
        impresion: {
            titulo: "Mov Clientes",
            hoja: "custom",
            bloques: {
                cabeceraRenglon: {
                    clases: "full borderNone",
                    componentes: {
                        0: {
                            type: [soloLogoEmpresa, ["/img/logo_transparent_background.png", "ochoRem"]],

                        },
                    }
                },
                segundoRenglon: {
                    clases: "medioCol borderNone",
                    componentes: {
                        0: {
                            type: [infoReferencia, [P("cliente"), ["name"], ["cliente"]]],
                            class: `izquierda`
                        },
                        1: {
                            type: [infoReferencia, [P("moneda"), ["value"], ["moneda"]]],
                            class: `derecha rightContenido`
                        },
                    }
                },
                tercerRenglon: {
                    clases: "full borderNone margin-bot-uno tablaReporteImp",
                    componentes: {
                        0: {
                            type: [reporteCompletoTabla, []],

                        },
                    }
                },

            },
        },
        acumulador: variablesModeloPagosCobros.cuentaCorrienteClientes.acumulador,
        entidad: "cuentaCorrienteClientes",
        cabeceraCont: {
            parametrica: [{ atributo: P("cliente"), type: "cabecera", titulo: "Cliente" }, { atributo: P("moneda"), type: "cabecera", titulo: "Moneda", clases: "margin-left-dos" }],
            fecha: [Date.now(), -30],
            saldo: [],
            botones: [{ boton: iLupaRep }],
        },
        pest: `Cuentas Clientes`,
        accion: `movimientosClientes`,
        consultable: "consultable"

    },
    movimientosProveedores: {
        tablas: {
            movimientosProveedores: {
                atributos: [

                    F({ nombre: "fecha" }),
                    P({ nombre: "proveedor", width: "diez" }),
                    T({ nombre: "movimientoDestino" }),
                    T({ nombre: "tipoComprobante" }),
                    T({ nombre: "numComprobante" }),
                    P({ nombre: "moneda", width: "ocho" }),
                    I({ nombre: "importe", width: "ocho", clase: "textoCentrado" }),
                    I({ nombre: "saldoComprobante", clase: "textoCentrado" }),
                    F({ nombre: "fechaVencimiento" }),
                    LAT("comprobanteOP"),
                    T("estado")

                ],
                titulos: [`Fecha`, `Proveedor`, `Concepto`, `Tipo`, `Comprobante`, `Moneda`, `Importe`, `Saldo Comprobante`, `Vencimiento`, `Comprobante OP`, `Estado`],
                type: "tipoExtracto",
                entidad: "cuentaCorrienteProveedores",
                ordenDefault: [F("fecha"), "arriba"],
                funcionesPropias: {
                    tabla: {
                        asgregarStickyColumnasTabla: [asgregarStickyColumnasTabla, [P("proveedor")]],
                        asignacionSaldosCabecera: [asignacionSaldosCabeceraCC, "cuentaCorrienteProveedores", "proveedor", "cuentaCorrienteProveedores"],
                    },

                },
                clases: {
                    table: ["trBordes", "white"]
                },
            },

        },
        impresion: {
            titulo: "Mov Proveedores",
            hoja: "landscape",
            bloques: {
                cabeceraRenglon: {
                    clases: "full borderNone",
                    componentes: {
                        0: {
                            type: [soloLogoEmpresa, ["/img/logo_transparent_background.png", "ochoRem"]],

                        },
                    }
                },
                segundoRenglon: {
                    clases: "full borderNone margin-bot-uno",
                    componentes: {
                        0: {
                            type: [reporteCabecera, []],

                        },
                    }
                },
                tercerRenglon: {
                    clases: "full borderNone margin-bot-uno tablaReporteImp",
                    componentes: {
                        0: {
                            type: [reporteCompletoTabla, []],

                        },
                    }
                },

            },
        },
        acumulador: variablesModeloPagosCobros.cuentaCorrienteProveedores.acumulador,
        entidad: "cuentaCorrienteProveedores",
        cabeceraCont: {
            parametrica: [{ atributo: P("proveedor"), type: "cabecera", titulo: "Proveedor" }, { atributo: P("moneda"), type: "cabecera", titulo: "Moneda", clases: "margin-left-dos" }],
            fecha: [Date.now(), -30],
            saldo: [],
            botones: [{ boton: iLupaRep }],
        },
        pest: `Cuentas Proveedores`,
        accion: `movimientosProveedores`,
        consultable: "consultable"
    },
    tipoCambio: {
        tablas: {
            emails: {
                atributos: [
                    F("fecha"),
                ],
                titulos: ["Fecha"],
                datos: "get",
                type: "infoEntidadMasEditTable",
                entidad: "logEmails",// Aca es donde va a buscar la información
                clases: {
                    table: ["trBordes", "white"]
                },
            }
        },
        cabeceraCont: {
            fecha: [Date.now(), -30],
        },
        pest: `Emails enviados`,
        accion: `emailLogs`,
        consultable: "consultable"
    },
    productosVencimientos: {
        tablas: {
            productosVencimientos: {
                atributos:
                    [N({ nombre: "numerador", clase: "textoCentrado" }),
                    F({ nombre: "fechaVencimientoProducto" }),
                    P("producto"),
                    P("marca"),
                    P("unidadesMedida"),
                    N({ nombre: "cantidad", clase: "textoCentrado" }),
                    N({ nombre: "disponibles", clase: "textoCentrado" }),
                    P({ nombre: "almacen", clase: "textoCentrado" }),
                    F(),

                    ],
                titulos: ["Número", "Vencimiento", "Producto", "Marca", "Unidad de medida", "Cantidad", "Disponibles", "Almacen", "Fecha"],
                type: "tipoExtracto",
                entidad: "stock",
                ordenDefault: [F("fechaVencimientoProducto"), "abajo"],
                filtros: {
                    cabecera: {
                        estado: [filtroValorIgual, ["Ingresado", "Salida parcial"]],
                        fechaVencimientoProducto: [filtroValorDistino, ""],

                    }
                },
                funcionesPropias: {
                    tabla: {
                        ordenarTablasRep: [ordenarTablasRep, "productosVencimientos", "fechaVencimientoProducto"],

                        //asgregarStickyColumnasTabla: [asgregarStickyColumnasTabla, [P("cliente")]],
                        // asignacionSaldosCabecera: [asignacionSaldosCabeceraCC, "cuentaCorrienteClientes", "cliente", "cuentaCorrienteClientes"],
                    },

                },
                clases: {
                    table: ["trBordes", "white"]
                },
            },

        },

        entidad: "stock",
        cabeceraCont: {
            parametrica: [{ atributo: P("producto"), type: "coleccion", titulo: "Producto" }, { atributo: P({ nombre: "almacen" }), type: "coleccion", clases: "margin-left-dos", titulo: "Almacen" }],
            fecha: [Date.now(), -30, "fechaVencimientoProducto", "fechaVencimientoProducto"],
            botones: [{ boton: iLupaRep }],
        },
        pest: `Vencimientos`,
        accion: `productosVencimientos`,
        consultable: "consultable"

    },
}