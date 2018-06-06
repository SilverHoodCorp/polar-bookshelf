const {Clock} = require("./Clock.js");

module.exports.SystemClock = class extends Clock {

    getDate() {
        return new Date();
    }

}