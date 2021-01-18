const Teams = require('../../models/Teams');
const { MessageEmbed } = require("discord.js");
const COLOR = require("../../utils/colors");
const log = require("../../utils/logger");
const rankingQuery = [
    {
        '$addFields': {
            'ranking': {
                '$toDouble': {
                    '$concat': [
                        {
                            '$toString': '$losses'
                        }, '.', {
                            '$toString': '$wins'
                        }
                    ]
                }
            }
        }
    }, {
        '$sort': {
            'ranking': 1
        }
    }
];
module.exports.run = async ({ message, args, prefix }) => {
    const teams = await Teams.aggregate(rankingQuery);
    if (teams) {
        let rankings = "";
        let embed = new MessageEmbed()
            .setColor(COLOR.INFO)
            .setTitle("Rankings")
            .setTimestamp(new Date());
        if (args[1] == "2") {
            let tiers = new Set();
            let tierTeams = new Map();
            //get the unique tiers
            for (tier of teams) {
                tiers.add(tier.wins)
            }
            let output;
            //adds each team to a map of a tier
            for (team of teams) {
                output = null;
                if (tierTeams.get(team.wins) && tierTeams.get(team.wins).length > 0) {
                    output = [...tierTeams.get(team.wins), team]
                }
                else
                    output = [team]
                tierTeams.set(team.wins, output)
            }
            //displays every team by tier
            for (tier of tiers) {
                rankings += `**Tier ${tier}**\n`;
                for (team of tierTeams.get(tier)) {
                    rankings += `${team.losses}. ${team.name}\n`
                }
                rankings += "\n";
            }
        }
        else {
            for (team of teams) {
                rankings += `${team.losses}. ${team.name} - Tier: ${team.wins}\n`
            }
        }
        // embed.addField((i == 0) ? `Tier ${tier}` : '', `${team.losses}. ${team.name} - Tier: ${team.wins}`, false)
        embed.setDescription(rankings);
        message.channel.send(embed)
    }
    else {
        message.channel.send(new MessageEmbed()
            .setColor(COLOR.ERROR)
            .setTitle("Rankings")
            .setDescription("No teams have been found."))
        log.error("Teams DB could not load.")
    }

}

module.exports.help = {
    command: "rankings",
    aliases: ["rks"],
    "description": "Gets the information about the team",
    "group": 0
}