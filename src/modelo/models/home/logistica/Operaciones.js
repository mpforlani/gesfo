const { Schema, model } = require("mongoose");
const AtributosCompartidosSchema = require('../../AtributosCompartidos');

const OperacionesSchema = new Schema({
    numerador: { type: Number },
    texto: { type: String },
    cliente: {
        type: Schema.Types.ObjectId,
        ref: "cliente"
    },
    MBLMAWB: { type: String },
    fecha: { type: Date },
    tipoOperacion: { type: String },
    tipoTransporte: {
        type: String,
        ref: "tipoTransporte"
    },
    tipoTransporteDos: {
        type: String,
        ref: "tipoTransporte"
    },
    tipoCarga: {
        type: String,
        ref: "tipoCarga"
    },
    ciudad: {
        type: Schema.Types.ObjectId,
        ref: "ciudad"
    },
    transbordo: { type: [String] },
    atrriboTransbordo: { type: [Date] },
    salidaTransbordo: { type: [Date] },
    destinoSbc: {
        type: Schema.Types.ObjectId,
        ref: "destinoSbc"
    },
    fechaDos: { type: Date },
    fechaTres: { type: Date },
    textoTres: { type: String },
    textoCuatro: { type: String },
    diasLibres: { type: String },
    textoOcho: { type: String },
    despachante: { type: String },
    agenteComex: { type: [String] },
    incoterm: { type: String },
    maritima: { type: String },
    seguro: { type: String },
    recepcion: { type: String },
    transitTime: { type: Number },
    firstArribal: { type: Date },
    delay: { type: Number },
    ////Coleccion caracteristicas de producto
    cantidadCaractProd: { type: [Number] },
    cantidadDosCaractProd: { type: [Number] },
    cantidadTresCaractProd: { type: [Number] },
    cantidadCuatroCaractProd: { type: [Number] },
    cantidadCincoCaractProd: { type: [Number] },
    cantidadSeisCaractProd: { type: [Number] },
    idcaractProd: { type: [String] },//Default coleccion
    destinocaractProd: { type: [String] },//Default coleccion
    positioncaractProd: { type: [String] },//Default coleccion
    //Coleccion tipo Flete
    tamanoContenedor: {
        type: [String],
        ref: "tipoContenedor",
        sparse: true,
        default: ""
    },
    tipoContenedor: {
        type: [String],
        ref: "tipoContenedor",
        sparse: true,
        default: ""
    },
    moneda: {
        type: [String],
        ref: "monedac",
        sparse: true,
        default: ""
    },
    cantidadFlete: { type: [Number] },
    importeFlete: { type: [Number] },
    importeCincoFlete: { type: [Number] },
    importeDosFlete: { type: [Number] },
    importeTresFlete: { type: [Number] },
    importeCuatroFlete: { type: [Number] },
    iddetalleFlete: { type: [String] },//Default coleccion
    destinodetalleFlete: { type: [String] },//Default coleccion
    positiondetalleFlete: { type: [String] },//Default coleccion
    //Coleccion Cotización
    cantidadCotizacion: { type: [String] },
    unidadesMedida: {
        type: [String],
        ref: "unidadesMedida"
    },
    itemVenta: {
        type: [String],
        ref: "itemVenta",
        sparse: true,
        default: ""
    },
    proveedor: { type: [String] },
    monedaComp: {
        type: [String],
        ref: "monedaComp",
        sparse: true,
        default: ""
    },
    porcentaje: { type: [String] },
    impuestoDefinicion: {
        type: [String],
        ref: "impuestoDefinicion",
        sparse: true,
        default: ""
    },
    importeCotizacion: { type: [Number] },
    comisionCotizacion: { type: [Number] },
    importeDosCotizacion: { type: [Number] },
    importeTresCotizacion: { type: [Number] },
    importeCuatroCotizacion: { type: [Number] },
    importeCincoCotizacion: { type: [Number] },
    importeSeisCotizacion: { type: [Number] },
    importeSieteCotizacion: { type: [Number] },
    importeOchoCotizacion: { type: [Number] },
    facturado: { type: [String] },
    certificado: { type: [String] },
    idColCotizacionGemela: { type: [String] },
    idColgastosAgente: { type: [String] },//DesencadenanteColeccion
    idcotizacionLogistica: { type: [String] },//Default coleccion
    destinocotizacionLogistica: { type: [String] },//Default coleccion
    positioncotizacionLogistica: { type: [String] },//Default coleccion
    totalDolaresimporteDosCotizacion: { type: [Number] },//totales
    totalDolaresimporteCuatroCotizacion: { type: [Number] },//totales
    totalDolaresimporteSeisCotizacion: { type: [Number] },//totales
    totalDolaresimporteOchoCotizacion: { type: [Number] },//totales
    totalEurosimporteDosCotizacion: { type: [Number] },//totales
    totalEurosimporteCuatroCotizacion: { type: [Number] },//totales
    totalEurosimporteSeisCotizacion: { type: [Number] },//totales
    totalEurosimporteOchoCotizacion: { type: [Number] },//totales
    /////
    importeDolares: { type: Number },
    importeEuro: { type: Number },
    observacionesCompleto: { type: String },
    usuarioAprobar: { type: String },
    estado: { type: String },
    textoDos: { type: String },
    textoSiete: { type: String },
    textoCinco: { type: String },
    estadoReporte: {
        type: [String],
        default: ["Abierto"]
    },
    ///Esto es solo para reportes no esta ara cargar en la el reporte
    textoNueve: { type: String },
    ...AtributosCompartidosSchema
});

module.exports = model("Operaciones", OperacionesSchema);