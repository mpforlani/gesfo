const { Schema } = require('mongoose');

const AtributosCompartidosSchema = {

    infoReportes: { type: Object },
    eliminado: { type: Boolean, default: false },
    nameUsu: { type: [String] },
    path: { type: [String] },
    originalname: { type: [String] },
    empresa: {
        type: String,
        ref: "unidades",
        required: false,
        sparse: true,
    },
    date: {
        type: Date,
        default: () => new Date(),
        required: true,
    },
    username: {
        type: String,
        ref: "username",
        required: true,
    },
    referencias: { type: Object },
    autoImputo: { type: Object },
    historia: { type: [Object] },
    version: { type: Number }
};

module.exports = AtributosCompartidosSchema;