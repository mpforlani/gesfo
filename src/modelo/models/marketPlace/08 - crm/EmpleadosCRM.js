const { Schema, model } = require("mongoose");
const AtributosCompartidosSchema = require('../../AtributosCompartidos');

const EmpleadosCrmSchema = new Schema({
    name: { type: String },
    usuario: { type: String, index: { unique: true, sparse: true } },
    entidadesHabilitadas: { type: [String] },
    habilitado: { type: String },
    ...AtributosCompartidosSchema
});

module.exports = model("EmpleadosCrm", EmpleadosCrmSchema);