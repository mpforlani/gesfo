const { mongoose, Schema, model } = require("mongoose");
const AtributosCompartidosSchema = require('../../AtributosCompartidos');

const ProvinciaSchema = new Schema({
    name: { type: String, index: { unique: true, } },
    pais: { type: String },
    habilitado: { type: String },
    ...AtributosCompartidosSchema
},);


module.exports = model("Provincia", ProvinciaSchema);