const { Schema, model } = require("mongoose");
const AtributosCompartidosSchema = require('../../AtributosCompartidos');

const SectorCrmSchema = new Schema({
    name: { type: String, index: { unique: true, sparse: true } },
    sector: { type: String },
    habilitado: { type: String },
    ...AtributosCompartidosSchema
});

module.exports = model("SectorCrm", SectorCrmSchema);