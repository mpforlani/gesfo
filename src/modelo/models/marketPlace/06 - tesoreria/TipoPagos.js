const { Schema, model } = require("mongoose");
const AtributosCompartidosSchema = require('../../AtributosCompartidos');

const TipoPagoschema = new Schema({

    name: { type: String, index: { unique: true, sparse: true } },
    admCheque: { type: String },
    admCajas: { type: String },
    admBancos: { type: String },
    habilitado: { type: String },
    ...AtributosCompartidosSchema
});

TipoPagoschema.set('toJSON', { getters: true });
TipoPagoschema.set('toObject', { getters: true });

module.exports = model("TipoPagos", TipoPagoschema);