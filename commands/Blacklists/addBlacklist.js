const { MessageEmbed } = require("discord.js");
const COLOR = require("../../utils/colors");
const { GROUP } = require("../../utils/groups");
const log = require("../../utils/logger");
const BLACKLISTS = require("../../models/Blacklists");
const MCAPI = require("../../utils/MinecraftAPI");

module.exports.run = async ({ message, args, prefix }) => {
    let embed = new MessageEmbed()
        .setAuthor("Blacklist Wizard")
        .setColor(COLOR.INFO),
        errorEmbed = new MessageEmbed()
            .setAuthor("Blacklist Wizard Error")
            .setColor(COLOR.WARN),
        league = "CCL",
        username,
        uuid,
        type,
        reason,
        referee,
        start_date,
        end_date,
        alts,
        notes,
        isGlobal,
        exit = false,
        error = false,
        messageOptions = {
            max: 1,
            time: 30000,
            errors: ['time']
        },
        filter = m => m.author.id === message.author.id,
        pendingAnswer = null;
    try {
        //player ign

        while ((!uuid || error) && !exit) {
            embed.setTitle("Username")
            errorEmbed.setTitle("Username")
            if (!error)
                message.channel.send(embed.setDescription("Please type the player's IGN to blacklist."))
            pendingAnswer = await message.channel.awaitMessages(filter, messageOptions)
            if (pendingAnswer) {
                if (pendingAnswer.first().content == "exit") {
                    embed.setDescription("Closing wizard.");
                    exit = true;
                } else {
                    username = pendingAnswer.first().content;
                    uuid = await MCAPI.getUuid(username);
                    let exists = await BLACKLISTS.find({ uuid: uuid });
                    console.log(exists)
                    if (!uuid && exists[0].length) {
                        error = true;
                        message.channel.send(errorEmbed.setDescription("Invalid player name. Enter a valid IGN again or exit using the command exit."))
                    }
                    else
                        error = false
                }
            }
        }
        // else {
        //     exit = true;
        //     embed.setDescription("Did not input a name after 30s. Stopping wizard.")
        // } 
        //type of blacklist
        while ((!type || error) && !exit) {
            embed.setTitle("Type")
            errorEmbed.setTitle("Type")
            if (!error)
                message.channel.send(embed.setDescription("Please answer the type of blacklist. Permanent or Temporary (p/t)."))

            pendingAnswer = await message.channel.awaitMessages(filter, messageOptions);

            if (pendingAnswer.first().content == "exit") {
                embed.setDescription("Closing wizard.");
                exit = true;
            } else {
                type = pendingAnswer.first().content;
                if (!type) {
                    error = true;
                    message.channel.send(errorEmbed.setDescription("Invalid Type. Enter the type again or exit using the command exit."))
                } else if ([/p.{0,9}/gi, /1/gi].reduce((val, acc) => acc = val.test(type) || acc)) {
                    error = false;
                    type = "permanent"
                }
                else {
                    error = false;
                    type = "temporary";
                }

            }
        }




        //reason of blacklist
        while ((!reason || error) && !exit) {
            embed.setTitle("Reason")
            errorEmbed.setTitle("Reason")
            if (!error)
                message.channel.send(embed.setDescription("Please enter the reason for the blacklist."))

            pendingAnswer = await message.channel.awaitMessages(filter, messageOptions);

            if (pendingAnswer.first().content == "exit") {
                embed.setDescription("Closing wizard.");
                exit = true;
            } else {
                reason = pendingAnswer.first().content;
                if (reason.length <= 10) {
                    error = true;
                    message.channel.send(errorEmbed.setDescription("Minimun amount of characters is 10. Enter the reason again or exit using the command exit."))
                }
                else
                    error = false;

            }
        }

        //referee of the blacklist
        while ((!referee || error) && !exit) {
            embed.setTitle("Referee")
            errorEmbed.setTitle("Referee")
            if (!error)
                message.channel.send(embed.setDescription("Please enter the referee's IGN."))
            pendingAnswer = await message.channel.awaitMessages(filter, messageOptions)
            if (pendingAnswer) {
                if (pendingAnswer.first().content == "exit") {
                    embed.setDescription("Closing wizard.");
                    exit = true;
                } else {
                    username = pendingAnswer.first().content;
                    referee = await MCAPI.getUuid(username);
                    if (!referee) {
                        error = true;
                        message.channel.send(errorEmbed.setDescription("Invalid player name. Enter a valid IGN again or exit using the command exit."))
                    }
                    else
                        error = false;
                }
            }
        }



        //start_date of blacklist
        while ((!start_date || error) && !exit) {
            embed.setTitle("Start Date")
            errorEmbed.setTitle("Start Date")
            if (!error)
                message.channel.send(embed.setDescription("Please enter the start date of the blacklist. (MM/DD/YYYY)"))

            pendingAnswer = await message.channel.awaitMessages(filter, messageOptions);

            if (pendingAnswer.first().content == "exit") {
                embed.setDescription("Closing wizard.");
                exit = true;
            } else {
                start_date = new Date(pendingAnswer.first().content);
                console.log(start_date)
                if (isNaN(start_date.getTime())) {
                    error = true;
                    message.channel.send(errorEmbed.setDescription("Invalid Date. Please enter a valid date or exit using the command exit."))
                }
                else
                    error = false;
            }
        }
        //end_date of blacklist
        while ((!end_date || error) && !exit && type == "temporary") {
            embed.setTitle("End Date")
            errorEmbed.setTitle("End Date")
            if (!error)
                message.channel.send(embed.setDescription("Please enter the end date of the blacklist. (MM/DD/YYYY)"))

            pendingAnswer = await message.channel.awaitMessages(filter, messageOptions);

            if (pendingAnswer.first().content == "exit") {
                embed.setDescription("Closing wizard.");
                exit = true;
            } else {
                end_date = new Date(pendingAnswer.first().content);
                if (isNaN(end_date.getTime())) {
                    error = true;
                    message.channel.send(errorEmbed.setDescription("Invalid Date. Please enter a valid date or exit using the command exit."))
                }
                else
                    error = false;
            }
        }


        //alts of blacklist 
        if (!exit) {
            embed.setTitle("Alts")
            errorEmbed.setTitle("Alts")
            message.channel.send(embed.setDescription("Please enter the alts of the blacklisted player if any."))

            pendingAnswer = await message.channel.awaitMessages(filter, messageOptions);

            if (pendingAnswer.first().content == "exit") {
                embed.setDescription("Closing wizard.");
                exit = true;
            } else {
                alts = pendingAnswer.first().content;

                // if (!alts) {
                //         message.channel.send(errorEmbed.setDescription(". Enter the reason again or exit using the command exit."))
                //     }
            }
        }
        //notes of blacklist 

        if (!exit) {
            embed.setTitle("Notes")
            errorEmbed.setTitle("Notes")
            message.channel.send(embed.setDescription("Please enter additional notes about this blacklist if any."))

            pendingAnswer = await message.channel.awaitMessages(filter, messageOptions);

            if (pendingAnswer.first().content == "exit") {
                embed.setDescription("Closing wizard.");
                exit = true;
            } else {
                notes = pendingAnswer.first().content;
            }
        }

        console.log(
            uuid,
            type,
            reason,
            referee,
            start_date,
            end_date,
            alts,
            notes)
    } catch (e) {
        log.error(e);
        error = true;
        embed.setColor(COLOR.ERROR).setTitle("Timeout").setDescription("Blacklist Wizard has stopped after 30s of inacitvity")
    }
    if (!error && !exit) {
        try {


            let bl = new BLACKLISTS({
                league: league,
                uuid: uuid,
                type: type,
                reason: reason,
                referee: referee,
                start_date: start_date,
                end_date: end_date,
                alts: alts,
                notes: notes,
                isGlobal: false,
            }
            )
            bl.save();

            embed
                .setTitle("Completed")
                .setColor(COLOR.SUCCESS)
                .setDescription("Blacklist has sucessfully been created.");
        }
        catch (e) {
            embed.setColor(COLOR.ERROR).setTitle("Error").setDescription("Blacklist Wizard failed on creation.")
        }
    }
    else if (!error)
        embed
            .setTitle("Exit")
            .setColor(COLOR.WARN)
            .setDescription("Blacklist wizard has been stopped.");
    // let bl = await BLACKLISTS.find({ $or: [{ uuid: plUuid }, { alts: new RegExp(args[1], 'i') }] })

    message.channel.send(embed)
}

module.exports.help = (async () => {
    return {
        command: "addblacklist",
        aliases: ["+blacklist", "createblacklist", "createbl", "+bl"],
        description: "Starts the blacklist wizard",
        permission: (await GROUP).REFEREE,
        usage: "addblacklist"// <player name> <type permanent|temporary> [start_date] [end_date] <reason>"
    }
})()



