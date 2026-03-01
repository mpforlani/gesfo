const { mongoose, Schema, model } = require("mongoose");
const AtributosCompartidosSchema = require('../../AtributosCompartidos');

const ProyeccionesCashSchema = new Schema({
    tabla: { type: Object },
    unidades: {
        type: Schema.Types.ObjectId,
        ref: "unidades"
    },
    ...AtributosCompartidosSchema
});

module.exports = model("ProyeccionesCash", ProyeccionesCashSchema);