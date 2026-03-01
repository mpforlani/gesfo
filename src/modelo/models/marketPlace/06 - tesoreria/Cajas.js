const { Schema, model } = require("mongoose");
const AtributosCompartidosSchema = require('../../AtributosCompartidos');

const CajasSchema = new Schema({
    name: { type: String, index: { unique: true, sparse: true } },
    cuenta: { type: String },
    habilitado: { type: String },
    ...AtributosCompartidosSchema
});

module.exports = model("Cajas", CajasSchema);