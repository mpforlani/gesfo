const { mongoose, Schema, model } = require("mongoose");
const AtributosCompartidosSchema = require('../../AtributosCompartidos');

const StockSchema = new Schema({
    numerador: { type: Number },
    fecha: { type: Date },
    producto: {
        type: String,
        ref: "producto",
        sparse: true,
    },
    unidadesMedida: {
        type: String,
        ref: "unidadesMedida"
    },
    cantidad: { type: Number },
    almacen: {
        type: String,
        ref: "almacen",
        sparse: true,
        default: ""
    },

    estado: { type: String },
    comprobanteOP: { type: String },
    operacionStock: { type: String },
    marca: { type: String },
    estadoFacturacion: { type: String },
    disponibles: { type: Number },
    proveedor: {
        type: String,
        ref: "proveedor",

    },
    remito: { type: String },
    fechaVencimientoProducto: { type: Date },
    codigoDeBarras: { type: String },

    idComprobante: { type: [String] },
    ...AtributosCompartidosSchema
});


module.exports = model("Stock", StockSchema);