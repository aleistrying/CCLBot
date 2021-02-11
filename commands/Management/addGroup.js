const { MessageEmbed } = require("discord.js");
const COLOR = require("../../utils/colors");
const { GROUP } = require("../../utils/groups");
const log = require("../../utils/logger");
const Blacklists = require("../../models/Blacklists");
const MCAPI = require("../../utils/MinecraftAPI");

module.exports.run = async ({ message, args, prefix }) => {
    //things to work on -> addgroup command,
    // -> addPlayer
    // -> remPlayer
    // -> addBlacklist
    // -> remBlacklist
    // -> help command shown permissions
    let embed = new MessageEmbed()
    if (args[1]) {
        let plUuid = await MCAPI.getUuid(args[1]);
        let bl = await Blacklists.find({ $or: [{ uuid: plUuid }, { alts: new RegExp(args[1], 'i') }] })
        if (bl && bl.length > 0) {

            embed
                .setColor(COLOR.WARN)
                .setTitle("Blacklist")
                .setThumbnail(`https://crafatar.com/avatars/${bl[0].uuid}`)
                .addField(`Name`, `${await MCAPI.getName(bl[0].uuid)}`)
                // for (field of Object.entries(player)) {
                //     console.log(field)
                //     embed.addField(field[0], field[1])
                // }
                .addField(`UUID`, `${bl[0].uuid}`)
                .addField(`Start Date`, `${(!bl[0].start_date || typeof (bl[0].start_date) == "string") ? "None" : bl[0].start_date.toISOString().split("T")[0]}`)
                .addField(`End Date`, `${(!bl[0].end_date || typeof (bl[0].end_date) == "string") ? "None" : bl[0].end_date.toISOString().split("T")[0]} `)
                .addField(`Reason`, `${bl[0].reason} `)
                .addField(`Referee`, `${bl[0].referee} `)
                .addField(`Type`, `${bl[0].type} `)
                .addField(`Alts`, `${bl[0].alts} `)
                .addField(`Notes`, `${bl[0].notes} `);
        }
        else if (bl.length == 0) {
            embed
                .setColor(COLOR.WARN)
                .setTitle("Blacklist")
                .setDescription("This player is not blacklisted");
        }
        else {
            log.error(bl);
            embed
                .setColor(COLOR.WARN)
                .setTitle("Blacklist")
                .setDescription("Error looking for the blacklist");
        }

    }
    else {
        embed
            .setColor(COLOR.WARN)
            .setTitle("Blacklist")
            .setDescription("Player field is required");
    }
    message.channel.send(embed)
}

module.exports.help = (async () => {
    return {
        command: "addgroup",
        aliases: [],
        description: "Gives a discord user a certain permission group.",
        permission: (await GROUP).ADMIN,
        usage: "addgroup [Discord Tag|Discord Id]"
    }
})()