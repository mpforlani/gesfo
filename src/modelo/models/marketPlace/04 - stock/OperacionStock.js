const { Schema, model } = require("mongoose");
const AtributosCompartidosSchema = require('../../AtributosCompartidos');

const OperacionStockSchema = new Schema({
    name: { type: String },
    observacionesCompleto: { type: String },
    habilitado: { type: String },
    ...AtributosCompartidosSchema
});

module.exports = model("OperacionStock", OperacionStockSchema);