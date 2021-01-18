const axios = require('axios');

module.exports = class _MinecaftAPI {

    /**
     * 
     * @param {String} name 
     * @returns {<String>}
     */

    static getUuid(name) {
        if (name == null) return null;
        let player = axios.get(`https://api.mojang.com/users/profiles/minecraft/${name}`);
        return player;

    }

    /**
     * @param {String} uuid
     * @returns {<String>}
     */

    static getName(uuid) {
        if (uuid == null) return null;
        let player = axios.get(`https://api.mojang.com/users/profiles/minecraft/${uuid}`);
        return player;

    }

}