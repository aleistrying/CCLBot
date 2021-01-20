const { MessageEmbed } = require("discord.js");
const COLOR = require("../../utils/colors");
const GROUP = require("../../utils/groups");
const log = require("../../utils/logger");
const Blacklists = require("../../models/Blacklists");
const MCAPI = require("../../utils/MinecraftAPI");

module.exports.run = async ({ message, args, prefix }) => {

    let embed = new MessageEmbed()
    if (args[1]) {
        let plUuid = await MCAPI.getUuid(args[1]);
        let bl = await Blacklists.find({ uuid: plUuid })
        if (bl && bl.length > 0) {
            embed
                .setColor(COLOR.SUCCESS)
                .setTitle("Blacklist")
                .setDescription("test test");
        }
        else if (bl.length == 0) {
            embed
                .setColor(COLOR.WARN)
                .setTitle("Blacklist")
                .setDescription("This player is not blacklisted");
        }
        else {
            embed
                .setColor(COLOR.WARN)
                .setTitle("Blacklist")
                .setDescription("Error looking for the blacklist");
        }

    }
    else {
        embed
            .setColor(COLOR.WARN)
            .setTitle("Blacklist")
            .setDescription("Player field is required");
    }
    message.channel.send(embed)
}

module.exports.help = {
    command: "blacklist",
    aliases: ["bl", "bp"],
    description: "Gets the information from a player's blacklist",
    permissions: GROUP.DEFAULT,
    help: "blacklist <player name>"
}