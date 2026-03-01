const { Schema, model } = require("mongoose");
const AtributosCompartidosSchema = require('./AtributosCompartidos');

const AcumuladorSchema = new Schema({
    name: { type: String },
    entidad: { type: String },
    mes: { type: Number },
    ano: { type: Number },
    periodo: { type: Number },
    moneda: { type: String },
    importe: { type: Number },
    importemb: { type: Number },
    importema: { type: Number },
    typeRegistro: { type: String },
    habilitado: { type: String },
    ///Atributos Sistemas
    ...AtributosCompartidosSchema
}, {
    strict: false,       // ← permite guardar campos no definidos en el schema
    strictQuery: false   // ← permite filtrar por campos no definidos
});

module.exports = model("Acumulador", AcumuladorSchema);