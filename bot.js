// import default libs
const Discord = require("discord.js");
const fs = require("fs");
const log = require("./utils/logger");

// create the client
const client = new Discord.Client();

// import commands
let commands = new Map();

// import manifest
const manifest = JSON.parse(fs.readFileSync("./manifest.json"));

// grab the command directory
fs.readdir("./commands/", (err, files) => {
    if (err) return log.error(`There was an error in loading the commands at: \n ${err}`);

    // filter the submodules
    files
        .filter((file) => file.split(".").length == 1)
        .forEach((subfolder, i) => {
            let modules = fs
                .readdirSync(`./commands/${subfolder}`)
                .filter((file) => file.endsWith(".js"));

            for (file of modules) {
                // get the command
                let command = require(`./commands/${subfolder}/${file}`);

                // get the command identifier
                let commandIdentifier = file.split(".js")[0].toLowerCase();

                // grab our configured commands
                let commandMap = new Map(Object.entries(manifest.commands));

                // grab aliases for this command
                let aliases = commandMap.get(commandIdentifier);

                // if the command has aliases, load them
                if (aliases) {
                    for (alias of aliases.aliases) {
                        commands.set(alias, command);
                    }
                }

                // set the parent command
                commands.set(commandIdentifier, command);
            }
        });
});

client.on("error", (err) => {
    log.error(err);
});

client.on("ready", () => {
    log.info("Bot is online.");
    client.user.setActivity(`Watching CCL`);
});

client.on("message", (message) => {
    // check conditionals in which we don't want the bot to "listen"
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;

    let prefix = manifest.bot.prefix;
    let content = message.content;

    // make sure the message starts with our prefix
    if (content.indexOf(prefix) == 0) {
        // run some regex to allow easier arg querying
        const args = content.splice(prefix).trim().split(/ +/g);

        // grab the intended command
        const command = args[0].toLowerCase();

        try {
            commands.get(command).execute({
                message: message,
                args: args,
                prefix: prefix,
            });
        } catch (err) {
            log.warn(`Tried to run command "${command}" but it doesn't exist.`);
        }
    }
});

client.login(manifest.bot.token);// import default libs