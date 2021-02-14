const { MessageEmbed } = require("discord.js");
const COLOR = require("../../utils/colors");
const { GROUP } = require("../../utils/groups");
const log = require("../../utils/logger");
const MCAPI = require("../../utils/MinecraftAPI");
const Blacklists = require("../../models/Blacklists");

module.exports.run = async ({ message, args, prefix }) => {
    let embed = new MessageEmbed()
        .setTitle("Remove Blacklist")
        .setColor(COLOR.INFO)
    if (args[1]) {
        let uuid = await MCAPI.getUuid(args[1]);
        let oldPl = await Blacklists.findOne({ uuid: uuid });

        if (uuid) {
            const pl = await Blacklists.findOneAndRemove({ uuid: uuid },
                { /*upsert: true, setDefaultsOnInsert: true, new: true,*/ rawResult: true });
            console.log(pl)
            if (pl && oldPl) {
                embed
                    .setColor(COLOR.SUCCESS)
                    .setDescription(`The blacklist for ${await MCAPI.getName(pl.name)} has been removed.`);

            }
            else {
                embed
                    .setColor(COLOR.WARN)
                    .setDescription(`Player is not blacklisted.`);
            }
            // else {
            //     log.info("error ", pl, oldPl)
            //     embed.setColor(COLOR.ERROR).setDescription("Data could not be updated. Contact ._.#1238")
            // }
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
        aliases: ["-bl", "-blacklist", "rembl", "remblacklist"],
        description: "Starts the blacklist wizard",
        permission: (await GROUP).ADMIN,
        usage: "removeblacklist [MC IGN]"// <player name> <type permanent|temporary> [start_date] [end_date] <reason>"
    }
})()



