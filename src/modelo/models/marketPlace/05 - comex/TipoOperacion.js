const { Schema, model } = require("mongoose");
const AtributosCompartidosSchema = require('../../AtributosCompartidos');

const TipoOperacionSchema = new Schema({
    name: { type: String, unique: true },
    habilitado: { type: String },
    ...AtributosCompartidosSchema
});

module.exports = model("TipoOperacion", TipoOperacionSchema);