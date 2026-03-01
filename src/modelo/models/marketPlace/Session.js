const { Schema, model } = require("mongoose");

const SessionSchema = new Schema({
    _id: { type: String },
    expires: { type: String },
    session: { type: String }
}, { strict: false });


module.exports = model("Session", SessionSchema);