// import default libs
const Discord = require("discord.js");
const fs = require("fs");
const log = require("./utils/logger");
const COLOR = require("./utils/colors")
const mongoose = require("mongoose");
const hasGroupPermissions = require("./utils/hasGroupPermissions")

// import manifest
const manifest = JSON.parse(fs.readFileSync("./manifest.json"));

//Connect to the database
let mongodbUrl = `mongodb+srv://${manifest.mongoose.acc}:${manifest.mongoose.pass}${manifest.mongoose.node}/${manifest.mongoose.database}`;
mongoose
    .connect(mongodbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    }).then(() => log.info(`Connected to database ${manifest.mongoose.database}`))
    .catch((err) => log.error("db error", err.reason));

//add the messasge embed constructor
const MessageEmbed = Discord.MessageEmbed;

// create the client
const client = new Discord.Client();

// import commands
let commands = new Map();

// grab the command directory
fs.readdir("./commands/", (err, files) => {
    if (err) return log.error(`There was an error in loading the commands at: \n ${err}`);

    // filter the submodules
    files
        .filter((file) => file.split(".").length == 1)
        .forEach(async (subfolder, i) => {
            let modules = fs
                .readdirSync(`./commands/${subfolder}`)
                .filter((file) => file.endsWith(".js"));

            for (file of modules) {
                // get the command
                let command = require(`./commands/${subfolder}/${file}`);

                // get the command identifier
                let commandIdentifier = file.split(".js")[0].toLowerCase();

                // if the command has aliases, load them
                let help = await command.help;
                if (help && help.aliases) {
                    for (alias of help.aliases) {
                        commands.set(alias, command);
                    }
                }

                // set the parent command
                commands.set(commandIdentifier, command);
            }
        });

    // log.error(commands);
    // log.error(commands.get('r'));
});

client.on("error", (err) => {
    log.error("discord err", err);
});

client.on("ready", () => {
    log.info("Bot is online.");
    client.user.setActivity(
        'CCL', { type: 'PLAYING' }
    );

});

client.on("message", async (message) => {
    // check conditionals in which we don't want the bot to "listen"
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;

    let prefix = manifest.bot.prefix;
    let content = message.content;

    // make sure the message starts with our prefix
    if (content.indexOf(prefix) == 0) {
        // run some regex to allow easier arg querying
        const args = content.slice(1).trim().split(/ +/g);
        log.info("args " + args)

        // grab the intended command
        const command = args[0].toLowerCase();

        try {
            // Logs who is running the command, what channel and what guild.
            log.info(`[${message.guild.name}#${message.channel.name} - ${message.author.tag}] ${message.content}`)
            // console.log(message.member.roles.cache, message.author.permissions)
            // console.log(commands.get(command).help)
            //if (//manifest.owners.includes(message.author.id) ||
            //|| hasPermissions(commands.get(command), message.author.permissions)) { //runs the command given.

            // console.log(commands.get(command))
            // console.log(await hasGroupPermissions(message.member, commands.get(command)))
            if (await hasGroupPermissions(message.author.id, commands.get(command))) {
                commands.get(command).run({
                    message: message,
                    args: args,
                    prefix: prefix,
                });
            }
            else {
                let embed = new MessageEmbed()
                    .setColor(COLOR.WARN)
                    .setDescription("You do not have enough permissions to run this command.")
                message.channel.send(embed)
            }
        } catch (err) {
            log.error("failing command", err);
            log.warn(`Tried to run command "${command}" but it doesn't exist.`);
            let embed = new MessageEmbed()
                .setColor(COLOR.WARN)
                .setDescription(`Tried to run command "${command}" but it doesn't exist.`);
            message.channel.send(embed)
        }
    }
});

client.login(manifest.bot.token);// import default libs
