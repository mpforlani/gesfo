const { Schema, model } = require("mongoose");
const AtributosCompartidosSchema = require('../../AtributosCompartidos');

const GastosAgentesSchema = new Schema({
    numerador: { type: String },
    origenRegistro: { type: String },
    fecha: { type: Date },
    proveedor: { type: String },
    documento: { type: [String] },
    MBLMAWB: { type: String },
    arribo: { type: Date },
    importe: { type: Number },
    moneda: { type: String },
    estado: { type: String },
    pago: { type: Date },
    ...AtributosCompartidosSchema
});

module.exports = model("GastosAgentes", GastosAgentesSchema);