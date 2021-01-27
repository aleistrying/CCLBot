const { GROUP } = require("../../utils/groups");
const { MessageEmbed } = require('discord.js')
const COLORS = require('../../utils/COLORS');
const logger = require('../../utils/logger');
module.exports.run = async ({ message, args, prefix }) => {
    let embed = new MessageEmbed();

    let user = message.mentions.users.first() || message.guild.members.cache.get(args[0]);

    if (args.length == 0) {
        embed.setColor(COLORS.WARN)
            .setDescription("Please specify a user (mention or id)")
        message.channel.send(embed);
    }
    else if (args.length == 1) { embed.setColor(COLORS.WARN).setDescription("Please specify a message") }
    else if (!user) {
        embed.setColor(COLOR.ERROR)
        embed.setDescription("Invalid user - Specify a valid user (mention or id)")
        message.channel.send(embed);
    }
    else {
        let modArgs = args;
        let messageToSend = modArgs.shift().join(" ");
        try {
            user.send(messageToSend)
                .catch(() => {
                    embed.setColor(COLORS.ERROR).setDescription("Unable to send message");
                });
            embed.setColor(COLORS.SUCCESS)
                .setDescription("Successfully dmed <@" + user + ">")
        }
        catch (e) { logger.error("Error sending message: ", e) };
    }
    message.channel.send(embed);
}
module.exports.help = (async () => {
    return {
        command: "dm",
        aliases: ["pm", "privatemessage", "message"],
        permission: (await GROUP).ADMIN,// (await GROUPS.find({ name: "ADMIN" }))[0].groupId,
        description: "Sends a private message to a user through the bot",
        usage: "dm <mention|id> <message>"
    }
})()