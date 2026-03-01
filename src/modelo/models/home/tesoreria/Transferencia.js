const { mongoose, Schema, model } = require("mongoose");
const AtributosCompartidosSchema = require('../../AtributosCompartidos');

const TransferenciaSchema = new Schema({

    numerador: { type: Number, required: true },
    fecha: { type: Date },
    moneda: {
        type: String,
        ref: "moneda",
        sparse: true,
        default: ""
    },
    tipoCambio: { type: Number },
    //movimientosInternos
    cajaOrigen: {
        type: [String],
        ref: "cajaOrigen",
        required: false,
        sparse: true,
        default: []
    },
    cuentaOrigen: {
        type: [String],
        ref: "cuentasBancarias",
        sparse: true,
        default: ""
    },
    importe: { type: [Number] },
    importemb: { type: [Number] },
    importema: { type: [Number] },
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
    observaciones: { type: [String] },
    //
    importeTotal: { type: [String] },
    importeTotalma: { type: [String] },
    importeTotalmb: { type: [String] },
    destinoorigen: { type: [String] },
    idColorigen: { type: [String] },
    destinodestino: { type: [String] },
    idColdestino: { type: [String] },
    positionmovimientosInternos: { type: [String] },
    ...AtributosCompartidosSchema
});



module.exports = model("Transferencia", TransferenciaSchema);