const mongoose = require('mongoose');


const TeamSchema = new mongoose.Schema({
    name: { type: String, required: true },
    color: { type: String, required: false, default: "BLUE" },
    logo: { type: String, required: false },
    rank: { type: Number, required: false, default: 0 },
    tier: { type: Number, required: false, default: 0 },
    wins: { type: String, required: false, default: 0 },
    losses: { type: String, required: false, default: 0 },
})

module.exports = mongoose.model("teams", TeamSchema);