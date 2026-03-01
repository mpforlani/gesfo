const { Schema, model } = require("mongoose");
const AtributosCompartidosSchema = require('../../AtributosCompartidos');

const TipoContenedorSchema = new Schema({
    name: { type: String, unique: true },
    habilitado: { type: String },
    ...AtributosCompartidosSchema
});

module.exports = model("TipoContenedor", TipoContenedorSchema);