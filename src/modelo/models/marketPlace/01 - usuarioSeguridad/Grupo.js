const { Schema, model } = require("mongoose");
const AtributosCompartidosSchema = require('../../AtributosCompartidos');

const GrupoSchema = new Schema({
    name: {
        type: String,
        unique: true,
        sparse: true,
        trim: true,
    },
    visualizar: {
        type: Object,
        default: {},
    },
    crear: {
        type: Object,
        default: {},
    },
    editar: {
        type: Object,
        default: {},
    },
    eliminar: {
        type: Object,
        default: {},
    },
    atributos: {
        type: Object,
        default: {},
    },
    observaciones: { type: String },
    habilitado: { type: String },
    ...AtributosCompartidosSchema
});

module.exports = model("Grupo", GrupoSchema);