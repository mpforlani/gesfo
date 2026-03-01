const { Schema, model } = require("mongoose");
const AtributosCompartidosSchema = require('../../AtributosCompartidos');

const IncotermSchema = new Schema({
    name: { type: String },
    habilitado: { type: String },
    ...AtributosCompartidosSchema
});

module.exports = model("Incoterm", IncotermSchema);