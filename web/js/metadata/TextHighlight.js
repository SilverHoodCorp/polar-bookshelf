const {BaseHighlight} = require("./BaseHighlight.js");

class TextHighlight extends BaseHighlight {

    constructor(val) {

        super(val);

        /**
         * A raw array-like object of text from the regions that the user
         * has highlighted in the UI. In PDF and pdf.js there isn't really
         * the concept of flowing text so we try to show the user the text
         * in the specific regions they selected.
         *
         * @type map<int,TextRect>
         */
        this.textSelections = {};

        /**
         * The text selections converted to a text string which may or may not
         * be human readable.
         *
         * @type {string}
         */
        this.text = "";

    }

}