const Teams = require('../../models/Teams');
const Players = require("../../models/Players");
const { MessageEmbed } = require("discord.js");
const GROUP = require("../../utils/groups");
const COLOR = require("../../utils/colors");
const MCAPI = require("../../utils/MinecraftAPI");
module.exports.run = async ({ message, args, prefix }) => {
    if (args[1]) {
        const tm = await Teams.aggregate([
            {
                "$match": { "name": new RegExp(args[1], 'i') }
            }
        ]);
        const pl = await Players.aggregate([{
            "$lookup": {
                "from": "ranks",
                "localField": "rank",
                "foreignField": "name",
                "as": "rank"
            }
        }, {
            "$lookup": {
                "from": "ranks",
                "localField": "rank2",
                "foreignField": "name",
                "as": "rank2"
            }
        }, {
            "$match": { "team": new RegExp(args[1], 'i') }
        }]);
        let embed = new MessageEmbed()
            .setTitle("Teams")
        if (tm && tm.length > 0 && pl && pl.length > 0) {
            pl.sort((a, b) => (a.rank[0].rankId - b.rank[0].rankId))
            embed
                .setColor(COLOR.INFO)
                .setTitle(tm[0].name)
                .setThumbnail(tm[0].logo);
            let formattedList = "";
            formattedList += `**Tier**\n${tm[0].wins}\n\n`;
            formattedList += `**Members**\n`;
            let i = 0, ppl = [];
            while (i < pl.length) {
                ppl[i] = await MCAPI.getName(pl[i].uuid)
                i++;
            }
            i = 0;
            for (p of pl) {
                //check if blacklist, change emoji depending on bl 
                formattedList += `${p.rank[0].emoji} ${ppl[i][ppl[i].length - 1].name} ${(p.rank2 && p.rank2.length > 0) ? p.rank2[0].emoji : ""} \n`;
                i++;
            }
            embed.setDescription(formattedList);
        }
        else if (pl)
            embed.setColor(COLOR.ERROR)
                .setDescription("No team Found")
        else if (!tm)
            embed.setColor(COLOR.ERROR)
                .setDescription("No Players found Found")
        else embed.setColor(COLOR.ERROR)
            .setDescription("No players and Teams Set")
        message.channel.send(embed)
    }
    else {
        message.channel.send(new MessageEmbed()
            .setColor(COLOR.WARN)
            .setTitle("Teams")
            .setDescription("No teams have been found by that name."))
        log.error("Teams DB could not load.")
    }

}

module.exports.help = {
    command: "getteam",
    aliases: ["roster", "r", "team", "t"],
    description: "Shows all the team's rosters with their members",
    group: GROUP.DEFAULT
}