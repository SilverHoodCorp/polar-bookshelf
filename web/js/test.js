var chai = require("chai");
const {mocha, describe} = require("mocha");
console.log("FIXME" , require("mocha"))

require("./testrunner");
window.onload = function() {
    mocha.run(function () {
        console.log("done");
    });
};