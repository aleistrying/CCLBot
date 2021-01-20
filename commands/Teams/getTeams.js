const Teams = require('../../models/Teams');
const { MessageEmbed } = require("discord.js");
const GROUP = require("../../utils/groups");
const COLOR = require("../../utils/colors")
const teamsQuery = [
    {
        '$lookup': {
            'from': 'players',
            'localField': 'name',
            'foreignField': 'team',
            'as': 'players'
        }
    }, {
        '$project': {
            'name': 1,
            'players': {
                '$size': '$players'
            }
        }
    },
    {
        '$sort': {
            'name': 1,
            'players': 1
        }
    }
];
module.exports.run = async ({ message, args, prefix }) => {
    const teams = await Teams.aggregate(teamsQuery);
    if (teams) {

        let embed = new MessageEmbed()
            .setColor(COLOR.INFO)
            .setTitle("Teams")
        let formattedList = "";
        if (args[1] == '3') {
            for (team of teams) {
                embed.addField(`${team.name}`, `Member Count: ${team.players}`, true)
            }
        }
        else if (args[1] == '2') {
            for (team of teams) {
                formattedList += `**${team.name}** - Member Count: ${team.players}\n`
            }
        } else {
            for (team of teams) {
                embed.addField(`${team.name}`, `Member Count: ${team.players}`)
            }
        }
        embed.setDescription(formattedList);
        message.channel.send(embed)
    }
    else {
        message.channel.send(new MessageEmbed()
            .setColor(COLOR.ERROR)
            .setTitle("Teams")
            .setDescription("No teams have been found."))
        log.error("Teams DB could not load.")
    }

}

module.exports.help = {
    command: "getteams",
    aliases: ["teams", "lt", "listteams", "*t"],
    description: "Shows all the teams in the league",
    group: GROUP.DEFAULT,
    usage: "getteams"
}