const { Schema, model } = require("mongoose");
const AtributosCompartidosSchema = require('../../AtributosCompartidos');

const ListaDeVentaSchema = new Schema({
    numerador: { type: Number },
    listasPrecios: { type: String },
    fecha: { type: Date },
    //PreciosInventarios

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
    moneda: {
        type: [String],
        ref: "moneda"
    },
    precioInventario: { type: [Number] },

    idColpreciosInventarios: { type: [String] },//Standar coleccion
    destinopreciosInventarios: { type: [String] },//Standar coleccion
    positionpreciosInventarios: { type: [String] },
    //
    observaciones: { type: String },
    habilitado: { type: String },
    ...AtributosCompartidosSchema
});

module.exports = model("ListaDeVenta", ListaDeVentaSchema);