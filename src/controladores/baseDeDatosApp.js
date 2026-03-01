const baseDeDatosSbc = {

    OperacionesLogistica: require("../modelo/models/home/logistica/Operaciones"),
    ItemVenta: require("../modelo/models/marketPlace/02 - clientes/ItemVentas"),
    Ciudad: require("../modelo/models/marketPlace/09 - generales/Ciudad"),
    Cliente: require("../modelo/models/marketPlace/02 - clientes/Cliente"),
}

baseDeDatosSbc.ItemVenta.schema.add({
    logico: { type: Boolean, },
});
baseDeDatosSbc.OperacionesLogistica.schema.add({
    numerador: { type: String },
    ancla: { type: String },
    refAgente: { type: String },
    userResponsable: { type: String },
    referenciaCliente: { type: String },
    multimodalFCL: { type: String },
    contenedor: { type: String },
    listaDesplegableTexto: { type: [String] },
    tipoDeCargaRep: { type: String }
});
baseDeDatosSbc.Ciudad.schema.add({
    logico: { type: String },

})
baseDeDatosSbc.Cliente.schema.add({
    garantia: { type: Date },
    //   tarifaSeguro: { type: String },
    clienteAgrupado: { type: String },



})
module.exports = baseDeDatosSbc