const { Schema, model } = require("mongoose");
const AtributosCompartidosSchema = require('../../AtributosCompartidos');

const CategoriaProductoSchema = new Schema({
    name: { type: String },
    observacionesCompleto: { type: String },
    habilitado: { type: String },
    ...AtributosCompartidosSchema
});

module.exports = model("CategoriaProducto", CategoriaProductoSchema);