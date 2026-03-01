const { Schema, model } = require("mongoose");
const AtributosCompartidosSchema = require('../../AtributosCompartidos');

const DetalleTestingSchema = new Schema({
    numerador: { type: Number },
    name: { type: String, unique: true },
    edit: { type: String },
    entidad: { type: String },
    atributos: { type: Object },
    atributosEdit: { type: Object },
    ...AtributosCompartidosSchema
});

module.exports = model("CasosTesting", DetalleTestingSchema);