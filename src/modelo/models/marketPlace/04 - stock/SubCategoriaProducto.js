const { Schema, model } = require("mongoose");
const AtributosCompartidosSchema = require('../../AtributosCompartidos');

const SubCategoriaProductoSchema = new Schema({
    name: { type: String },
    categoriaProducto: { type: String },
    observacionesCompleto: { type: String },
    ...AtributosCompartidosSchema
});

module.exports = model("SubCategoriaProducto", SubCategoriaProductoSchema);