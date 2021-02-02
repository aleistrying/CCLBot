
const PERMISSIONS = require("../models/Permissions");
const { parseGroup, GROUP } = require("./groups");
const logger = require("./logger");

module.exports = async function hasGroupPermissions(discordId, command) {
    // console.log((await command.help).permission)
    let cmdPerm = (await command.help).permission,
        userId = discordId
    // console.log(userId, cmdPerm)
    try {
        const perm = await PERMISSIONS.findOne({ "discordId": Number(userId) });
        if (perm && perm.groups.length > 0) {

            // console.log(perm.groups.map(async val => { return (await GROUP)[val]; }));
            let canRunCommand = 0;
            for (groupName of perm.groups) {
                value = (await GROUP)[groupName];
                if (!value) value = 0;
                canRunCommand += await value;
            }
            // console.log("perm.permid", perm, "req", cmdPerm)
            // console.log((await parseGroup)[cmdPerm])
            // console.log("can", canRunCommand, "group", perm.groups)
            if (canRunCommand >= cmdPerm) {
                return true;
            }
            else {
                return false;
            }
        }
        else if (0 == cmdPerm) {
            return true;
        }
        else {
            logger.error("Did not find permissions for this person.")
            return false;
        }
    }
    catch (e) {
        logger.error(e)
        return false;
    }
}

