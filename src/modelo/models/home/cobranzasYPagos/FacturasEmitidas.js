const { mongoose, Schema, model } = require("mongoose");
const AtributosCompartidosSchema = require('../../AtributosCompartidos');

const FacturasEmitidasSchema = new Schema({
    cliente: {
        type: Schema.Types.ObjectId,
        ref: "cliente"
    },
    fecha: { type: Date },
    fechaVencimiento: { type: Date },
    comprobante: {
        type: String,
        ref: "tipoComprobante"
    },
    tipoComprobante: {
        type: String,
        ref: "tipoComprobante"
    },
    ancla: { type: String },
    numerador: { type: String },
    moneda: {
        type: String,
        ref: "moneda"
    },
    descripcionCompleto: { type: String },
    tipoCambio: { type: Number },
    observaciones: { type: String },
    ////compuestoFacturaVentas
    cantidad: {
        type: [Number],
        ref: "cajas",
        required: false,
        sparse: true,
        default: []
    },
    unidadesMedida: {
        type: [String],
        ref: "itemVenta"
    },
    itemVenta: {
        type: [String],
        ref: "itemVenta"
    },
    precioUnitario: { type: [Number] },
    precioUnitariomb: { type: [Number] },
    precioUnitarioma: { type: [Number] },
    importeNeto: { type: [Number] },
    importeNetomb: { type: [Number] },
    importeNetoma: { type: [Number] },
    porcentaje: { type: [Number] },
    impuestoFactVentas: { type: [Number] },
    impuestoFactVentasmb: { type: [Number] },
    impuestoFactVentasma: { type: [Number] },
    otrosImpuestos: { type: [Number] },
    otrosImpuestosmb: { type: [Number] },
    otrosImpuestosma: { type: [Number] },
    subtotalVentas: { type: [Number] },
    subtotalVentasmb: { type: [Number] },
    subtotalVentasma: { type: [Number] },
    descripcion: { type: [String] },
    idColcompuestoFacturaVentas: { type: [String] },//Standar coleccion
    destinocompuestoFacturaVentas: { type: [String] },//Standar coleccion
    positioncompuestoFacturaVentas: { type: [String] },
    //idColecFact: { type: [String] },//Esto ?
    //destinoColecFact: { type: [String] },//Esto ?
    //////
    //compuesto detalleProducto
    cantidadProducto: {
        type: [Number]
    },
    unidadesMedidaProducto: {
        type: [String],
        ref: "unidadesMedida"
    },
    producto: {
        type: [String],
        ref: "producto"
    },
    almacenProducto: {
        type: [String],
        ref: "almacen"
    },
    importeProducto: { type: [Number] },
    importeProductomb: { type: [Number] },
    importeProductoma: { type: [Number] },
    descripcionProducto: { type: [String] },
    idColdetalleProducto: { type: [String] },//Standar coleccion
    destinodetalleProducto: { type: [String] },//Standar coleccion
    positiondetalleProducto: { type: [String] },
    //ColeccionTipoPago
    tipoPago: {
        type: [String],
        ref: "formaPago"
    },
    fechaTipoPago: { type: [Date] },
    monedaTipoPago: {
        type: [String],
        ref: "moneda"
    },
    importeTipoPago: { type: [Number] },
    importeTipoPagomb: { type: [Number] },
    importeTipoPagoma: { type: [Number] },
    tipoCambioTipoPago: { type: [Number] },
    cajas: {
        type: [String],
        ref: "cajas",
        required: false,
        sparse: true,
        default: []
    },
    cuentasBancarias: {
        type: [String],
        ref: "cuentasBancarias",
        required: false,
        sparse: true,
        default: []
    },
    numeroDeCheque: { type: [String] },
    vencimientoCheque: { type: [String] },
    bancoCheque: { type: [String] },
    otroBancos: { type: [String] },
    observacionesMediosPago: { type: [String] },
    totalImporteTipoPago: { type: Number },//Total colección
    totalImporteValidador: { type: Number },//Total colección
    idColcompuestoMedioPagos: { type: [String] },//Standar coleccion
    destinocompuestoMedioPagos: { type: [String] },//Standar coleccion
    positioncompuestoMedioPagos: { type: [String] },
    ////////////////////
    cuentasBancariasPago: {
        type: String,
        ref: "cuentasBancarias"

    },
    importeTotal: { type: Number },
    importeTotalmb: { type: Number },
    importeTotalma: { type: Number },
    CAE: { type: String },
    vtocae: { type: Date },
    ...AtributosCompartidosSchema
});

module.exports = model("FacturasEmitidas", FacturasEmitidasSchema);