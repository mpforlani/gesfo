const { Schema, model } = require("mongoose");
const AtributosCompartidosSchema = require('../../AtributosCompartidos');


const DespachanteSchema = new Schema({
    numerador: { type: Number, required: true },
    name: { type: String, unique: true },
    documento: { type: String },
    condicionImpositiva: { type: String },
    ciudad: { type: String },
    observaciones: { type: String },
    //Colección de contactos
    nombreContacto: { type: [String] },
    telefonoContacto: { type: [String] },
    emailContacto: { type: [String] },
    observacionesContacto: { type: [String] },
    positioncontacto: { type: [String] },
    //Colección de direcciónes
    nombreDireccion: { type: [String] },
    calle: { type: [String] },
    numero: { type: [String] },
    piso: { type: [String] },
    depto: { type: [String] },
    cp: { type: [String] },
    observacionesDirecciones: { type: [String] },
    ciudadDir: { type: [String] },
    positiondirecciones: { type: [String] },
    ////
    habilitado: { type: String },
    ...AtributosCompartidosSchema
}, { strict: false });

function normalizarCamposDinamicos(obj) {
    if (!obj || typeof obj !== "object") return;

    for (const key of Object.keys(obj)) {

        // si la key está en el schema → NO la tocamos
        if (DespachanteSchema.path(key)) continue;
        const val = obj[key];
        // ya array → dejar
        if (Array.isArray(val)) continue;
        // null / undefined → dejar
        if (val === undefined || val === null) continue;
        // objetos → dejar (ej {a:1})
        if (typeof val === "object") continue;
        // string / number / boolean → envolver
        obj[key] = [val];
    }
}

DespachanteSchema.pre('save', function () {
    const doc = this;
    normalizarCamposDinamicos(doc._doc);
});
DespachanteSchema.pre(['findOneAndUpdate', 'findByIdAndUpdate', 'updateOne', 'updateMany'], function () {
    const update = this.getUpdate();

    if (!update || typeof update !== "object") return;

    if (update.$set && typeof update.$set === "object") {
        normalizarCamposDinamicos(update.$set);
    }

    const directKeys = {};
    for (const k of Object.keys(update)) {
        if (k.startsWith("$")) continue; // es operador -> skip
        directKeys[k] = update[k];
    }

    normalizarCamposDinamicos(directKeys);

    for (const k of Object.keys(directKeys)) {
        update[k] = directKeys[k];
    }

    // guardamos el update modificado de vuelta en la query
    this.setUpdate(update);
});



module.exports = model("Despachante", DespachanteSchema);