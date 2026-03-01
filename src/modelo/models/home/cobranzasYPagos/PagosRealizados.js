const { mongoose, Schema, model } = require("mongoose");
const AtributosCompartidosSchema = require('../../AtributosCompartidos');

const PagosRealizadosSchema = new Schema({
    numerador: { type: Number, required: true },
    items: { type: String },
    fecha: { type: Date },
    proveedor: {
        type: String,
        ref: "proveedor",
        sparse: true,
        default: ""
    },
    moneda: {
        type: String,
        ref: "moneda",
        sparse: true,
        default: ""
    },
    tipoCambio: { type: Number },
    descripcionCompleto: { type: String },
    //coleccion pagosCtaCte
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
    importeaPagar: { type: [Number] },
    importeaPagarmb: { type: [Number] },
    importeaPagarma: { type: [Number] },
    saldoComprobante: { type: [Number] },
    saldoComprobantemb: { type: [Number] },
    saldoComprobantema: { type: [Number] },
    idComprobante: { type: [String] },
    idColpagosCtaCte: { type: [String] },//Standar coleccion
    destinopagosCtaCte: { type: [String] },//Standar coleccion
    positionpagosCtaCte: { type: [String] },
    //Coleccion itemsPagos
    cantidad: {
        type: [Number],
    },
    itemCompra: {
        type: [String],
        ref: "rubroPagos",
        sparse: true,
        default: ""
    },
    precioUnitario: { type: [Number] },
    iva: { type: [Number] },
    otrosImpuestos: { type: [Number] },
    subTotal: { type: [Number] },
    positionitemsPagosSinFactura: { type: [String] },
    idColanticipos: { type: [String] },
    /////////////////////////////
    //Coleccion compuestoMedioPagosConChequeTercero
    tipoPago: {
        type: [String],
        ref: "tipoPago",
        sparse: true,
        default: ""
    },
    monedaTipoPago: {
        type: [String],
        ref: "monedaTipoPago",
        sparse: true,
        default: ""
    },
    importeTipoPago: { type: [Number] },
    tipoCambioTipoPago: { type: [Number] },
    importeMonedaDocumento: { type: [Number] },
    cajas: {
        type: [String],
        ref: "cajas",
        required: false,
        sparse: true,
        default: ""
    },
    numeroDeCheque: { type: [String] },
    vencimientoCheque: {
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
    observacionesMedioPago: { type: [String] },
    destinomediosPagos: { type: [String] },
    idColmediosPagos: { type: [String] },
    positioncompuestoMedioPagos: { type: [String] },
    totalimporteTipoPago: { type: Number },
    totalimporteMonedaDocumento: { type: Number },
    /////////////////////////////
    importeTotal: { type: Number },
    //campos multimoneda
    precioUnitariomb: { type: [Number] },
    precioUnitarioma: { type: [Number] },
    ivamb: { type: [Number] },
    ivama: { type: [Number] },
    otrosImpuestosmb: { type: [Number] },
    otrosImpuestosma: { type: [Number] },
    subTotalmb: { type: [Number] },
    subTotalma: { type: [Number] },
    importeTotalmb: { type: Number },
    importeTotalma: { type: Number },
    importeTipoPagomb: { type: [Number] },
    importeTipoPagoma: { type: [Number] },
    importePendientemb: { type: [Number] },
    importePendientema: { type: [Number] },
    ...AtributosCompartidosSchema
});

module.exports = model("PagosRealizados", PagosRealizadosSchema);