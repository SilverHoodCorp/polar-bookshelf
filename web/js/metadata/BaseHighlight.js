const {SerializedObject} = require("./SerializedObject.js");

class BaseHighlight extends SerializedObject {

    constructor(val) {
        super(val);

        /**
         * The rectangles where we need to place content for this highlights.
         * @type {{}}
         */
        this.rects = {};

        // this.linesOfText = {};
        //
        // this.text

        /**
         * Optional thumbnail for this highlight.
         * @type {null}
         */
        this.thumbnail = null;

    }

}
