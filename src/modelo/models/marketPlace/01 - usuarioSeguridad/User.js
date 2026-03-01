const { Schema, model } = require("mongoose");
const AtributosCompartidosSchema = require('../../AtributosCompartidos');
const bcrypt = require("bcrypt");

const UserSchema = new Schema({
    name: { type: String },
    surname: { type: String },
    email: { type: String },
    password: { type: String },
    logico: { type: String },
    grupoSeguridad: { type: [String] },
    descripcion: { type: [String] },
    entidadesHab: { type: [String] },
    positiongruposDeSeguridad: { type: [String] },
    usernameUser: { type: String, unique: true },
    habilitado: { type: String },
    /////
    tareasProgramadas: { type: [String] },
    tareasPendientes: { type: [Object] },
    /////
    resetToken: { type: String },
    resetExpires: { type: Date },
    currentSessionId: {
        type: String,
        default: null
    },
    lastIp: {
        type: String,
        default: null
    },
    ...AtributosCompartidosSchema
});
UserSchema.methods.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

UserSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = model("User", UserSchema);