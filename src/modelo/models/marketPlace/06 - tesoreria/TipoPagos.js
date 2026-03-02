const { Schema, model } = require("mongoose");
const AtributosCompartidosSchema = require('../../AtributosCompartidos');

const TipoPagoschema = new Schema({

    name: { type: String, index: { unique: true, sparse: true } },
    logico: { type: String },
    logicoDos: { type: String },
    logicoTres: { type: String },
    habilitado: { type: String },
    ...AtributosCompartidosSchema
});

TipoPagoschema.set('toJSON', { getters: true });
TipoPagoschema.set('toObject', { getters: true });

module.exports = model("TipoPagos", TipoPagoschema);