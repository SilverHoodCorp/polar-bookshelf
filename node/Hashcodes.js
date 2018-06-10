
const base58check = require("base58check");
const createKeccakHash = require("keccak");

/**
 * Create hashcodes from string data to be used as identifiers in keys.
 *
 * @type {Hashcodes}
 */
module.exports.Hashcodes = class {

    static create(data) {
        return base58check.encode(createKeccakHash('keccak256').update(data).digest());
    }

};
