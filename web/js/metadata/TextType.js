const {Symbol} = require("./Symbol.js");

// this is I think a better pattern for typesafe enum:
// http://2ality.com/2016/01/enumify.html
module.exports.TextType = Object.freeze( {

    /**
     * RAW text. No interpretation.
     */
    TEXT: new Symbol("TEXT"),

    /**
     * Markdown content.
     */
    MARKDOWN: new Symbol("MARKDOWN"),

    /**
     * Well-formed and safe HTML.
     */
    HTML: new Symbol("HTML")

});
