const { Schema, model } = require("mongoose");
const AtributosCompartidosSchema = require('../../AtributosCompartidos');

const EstadoProcesoSchema = new Schema({
    name: { type: String, index: { unique: true, sparse: true } },
    orden: { type: Number },
    habilitado: { type: String },
    ...AtributosCompartidosSchema
});

module.exports = model("EstadoProceso", EstadoProcesoSchema);