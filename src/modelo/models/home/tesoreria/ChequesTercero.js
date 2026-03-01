const { mongoose, Schema, model } = require("mongoose");
const AtributosCompartidosSchema = require('../../AtributosCompartidos');

const ChequesTerceroSchema = new Schema({
    numeroDeCheque: { type: String },
    fecha: { type: Date },
    vencimientoCheque: { type: Date },
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
    cliente: {
        type: String,
        ref: "clientes",
        sparse: true //Esto indicará a Mongoose que el índice correspondiente al atributo
    },
    bancoCheque: { type: String },
    texto: { type: String },
    estado: { type: String },
    fechaDeposito: { type: Date },
    bancos: {
        type: String,
        ref: "bancos",
        sparse: true,
        default: ""
    },
    cuentasBancarias: {
        type: [String],
        ref: "cuentasBancarias",
        sparse: true,
        default: ""
    },
    ...AtributosCompartidosSchema
});

module.exports = model("ChequesTercero", ChequesTerceroSchema);