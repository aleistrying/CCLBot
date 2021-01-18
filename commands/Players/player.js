const { MessageEmbed } = require("discord.js");
const COLOR = require("../../utils/colors");
const GROUP = require("../../utils/groups");
const log = require("../../utils/logger");
const MCAPI = require("../../utils/MinecraftAPI");
const Players = require("../../models/Players");
module.exports.run = ({ message, args, prefix }) => {
    if (args[1]) {
        let pl = Players.find({ uuid: args[1] })
        let embed = new MessageEmbed()
            .setColor(COLOR.INFO)
            .setAuthor(`${pl.name}'s Profile`)
            .setThumbnail(PlayerHead)
            .addField("Team", pl.team)
            .addField("Rank", pl.rank)
            .addField("UUID", pl.uui);
        // .addField("Leagues", "CCL");
    }
    message.channel.send(embed)
}

module.exports.help = {
    command: "player",
    aliases: ["profile", "p", "getplayer", "who"],
    "description": "Gets the information from a Player using minecraft API",
    permissions: GROUP.DEFAULT,
    help: "player"
}