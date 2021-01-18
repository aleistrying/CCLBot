const mongoose = require('mongoose');


const PlayerSchema = new mongoose.Schema({
    uuid: { type: String, required: true },
    rank: { type: String, required: true },
    team: { type: String, required: true },
    deaths: { type: String, required: true },
    kills: { type: String, required: true },
})

module.exports = mongoose.model("players", PlayerSchema);