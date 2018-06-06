const {SerializedObject} = require("./SerializedObject");

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
         * @type {number}
         */
        this.type = TextType.MARKDOWN;

        this.init(val);

    }

}