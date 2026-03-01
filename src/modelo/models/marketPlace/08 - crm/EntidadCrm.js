const { Schema, model } = require("mongoose");
const AtributosCompartidosSchema = require('../../AtributosCompartidos');

const EntidadCrmSchema = new Schema({
    name: { type: String, index: { unique: true, sparse: true } },
    habilitado: { type: String },
    ...AtributosCompartidosSchema
});
module.exports = model("EntidadCrmSchema", EntidadCrmSchema);