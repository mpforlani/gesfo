const { Schema, model } = require("mongoose");
const AtributosCompartidosSchema = require('../../AtributosCompartidos');

const AgrupadorImpuestoSchema = new Schema({

    name: { type: String },
    habilitado: { type: String },
    ...AtributosCompartidosSchema
});

module.exports = model("AgrupadorImpuesto", AgrupadorImpuestoSchema);