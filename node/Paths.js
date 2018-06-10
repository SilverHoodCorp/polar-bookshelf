
/**
 * Create hashcodes from string data to be used as identifiers in keys.
 *
 * @type {Hashcodes}
 */
module.exports.Paths = class {

    static basename(data) {

        let end = data.lastIndexOf("/");

        if(end <= -1) {
            return null;
        }

        return data.substring(end+1, data.length);

    }

};
