const { Schema, model } = require("mongoose");
const AtributosCompartidosSchema = require('../../AtributosCompartidos');

const SeguridadAtributochema = new Schema({

    entidadOrigen: { type: String },
    visualizar: { type: Schema.Types.Mixed },
    editar: { type: Schema.Types.Mixed },
    entidad: { type: String },

    ...AtributosCompartidosSchema
});

module.exports = model("SeguridadAtributo", SeguridadAtributochema);