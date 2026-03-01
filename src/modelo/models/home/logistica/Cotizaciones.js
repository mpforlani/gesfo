const { Schema, model } = require("mongoose");
const AtributosCompartidosSchema = require('../../AtributosCompartidos');

const CotizacionesSchema = new Schema({
    numerador: { type: String },
    cliente: {
        type: Schema.Types.ObjectId,
        ref: "cliente"
    },
    fecha: { type: Date },
    tipoOperacion: { type: String },
    tipoTransporte: { type: String },
    tipoCarga: { type: String },
    ciudad: { type: String },
    transbordo: { type: [String] },
    destinoSbc: { type: String },
    incoterm: { type: String },
    seguro: { type: String },
    //Coleccion caracteristicas productos
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
        default: []
    },
    tipoContenedor: {
        type: [String],
        ref: "tipoContenedor",
        sparse: true,
        default: []
    },
    moneda: {
        type: [String],
        ref: "monedac",
        sparse: true,
        default: []
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
    cantidadCotizacion: { type: [Number] },
    unidadesMedida: {
        type: [String],
        ref: "unidadesMedida"
    },
    itemVenta: {
        type: [String],
        ref: "itemVenta"
    },
    monedaComp: {
        type: [String],
        ref: "tipoContenedor",
        sparse: true,
        default: ""
    },
    porcentaje: { type: [String] },
    impuestoDefinicion: {
        type: [String],
        ref: "impuestoDefinicion"
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
    ...AtributosCompartidosSchema

});

module.exports = model("Cotizaciones", CotizacionesSchema);