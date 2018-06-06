
const {AnnotationWithNote} = require("./AnnotationWithNote");
const {PagemarkType} = require("./PagemarkType");
const {MetadataSerializer} = require("./MetadataSerializer");
const {ISODateTime} = require("./ISODateTime");

module.exports.Pagemark = class extends AnnotationWithNote {

    constructor(val) {

        super(val);

        /**
         * The note for this annotation.
         *
         * @type PagemarkType
         */
        this.type = null;

        /**
         * The vertical percentage of the page that is covered with the page
         * mark.  From 0 to 100.
         * @type number
         */
        this.percentage = null;

        /**
         * The column number we're working on.
         *
         * @type {null}
         */
        this.column = null;

        this.init(val);

    }

    setup() {

        super.setup();

        if(!this.type) {
            this.type = PagemarkType.SINGLE_COLUMN;
        }

        if(!this.percentage) {
            this.percentage = 100;
        }

        if(!this.column) {
            this.column = 0;
        }

    }

    validate() {
        super.validate();
    }


    // toJSON() {
    //     return MetadataSerializer.serialize(this);
    // }

    toString() {
        return MetadataSerializer.serialize(this);
    }

}