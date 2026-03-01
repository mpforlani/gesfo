const { Schema, model } = require("mongoose");
const AtributosCompartidosSchema = require('../../AtributosCompartidos');

const TestingSchema = new Schema({
    name: { type: String, unique: true },
    observaciones: { type: String },
    crearInd: { type: Object },
    crearIndAbm: { type: Object },
    crearAbm: { type: Object },
    editInd: { type: Object },
    editAbm: { type: Object },
    eliminar: { type: Object },
    imprimir: { type: Object },
    orden: { type: Schema.Types.Mixed },
    habilitado: { type: String },
    ...AtributosCompartidosSchema
});
module.exports = model("Testing", TestingSchema);