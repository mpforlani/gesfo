//AtribustoCompuestoColección
const tareas = {
  titulos: `Tareas`,
  nombre: `tareas`,
  type: `coleccionInd`,
  totalizadores: {
    estimadoTarea: {
      type: "totalizadorColeccionVerticalHora",
      total: ["totaltiempoEstimado"],
      digitosPositivos: ["tiempoEstimado"],
      trigger: ["tiempoEstimado"],
    },
    consumidoTarea: {
      type: "totalizadorColeccionVerticalHora",
      total: ["totaltiempoConsumido"],
      digitosPositivos: ["tiempoConsumido"],
      trigger: ["tiempoConsumido"],
    },
    remanenteTarea: {
      type: "totalizadorColeccionVerticalHora",
      total: ["totaltiempoRemanente"],
      digitosPositivos: ["tiempoRemanente"],
      trigger: ["tiempoRemanente"],
    },
    remanenteIndTarea: {
      type: "totalizadorColeccionHora",
      total: ["tiempoRemanente"],
      digitosPositivos: ["tiempoEstimado"],
      digitosNegativos: ["tiempoConsumido"],
      trigger: ["tiempoEstimado", "tiempoConsumido"],
    },
  },
  funcion: [
    {
      lugar: "formularioIndiv",
      nombre: "transformarNumerosaHora",
      func: transformarNumerosaHora,

    },
    {
      lugar: "formularioIndiv",
      nombre: "detalleTareasCrm",
      func: detalleTareasCrm,
    },
  ],
  componentes: {
    tarea: P(`tarea`),
    fechaTarea: F(`fechaTarea`),
    tiempoEstimado: T({
      nombre: "tiempoEstimado",
      clase: "horaMinutos",
      width: "diez",
    }),
    tiempoConsumido: T({
      nombre: "tiempoConsumido",
      clase: "horaMinutos totalExt",
      width: "diez",
    }),
    tiempoRemanente: T({
      nombre: "tiempoRemanente",
      clase: "horaMinutos",
      width: "diez",
    }),
    usuarioAsignado: P({
      nombre: "usuarioAsignado",
      origen: "user",
      width: "diez",
    }),
    observacionesColec: TA(`observacionesColec`),
  },
  totales: {
    0: {
      titulo: "Total",
      componentes: {
        tiempoEstimado: T(`totaltiempoEstimado`),
        tiempoConsumido: T(`totaltiempoConsumido`),
        tiempoRemanente: T(`totaltiempoRemanente`),
      },
    },
  },
  titulosComponentes: [
    `Tarea`,
    `Fecha`,
    `Estimado`,
    `Consumido`,
    `Remanente`,
    `Asginado`,
    `Detalle`,
  ],
  complemento: {
    atributos: {
      fechaDetalle: F({ nombre: "fechaDetalle", width: "nueve" }),
      consumidoDetalle: T({ nombre: "consumidoDetalle", width: "nueve" }),
      remanenteDetalle: T({ nombre: "remanenteDetalle", width: "nueve" }),
      observacionesDetalle: TA({ nombre: "remanenteDetalle", width: "quince" }),
    },
    totales: {
      0: {
        titulo: "Total",
        componentes: {
          consumidoDetalle: T(`totalconsumidoDetalle`),
          remanenteDetalle: T(`totalremanenteDetalle`),
        },
      },
    },
    titulos: [`Fecha`, `Consumido`, `Remanente`, `Observaciones`],
  },
};
//AtribustoCompuestoColección
const contacto = {
  titulos: `Contactos`,
  nombre: `contacto`,
  type: `coleccionInd`,
  componentes: {
    nombreContacto: T("nombreContacto"),
    telefonoContacto: T({ nombre: "telefonoContacto" }),
    emailContacto: T("email"),
    observacionesContacto: TA("observacionesContacto"),
  },
  titulosComponentes: [`Nombre`, `Telefono`, `Email`, "Observaciones"],
};
const direcciones = {
  titulos: `Direcciones`,
  nombre: `direcciones`,
  type: `coleccionInd`,
  componentes: {
    nombreDireccion: T("nombreDireccion"),
    calle: T("calle"),
    numero: T({ nombre: "numero", clase: "center", width: "siete" }),
    piso: T({ nombre: "piso", clase: "center", width: "siete" }),
    depto: T({ nombre: "depto", clase: "center", width: "siete" }),
    cp: T({ nombre: "cp", clase: "center", width: "siete" }),
    ciudadDir: P({ nombre: "ciudadDir", origen: "ciudad" }),
    observacionesDirecciones: TA("observacionesDirecciones"),
  },
  titulosComponentes: [`Nombre`, `Calle`, `Numero`, "Piso", "Depto", "CP", "Ciudad", "Observaciones"],
};
const compuestoFacturaVentas = {
  titulos: `Items`,
  nombre: `compuestoFacturaVentas`,
  type: `coleccionInd`,
  funcion: [
    {
      lugar: "formularioIndiv",
      nombre: "asignarUnidadesMedida",
      func: asignarUnidadesMedida,
      atributos: [["porcentaje"]],
    },
    {
      lugar: "formularioIndiv",
      nombre: "calculaImpuestossoloIVa",
      func: calculaImpuestossoloIVa,
    },
  ],
  totalizadores: {
    subtotalVentasFact: {
      type: "totalizadorColeccion",
      total: ["subtotalVentas"],
      cantidad: false,
      digitosPositivos: ["importeNeto", "otrosImpuestos", "impuestoFactVentas"],
      trigger: ["importeNeto", "otrosImpuestos", "impuestoFactVentas"],
    },
    ivaFact: {
      type: "totalizadorColeccion",
      total: ["impuestoFactVentas"],
      cantidad: { nombre: "porcentaje", type: "porcentaje" },
      digitosPositivos: ["importeNeto"],
      trigger: ["porcentaje", "importeNeto"],
    },
    precioPorCantidadFact: {
      type: "totalizadorColeccionSegunValorExt",
      total: ["importeNeto"],
      cantidad: "cantidad",
      digitosPositivos: ["precioUnitario"],
      digitosNegativos: [],
      trigger: ["precioUnitario", "cantidad"],
      porcentaje: {
        atributo: "unidadesMedida",
        valor: "%",
      },
    },
  },
  componentes: {
    cantidad: N({ nombre: "cantidad", clase: "requerido" }),
    unidadesMedida: P({ nombre: "unidadesMedida", clase: "requerido" }),
    itemVenta: P({ nombre: "itemVenta", clase: "requerido" }),
    precioUnitario: I({ nombre: "importe", clase: "requerido" }),
    importeNeto: I("importeNeto"),
    porcentaje: N({ nombre: "porcentaje", clase: "textoCentrado" }),
    impuestoFactVentas: I("impuestoFactVentas"),
    otrosImpuestos: I("otrosImpuestos"),
    subtotalVentas: I("subtotalVentas"),
    descripcion: TA("descripcion"),
  },
  titulosComponentes: [`Q`, `Unidad`, `Item`, `P Unit`, `Neto`, `%`, `IVA`, `Otros impuestos`, `Subtotal`, `Descripción`,
  ],
};
const compuestoFacturaCompras = {
  titulos: `Items`,
  nombre: `compuestoFacturaCompras`,
  type: `coleccionInd`,
  funcion: [
    {
      lugar: "formularioIndiv",
      nombre: "asignarUnidadesMedida",
      func: asignarUnidadesMedida,
      atributos: [["porcentaje"]],
    },
    {
      lugar: "formularioIndiv",
      nombre: "calculaImpuestossoloIVa",
      func: calculaImpuestossoloIVa,
    },
  ],
  totalizadores: {
    subtotalVentasFact: {
      type: "totalizadorColeccion",
      total: ["subtotalVentas"],
      cantidad: false,
      digitosPositivos: ["importeNeto", "otrosImpuestos", "impuestoFactVentas"],
      trigger: ["importeNeto", "otrosImpuestos", "impuestoFactVentas"],
    },
    ivaFact: {
      type: "totalizadorColeccion",
      total: ["impuestoFactVentas"],
      cantidad: { nombre: "porcentaje", type: "porcentaje" },
      digitosPositivos: ["importeNeto"],
      trigger: ["porcentaje", "importeNeto"],
    },
    precioPorCantidadFact: {
      type: "totalizadorColeccionSegunValorExt",
      total: ["importeNeto"],
      cantidad: "cantidad",
      digitosPositivos: ["precioUnitario"],
      digitosNegativos: [],
      trigger: ["precioUnitario", "cantidad"],
      porcentaje: {
        atributo: "unidadesMedida",
        valor: "%",
      },
    },
  },
  componentes: {
    cantidad: N({ nombre: "cantidad", clase: "requerido" }),
    unidadesMedida: P({ nombre: "unidadesMedida", clase: "requerido" }),
    itemCompra: P({ nombre: "itemCompra", clase: "requerido" }),
    precioUnitario: I({ nombre: "importe", clase: "requerido" }),
    importeNeto: I("importeNeto"),
    porcentaje: N({ nombre: "porcentaje", clase: "textoCentrado" }),
    impuestoFactVentas: I("impuestoFactVentas"),
    otrosImpuestos: I("otrosImpuestos"),
    subtotalVentas: I("subtotalVentas"),
    descripcion: TA("descripcion"),
  },
  titulosComponentes: [`Cantidad`, `Unidad`, `Item`, `P Unit`, `Neto`, `%`, `IVA`, `Otros impuestos`, `Subtotal`, `Descripción`,
  ],
};
const compuestoReciboCobros = {
  titulos: `Items`,
  nombre: `compuestoReciboCobros`,
  type: `coleccionInd`,
  totalizadores: {
    importeBaseMp: {
      type: "totalizadorColeccion",
      total: ["subTotal"],
      cantidad: "cantidad",
      digitosPositivos: ["importeBruto", "impuesto"],
      trigger: ["importeBruto", "impuesto", "cantidad"],
    },
  },
  componentes: {
    cantidad: N({ nombre: "cantidad", clase: "requerido" }),
    itemVenta: P({ nombre: "itemVenta", clase: "requerido" }),
    importeBruto: I({ nombre: "importeBruto", clase: "requerido" }),
    impuesto: I("impuesto"),
    subTotal: I("subTotal"),
    descripcionVentas: TA("descripcionVentas"),
  },
  titulosComponentes: [`Cantidad`, `Rubro`, `Neto`, `Impuestos`, `Subtotal`, `Descripción`],
};
const compuestoMedioPagos = {
  titulos: `Medio de Pago`,
  nombre: `compuestoMedioPagos`,
  type: `coleccionInd`,
  moneda: "monedaTipoPago",
  funcion: [
    {
      lugar: "cargar",
      nombre: "ocultarAtributosMedioPagos",
      func: ocultarAtributosMedioPagos,
    },

    {
      lugar: "validarAlConfirmar",
      nombre: "validarMediosPagos",
      func: validarMediosPagos,
    },
    {
      lugar: "formularioIndiv",
      nombre: "cobroChequesTerceros",
      func: cobroChequesTerceros,
    },
    {
      lugar: "formularioIndiv",
      nombre: "habilitarChequesTerceros",
      func: habilitarChequesTerceros,
    },
    {
      lugar: "formularioIndiv",
      nombre: "habilitarCuentaCorriente",
      func: habilitarCuentaCorriente,
    },
    {
      lugar: "formularioIndiv",
      nombre: "calcularTotalMediosPagoConvertido",
      func: calcularTotalMediosPagoConvertido,
    }

  ],
  totalizadores: {
    tipoCambioTipoPago: {
      type: "totalizadorColeccion",
      total: ["importeMonedaDocumento"],
      cantidad: "tipoCambioTipoPago",
      digitosPositivos: ["importeTipoPago"],
      trigger: ["importeTipoPago", "tipoCambioTipoPago"],
    },
  },
  componentes: {
    tipoPago: P({ nombre: "tipoPago", clase: "requerido" }),
    monedaTipoPago: P({ nombre: "monedaTipoPago", origen: "moneda", width: "diez", clase: "requerido" }),
    importeTipoPago: I("importeTipoPago"),
    tipoCambioTipoPago: N("tipoCambioTipoPago"),
    cajas: P("cajas"),
    cuentasBancarias: P("cuentasBancarias"),
    numeroDeCheque: T({ nombre: "numeroDeCheque", clase: "textoCentrado requerido" }),
    vencimientoCheque: F({ nombre: "vencimientoCheque", clase: "requerido" }),
    bancoCheque: T({ nombre: "bancoCheque", clase: "textoCentrado requerido" }),
    observacionesMediosPago: TA("observacionesMediosPago"),

  },
  totales: {
    0: {
      titulo: "Total",
      componentes: {
        importeTipoPago: I(`totalimporteTipoPago`),
      },
    },
  },
  titulosComponentes: [`Medio pago`, `Moneda`, `Importe`, `TC`, `Caja`, `Cuenta banco`, `Número`, `Vencimiento`, `Banco cheque`, `Observaciones`,],
};
const cobrosCtaCte = {
  titulos: `Comprobantes fiscales`,
  nombre: `cobrosCtaCte`,
  type: `coleccionInd`,
  funcion: [
    {
      lugar: "cargar",
      nombre: "cobroPendientes",
      func: cobroPendientes,
    },
  ],
  componentes: {
    fechaComprobante: F({ nombre: "fechaComprobante", clase: "requerido" }),
    tipoComprobante: T({ nombre: "tipoComprobante", width: "siete" }),
    numComprobante: T({ nombre: "numComprobante", width: "diez" }),
    monedaPendiente: P({ nombre: "monedaPendiente", origen: "moneda", width: "diez", clase: "requerido" }),
    importePendiente: I("importePendiente"),
    tipoCambioPendiente: N({ nombre: "tipoCambioPendiente", oculto: "notEsconder" }),
    saldoComprobante: I({ nombre: "saldoComprobante" }),
    importeaCobrar: I({ nombre: "importeaCobrar", clase: "requerido" }),
    idComprobante: T({ nombre: "idComprobante", oculto: "oculto" }),
  },

  titulosComponentes: [`Fecha`, `Tipo`, `Comprobante`, `Moneda`, `Importe`, `TC`, `Saldo`, `Importe a cobrar`],
};
const pagosCtaCte = {
  titulos: `Comprobantes fiscales`,
  nombre: `pagosCtaCte`,
  type: `coleccionInd`,
  funcion: [
    {
      lugar: "cargar",
      nombre: "pagoPendientes",
      func: pagoPendientes,
    },
  ],
  componentes: {
    fechaComprobante: F({ nombre: "fechaComprobante", clase: "requerido" }),
    tipoComprobante: T({ nombre: "tipoComprobante", width: "siete" }),
    numComprobante: T({ nombre: "numComprobante", width: "diez" }),
    monedaPendiente: P({ nombre: "monedaPendiente", origen: "moneda", width: "diez", clase: "requerido" }),
    importePendiente: I("importePendiente"),
    tipoCambioPendiente: N("tipoCambioPendiente"),
    saldoComprobante: I({ nombre: "saldoComprobante" }),
    importeaPagar: I({ nombre: "importeaPagar", clase: "requerido" }),
    idComprobante: T({ nombre: "idComprobante", oculto: "oculto" }),
  },

  titulosComponentes: [`Fecha`, `Tipo`, `Comprobante`, `Moneda`, `Importe`, `TC`, `Saldo`, `Importe a pagar`],
};
const itemsPagosSinFactura = {
  titulos: `Items`,
  nombre: `itemsPagosSinFactura`,
  type: `coleccionInd`,
  totalizadores: {
    importeBaseIp: {
      type: "totalizadorColeccion",
      total: ["subTotal"],
      cantidad: "cantidad",
      digitosPositivos: ["precioUnitario", "iva", "otrosImpuestos"],
      trigger: ["cantidad", "precioUnitario", "iva", "otrosImpuestos"],
    },
  },
  componentes: {
    cantidad: N({ nombre: "cantidad", clase: "requerido" }),
    itemCompra: P(({ nombre: "itemCompra", clase: "requerido" })),
    precioUnitario: I(({ nombre: "precioUnitario", clase: "requerido" })),
    iva: I("iva"),
    otrosImpuestos: I("otrosImpuestos"),
    subTotal: I("subTotal"),
    descripcionItem: TA("descripcionItem"),
  },
  titulosComponentes: [`Cantidad`, `Item`, `Precio Unit`, `Iva`, `Otros Impuestos`, `Total`, "Descripcion"],
};
const gruposDeSeguridad = {
  titulos: `Grupo de seguridad`,
  nombre: `gruposDeSeguridad`,
  type: `coleccionInd`,
  componentes: {
    grupoSeguridad: P("grupoSeguridad"),
    descripcion: TA("descripcion"),
  },
  titulosComponentes: ["Grupo Seguridad", "Observaciones"],
};
const rendicionGastos = {
  titulos: `Rendicion Gastos`,
  nombre: `rendicionGastos`,
  type: `coleccionInd`,
  componentes: {
    fechaGasto: F("fechaGasto"),
    itemGasto: TA("Item Gasto"),
    numComprobante: TA("Comprobante"),
    importe: I("importe"),
    descripcionGasto: T("descripcionGasto")
  },
  titulosComponentes: [`Fecha`, `Item Gasto`, `Comprobante`, `Importe`, `Observaciones`],
};
const caractProd = {
  titulos: `Caracteristica`,
  nombre: `caractProd`,
  type: `coleccionInd`,
  alinearTotal: "derecha",
  funcion: [
    {
      lugar: "formularioIndiv",
      nombre: "PesoOTamano",
      func: PesoOTamano,
    },
    {
      lugar: "formularioIndiv",
      nombre: "asignarUnidadesMedidaCarac",
      func: asignarUnidadesMedida,
      atributos: [["metros", "metrosCubicos", "kilos"]],
    },
    {
      lugar: "formularioIndiv",
      nombre: "metrosCubicosAereos",
      func: metrosCubicosAereos,
    },
  ],
  componentes: {
    cantidadCaractProd: N({ nombre: "cantidadCaractProd", width: "cinco" }),
    cantidadDosCaractProd: N({ nombre: "cantidadDosCaractProd", clase: "metros", }),
    cantidadTresCaractProd: N({ nombre: "cantidadTresCaractProd", clase: "metros", }),
    cantidadCuatroCaractProd: N({ nombre: "cantidadCuatroCaractProd", clase: "metros", }),
    cantidadCincoCaractProd: N({ nombre: "cantidadCincoCaractProd", clase: "metrosCubicos", width: "diez", }),
    cantidadSeisCaractProd: N({
      nombre: "cantidadSeisCaractProd", clase: "kilos", width: "diez",
    }),
  },
  titulosComponentes: [`Bultos`, `Largo`, `Ancho`, `Alto`, `Tamaño`, `Peso`],
};
const cotizacionLogistica = {
  titulos: `Cotizacion`,
  nombre: `cotizacionLogistica`,
  type: `coleccionInd`,
  alinearTotal: "derecha",
  moneda: "monedaComp",
  funcion: [
    {
      lugar: "formularioIndiv",
      nombre: "comisionEnTarifaFlete",
      func: comisionEnTarifaFlete,
    },
    {
      lugar: "formularioIndiv",
      nombre: "asignarUnidadesMedidaCot",
      func: asignarUnidadesMedida,
      atributos: [["porcentaje"]],
    },
    {
      lugar: "formularioIndiv",
      nombre: "ocultarTotal",
      func: ocultarTotal,
    },
    {
      lugar: "formularioIndiv",
      nombre: "calculaImpuestossoloIVa",
      func: calculaImpuestossoloIVa,
      atributos: [P("itemVenta")],
    },
    {
      lugar: "formularioIndiv",
      nombre: "verRentabilidad",
      func: verRentabilidad,
    },
    {
      lugar: "formularioIndiv",
      nombre: "agregarAttrItemVentaEdit",
      func: agregarAttrItemVentaEdit,
    },
    {////ESto tiene que ir solo en sbc, porque no esta cuerdo segun Seguro
      lugar: "formularioIndiv",
      nombre: "totlizadorImporteDosCotizacion",
      func: totlizadorImporteDosCotizacion,
    }],
  totalizadores: {
    impuestoUno: {
      type: "totalizadorColeccion",
      total: ["importeCuatroCotizacion"],
      cantidad: false,
      digitosPositivos: ["importeTresCotizacion", "importeDosCotizacion"],
      trigger: ["importeTresCotizacion", "importeDosCotizacion ", "importeCotizacion"],
    },
    impuestoDos: {
      type: "totalizadorColeccion",
      total: ["importeOchoCotizacion"],
      cantidad: false,
      digitosPositivos: ["importeSieteCotizacion", "importeSeisCotizacion"],
      trigger: ["importeSieteCotizacion", "importeSeisCotizacion", "importeCincoCotizacion"],
    },
    iva: {
      type: "totalizadorColeccion",
      total: ["importeSieteCotizacion"],
      cantidad: { nombre: "porcentaje", type: "porcentaje" },
      digitosPositivos: ["importeSeisCotizacion"],
      trigger: ["porcentaje", "importeSeisCotizacion"],
    },
    ivaComp: {
      type: "totalizadorColeccion",
      total: ["importeTresCotizacion"],
      cantidad: { nombre: "porcentaje", type: "porcentaje" },
      digitosPositivos: ["importeDosCotizacion"],
      trigger: ["porcentaje", "importeDosCotizacion"],
    },
    ventaPorUnit: {
      type: "totalizadorColeccionSegunValorExt",
      total: ["importeSeisCotizacion"],
      cantidad: "cantidadCotizacion",
      digitosPositivos: ["importeCincoCotizacion"],
      digitosNegativos: [],
      trigger: ["importeCincoCotizacion", "cantidadCotizacion"],
      porcentaje: {
        atributo: "unidadesMedida",
        valor: "%",
      },
    },
    compra: {
      type: "totalizadorColeccionVerticalConCondicion",
      total: {
        Dolar: "totalDolaresimporteDosCotizacion",
        Euro: "totalEurosimporteDosCotizacion",
      },
      digitosPositivos: ["importeDosCotizacion"],
      digitosNegativos: [],
      trigger: ["monedaComp", "importeDosCotizacion"],
    },
    compraTotal: {
      type: "totalizadorColeccionVerticalConCondicion",
      total: {
        Dolar: "totalDolaresimporteCuatroCotizacion",
        Euro: "totalEurosimporteCuatroCotizacion",
      },
      digitosPositivos: ["importeCuatroCotizacion"],
      digitosNegativos: [],
      trigger: ["monedaComp", "importeCuatroCotizacion"],
    },
    venta: {
      type: "totalizadorColeccionVerticalConCondicion",
      total: {
        Dolar: "totalDolaresimporteSeisCotizacion",
        Euro: "totalEurosimporteSeisCotizacion",
      },
      digitosPositivos: ["importeSeisCotizacion"],
      digitosNegativos: [],
      trigger: ["monedaComp", "importeSeisCotizacion"],
    },
    ventaTotal: {
      type: "totalizadorColeccionVerticalConCondicion",
      total: {
        Dolar: "totalDolaresimporteOchoCotizacion",
        Euro: "totalEurosimporteOchoCotizacion",
      },
      digitosPositivos: ["importeOchoCotizacion"],
      digitosNegativos: [],
      trigger: ["monedaComp", "importeOchoCotizacion"],
    },
  },
  componentes: {
    cantidadCotizacion: N({ nombre: "cantidadCotizacion", width: "cinco", clase: "cuatroDec" }), //se oculta en el LCL
    unidadesMedida: P("unidadesMedida"),
    itemVenta: P("itemVenta"),
    proveedor: P("proveedor"),
    monedaComp: P({ nombre: "monedaComp", origen: "moneda", width: "diez" }),
    porcentaje: N({ nombre: "porcentaje" }),
    importeCotizacion: I("importeCotizacion"),
    comisionCotizacion: I({ nombre: "comisionCotizacion", oculto: "ocultoConLugar", }),
    importeDosCotizacion: I("importeDosCotizacion"),
    importeTresCotizacion: I("importeTresCotizacion"),
    importeCuatroCotizacion: I("importeCuatroCotizacion"),
    importeCincoCotizacion: I("importeCincoCotizacion"),
    importeSeisCotizacion: I("importeSeisCotizacion"),
    importeSieteCotizacion: I("importeSieteCotizacion"),
    importeOchoCotizacion: I("importeOchoCotizacion"),
    facturado: T({ nombre: "facturado", clase: "soloLectura textoCentrado", valorInicial: "No Facturado" }),
    certificado: T({ nombre: "certificado", clase: "soloLectura textoCentrado" }),
    idColCotizacionGemela: T({ nombre: "idColCotizacionGemela", oculto: "oculto", }),
  },
  totales: {
    0: {
      titulo: "Total Dolares",
      componentes: {
        importeDosCotizacion: IMA({ nombre: "totalDolaresimporteDosCotizacion", moneda: "Dolar" }),
        importeCuatroCotizacion: IMA({ nombre: "totalDolaresimporteCuatroCotizacion", moneda: "Dolar" }),
        importeSeisCotizacion: IMA({ nombre: "totalDolaresimporteSeisCotizacion", moneda: "Dolar" }),
        importeOchoCotizacion: IMA({ nombre: "totalDolaresimporteOchoCotizacion", moneda: "Dolar" }),
      },
    },
    1: {
      titulo: "Total Euros",
      complementoTitulo: "totalEuros",
      componentes: {
        importeDosCotizacion: IMA({ nombre: "totalEurosimporteDosCotizacion", moneda: "Euro" }),
        importeCuatroCotizacion: IMA({ nombre: "totalEurosimporteCuatroCotizacion", moneda: "Euro" }),
        importeSeisCotizacion: IMA({ nombre: "totalEurosimporteSeisCotizacion", moneda: "Euro" }),
        importeOchoCotizacion: IMA({ nombre: "totalEurosimporteOchoCotizacion", moneda: "Euro" }),
      },
    },
  },
  titulosComponentes: [`Q`, `Unidad`, `Item`, "Agente/ Proveedor", `Moneda`, `Alicuota`, `Costo Unitario`, `Comisión`, `Costo Bruto`, ` IVA Compras`, `Costo Neto`, `Venta Unit`, `Neto`, `IVA`, `Bruto`, `Facturado`, `Certificado`,
  ],
  clases: { facturado: "readOnlyFuncion", certificado: "readOnlyFuncion" },
  ocultoColec: { comisionCotizacion: "ocultoConLugar" },
  ocultarColumna: {
    0: ["importeDosCotizacion", "importeTresCotizacion", "importeSieteCotizacion", "facturado", "certificado",],
  },
};
const detalleFlete = {
  titulos: `Detalle Flete`,
  nombre: `detalleFlete`,
  type: `coleccionInd`,
  alinearTotal: "derecha",
  totalizadores: {
    importeBaseFlete: {
      type: "totalizadorColeccion",
      total: ["importeDosFlete"],
      cantidad: "cantidadFlete",
      digitosPositivos: ["importeFlete", "importeCincoFlete"],
      digitosPositivosSinCantidad: [],
      digitosNegativos: [],
      trigger: ["importeFlete", "cantidadFlete", "importeCincoFlete"],
    },
    importeBaseTresFlete: {
      type: "totalizadorColeccion",
      total: ["importeCuatroFlete"],
      cantidad: "cantidadFlete",
      digitosPositivos: ["importeTresFlete"],
      digitosNegativos: [],
      trigger: ["cantidadFlete", "importeTresFlete"],
    },
  },
  componentes: {
    tamanoContenedor: P({ nombre: "tamanoContenedor", width: "cinco" }), //se oculta en el LCL
    tipoContenedor: P("tipoContenedor"),
    cantidadFlete: N({ nombre: "cantidadFlete", width: "cinco" }),
    moneda: P({ nombre: "moneda", width: "diez" }),
    importeFlete: I("importeFlete"),
    importeCincoFlete: I("importeCincoFlete"),
    importeDosFlete: I("importeDosFlete"),
    importeTresFlete: I("importeTresFlete"),
    importeCuatroFlete: I("importeCuatroFlete"),
  },
  titulosComponentes: [`Size`, `Contenedor`, `Q`, `Moneda`, `Costo Unit`, "Comision", `Compra Total`, `Venta Unit`, `Venta Total`],
};
//CRM
const entidadTarea = {
  titulos: `Entidad Tarea`,
  nombre: `entidadTarea`,
  type: `coleccionInd`,
  alinearTotal: "derecha",
  componentes: {
    entidadCrm: P("entidadCrm"),
  },
  titulosComponentes: [`Entidad`],
};
const coleccionImpuestoProducto = {
  titulos: `Impuestos producto`,
  nombre: `coleccionImpuestoProducto`,
  type: `coleccionInd`,
  moneda: "",
  componentes: {
    impuestoDefinicion: P("impuestoDefinicion"),
  },
  titulosComponentes: [`Impuesto`],
};
//Tesoreria
const cotizacionMonedas = {
  titulos: `Cotizacion monedas`,
  nombre: `cotizacionMonedas`,
  type: `coleccionInd`,
  componentes: {
    moneda: P({ nombre: "moneda", clase: "requerido notValApp" }),
    cotizacion: N({ nombre: "cotizacion", clase: "requerido" }),
    descripcion: TA("descripcion")
  },
  titulosComponentes: [`Moneda`, `Cotizacion`, `Descripcion`],
};
const compuestoDeposito = {
  titulos: `Deposito Cheques`,
  nombre: `compuestoDeposito`,
  type: `coleccionInd`,
  funcion: [{
    lugar: "formularioIndiv",
    nombre: "depositoDeCheques",
    func: depositoDeCheques,
  }, {
    lugar: "cargar",
    nombre: "ocultarHermanos",
    func: ocultarHermanos,
  }],

  componentes: {
    monedaTipoPago: P({ nombre: "monedaTipoPago", origen: "moneda", width: "diez", clase: "requerido" }),
    importeTipoPago: I("importeTipoPago"),
    tipoCambioTipoPago: N({ nombre: "tipoCambioTipoPago", oculto: "oculto" }),
    numeroDeCheque: T({ nombre: "numeroDeCheque", clase: "textoCentrado requerido" }),
    vencimientoCheque: F({ nombre: "vencimientoCheque", clase: "requerido" }),
    bancoCheque: T({ nombre: "bancoCheque", clase: "textoCentrado requerido" }),
    cajaDestino: P({ nombre: "cajaDestino", origen: "cajas", clase: "requerido" }),
    cuentaDestino: P({ nombre: "cuentaDestino", origen: "cuentasBancarias", clase: "requerido" }),
    observacionesMediosPago: TA("observacionesMediosPago"),
  },
  titulosComponentes: [`Moneda`, `Importe`, `TC`, `Numero de Cheque`, `Vencimiento Cheque`, `Banco Cheque`, `Caja destino`, `Cuenta destino`, `Observaciones`],

};
const movimientosInternos = {
  titulos: `Movimientos internos`,
  nombre: `movimientosInternos`,
  type: `coleccionInd`,
  componentes: {
    cajaOrigen: P({ nombre: "cajaOrigen", origen: "cajas", clase: "requerido" }),
    cuentaOrigen: P({ nombre: "cuentaOrigen", origen: "cuentasBancarias", clase: "requerido" }),
    importe: I({ nombre: "importe", clase: "requerido" }),
    cajaDestino: P({ nombre: "cajaDestino", origen: "cajas", clase: "requerido" }),
    cuentaDestino: P({ nombre: "cuentaDestino", origen: "cuentasBancarias", clase: "requerido" }),
    observaciones: TA("observaciones"),

  },
  titulosComponentes: [`Caja origen`, `Cuenta origen`, `Importe`, `Caja destino`, `Cuenta destino`, `Observaciones`],
  funcion: [
    {
      lugar: "cargar",
      nombre: "ocultarHermanos",
      func: ocultarHermanos,
    },
  ]
};
const liquidacionMonedas = {
  titulos: `Liquidacion monedas`,
  nombre: `liquidacionMonedas`,
  type: `coleccionInd`,
  funcion: [{
    lugar: "formularioIndiv",
    nombre: "convierteMoneda",
    func: convierteMoneda,
  },
  {
    lugar: "formularioIndiv",
    nombre: "tipoCambioPesos",
    func: tipoCambioPesos,
  },
  ],

  componentes: {
    monedaOrigen: P({ nombre: "monedaOrigen", origen: "moneda", width: "diez", clase: "requerido" }),
    tipoCambioOrigen: N({ nombre: "tipoCambioOrigen", clase: "requerido" }),
    importeOrigen: I({ nombre: "importeOrigen", clase: "requerido" }),
    monedaDestino: P({ nombre: "monedaDestino", origen: "moneda", width: "diez", clase: "requerido" }),
    tipoCambioDestino: N({ nombre: "tipoCambioDestino", clase: "requerido" }),
    importeDestino: I({ nombre: "importeDestino", clase: "requerido" }),

  },
  titulosComponentes: [`Moneda origen`, `TC`, `Importe origen`, `Moneda destino`, `TC`, `Importe destino`],

}
//Inventario
const movimientoStock = {
  titulos: `Movimiento Stock`,
  nombre: `movimientoStock`,
  type: `coleccionInd`,

  componentes: {
    cantidad: N({ nombre: "cantidad", clase: "requerido" }),
    unidadesMedida: P({ nombre: "unidadesMedida", clase: "requerido" }),
    producto: P({ nombre: "producto", clase: "requerido" }),
    fechaVencimientoProducto: F({ nombre: "fechaVencimientoProducto" }),
    codigoDeBarras: T({ nombre: "codigoDeBarras", clase: "requerido" }),
    estadoFacturacion: PPE({ nombre: "estadoFacturacion", valorInicial: "Pendiente", oculto: "oculto", opciones: ["Pendiente", "Facturado"] }),
    disponibles: N({ nombre: "disponibles" }),
    cantidadSalidas: N({ nombre: "cantidadSalidas" }),
    descripcion: TA("descripcion"),
    idComprobante: T({ nombre: "idComprobante", oculto: "oculto" }),

  },
  titulosComponentes: ["Cantidad", "Unidad", "Producto", "Fecha vencimiento", "Codigo de barras", "Estado", "Disponibles", "Salidas", "Descripción", "idComprobante"],
};
const movimientoUbicaciones = {
  titulos: `Movimiento Ubicaciones`,
  nombre: `movimientoUbicaciones`,
  type: `coleccionInd`,
  componentes: {
    almacenOrigen: P({ nombre: "almacenOrigen", origen: "almacen", clase: "requerido" }),
    ubicacionOrigen: P({ nombre: "ubicacionOrigen", origen: "ubicaciones", clase: "requerido" }),
    producto: P({ nombre: "producto", clase: "requerido" }),
    disponibles: N({ nombre: "disponibles", clase: "requerido" }),
    almacenDestino: P({ nombre: "almacenDestino", origen: "almacen", clase: "requerido" }),
    ubicacionDestino: P({ nombre: "ubicacionDestino", origen: "ubicaciones", clase: "requerido" }),
    idComprobante: T({ nombre: "idComprobante", oculto: "oculto" }),
    unidadesMedida: P({ nombre: "unidadesMedida", clase: "requerido", oculto: "oculto" }),
    cantidad: N({ nombre: "cantidad", clase: "requerido", oculto: "oculto" }),
  },
  titulosComponentes: ["Almacen origen", "Ubicacion origen", "Producto", "Cantidad", "Almacen destino", "Ubicacion destino", "ID", "unidadesMedida", "cantidad"],
};
const costosInventarios = {
  titulos: `Lista de precios`,
  nombre: `costosInventarios`,
  type: `coleccionInd`,
  componentes: {
    producto: P({ nombre: "producto", clase: "requerido" }),
    marca: P({ nombre: "marca", clase: "requerido" }),
    cantidad: N({ nombre: "cantidad", clase: "requerido" }),
    unidadesMedida: P({ nombre: "unidadesMedida", clase: "requerido" }),
    tipoCosto: PPE({ nombre: "tipoCosto", opciones: ["Nacional", "Importado"], clase: "requerido" }),
    moneda: P({ nombre: "moneda", clase: "requerido" }),
    costoInventario: I({ nombre: "costoInventario", clase: "requerido" })

  },
  titulosComponentes: ["Producto", "Marca", "Cantidad", "Unidad", "Tipo", "Moneda", "Importe"],
};
const preciosInventarios = {
  titulos: `Precios`,
  nombre: `preciosInventarios`,
  type: `coleccionInd`,
  componentes: {
    producto: P({ nombre: "producto", clase: "requerido" }),
    marca: P({ nombre: "marca", clase: "requerido" }),
    cantidad: N({ nombre: "cantidad", clase: "requerido" }),
    unidadesMedida: P({ nombre: "unidadesMedida", clase: "requerido" }),
    moneda: P({ nombre: "moneda", clase: "requerido" }),
    precioInventario: I({ nombre: "precioInventario", clase: "requerido" }),

  },
  titulosComponentes: ["Producto", "Marca", "Cantidad", "Unidad", "Moneda", "Precio"],
};
const costosProducto = {
  titulos: `Costos`,
  nombre: `costosProducto`,
  type: `coleccionInd`,
  componentes: {
    proveedor: P({ nombre: "proveedor" }),
    cantidadCostos: N({ nombre: "cantidadCostos" }),
    unidadesMedidaCostos: P({ nombre: "unidadesMedidaCostos", origen: "unidadesMedida" }),
    monedaCostos: P({ nombre: "monedaCostos", origen: "moneda", width: "diez" }),
    costoInventario: I({ nombre: "costoInventario" }),

  },
  titulosComponentes: ["Proveedor", "Cantidad", "Unidad", "Moneda", "Costo"],
};
const preciosProducto = {
  titulos: `Precios de venta`,
  nombre: `preciosProducto`,
  type: `coleccionInd`,
  componentes: {
    listasPrecios: P({ nombre: "listasPrecios" }),
    cantidadPrecios: N({ nombre: "cantidadPrecios" }),
    unidadesMedidaPrecios: P({ nombre: "unidadesMedidaPrecios", origen: "unidadesMedida" }),
    monedaPrecios: P({ nombre: "monedaPrecios", origen: "moneda", width: "diez" }),
    precioInventario: I({ nombre: "precioInventario" }),

  },
  titulosComponentes: ["Lista de precios", "Cantidad", "Unidad", "Moneda", "Precio"],
};
const quiebreDeStock = {
  titulos: `Notificaciones Stock`,
  nombre: `quiebreDeStock`,
  type: `coleccionInd`,
  componentes: {
    cantidad: N({ nombre: "cantidad" }),
    unidadesMedida: P({ nombre: "unidadesMedida" }),
    accion: PPE({ nombre: "accion", opciones: ["Notificacion", "Envio de Correo"] }),
    descripcionQuiebre: TA("descripcionQuiebre"),
  },
  titulosComponentes: ["Cantidad", "Unidad", "Acción", "Descripción"],
};
const toleranciaStock = {
  titulos: `Tolerancia de salida`,
  nombre: `toleranciaStock`,
  type: `coleccionInd`,
  componentes: {
    quiebrePermitido: N({ nombre: "quiebrePermitido" }),
    unidadesMedida: P({ nombre: "unidadesMedida" }),

  },
  titulosComponentes: ["Cantidad", "Unidad"],
}
const detalleProducto = {
  titulos: `Detalle Producto`,
  nombre: `detalleProducto`,
  type: `coleccionInd`,
  funcion: [
    {
      lugar: "formularioIndiv",
      nombre: "copiaDetalleProducto",
      func: copiaDetalleProducto,

    },

  ],
  componentes: {
    cantidadProducto: N({ nombre: "cantidadProducto", clase: "requerido" }),
    unidadesMedidaProducto: P({ nombre: "unidadesMedidaProducto", origen: "unidadesMedida", clase: "requerido" }),
    producto: P({ nombre: "producto", clase: "requerido" }),
    almacenProducto: P({ nombre: "almacenProducto", origen: "almacen", clase: "requerido" }),
    importeProducto: I({ nombre: "importeProducto", clase: "requerido" }),
    descripcionProducto: TA("descripcionProducto"),
  },
  titulosComponentes: ["Cantidad", "Unidad", "Producto", "Almacen", "P Unit", "Descripción"],
};
const remitoIngreso = {
  titulos: `Remito`,
  nombre: `remitoIngreso`,
  type: `coleccionInd`,
  funcion: [
    {
      lugar: "cargar",
      nombre: "remitosPendientes",
      func: remitosPendientes,
    },
  ],
  componentes: {
    remito: T("remito"),
    cantidadRemito: N({ nombre: "cantidadRemito" }),
    unidadesMedidaRemito: P({ nombre: "unidadesMedidaRemito", origen: "unidadesMedida" }),
    productoRemito: P({ nombre: "productoRemito", origen: "producto" }),
    almacenRemito: P({ nombre: "almacenRemito", origen: "almacen" }),
    observaciones: TA("observaciones"),
    idComprobante: T({ nombre: "idComprobante", oculto: "oculto" }),
    idColeccionUnWind: T({ nombre: "idColeccionUnWind", oculto: "oculto" }),
    estadoFacturacion: T({ nombre: "estadoFacturacion", oculto: "oculto" }),
  },
  titulosComponentes: [`Remito`, `Cantidad`, `Unidad`, `Producto`, `Almacen`, `Observaciones`],

};
class AtributoCompuesto {

