const { MessageEmbed } = require("discord.js");
const COLOR = require("../../utils/colors");
const { GROUP } = require("../../utils/groups");
const log = require("../../utils/logger");
const Players = require("../../models/Players");
const Teams = require("../../models/Teams");
const MCAPI = require("../../utils/MinecraftAPI");

module.exports.run = async ({ message, args, prefix }) => {
    let embed = new MessageEmbed()
        .setTitle("Remove Member")
        .setColor(COLOR.INFO)
    if (args[1]) {
        let uuid = await MCAPI.getUuid(args[1]);
        let oldPl = await Players.findOne({ uuid: uuid });

        if (uuid) {
            const pl = await Players.findOneAndUpdate({ uuid: uuid },
                { team: null },
                { upsert: true, setDefaultsOnInsert: true, new: true, rawResult: true });

            if (pl && oldPl && oldPl.team != null) {
                embed
                    .setColor(COLOR.SUCCESS)
                    .setDescription(`Player has been removed from ${oldPl.team}.`);

            }
            else if (pl && oldPl && oldPl.team == null) {
                embed
                    .setColor(COLOR.WARN)
                    .setDescription(`Player is not on a team.`);
            }
            else {
                log.info("error ", pl, oldPl)
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
    message.channel.send(embed)
}

module.exports.help = (async () => {
    return {
        command: "removeblacklist",
        aliases: ["-b", "-blacklist", "rembl", "remblacklist"],
        description: "Starts the blacklist wizard",
        permission: (await GROUP).ADMIN,
        usage: "removeblacklist [MC IGN]"// <player name> <type permanent|temporary> [start_date] [end_date] <reason>"
    }
})()



