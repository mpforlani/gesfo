const { Schema, model } = require("mongoose");
const AtributosCompartidosSchema = require('../../AtributosCompartidos');

const CuentaBancariaSchema = new Schema({
    name: { type: String, index: { unique: true, sparse: true } },
    texto: { type: String },
    textoDos: { type: String },
    textoTres: { type: String },
    textoCuatro: { type: String },
    bancos: {
        type: Schema.Types.ObjectId,
        ref: "bancos"
    },
    habilitado: { type: String },
    ...AtributosCompartidosSchema
});

module.exports = model("CuentaBancaria", CuentaBancariaSchema);