const { mongoose, Schema, model } = require("mongoose");
const AtributosCompartidosSchema = require('../../AtributosCompartidos');

const PaisSchema = new Schema({
    name: { type: String, index: { unique: true, sparse: true } },
    date: { type: String },
    habilitado: { type: String },
    ...AtributosCompartidosSchema

},);

module.exports = model("Pais", PaisSchema);