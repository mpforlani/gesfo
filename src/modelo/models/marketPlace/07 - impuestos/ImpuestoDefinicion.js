const { Schema, model } = require("mongoose");
const AtributosCompartidosSchema = require('../../AtributosCompartidos');

const ImpuestoDefinicionschema = new Schema({

    name: { type: String, index: { unique: true } },
    agrupadorImpuesto: { type: String },
    tasa: { type: Number },
    habilitado: { type: String },
    ...AtributosCompartidosSchema
});

module.exports = model("ImpuestoDefinicion", ImpuestoDefinicionschema);