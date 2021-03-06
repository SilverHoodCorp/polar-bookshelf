
const {AnnotationWithNote} = require("./AnnotationWithNote");
const {PagemarkType} = require("./PagemarkType");
const {MetadataSerializer} = require("./MetadataSerializer");
const {ISODateTime} = require("./ISODateTime");

module.exports.Pagemark = class extends AnnotationWithNote {

    constructor(val) {

        super(val);

        /**
         * The type of pagemark.
         *
         * @type {PagemarkType}
         */
        this.type = null;

        /**
         * The total percentage of the page that is covered with the page mark.
         * From 0 to 100.  This factors in the total rows and columns on the
         * page and is the raw percentage value of the page.
         *
         * @type number
         */
        this.percentage = null;

        /**
         * The column number on which this pagemark is rendered.  This is mostly
         * metadata and we should be migrating to PagemarkBox and PagemarkRange
         * which supports raw rendering of the pagemarks.
         *
         * @type {null}
         */
        this.column = null;

        // TODO: support 'range' in the future which is a PagemarkRange so that
        // we can start off reading within a smaller page.

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
