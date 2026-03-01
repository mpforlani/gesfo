const { mongoose, Schema, model } = require("mongoose");
const AtributosCompartidosSchema = require('../../AtributosCompartidos');

const ErrorSchema = new Schema({
    numerador: { type: Number, required: true },
    fecha: { type: Date },
    cliente: { type: String },
    asunto: { type: String },
    estadoProceso: {
        type: String,
        ref: "Estado"
    },
    criticidad: {
        type: String,
        ref: "Criticidad"
    },
    descripcion: { type: String },
    fechaResolucion: { type: Date },
    estimado: { type: String },
    ///Colección
    tarea: {
        type: [String],
        ref: "Tarea"
    },
    fechaTarea: { type: [Date] },
    tiempoEstimado: { type: [String] },
    tiempoConsumido: { type: [String] },
    tiempoRemanente: { type: [String] },
    usuarioAsignado: { type: [String] },
    observacionesColec: { type: [String] },
    descripcionAdjunto: { type: [String] },
    positiontareas: { type: [String] },
    totaltiempoEstimado: { type: [String] },//Total tiempo estimado
    totaltiempoConsumido: { type: [String] },//Total tiempo consumido
    totaltiempoRemanente: { type: [String] },//Total tiempo remanente
    ///Sub tabla
    resolucion: { type: Date },
    tiempoTotal: { type: String },
    resolucionTexto: { type: String },
    ////Ver esto
    fechaDetalle: { type: [Date] },
    consumidoDetalle: { type: [String] },
    remanenteDetalle: { type: [String] },
    observacionesDetalle: { type: [String] },
    positionDetalle: { type: [String] },
    ...AtributosCompartidosSchema
});


module.exports = model("Error", ErrorSchema);