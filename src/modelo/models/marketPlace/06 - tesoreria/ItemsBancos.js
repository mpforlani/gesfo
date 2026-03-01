const { Schema, model } = require("mongoose");
const AtributosCompartidosSchema = require('../../AtributosCompartidos');

const ItemsBancosSchema = new Schema({

    name: { type: String },
    tipoItems: { type: String },
    habilitado: { type: String },
    ...AtributosCompartidosSchema
});

module.exports = model("ItemsBancos", ItemsBancosSchema);