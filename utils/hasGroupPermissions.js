
const PERMISSIONS = require("../models/Permissions");
const { parseGroup, GROUP } = require("./groups");
const logger = require("./logger");

module.exports = async function hasGroupPermissions(discordId, command) {
    // console.log((await command.help).permission)
    let cmdPerm = (await command.help).permission,
        userId = String(discordId)
    // console.log(userId, cmdPerm)
    try {
        const perm = await PERMISSIONS.findOne({ "discordId": userId })
            .then(values => { if (values) { return values.groups } else return });
        if (perm && perm.length > 0) {
            let groups = [0];//just incase the person doesn't have the perm.
            await perm.forEach(async group => groups.push((await GROUP)[group]))
            // console.log(perm.groups.map(async val => { return (await GROUP)[val]; }));
            // let canRunCommand = 0;
            // for (groupName of perm.groups) {
            //     value = (await GROUP)[groupName];
            //     if (!value) value = 0;
            //     canRunCommand += await value;
            // }
            // console.log("perm.permid", perm, "req", cmdPerm)
            // console.log((await parseGroup)[cmdPerm])
            // console.log("can", canRunCommand, "group", perm.groups)
            // perm.groups = perm.groups.map(async v => ) 
            if (groups.includes(cmdPerm)) {//canRunCommand >= cmdPerm) {
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
            logger.info(`Creating user ${userId} in permissions`)
            await new PERMISSIONS({ discordId: userId }).save();
            return false;
        }
    }
    catch (e) {
        logger.error(e)
        return false;
    }
}

