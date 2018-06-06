const {SerializedObject} = require("./SerializedObject.js");

/**
 * Private note describing this object.  Meant to last a long time.
 */
module.exports.Note = class extends SerializedObject {

    constructor(val) {

        super(val);

        /**
         * The text of this note.
         *
         * @type {Text}
         */
        this.text = null;

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

        if(!this.text) {
            this.text = "";
        }

    }

    validate() {

        if(!this.created) {
            throw new Error("The field `created` is required.");
        }

    }

}
