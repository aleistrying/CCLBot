/*
{
    "Head Director":"692799882142023800",
    "Director":"692395715892215890",
    "Head Referee":"693171431206289489",
    "Referee":"692400079398502481",
    "Head Host":"693171560462155816",
    "Host":"692399897554583562",
    "Head Media":"693171229104013404",
    "Media":"693171026288312372",
    "Staff":"692485989674909748"
}*/
const mongoose = require('mongoose');


const RolesSchema = new mongoose.Schema({
    roles: { type: String, required: true },
    discordId: { type: Number, required: true },
})

module.exports = mongoose.model("roles", RolesSchema);