  constructor(caracteristica) {
    this.nombre = caracteristica?.nombre || caracteristica;
    this.titulos = caracteristica?.titulos
    this.type = `coleccionInd`
    this.componentes = caracteristica?.componentes
    this.titulosComponentes = caracteristica?.titulosComponentes

  }
}
const COM = new Proxy(AtributoCompuesto, {
  // Interceptar la llamada a P(...)
  apply(target, thisArg, args) {
    // Devuelve una instancia automáticamente
    return new target(...args);
  }
})
//Atributos de sistema no utlizado por el usuario sino por el sistema para programar
const widthObject = {
  tres: `width="tres"`,
  cuatroCinco: `width="cuatroCinco"`,
  cinco: `width="cinco"`,
  seis: `width="seis"`,
  siete: `width="siete"`,
  ocho: `width="ocho"`,
  nueve: `width="nueve"`,
  diez: `width="diez"`,
  doce: `width="doce"`,
  quince: `width="quince"`,
  veinte: `width="veinte"`,
  treinta: `width="treinta"`,
};
const ocultoOject = {
  oculto: `oculto=true`,
  ocultoSeguridad: `oculto=true`,
  ocultoConLugar: `ocultoConLugar=true`,
  ocultoAbm: `ocultoAbm=true`,
  notEsconder: `notEsconder=true`,
};
//Objetos refrencias usados por funciones
let monedaGesfin = {
  local: "Pesos",
  alernativa: "Dolar",
  alernativaDos: "Euro",
  dolar: "Dolar",
  euro: "Euro",
  base: "variable",
};
////Objeto Facturación fiscal
const condicionIva = {
  responsableinscripto: 1,
  responsablenoinscripto: 2,
  exento: 3,
  noresponsable: 4,
  consumidorfinal: 5,
  monotributo: 6,
  sujetonocategorizado: 7,
  clientedellexterior: 8,
  responsableinscriptoagentepercepcion: 9,
  responsableinscriptoagenteretencion: 10,
  monotributistasocial: 11,
  pequeñocontribuyenteeventual: 12,
  pequeñocontribuyenteeventualsocial: 13

}
const docTipo = {
  cuit: 80,
  cuil: 86,
  cdi: 87,
  le: 89,
  lc: 90,
  ciextranjera: 91,
  entramite: 92,
  actanacimiento: 93,
  pasaporte: 94,
  cipoliciafederal: 95,
  dni: 96,
  la: 97,
  cibuenosaires: 98,
  sinidentificar: 99
};
const tasasImpositivas = {
  0: 3,
  2.5: 9,
  5: 8,
  10.5: 4,
  21: 5,
  27: 6,

}
const tiposComprobante = {
  letraa: {
    letra: "A",
    facturasEmitidas: 1,
    notaDebito: 2,
    notaCredito: 3
  },
  letrab: {
    letra: "B",
    facturasEmitidas: 6,
    notaDebito: 7,
    notaCredito: 8
  },
  letrac: {
    letra: "C",
    facturasEmitidas: 11,
    notaDebito: 12,
    notaCredito: 13
  },
  letrae: {
    letra: "E",
    facturasEmitidas: 19,
    notaDebito: 20,
    notaCredito: 21
  },
  letram: {
    letra: "M",
    facturasEmitidas: 201,
    notaDebito: 202,
    notaCredito: 203
  }
}


