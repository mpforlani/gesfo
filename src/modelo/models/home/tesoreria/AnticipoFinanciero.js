const { Schema, model } = require("mongoose");
const AtributosCompartidosSchema = require('../../AtributosCompartidos');

const AnticipoFinancieroSchema = new Schema({
    numerador: { type: Number },
    fecha: { type: Date },
    proveedor: {
        type: String,
        ref: "proveedor",
        sparse: true,
        default: ""
    },
    fechaVencimiento: { type: Date },
    observaciones: { type: String },
    moneda: {
        type: String,
        ref: "moneda"
    },
    ///rendicionGasto
    fechaGasto: { type: [Date] },
    itemGasto: { type: [String] },
    numComprobante: { type: [String] },
    importe: { type: [Number] },
    importemb: { type: [Number] },
    importema: { type: [Number] },
    descripcionGasto: { type: [String] },
    positionrendicionGastos: { type: [String] },

    ////
    importeTotal: { type: Number },
    importeTotalmb: { type: Number },
    importeTotalma: { type: Number },
    importeGastos: { type: Number },
    importeGastosmb: { type: Number },
    importeGastosma: { type: Number },
    saldo: { type: Number },
    saldomb: { type: Number },
    saldoma: { type: Number },
    estado: { type: String },

    ///AdjuntoClec
    /*1*/nameUsuColec: { type: [String] },
    /*2*/pathColec: { type: [String] },
    /*3*/originalnameColec: { type: [String] },
    ...AtributosCompartidosSchema
});




module.exports = model("AnticipoFinanciero", AnticipoFinancieroSchema);