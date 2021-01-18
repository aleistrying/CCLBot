const Groups = require("../models/Groups");
Groups.find({}).then((groupQuery) => {

    let values = {}, parseGroup = [];
    if (groupQuery) {
        for (value of groupQuery) {
            values[value.name] = value.groupId;
        }
        for (value of groupQuery) {
            parseGroup[value.groupId] = value.name;
        }
    }
    // console.log(values)
    // console.log(parseGroup)
    module.exports = values;
    module.exports.parseGroup = parseGroup;
});