const { Schema, model } = require("mongoose");
const AtributosCompartidosSchema = require('./AtributosCompartidos');

const NumeroSchema = new Schema({
    name: { type: String },
    numerador: { type: Number },
    ancla: { type: String },
    filtroUno: { type: String },
    habilitado: { type: String },
    ...AtributosCompartidosSchema

}, { strict: false });

module.exports = model("Numerador", NumeroSchema);