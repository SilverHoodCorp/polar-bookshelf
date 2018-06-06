const {Clock} = require("./Clock.js");

module.exports.SyntheticClock = class extends Clock {

    getDate() {
        return new Date(Date.parse("2018-05-30T02:47:44.411Z"));
    }

}
