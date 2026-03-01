const { Schema, model } = require("mongoose");
const AtributosCompartidosSchema = require('../../AtributosCompartidos');

const TamanoContenedorSchema = new Schema({
    name: { type: String, unique: true },
    habilitado: { type: String },
    ...AtributosCompartidosSchema
});

module.exports = model("TamanoContenedor", TamanoContenedorSchema);