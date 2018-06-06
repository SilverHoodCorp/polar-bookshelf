const {SerializedObject} = require("./SerializedObject.js");

class Author extends SerializedObject {

    constructor(val) {
        super(val);

        /**
         * The name of this author.
         * @type string
         */
        this.name = null;

    }

}

