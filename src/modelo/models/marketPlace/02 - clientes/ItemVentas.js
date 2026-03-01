const { Schema, model } = require("mongoose");
const AtributosCompartidosSchema = require('../../AtributosCompartidos');

const ItemVentaSchema = new Schema({
    name: { type: String, unique: true },
    rubroVentas: {
        type: Schema.Types.ObjectId,
        ref: "rubroVentas"
    },
    concepto: { type: String },
    impuestoDefinicion: {
        type: [String]
    },
    positioncoleccionImpuestoProducto: { type: [String] },
    habilitado: { type: String },
    ...AtributosCompartidosSchema
});

module.exports = model("ItemVenta", ItemVentaSchema);