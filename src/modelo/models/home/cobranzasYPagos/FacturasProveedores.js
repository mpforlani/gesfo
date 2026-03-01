const { mongoose, Schema, model } = require("mongoose");
const AtributosCompartidosSchema = require('../../AtributosCompartidos');

const FacturasProveedoresSchema = new Schema({
    proveedor: {
        type: String,
        ref: "proveedor",
        sparse: true,
        default: ""
    },
    fecha: { type: Date },
    fechaVencimiento: { type: Date },
    tipoComprobante: {
        type: String,
        ref: "tipoComprobante"
    },
    numComprobante: { type: String },
    moneda: {
        type: String,
        ref: "moneda"
    },
    tipoCambio: { type: Number },
    estado: { type: String },
    descripcionCompleto: { type: String },
    //compuesto remitoIngreso
    remito: {
        type: [String]
    },
    cantidadRemito: {
        type: [Number]
    },
    unidadesMedidaRemito: {
        type: [String],
        ref: "unidadesMedida"
    },
    productoRemito: {
        type: [String],
        ref: "producto"
    },
    almacenRemito: {
        type: [String],
        ref: "almacen"
    },
    observaciones: { type: [String] },
    idComprobante: { type: [String] },
    idColeccionUnWind: { type: [String] },
    estadoFacturacion: { type: [String] },
    idColremitoIngreso: { type: [String] },//Standar coleccion
    destinoremitoIngreso: { type: [String] },//Standar coleccion
    positionremitoIngreso: { type: [String] },

    //compuesto detalleProducto
    cantidadProducto: {
        type: [Number]
    },
    unidadesMedidaProducto: {
        type: [String],
        ref: "unidadesMedida"
    },
    producto: {
        type: [String],
        ref: "producto"
    },
    almacenProducto: {
        type: [String],
        ref: "almacen"
    },
    importeProducto: { type: [Number] },
    importeProductomb: { type: [Number] },
    importeProductoma: { type: [Number] },
    descripcionProducto: { type: [String] },
    idColdetalleProducto: { type: [String] },//Standar coleccion
    destinodetalleProducto: { type: [String] },//Standar coleccion
    positiondetalleProducto: { type: [String] },
    ////compuestoFacturaCompras
    cantidad: {
        type: [Number],
        ref: "cajas",
        required: false,
        sparse: true,
        default: []
    },
    unidadesMedida: {
        type: [String],
        ref: "itemCompra"
    },
    itemCompra: {
        type: [String],
        ref: "itemCompra"
    },
    precioUnitario: { type: [Number] },
    precioUnitariomb: { type: [Number] },
    precioUnitarioma: { type: [Number] },
    importeNeto: { type: [Number] },
    importeNetomb: { type: [Number] },
    importeNetoma: { type: [Number] },
    porcentaje: { type: [Number] },
    impuestoFactVentas: { type: [Number] },
    impuestoFactVentasmb: { type: [Number] },
    impuestoFactVentasma: { type: [Number] },
    otrosImpuestos: { type: [Number] },
    otrosImpuestosmb: { type: [Number] },
    otrosImpuestosma: { type: [Number] },
    subtotalVentas: { type: [Number] },
    subtotalVentasmb: { type: [Number] },
    subtotalVentasma: { type: [Number] },
    descripcion: { type: [String] },
    positioncompuestoFacturaCompras: { type: [String] },
    //idColecFact: { type: [String] },//Esto ?
    //destinoColecFact: { type: [String] },//Esto ?
    //////
    //ColeccionTipoPago
    tipoPago: {
        type: [String],
        ref: "formaPago"
    },
    fechaTipoPago: { type: [Date] },
    monedaTipoPago: {
        type: [String],
        ref: "moneda"
    },
    importeTipoPago: { type: [Number] },
    importeTipoPagomb: { type: [Number] },
    importeTipoPagoma: { type: [Number] },
    tipoCambioTipoPago: { type: [Number] },
    cajas: {
        type: [String],
        ref: "cajas",
        required: false,
        sparse: true,
        default: []
    },
    cuentasBancarias: {
        type: [String],
        ref: "cuentasBancarias",
        required: false,
        sparse: true,
        default: []
    },
    numeroDeCheque: { type: [String] },
    vencimientoCheque: { type: [String] },
    bancoCheque: { type: [String] },
    otroBancos: { type: [String] },
    observacionesMediosPago: { type: [String] },
    totalImporteTipoPago: { type: Number },//Total colección
    totalImporteValidador: { type: Number },//Total colección
    //idColecTp: { type: [String] },//Esto ?
    //destinoColecTp: { type: [String] },//Esto ?
    positioncompuestoMedioPagos: { type: [String] },
    ////////////////////
    importeTotal: { type: Number },
    importeTotalmb: { type: Number },
    importeTotalma: { type: Number },

    ...AtributosCompartidosSchema
});

module.exports = model("FacturasProveedores", FacturasProveedoresSchema);