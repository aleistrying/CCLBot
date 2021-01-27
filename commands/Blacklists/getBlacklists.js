const Blacklists = require("../../models/Blacklists");
const { MessageEmbed } = require("discord.js");
const COLOR = require("../../utils/colors");
const MCAPI = require("../../utils/MinecraftAPI")
const { GROUP } = require("../../utils/groups");
const log = require("../../utils/logger");

module.exports.run = async ({ message, args, prefix }) => {
    let embed = new MessageEmbed()
        .setTitle("Blacklists")
        .setColor(COLOR.ERROR);
    let formatedEmbed = "**Player**\n";
    const blPlayers = await Blacklists.find({ uuid: { $nin: [undefined] } });
    if (blPlayers && blPlayers.length > 0) {
        let i = 0;
        let time1 = new Date();
        while (i < blPlayers.length) {
            blPlayers[i].name = await MCAPI.getName(blPlayers[i].uuid)
            i++;
        }
        let time2 = new Date();
        log.info(new Date(time2 - time1).toISOString().split("T")[1])

        blPlayers.sort((a, b) => (() => {//sort by letters
            let i = 0;
            while (a.name.toLowerCase().charCodeAt(i) == b.name.toLowerCase().charCodeAt(i)) { i++; }
            return a.name.toLowerCase().charCodeAt(i) - b.name.toLowerCase().charCodeAt(i);
        })())
        for (p of blPlayers) {
            formatedEmbed += `${p.name.replace(/_/g, "\\_")}\n`;// - ${(!p.end_date || typeof (p.end_date) == "string") ? "∞" : p.end_date.toISOString().split("T")[0]}\n`;
        }
        embed.setDescription(formatedEmbed)
    }
    else if (blPlayers.length == 0) {
        embed.setDescription("No Blacklists found.");
    }
    else {
        log.error(blPlayers)
        embed.setDescription("Error looking for Blacklists.");
    }
    message.channel.send(embed)
}


module.exports.help = (async () => {
    return {
        command: "getblacklists",
        aliases: ["blacklists", "bls"],
        permissions: (await GROUP).DEFAULT,
        description: "Shows the blacklists for the league.",
        help: "blacklists",
    }
})()