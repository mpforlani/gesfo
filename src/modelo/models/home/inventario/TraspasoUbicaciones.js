const { Schema, model } = require("mongoose");
const AtributosCompartidosSchema = require("../../AtributosCompartidos");

const TraspasoUbicacionesSchema = new Schema({
    numerador: { type: Number },
    fecha: { type: Date },

    // compuesto movimientoUbicaciones
    almacenOrigen: {
        type: [String],
        ref: "almacen",
        sparse: true,
    },
    ubicacionOrigen: {
        type: [String],
        ref: "ubicaciones",
        sparse: true,
    },
    producto: {
        type: [String],
        ref: "producto",
        sparse: true,
    },
    cantidad: { type: [Number] },
    disponibles: { type: [Number] },
    almacenDestino: {
        type: [String],
        ref: "almacen",
        sparse: true,
    },
    ubicacionDestino: {
        type: [String],
        ref: "ubicaciones",
        sparse: true,
    },
    idComprobante: { type: [String] },
    unidadesMedida: {
        type: [String],
        ref: "unidadesMedida",

    },
    idColmovimientoUbicaciones: { type: [String] },
    destinomovimientoUbicaciones: { type: [String] },
    positionmovimientoUbicaciones: { type: [String] },

    observaciones: { type: String },
    ...AtributosCompartidosSchema
});

module.exports = model("TraspasoUbicaciones", TraspasoUbicacionesSchema);
