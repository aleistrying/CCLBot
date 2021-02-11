const mongoose = require('mongoose');

const BlacklistSchema = new mongoose.Schema({
    league: { type: String, required: true },
    uuid: { type: String, required: true },
    type: { type: String, required: true },
    reason: { type: String, required: true },
    referee: { type: String },
    start_date: { type: Date, required: true },
    end_date: { type: Date },
    alts: { type: String },
    notes: { type: String },
    isGlobal: { type: Boolean }
})

module.exports = mongoose.model("blacklists", BlacklistSchema)