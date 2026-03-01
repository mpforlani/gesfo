const { Schema, model } = require("mongoose");
const AtributosCompartidosSchema = require('../../AtributosCompartidos');

const MonedaSchema = new Schema({
    name: { type: String, index: { unique: true, sparse: true } },
    abrev: { type: String },
    habilitado: { type: String },
    ...AtributosCompartidosSchema
});


module.exports = model("Moneda", MonedaSchema);