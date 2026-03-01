const { mongoose, Schema, model } = require("mongoose");
const AtributosCompartidosSchema = require('../../AtributosCompartidos');

const CiudadSchema = new Schema({
    name: { type: String, index: { unique: true, sparse: true } },
    cp: { type: String },
    provincia: {
        type: String,
        ref: "Provincia",
        required: false,
        sparse: true,
        default: null
    },
    pais: {
        type: String,
        ref: "Pais"
    },
    habilitado: { type: String },
    ...AtributosCompartidosSchema

});

module.exports = model("Ciudad", CiudadSchema);