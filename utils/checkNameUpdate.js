// const Players = require("../models/Players");
// const MCAPI = require("../utils/MinecraftAPI")
// module.exports = async function checkPlayerNameUpdate(players) {
//     let player;
//     let values;
//     for (p of players) {
//         player = await Players.find({ uuid: p.uuid })
//         if (player && player.lastUpdate) {
//             if (player.lastUpdate - new Date() >= 30 * 24 * 3600 * 1000) {
//                 values = await MCAPI.getName(p.uuid);
//                 player.name = values.name;
//                 player.lastUpdate = new Date(values.changedToAt);
//                 await player.save();
//             }
//         }
//         else {

//         }
//     }
// }