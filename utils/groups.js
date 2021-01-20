const Groups = require("../models/Groups");

// console.log(parseGroup)
async function findGroup(val) {

    let groupQuery = await Groups.find({});
    let values = {}, parseGroup = [];
    if (values) {
        for (value of groupQuery) {
            values[value.name] = value.groupId;
        }
        for (value of groupQuery) {
            parseGroup[value.groupId] = value.name;
        }
    } if (val) {
        return values;
    } else
        return parseGroup;
}


module.exports.GROUP = findGroup(true);
module.exports.parseGroup = findGroup(false);