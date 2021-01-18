const { MessageEmbed } = require("discord.js");
const COLOR = require("../../utils/colors");
const GROUP = require("../../utils/groups");
const log = require("../../utils/logger");

module.exports.run = ({ message, args, prefix }) => {
    let embed = new MessageEmbed()
        .setColor(COLOR.SUCCESS)
        .setAuthor("test test");
    message.channel.send(embed)
}

module.exports.help = {
    command: "addteam",
    aliases: ["addteam", "createteam", "+team", "+t"],
    "description": "Gets the information from Teams",
    permissions: GROUP.DEFAULT,
    help: "getleague"
}