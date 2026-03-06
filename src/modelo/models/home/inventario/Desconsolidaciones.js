const { Schema, model } = require("mongoose");
const AtributosCompartidosSchema = require("../../AtributosCompartidos");

const DesconsolidacionesSchema = new Schema({
    numerador: { type: Number },
    fecha: { type: Date },
    productoOrigen: {
        type: String,
        ref: "producto",
        sparse: true,
        default: ""
    },
    marcaOrigen: {
        type: String,
        ref: "marca",
        sparse: true,
        default: ""
    },
    unidadesMedidaOrigen: {
        type: String,
        ref: "unidadesMedida",
        sparse: true,
        default: ""
    },
    disponiblesOrigen: { type: Number },
    almacenDestino: {
        type: String,
        ref: "almacen",
        sparse: true,
        default: ""
    },
    ubicacionDestino: {
        type: String,
        ref: "ubicaciones",
        sparse: true,
        default: ""
    },

    // compuesto movimientoStock
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
    estadoFacturacion: { type: [String] },
    disponibles: { type: [Number] },
    cantidadSalidas: { type: [Number] },
    descripcion: { type: [String] },
    idComprobante: { type: [String] },
    idColmovimientoStock: { type: [String] },
    destinomovimientoStock: { type: [String] },
    positionmovimientoStock: { type: [String] },

    observaciones: { type: String },

    ...AtributosCompartidosSchema
});

module.exports = model("Desconsolidaciones", DesconsolidacionesSchema);
