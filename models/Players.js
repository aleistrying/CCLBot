const mongoose = require('mongoose');


const PlayerSchema = new mongoose.Schema({
    uuid: { type: String, required: true },
    rank: { type: String, required: true },
    team: { type: String, default: 'None' },
    deaths: { type: Number, default: 0 },
    kills: { type: Number, default: 0 },
})

module.exports = mongoose.model("players", PlayerSchema);