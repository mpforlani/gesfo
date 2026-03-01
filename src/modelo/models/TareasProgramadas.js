const { Schema, model } = require("mongoose");
const AtributosCompartidosSchema = require('./AtributosCompartidos');

const TareasProgramadasSchema = new Schema({
    name: { type: String },
    funcionTarea: { type: String },
    todos: { type: String },
    lunes: { type: String },
    martes: { type: String },
    miercoles: { type: String },
    jueves: { type: String },
    viernes: { type: String },
    sabado: { type: String },
    domingo: { type: String },
    empresa: { type: String },
    userAsignado: { type: [String] },
    grupoSeguridad: { type: [String] },
    positionasignados: { type: [String] },
    habilitado: { type: String },
    ///Atributos Sistemas
    ...AtributosCompartidosSchema
});

module.exports = model("TareasProgramadas", TareasProgramadasSchema);