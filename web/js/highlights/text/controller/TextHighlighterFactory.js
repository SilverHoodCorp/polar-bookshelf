require("../../../../../lib/TextHighlighter.js");
module.exports.TextHighlighterFactory = class {

    static newInstance(element, options) {
        return new global.TextHighlighter(element, options);
    }

};
