const { Schema, model } = require("mongoose");
const AtributosCompartidosSchema = require('../../AtributosCompartidos');

const RubrosPagosSchema = new Schema({
    numerador: { type: Number },
    name: { type: String, index: { unique: true, sparse: true } },
    concepto: { type: String },

    habilitado: { type: String },
    ...AtributosCompartidosSchema
});

module.exports = model("RubrosPagos", RubrosPagosSchema);