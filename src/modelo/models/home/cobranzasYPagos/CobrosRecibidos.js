const { mongoose, Schema, model } = require("mongoose");
const AtributosCompartidosSchema = require('../../AtributosCompartidos');

const CobrosRecibidosSchema = new Schema({
    numerador: { type: Number, required: true },
    items: { type: String },
    unidades: {
        type: Schema.Types.ObjectId,
        ref: "unidades"
    },
    fecha: { type: Date },
    cliente: {
        type: String,
        ref: "clientes",
        sparse: true,
        default: ""
    },

    moneda: {
        type: Schema.Types.ObjectId,
        ref: "moneda"
    },
    tipoCambio: { type: Number },
    descripcionCompleto: { type: String },
    /*compuestoReciboCobros */
    cantidad: { type: [Number] },
    itemVenta: {
        type: [String],
        ref: "itemVenta",
        sparse: true,
        default: ""
    },

    importeBruto: { type: [Number] },
    impuesto: { type: [Number] },
    subTotal: { type: [Number] },
    descripcionVentas: { type: [String] },
    idColcompuestoReciboCobros: { type: [String] },//Standar coleccion
    destinocompuestoReciboCobros: { type: [String] },//Standar coleccion
    positioncompuestoReciboCobros: { type: [String] },
    //coleccion cobrosCtaCte
    fechaComprobante: {
        type: [Date],
        required: false,
        sparse: true,
    },
    tipoComprobante: {
        type: [String],
        ref: "tipoComprobante"
    },
    numComprobante: { type: [String] },
    monedaPendiente: {
        type: [String],
        ref: "monedaTipoPago",
        sparse: true,
        default: ""
    },
    importePendiente: { type: [Number] },
    tipoCambioPendiente: { type: [Number] },
    importeaCobrar: { type: [Number] },
    importeaCobrarmb: { type: [Number] },
    importeaCobrarma: { type: [Number] },
    saldoComprobante: { type: [Number] },
    saldoComprobantemb: { type: [Number] },
    saldoComprobantema: { type: [Number] },
    idComprobante: { type: [String] },
    idColcobrosCtaCte: { type: [String] },//Standar coleccion
    destinocobrosCtaCte: { type: [String] },//Standar coleccion
    positioncobrosCtaCte: { type: [String] },
    ////*Colecion tipo de pagos */
    tipoPago: {
        type: [Schema.Types.ObjectId],
        ref: "formaPago"
    },
    monedaTipoPago: {
        type: [Schema.Types.ObjectId],
        ref: "moneda"
    },
    importeTipoPago: { type: [Number] },
    tipoCambioTipoPago: { type: [Number] },
    importeMonedaDocumento: { type: [Number] },
    cajas: {
        type: [String],
        ref: "cajas",
        required: false,
        sparse: true,
        default: []
    },
    textoDosTipoPago: { type: [String] },
    fechaTipoPago: {
        type: [Date],
        required: false,
        sparse: true,
    },
    cuentasBancarias: {
        type: [String],
        ref: "cuentasBancarias",
        required: false,
        sparse: true,
        default: []
    },
    bancoCheque: { type: [String] },
    idColmediosPagos: { type: [String] },
    destinomediosPagos: { type: [String] },
    positioncompuestoMedioPagos: { type: [String] },
    ///////////////////////////////////
    importeTotal: { type: Number },
    totalimporteTipoPago: { type: Number },
    totalimporteMonedaDocumento: { type: Number },
    //campos multimoneda
    importeBrutomb: { type: [Number] },
    importeBrutoma: { type: [Number] },
    impuestomb: { type: [Number] },
    impuestoma: { type: [Number] },
    subTotalmb: { type: [Number] },
    subTotalma: { type: [Number] },
    importeTotalma: { type: Number },
    importeTotalmb: { type: Number },
    importeTipoPagoma: { type: [Number] },
    importeTipoPagomb: { type: [Number] },

    ...AtributosCompartidosSchema
});


module.exports = model("CobrosRecibidos", CobrosRecibidosSchema);