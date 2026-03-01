const { Schema, model } = require("mongoose");
const AtributosCompartidosSchema = require('../../AtributosCompartidos');

const ListaProveedoresSchema = new Schema({
    numerador: { type: Number },
    fecha: { type: Date },
    proveedor: {
        type: String,
        ref: "proveedor",
        sparse: true,
    },
    //costosInventarios
    producto: {
        type: [String],
        ref: "producto",
        sparse: true,
    },
    marca: {
        type: [String],
        ref: "marca",
        sparse: true,
    },
    cantidad: { type: [Number] },
    unidadesMedida: {
        type: [String],
        ref: "unidadesMedida"
    },
    costoInventario: { type: [Number] },
    moneda: {
        type: [String],
        ref: "moneda"
    },
    tipoCosto: { type: [String] },
    idColcostosInventarios: { type: [String] },//Standar coleccion
    destinocostosInventarios: { type: [String] },//Standar coleccion
    positioncostosInventarios: { type: [String] },
    //
    observaciones: { type: String },
    habilitado: { type: String },
    ...AtributosCompartidosSchema
});

module.exports = model("ListaProveedores", ListaProveedoresSchema);