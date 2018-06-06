
const { forDict } = require("../utils.js");
const {SerializedObject} = require("./SerializedObject.js");

/*

 general metadata structure

 doc
    title: string
    path: string
    hashcode: string

    pages: PAGE*

 PAGE:
    id: string
    annotations: ANNOTATION*

 # FIXME: I think we need to have separate types for each annotation.  So we
 # would have a NOTE, a HIGHLIGHT, AREA_HIGHLIGHT, TEXT, COMMENT, STRIKETHROUGH)
 #
 # FIXME: each annotation should be able to have OTHER metadata which is like a
 # 'comment' but a 'comment' at a high level

 ANNOTATION:
    box: BOX
    created: timestamp - ISO8601 that the annotation was created
    creator: AUTHOR

 ANNOTATION:
    box: BOX
    created: timestamp - ISO8601 that the annotation was created
    last_updated: timestamp - used if the annotation is moved or if the note was updated.
    creator: AUTHOR

 ANNOTATION_WITH_NOTE extends ANNOTATION:
    note:
    emotion:

 EMOTION
    INFO
    WARNING
    FATAL

 HIGHLIGHT
    priority: (1,2,3,4)  - priorities give us different colors ... but these
                           should probably be like primary, secondary, tertiary
                           FIXME: an area highlight should have these too.

 PAGEMARK extends ANNOTATION_WITH_NOTE
    coverage: float 0.0 -> 1.0

 Bookmark extends ANNOTATION_WITH_NOTE

 AUTHOR:
    id
    name
    email
    link

 BOX:
    x: int - X position on the page
    y
    width
    height

 NOTE:
    data: string
    format: MARKDOWN|HTML


 */


function createDocMeta(path) {

    return { title: null,
             path: null,
             hashcode: null,
             pagemarks: {} };

}

module.exports.DocMetaDescriber = class {

    static describe(docMeta) {

        var nrPagemarks = 0;

        forDict(docMeta.pageMetas, function (key, pageMeta) {
            forDict(pageMeta.pagemarks, function (column, pagemark) {
                ++nrPagemarks;
            }.bind(this));

        }.bind(this));


        return `PDF with ${docMeta.docInfo.nrPages} pages and ${nrPagemarks} pagemarks.`
    }

}







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

class TextRect extends SerializedObject {

    constructor(val) {
        super(val);

        // the actual text in this rect.
        this.text = null;

        // A rect area that the user has selected text.
        this.rect = null;

    }

}

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

class AreaHighlight extends BaseHighlight {

    constructor(val) {

        super(val);

    }

}

class DocMetaWriter {

}
