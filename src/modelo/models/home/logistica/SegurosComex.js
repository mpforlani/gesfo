const { Schema, model } = require("mongoose");
const AtributosCompartidosSchema = require('../../AtributosCompartidos');

const SegurosComexSchema = new Schema({
    numerador: { type: String },
    origenRegistro: { type: String },
    referenciaCliente: { type: String },
    cliente: { type: String },
    fecha: { type: Date },
    embarque: { type: Date },
    toma: { type: Date },
    incoterm: { type: String },
    moneda: { type: String },
    importeAsegurar: { type: Number },
    tc: { type: Number },
    importe: { type: Number },
    importeFacturar: { type: Number },
    documento: { type: [String], default: [] },
    MBLMAWB: { type: String },
    ...AtributosCompartidosSchema
});

module.exports = model("SegurosComex", SegurosComexSchema);