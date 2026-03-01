const { Schema, model } = require("mongoose");
const AtributosCompartidosSchema = require('../../AtributosCompartidos');

const TareaSchema = new Schema({
    orden: { type: Number },
    name: { type: String, index: { unique: true, sparse: true } },
    entidadCrm: { type: [String] },
    habilitado: { type: String },

    ...AtributosCompartidosSchema
});
module.exports = model("Tarea", TareaSchema);