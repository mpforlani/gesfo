const { mongoose, Schema, model } = require("mongoose");
const AtributosCompartidosSchema = require('../../AtributosCompartidos');

const RequerimientoSchema = new Schema({
    num: { type: Number, required: true },
    fecha: { type: Date },
    cliente: {
        type: Schema.Types.ObjectId,
        ref: "Cliente"
    },
    observaciones: { type: String },
    estado: {
        type: Schema.Types.ObjectId,
        ref: "Estado"
    },
    criticidad: {
        type: Schema.Types.ObjectId,
        ref: "Criticidad"
    },
    observacionesRectanculo: { type: String },
    fechaDos: { type: Date },
    fechaTres: { type: Date },
    observacionesRectanculoDos: { type: String },
    /////Colección
    tarea: {
        type: [Schema.Types.ObjectId],
        ref: "Tarea"
    },
    tiempoEstimado: { type: [String] },
    tiempoConsumido: { type: [String] },
    tiempoRemanente: { type: [String] },
    observacionesColec: { type: [String] },
    descripcionAdjunto: { type: [String] },
    ...AtributosCompartidosSchema
});



module.exports = model("Requerimiento", RequerimientoSchema);