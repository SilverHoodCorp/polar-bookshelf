const {Symbol} = require("./Symbol.js");

// this is I think a better pattern for typesafe enum:
// http://2ality.com/2016/01/enumify.html
module.exports.TextType = Object.freeze( {
    MARKDOWN: new Symbol("MARKDOWN"),
    HTML: new Symbol("HTML")
});
