const {SerializedObject} = require("./SerializedObject.js");
const {Preconditions} = require("../Preconditions");
const {Annotation} = require("./Annotation");

module.exports.BaseHighlight = class extends Annotation {

    constructor(val) {
        super(val);

        /**
         * The rectangles where we need to place content for this highlights.
         *
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

    validate() {
        super.validate();

        Preconditions.assertNotNull(this.rects, "rects");
        Preconditions.assertNotInstanceOf(this.rects, "rects", Array);
    };

};
