const { mongoose, Schema, model } = require("mongoose");
const AtributosCompartidosSchema = require('../../AtributosCompartidos');

const LiquidacionMonedaSchema = new Schema({
    numerador: { type: Number, required: true },
    fecha: { type: Date },
    cajas: {
        type: String,
        ref: "cajas",
        sparse: true,
        default: ""
    },
    cuentasBancarias: {
        type: String,
        ref: "cuentasBancarias",
        sparse: true,
        default: ""
    },
    ////
    monedaOrigen: {
        type: [String],
        ref: "moneda",
        sparse: true,
        default: ""
    },
    importeOrigen: { type: [Number] },
    tipoCambioOrigen: { type: [Number] },

    monedaDestino: {
        type: [String],
        ref: "moneda",
        sparse: true,
        default: ""
    },
    importeDestino: { type: [Number] },
    tipoCambioDestino: { type: [Number] },
    //
    destinoorigen: { type: [String] },
    idColorigen: { type: [String] },
    destinodestino: { type: [String] },
    idColdestino: { type: [String] },
    observaciones: { type: String },
    positionliquidacionMonedas: { type: [String] },
    ...AtributosCompartidosSchema
});


module.exports = model("liquidacionMoneda", LiquidacionMonedaSchema);