const { MessageEmbed } = require("discord.js");
const COLOR = require("../../utils/colors");
const { GROUP, parseGroup } = require("../../utils/groups");
const Permissions = require("../../models/Permissions");
const hasGroupPermissions = require("../../utils/hasGroupPermissions")
const log = require("../../utils/logger");
const fs = require("fs");
module.exports.run = async ({ message, args, prefix }) => {

    let embed = new MessageEmbed()
        .setColor(COLOR.INFO);
    // let discId = message || await message.guild.members.fetch(args[1]); 
    let formattedText = "";
    if (!args[1] || args[1].length == 0) {
        embed.setTitle("Bot Commands");

        const files = fs.readdirSync("./commands");
        if (!files) return log.error(`There was an error in loading the commands at: \n ${err}`);

        files.sort();

        for (subfolder of files) {
            if (!subfolder.endsWith(".js")) {
                const commands = fs.readdirSync(`./commands/${subfolder}`);

                commands.sort()
                let shownCommands = [];
                for (command of commands) {
                    const cmd = require(`../${subfolder}/${command}`)
                    if (await hasGroupPermissions(message.author.id, cmd)) {
                        shownCommands.push((await cmd.help).command)
                    }
                }
                if (shownCommands && shownCommands.length != 0) {
                    formattedText += `**${subfolder}**\n`;
                    formattedText += `${shownCommands.map(val => `\`${val}\``).toString().toLowerCase().replace(/\.js/g, "").replace(/,/g, ", ")}\n\n`;
                }
            }
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
                    // if (cmd.permissions == getUserPermissions())
                    //     break;  
                    let help = await cmd.help;
                    if (cmd && help) {
                        if (args[1] == help.command || (help.aliases && help.aliases.includes(args[1]))) {
                            if (await hasGroupPermissions(message.author.id, cmd)) {
                                embed.setTitle(`Bot Command _${help.command}_`)
                                let alias = help.aliases.toString().toLowerCase().replace(/\.js/g, "").replace(/,/g, ", "),
                                    desc = help.description,
                                    usage = help.usage;
                                perm = help.permission;
                                embed.addField("Command", help.command);
                                if (alias) embed.addField("Aliases", alias)
                                if (desc) embed.addField("Description", desc)
                                if (usage) embed.addField("Usage", usage)
                                if (String(perm)) embed.addField("Permissions", (await parseGroup)[perm])
                                found = true;
                            }
                            break;
                        }
                    }
                }
                if (found) break;
            }
        }
        if (!found) {
            embed.setTitle("Bot Command")
                .setDescription("Command Not Found")
        }
    }
    message.channel.send(embed)
}

module.exports.help = (async () => {
    return {
        command: "help",
        aliases: ["he", "h"],
        description: "Shows all commands available. If a command is added at the end, it shows the information about that command",
        permission: (await GROUP).DEFAULT,
        usage: "help <command>"
    }
})()