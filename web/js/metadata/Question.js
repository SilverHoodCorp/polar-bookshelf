const {SerializedObject} = require("./SerializedObject.js");

/**
 * Some type of follow up on content that we need to analyze.
 */
module.exports.Question = class extends SerializedObject {

    constructor(val) {

        super(val);

        /**
         * The content of this note.
         *
         * @type {Text}
         */
        this.content = null;

        /**
         * @type ISODateTime
         */
        this.created = null;

        /**
         *
         * @type Author
         */
        this.author = null;

        this.init(val);

    };

    setup() {

        if(!this.content) {
            this.content = "";
        }

    }

    validate() {

        if(!this.created) {
            throw new Error("The field `created` is required.");
        }

    }

};
