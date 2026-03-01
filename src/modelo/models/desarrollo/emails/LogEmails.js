const { Schema, model } = require("mongoose");
const AtributosCompartidosSchema = require('../../AtributosCompartidos');

const LogEmailsSchema = new Schema({
    fecha: { type: String },
    para: { type: [String] },
    copia: { type: [String] },
    copiaOculta: { type: [String] },
    asunto: { type: String },
    paraKey: { type: String },
    origen: { type: String },
    estado: { type: String },
    ...AtributosCompartidosSchema
});

module.exports = model("LogEmails", LogEmailsSchema);