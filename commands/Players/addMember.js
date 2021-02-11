const { MessageEmbed } = require("discord.js");
const COLOR = require("../../utils/colors");
const { GROUP } = require("../../utils/groups");
const log = require("../../utils/logger");
const Players = require("../../models/Players");
const Teams = require("../../models/Teams");
const MCAPI = require("../../utils/MinecraftAPI");

module.exports.run = async ({ message, args, prefix }) => {
    let embed = new MessageEmbed()
        .setTitle("Add Member")
        .setColor(COLOR.INFO)
    if (args[1] && args[2]) {
        let uuid = await MCAPI.getUuid(args[1]);
        let oldPl = await Players.findOne({ uuid: uuid });
        const tm = await Teams.findOne({ name: new RegExp(args[2], 'i') })

        if (uuid && tm) {
            const pl = await Players.findOneAndUpdate({ uuid: uuid },
                { team: tm.name },
                { upsert: true, setDefaultsOnInsert: true, new: true, rawResult: true });

            console.log(pl, oldPl, tm)
            if (pl && oldPl && pl.value.team != oldPl.team) {
                embed
                    .setColor(COLOR.SUCCESS)
                    .setDescription(`Player has been added to ${tm.name} and removed from ${oldPl.team}`);

            }
            else if (pl && oldPl && pl.value.team == oldPl.team) {
                embed.setColor(COLOR.WARN).setDescription(`Player is already in ${pl.value.team}`)
            }
            else if (pl && !oldPl) {
                embed
                    .setColor(COLOR.SUCCESS)
                    .setDescription(`Player has been added to ${tm.name}`);
            }
            else {
                embed.setColor(COLOR.ERROR).setDescription("Data could not be updated. Contact ._.#1238")
            }
        } else if (!uuid) {
            embed.setColor(COLOR.WARN).setDescription("Player was not found.")
        }
        else if (!tm) {
            embed.setColor(COLOR.WARN).setDescription("Team does not exist.")
        }
    }
    else if (!args[1]) {
        embed.setColor(COLOR.WARN).setDescription("Player argument is required.")
    }
    else if (!args[2]) {
        embed.setColor(COLOR.WARN).setDescription("Team argument is required.")
    }
    message.channel.send(embed)
}

module.exports.help = (async () => {
    return {
        command: "addmember",
        aliases: ["+member", "+m", "addmem", "add-mem"],
        description: "Starts the blacklist wizard",
        permission: (await GROUP).MOD,
        usage: "addmember [User Name] [Team Name]"// <player name> <type permanent|temporary> [start_date] [end_date] <reason>"
    }
})()



