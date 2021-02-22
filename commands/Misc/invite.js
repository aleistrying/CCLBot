const { GROUP } = require('../../utils/groups')
const { MessageEmbed } = require('discord.js')
const Colors = require('../../utils/colors')
const fs = require("fs");

module.exports.run = async ({ message, args, prefix }) => {
    const manifest = JSON.parse(fs.readFileSync("./manifest.json"));
    // console.log(manifest)// https://discord.com/api/oauth2/authorize?client_id=804891581945348097&permissions=0&scope=bot
    let invite = `https://discord.com/oauth2/authorize?&client_id=${manifest.bot.clientId}&scope=bot&permissions=52224`//1275128918  52224 just in case

    let embed = new MessageEmbed()
        .setColor(Colors.INFO)
        .setTitle(`<${invite}>`)

    message.channel.send(embed);

}

module.exports.help = (async () => {
    return {
        command: "invite",
        aliases: ["invitelink", "inv"],
        permission: (await GROUP).DEFAULT,
        description: "Shows the invite link for the bot",
        usage: "invite"
    }
})()