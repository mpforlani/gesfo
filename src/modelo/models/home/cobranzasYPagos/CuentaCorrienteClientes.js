const { Schema, model } = require("mongoose");
const AtributosCompartidosSchema = require('../../AtributosCompartidos');

const CuentaCorrienteClientesSchema = new Schema({
    numerador: { type: Number },
    fecha: { type: Date },
    fechaVencimiento: { type: Date },
    cliente: {
        type: String,
        ref: "clientes",
        sparse: true,
        default: ""
    },
    movimientoDestino: { type: String },
    tipoComprobante: {
        type: [String],
        ref: "tipoComprobante"
    },
    numComprobante: { type: [String] },
    moneda: {
        type: String,
        ref: "moneda",
        sparse: true,
        default: ""
    },
    tipoCambio: { type: Number },
    importe: { type: Number },
    importemb: { type: Number },
    importema: { type: Number },
    saldoComprobante: { type: [Number] },
    saldoComprobantemb: { type: [Number] },
    saldoComprobantema: { type: [Number] },
    estado: { type: String },
    descripcionCompleto: { type: [String] },
    comprobanteOP: { type: [String] },
    ///AdjuntoClec
    /*1*/nameUsuColec: { type: [String] },
    /*2*/pathColec: { type: [String] },
    /*3*/originalnameColec: { type: [String] },
    ...AtributosCompartidosSchema
});




module.exports = model("CuentaCorrienteClientes", CuentaCorrienteClientesSchema);