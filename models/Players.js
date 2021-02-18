const mongoose = require('mongoose');


const PlayerSchema = new mongoose.Schema({
    // name: { type: String, required: false },
    uuid: { type: String, required: true },
    rank: { type: String, default: "Member" },
    team: { type: String, default: null },
    deaths: { type: Number, default: 0 },
    kills: { type: Number, default: 0 },
    // lastUpdate: { type: Date },
})

module.exports = mongoose.model("players", PlayerSchema);