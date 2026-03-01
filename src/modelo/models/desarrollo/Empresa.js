const { Schema, model } = require("mongoose");
const AtributosCompartidosSchema = require('../AtributosCompartidos');

const EmpresaSchema = new Schema({
    name: { type: String, unique: true },
    documento: { type: String },
    iibb: { type: String },
    condicionImpositiva: { type: String },
    fechaInicio: { type: Date },
    monedaBase: { type: String },
    monedaAlternativa: { type: String },
    bajaStock: { type: String },
    ingresaStock: { type: String },
    habilitado: { type: String },
    multimoneda: { type: String },
    listaPrecios: { type: String },
    nameUsuImg: { type: String },
    pathImg: { type: String },
    colores: { type: String },
    originalnameImg: { type: String },
    cajas: { type: String },
    cuentasBancarias: { type: String },
    ///Coleccion direcciones
    nombreDireccion: { type: [String] },
    calle: { type: [String] },
    numero: { type: [String] },
    piso: { type: [String] },
    depto: { type: [String] },
    cp: { type: [String] },
    ciudadDir: { type: [String] },
    tipoDomicilio: { type: [String] },
    observacionesDirecciones: { type: [String] },
    ...AtributosCompartidosSchema

});

module.exports = model("Empresa", EmpresaSchema);