const { Schema, model } = require("mongoose");
const AtributosCompartidosSchema = require('../../AtributosCompartidos');

const TipoTransporteSchema = new Schema({
    name: { type: String, unique: true },
    habilitado: { type: String },
    ...AtributosCompartidosSchema
});

module.exports = model("TipoTransporte", TipoTransporteSchema);