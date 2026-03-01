const { Schema, model } = require("mongoose");
const AtributosCompartidosSchema = require('../../AtributosCompartidos');

const ProveedorSchema = new Schema({
    numerador: { type: Number },
    name: { type: String, unique: true },
    documento: { type: String },
    condicionImpositiva: {
        type: String,
        ref: "condicionImpositiva"
    },
    descripcionCompleto: { type: String },
    //Colección de contactos
    nombreContacto: { type: [String] },
    telefonoContacto: { type: [String] },
    emailContacto: { type: [String] },
    observacionesContacto: { type: [String] },
    positioncontacto: { type: [String] },
    //Colección de direcciónes
    nombreDireccion: { type: [String] },
    calle: { type: [String] },
    numero: { type: [String] },
    piso: { type: [String] },
    depto: { type: [String] },
    cp: { type: [String] },
    ciudad: { type: [String] },
    observacionesDirecciones: { type: [String] },
    positiondirecciones: { type: [String] },
    habilitado: { type: String },
    ...AtributosCompartidosSchema
});

module.exports = model("Proveedor", ProveedorSchema);