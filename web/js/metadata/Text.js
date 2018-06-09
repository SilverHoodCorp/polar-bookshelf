const {SerializedObject} = require("./SerializedObject");
const {TextType} = require("./TextType");

class Text extends SerializedObject {

    constructor(val) {

        super(val);

        /**
         * The actual body of this text.
         *
         * @type {string}
         */
        this.body = "";

        /**
         * The type of this text.  Defaults to MARKDOWN.
         * @type {Symbol}
         */
        this.type = TextType.MARKDOWN;

        this.init(val);

    }

}

module.exports.Text = Text;
