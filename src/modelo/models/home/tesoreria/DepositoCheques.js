const { mongoose, Schema, model } = require("mongoose");
const AtributosCompartidosSchema = require('../../AtributosCompartidos');

const DepositoChequesSchema = new Schema({
    numerador: { type: Number },
    fecha: { type: Date },
    //coleccion compuestoDeposito
    monedaTipoPago: {
        type: [String],
        ref: "moneda",
        sparse: true,
        default: ""
    },
    tipoCambioTipoPago: { type: [Number] },
    importeTipoPago: { type: [Number] },
    importeTipoPagomb: { type: [Number] },
    importeTipoPagoma: { type: [Number] },
    numeroDeCheque: { type: [String] },
    vencimientoCheque: { type: [Date] },
    bancoCheque: { type: [String] },
    cajaDestino: {
        type: [String],
        ref: "cajaOrigen",
        required: false,
        sparse: true,
        default: []
    },
    cuentaDestino: {
        type: [String],
        ref: "cuentasBancarias",
        sparse: true,
        default: ""
    },
    observacionesMediosPago: { type: [String] },
    destinoorigen: { type: [String] },
    idColorigen: { type: [String] },
    destinodestino: { type: [String] },
    idColdestino: { type: [String] },
    positioncompuestoDeposito: { type: [String] },
    /////
    importeTotal: { type: Number },
    //
    importeTotalma: { type: [Number] },
    importeTotalmb: { type: [Number] },
    ...AtributosCompartidosSchema
});

module.exports = model("DepositoCheques", DepositoChequesSchema);