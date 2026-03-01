const { mongoose, Schema, model } = require("mongoose");
const AtributosCompartidosSchema = require('../../AtributosCompartidos');

const SaldosBancosSchema = new Schema({
    numerador: { type: Number },
    bancos: {
        type: String,
        ref: "bancos",
        sparse: true,
        default: ""
    },
    cuentasBancarias: {
        type: String,
        ref: "cuentasBancarias",
        sparse: true,
        default: ""
    },
    fecha: { type: Date },
    itemsBancos: {
        type: String,
        ref: "itemsBancos",
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

module.exports = model("SaldosBancos", SaldosBancosSchema);
