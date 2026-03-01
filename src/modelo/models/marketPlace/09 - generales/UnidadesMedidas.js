const { Schema, model } = require("mongoose");
const AtributosCompartidosSchema = require('../../AtributosCompartidos');

const unidadesMedidaSchema = new Schema({
    name: { type: String, unique: true },
    habilitado: { type: String },
    ...AtributosCompartidosSchema
});
module.exports = model("UnidadesMedida", unidadesMedidaSchema);