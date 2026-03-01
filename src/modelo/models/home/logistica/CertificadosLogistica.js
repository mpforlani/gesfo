const { Schema, model } = require("mongoose");
const AtributosCompartidosSchema = require('../../AtributosCompartidos');

const CertificadosLogisticaSchema = new Schema({
    numerador: { type: String },
    fecha: { type: Date },
    texto: { type: String },
    observacionesCompleto: { type: String },
    observacionesRectanculo: { type: String },
    listaDesplegableTexto: { type: [String] },
    ...AtributosCompartidosSchema

});

module.exports = model("CertificadosLogistica", CertificadosLogisticaSchema);