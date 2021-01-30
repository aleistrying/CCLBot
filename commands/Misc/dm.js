const { GROUP } = require("../../utils/groups");
const { MessageEmbed } = require('discord.js')
const logger = require('../../utils/logger');
const Colors = require("../../utils/colors");
module.exports.run = async ({ message, args, prefix }) => {
    let embed = new MessageEmbed();
    if (args[1]) {
        if (args[2]) {
            let user;
            try {
                user = message.mentions.users.first() || message.guild.members.cache.get(args[1]) || await message.guild.members.fetch(args[1]);
                // console.log("person", message.guild.members.cache.get(args[1]), args[1])
                if (args.length == 0) {
                    embed.setColor(Colors.WARN)
                        .setDescription("Please specify a user (mention or id)")
                    message.channel.send(embed);
                }
                else if (args.length == 1) { embed.setColor(Colors.WARN).setDescription("Please specify a message") }
                else if (!user) {
                    embed.setColor(Colors.ERROR)
                    embed.setDescription("Invalid user - Specify a valid user (mention or id)")
                    message.channel.send(embed);
                }
                else {
                    let modArgs = args;
                    modArgs.shift();
                    modArgs.shift();
                    console.log(modArgs)
                    let messageToSend = modArgs.join(" ");
                    try {
                        user.send(messageToSend)
                            .catch(() => {
                                embed.setColor(Colors.ERROR).setDescription("Unable to send message");
                            });
                        embed.setColor(Colors.SUCCESS)
                            .setDescription("Successfully dmed <@" + user + ">")
                    }
                    catch (e) { logger.error("Error sending message: ", e) };
                }

            } catch (e) {
                logger.error(e)
                embed.setColor(Colors.WARN)
                    .setDescription("Please specify a user in the discord.")
            }

        }
        else {
            embed.setColor(Colors.WARN)
                .setDescription("Please add a message.")
        }
    }
    else {
        embed.setColor(Colors.WARN)
            .setDescription("Please add a user.")
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