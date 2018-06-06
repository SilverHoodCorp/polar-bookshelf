const {Symbol} = require("./Symbol.js");

module.exports.PagemarkType = Object.freeze({
    SINGLE_COLUMN: new Symbol("SINGLE_COLUMN"),
    DOUBLE_COLUMN: new Symbol("DOUBLE_COLUMN")
});
