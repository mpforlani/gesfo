const { Schema, model } = require("mongoose");
const AtributosCompartidosSchema = require('../../AtributosCompartidos');

const ListasPreciosSchema = new Schema({
    numerador: { type: Number },
    fecha: { type: Date },
    name: { type: String },
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

module.exports = model("ListasPrecios", ListasPreciosSchema);