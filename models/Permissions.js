const mongoose = require('mongoose');


const PermissionsSchema = new mongoose.Schema({
    discordId: { type: String, required: true },
    groups: { type: Array, required: true, default: ["DEFAULT"] },
    commands: { type: Array, required: false, default: [] }
})

module.exports = mongoose.model("permissions", PermissionsSchema);