const { MessageEmbed } = require("discord.js");
const COLOR = require("../../utils/colors");
const GROUP = require("../../utils/groups");
const log = require("../../utils/logger");
const fs = require("fs");
module.exports.run = async ({ message, args, prefix }) => {

    let embed = new MessageEmbed()
        .setColor(COLOR.INFO);
    let formattedText = "";
    if (!args[1] || args[1].length == 0) {
        embed.setTitle("Bot Commands");

        const files = fs.readdirSync("./commands");
        if (!files) return log.error(`There was an error in loading the commands at: \n ${err}`);

        files.sort();

        for (subfolder of files) {
            if (!subfolder.endsWith(".js")) {
                formattedText += `**${subfolder}**\n`;
                const commands = fs.readdirSync(`./commands/${subfolder}`);
                commands.sort()
                if (commands) {
                    formattedText += `${commands.toString().toLowerCase().replace(/\.js/g, "").replace(/,/g, ", ")}\n`;
                }
            }
            formattedText += "\n"
        }

        embed.setDescription(formattedText)

    } else {
        const files = fs.readdirSync("./commands");
        if (!files) return log.error(`There was an error in loading the commands at: \n ${err}`);

        let found = false;

        for (subfolder of files) {
            if (!subfolder.endsWith(".js")) {

                const commands = fs.readdirSync(`./commands/${subfolder}`);

                for (command of commands) {

                    const cmd = require(`../${subfolder}/${command}`)

                    if (cmd && cmd.help) {
                        if (args[1] == cmd.help.command || (cmd.help.aliases && cmd.help.aliases.includes(args[1]))) {
                            found = true;
                            embed.setTitle(`Bot Command ${cmd.help.command}`)
                            let alias = cmd.help.aliases.toString().toLowerCase().replace(/\.js/g, "").replace(/,/g, ", "),
                                desc = cmd.help.description,
                                usage = cmd.help.usage;
                            embed.addField("Command", cmd.help.command);
                            if (alias) embed.addField("Aliases", alias)
                            if (desc) embed.addField("Description", desc)
                            if (usage) embed.addField("Usage", usage)
                            break;
                        }
                    }
                }
            }
        }
        if (!found) {
            embed.setTitle("Commands")
                .setDescription("Command Not Found")
        }
    }
    message.channel.send(embed)
}

module.exports.help = {
    command: "help",
    aliases: ["he", "h"],
    description: "Shows all commands available. If a command is added at the end, it shows the information about that command",
    permissions: GROUP.GROUP.DEFAULT,
    usage: "help [command]"
}