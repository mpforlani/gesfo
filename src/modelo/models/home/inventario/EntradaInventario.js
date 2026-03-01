const { mongoose, Schema, model } = require("mongoose");
const AtributosCompartidosSchema = require('../../AtributosCompartidos');

const EntradaInventarioSchema = new Schema({
    numerador: { type: Number },
    fecha: { type: Date },
    almacen: {
        type: String,
        ref: "almacen",
        sparse: true,
        default: ""
    },
    operacionStock: { type: String },
    proveedor: {
        type: String,
        ref: "proveedor",
        sparse: true,
        default: ""
    },
    remito: { type: String },
    numComprobante: { type: String },
    observaciones: { type: String },


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
    fechaVencimientoProducto: { type: [Date] },
    codigoDeBarras: { type: [String] },
    descripcion: { type: [String] },
    idColmovimientoStock: { type: [String] },//Standar coleccion
    destinomovimientoStock: { type: [String] },//Standar coleccion
    positionmovimientoStock: { type: [String] },
    positionremitoIngreso: { type: [String] },
    destinoremitoIngreso: { type: [String] },


    ...AtributosCompartidosSchema
});


module.exports = model("EntradaInventario", EntradaInventarioSchema);