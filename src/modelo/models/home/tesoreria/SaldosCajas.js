const { Schema, model } = require("mongoose");
const AtributosCompartidosSchema = require('../../AtributosCompartidos');

const SaldosCajasSchema = new Schema({
    numerador: { type: Number },
    cajas: {
        type: String,
        ref: "cajas",
        sparse: true,
        default: ""
    },
    fecha: { type: Date },
    itemsCajas: {
        type: String,
        ref: "itemsCajas",
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
    importe: { type: Number },
    importemb: { type: Number },
    importema: { type: Number },
    descripcionCompleto: { type: String },
    ...AtributosCompartidosSchema


});

module.exports = model("SaldosCajas", SaldosCajasSchema);
