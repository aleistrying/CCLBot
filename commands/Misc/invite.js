const { GROUP } = require('../../utils/groups')
const { MessageEmbed } = require('discord.js')
const Colors = require('../../utils/colors')

module.exports.run = async ({ message, args, prefix }) => {

    let invite = `https://discordapp.com/oauth2/authorize?&client_id=800504244993261648&scope=bot&permissions=3072`//52224 just in case

    let embed = new MessageEmbed()
        .setColor(Colors.INFO)
        .setTitle(`<${invite}>`)

    message.channel.send(embed);

}

module.exports.help = (async () => {
    return {
        name: "invite",
        aliases: ["invitelink", "inv"],
        permission: (await GROUP).DEFAULT,
        description: "Shows the invite link for the bot",
        usage: "invite"
    }
})()