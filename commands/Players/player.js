const { MessageEmbed } = require("discord.js");
const COLOR = require("../../utils/colors");
const GROUP = require("../../utils/groups");
const log = require("../../utils/logger");
const MCAPI = require("../../utils/MinecraftAPI");
const Players = require("../../models/Players");
module.exports.run = async ({ message, args, prefix }) => {
    let embed = new MessageEmbed();
    if (args[1]) {
        const playerUuid = await MCAPI.getUuid(args[1]);
        console.log(playerUuid)

        if (playerUuid && playerUuid.id) {
            console.log(playerUuid.id)
            let pl = await Players.findOne({ "uuid": playerUuid.id })
            embed.setColor(COLOR.INFO)
                .setTitle(`${playerUuid.name.replace(/_/g, "\\_")}}'s Profile`)
                .setThumbnail(`https://crafatar.com/renders/head/${playerUuid.id}`)
                .addField("Team", (pl) ? pl.team : "None")
                .addField("Rank", (pl) ? pl.rank : "None")
                .addField("UUID", playerUuid.id);
        }
        else
            embed.setColor(COLOR.WARN)
                .setDescription("No User Found")
        // .addField("Leagues", "CCL");
    }
    else
        embed.setColor(COLOR.WARN)
            .setDescription("No User provided")
    message.channel.send(embed)
}

module.exports.help = {
    command: "player",
    aliases: ["profile", "p", "getplayer", "who"],
    description: "Shows the information from a Player",
    permissions: GROUP.DEFAULT,
    help: "player <Player Name>"
}