const { Schema, model } = require("mongoose");
const AtributosCompartidosSchema = require('../../AtributosCompartidos');

const ProductoSchema = new Schema({
    numerador: { type: Number },
    name: { type: String },
    descripcion: { type: String },
    categoriaProducto: {
        type: [String],
        ref: "categoriaProducto",
        sparse: true,
    },
    marca: {
        type: String,
        ref: "marca",
        sparse: true,
    },
    itemVenta: {
        type: String,
        ref: "itemVenta",
        sparse: true,
    },
    itemCompra: {
        type: String,
        ref: "itemCompra",
        sparse: true,
    },
    codigoDeBarras: { type: String },
    imagen: { type: String },
    adjuntos: { type: String },

    //costosInventario
    proveedor: {
        type: [String],
        ref: "proveedor",
    },
    cantidadCostos: { type: [Number] },
    unidadesMedidaCostos: {
        type: [String],
        ref: "unidadesMedida"
    },
    monedaCostos: {
        type: [String],
        ref: "moneda"
    },
    costoInventario: { type: [Number] },
    positioncostosProducto: { type: [String] },
    //precioInventario
    listasPrecios: { type: [String] },
    cantidadPrecios: { type: [Number] },
    unidadesMedidaPrecios: {
        type: [String],
        ref: "unidadesMedida"
    },
    monedaPrecios: {
        type: [String],
        ref: "moneda"
    },
    precioInventario: { type: [Number] },
    positionpreciosProducto: { type: [String] },
    //toleranciaStock
    quiebrePermitido: { type: [Number] },
    unidadesMedida: {
        type: [String],
        ref: "unidadesMedida"
    },
    positiontoleranciaStock: { type: [String] },
    //quiebreDeStock
    cantidad: { type: [Number] },
    unidadesMedida: {
        type: [String],
        ref: "unidadesMedida"
    },
    accion: { type: [String] },
    descripcionQuiebre: { type: [String] },
    //

    habilitado: { type: String },
    ...AtributosCompartidosSchema
});

module.exports = model("Producto", ProductoSchema);