const { Schema, model } = require("mongoose");
const AtributosCompartidosSchema = require('../../AtributosCompartidos');

const ItemsCajasSchema = new Schema({

    name: { type: String },
    tipoItems: { type: String },
    habilitado: { type: String },
    ...AtributosCompartidosSchema
});

module.exports = model("ItemsCajas", ItemsCajasSchema);