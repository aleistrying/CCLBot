const Teams = require('../../models/Teams');
const Players = require("../../models/Players");
const { MessageEmbed } = require("discord.js");
const GROUP = require("../../utils/groups");
const COLOR = require("../../utils/colors");
const MCAPI = require("../../utils/MinecraftAPI");
const log = require("../../utils/logger")
module.exports.run = async ({ message, args, prefix }) => {
    if (args[1]) {
        const tm = await Teams.aggregate([
            {
                "$match": { "name": new RegExp(args[1], 'i') }
            }
        ]);
        const pl = await Players.aggregate([
            {
                '$lookup': {
                    'from': 'blacklists',
                    'localField': 'uuid',
                    'foreignField': 'uuid',
                    'as': 'blacklist'
                }
            }, {
                '$set': {
                    'rank': {
                        '$cond': {
                            'if': {
                                '$eq': [
                                    {
                                        '$size': {
                                            '$ifNull': [
                                                '$blacklist', []
                                            ]
                                        }
                                    }, 0
                                ]
                            },
                            'then': '$rank',
                            'else': 'Blacklist'
                        }
                    }
                }
            }, {
                '$lookup': {
                    'from': 'ranks',
                    'localField': 'rank',
                    'foreignField': 'name',
                    'as': 'rank'
                }
            }, {
                '$lookup': {
                    'from': 'ranks',
                    'localField': 'rank2',
                    'foreignField': 'name',
                    'as': 'rank2'
                }
            }, {
                '$match': {
                    'team': new RegExp(args[1], 'i')
                }
            }
        ]);
        let embed = new MessageEmbed()
            .setTitle("Teams")
        if (tm && tm.length > 0 && pl && pl.length > 0) {
            embed
                .setColor(COLOR.INFO)
                .setTitle(tm[0].name)
                .setThumbnail((tm[0] && tm[0].logo && tm[0].logo.match(/^http/g) == true) ? tm[0].logo : "");
            let formattedList = "";
            formattedList += `**Tier**\n${tm[0].wins}\n\n`;
            formattedList += `**Members**\n`;
            let i = 0;

            let time1 = new Date();
            while (i < pl.length) {
                pl[i].name = await MCAPI.getName(pl[i].uuid)
                i++;
            }
            let time2 = new Date();

            log.info(new Date(time2 - time1).toISOString().split("T")[1])
            time1 = new Date()
            pl.sort((a, b) => ((a.rank[0].rankId - b.rank[0].rankId) * 100 +
                (() => {//sort by letters
                    let i = 0;
                    while (a.name.toLowerCase().charCodeAt(i) == b.name.toLowerCase().charCodeAt(i)) { i++; }
                    return a.name.toLowerCase().charCodeAt(i) - b.name.toLowerCase().charCodeAt(i);
                })()
            ))
            // console.log("2", pl)

            time2 = new Date()
            log.info(new Date(time2 - time1).toISOString().split("T")[1])
            //find if any of the players is blacklisted 

            for (p of pl) {
                //check if blacklist, change emoji depending on bl 
                formattedList += `${p.rank[0].emoji} ${p.name.replace(/_/g, "\\_")} ${(p.rank2 && p.rank2.length > 0) ? p.rank2[0].emoji : ""} \n`;

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
            .setColor(COLOR.ERROR)
            .setTitle("Teams")
            .setDescription("No teams have been found by that name."))
        log.error("Teams DB could not load.")
    }

}

module.exports.help = {
    command: "getteam",
    aliases: ["roster", "r", "team", "t"],
    description: "Shows the selected team's rosters",
    group: GROUP.DEFAULT,
    usage: "getteam <Team Name>"
}