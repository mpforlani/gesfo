const { mongoose, Schema, model } = require("mongoose");
const AtributosCompartidosSchema = require('../../AtributosCompartidos');
const { stringify } = require("uuid");

const SalidaInventarioSchema = new Schema({
    numerador: { type: Number },
    fecha: { type: Date },
    almacen: {
        type: String,
        ref: "almacen",
        sparse: true,
        default: ""
    },
    operacionStock: { type: String },
    cliente: {
        type: String,
        ref: "cliente",
        sparse: true,
        default: ""
    },
    remito: { type: String },
    numComprobante: { type: String },
    obervaciones: { type: String },
    //compuesto movimientoStock
    cantidad: { type: [Number] },
    unidadesMedida: {
        type: [String],
        ref: "unidadesMedida"
    },
    producto: {
        type: [String],
        ref: "producto",
        sparse: true,
    },
    codigoDeBarras: { type: String },

    fechaVencimientoProducto: { type: [Date] },
    disponibles: { type: [Number] },
    cantidadSalidas: { type: [Number] },
    estadoFacturacion: { type: [String] },
    descripcion: { type: [String] },
    idColmovimientoStock: { type: [String] },//Standar coleccion
    destinomovimientoStock: { type: [String] },//Standar coleccion
    positionmovimientoStock: { type: [String] },
    idComprobante: { type: [String] },




    ...AtributosCompartidosSchema
});


module.exports = model("SalidaInventario", SalidaInventarioSchema);