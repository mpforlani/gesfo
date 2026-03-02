const { Schema, model } = require("mongoose");
const AtributosCompartidosSchema = require('../../AtributosCompartidos');

const UbicacionesSchema = new Schema({
    name: { type: String },
    almacen: {
        type: String,
        ref: "almacen",
        sparse: true,
        default: ""
    },
    observacionesCompleto: { type: String },
    habilitado: { type: String },
    ...AtributosCompartidosSchema
});

module.exports = model("Ubicaciones", UbicacionesSchema);
