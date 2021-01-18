const mongoose = require('mongoose');


const RankSchema = new mongoose.Schema({
    rankId: { type: Number, required: true },
    name: { type: String, required: true },
    emoji: { type: String, required: false, default: ":white_small_square:" },

})

module.exports = mongoose.model("ranks", RankSchema);