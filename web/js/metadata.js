import {forDict} from "./utils.js";

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


/**
 * Basic serialized object pattern. Take a closure as an argument to init,
 * and then assign the fields.  Then setup and validate that we have our
 * required data structures.
 */
class SerializedObject {

    constructor(val) {
        // noop
    }

    init(val) {

        if(arguments.length > 1) {
            throw new Error("Too many arguments");
        }

        if(typeof val === "object") {

            Object.assign(this, val);
            this.setup();
            this.validate();

        }

    }

    setup() {

    }

    validate() {

    }

    validateMemberExists(name) {

        if(!this[name]) {
            throw new Error(`Member field '${name}' missing.`);
        }

    }

    /**
     * Validate that the member is defined and that it has the given type.
     *
     * These are instance types compared via instanceof
     *
     * @param name The name of the member.
     * @param instanceType The instance type we expect
     */
    validateMemberInstanceOf(name, instance) {

        this.validateMemberExists(name);

        if( ! this[name] instanceof instance) {
            throw new Error(`Member field '${name}' is not a instance of ${instance}`);
        }
    }

    /**
     * Validate that the given member exists and it is a typeof of 'type'
     *
     * The types in this case are primitive types compared with typeof
     *
     * @param name The name of the member.
     * @param instanceType The instance type we expect
     */
    validateMemberTypeOf(name, type) {

        this.validateMemberExists(name);

        if( ! typeof this[name] === type) {
            throw new Error(`Member field '${name}' is not a type of ${type}`);
        }

    }

    validateMember(member) {

        if (member.instance) {
            this.validateMemberInstanceOf(member.name, member.instance);
        } else if(member.type) {
            this.validateMemberTypeOf(member.name, member.type);
        } else {
            throw new Error("Unable to handle member: ", member);
        }
    }

    validateMembers(members) {

        // TODO: needs testing.

        var caller = this;

        members.forEach(this.validateMember.bind(this));

    }

}

export class DocMetaDescriber {

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

/**
 * Root metadata for a document including page metadata, and metadata for
 * the specific document.
 */
export class DocMeta extends SerializedObject {

    constructor(val) {

        super(val);

        /**
         * The DocInfo which includes information like title, nrPages, etc.
         * @type DocInfo
         */
        this.docInfo = null;

        /**
         * A sparse dictionary of page number to page metadata.
         *
         * @type map<int,PageMeta>
         */
        this.pageMetas = {}

        /**
         * The version of this DocMeta version.
         */
        this.version = 1;

        this.init(val);

    }

    getPageMeta(num) {

        let pageMeta = this.pageMetas[num];

        if (!pageMeta) {
            throw new Error("No pageMeta for page: " + num);
        }

        return pageMeta;

    }

    validate() {

        this.validateMembers([
            {name: 'docInfo', instance: DocInfo},
            {name: 'pageMetas', type: "object"},
            {name: 'version', type: "number"}
        ]);
    }

    /**
     * Create the basic DocInfo structure that we can use with required / basic
     * field structure.
     * @param nrPages The number of pages in this document.
     * @returns {DocMeta}
     */
    static create(fingerprint, nrPages) {

        let docInfo = new DocInfo({fingerprint, nrPages});

        let pageMetas = {};

        for(let idx = 1; idx <= nrPages; ++idx) {
            let pageInfo = new PageInfo({num: idx});
            let pageMeta = new PageMeta({pageInfo: pageInfo});
            pageMetas[idx] = pageMeta;
        }

        return new DocMeta({docInfo, pageMetas});

    }

    /**
     * Create a DocMeta object but place initial pagemarks on it. This is useful
     * for testing.
     */
    static createWithinInitialPagemarks(fingerprint, nrPages) {

        var result = this.create(fingerprint, nrPages);

        let maxPages = 3;
        for(var pageNum = 1; pageNum <= Math.min(nrPages, maxPages); ++pageNum ) {

            let pagemark = new Pagemark({
                // TODO: this shouldn't have a hard wired date here but we don't
                // have a dependency injector yet.
                created: new Date(),
                type: PagemarkType.SINGLE_COLUMN,
                percentage: 100,
                column: 0
            });

            let pageMeta = result.getPageMeta(pageNum);

            // set the pagemark that we just created.
            pageMeta.pagemarks[pagemark.column] = pagemark;

        }

        return result;

    }

    /**
     */
    static addPagemarks(docMeta, options) {

        if (!options) {
            options = {};
        }

        if (!options.nrPages) {
            options.nrPages = 3;
        }

        if (!options.offsetPage) {
            // the starting page
            options.offsetPage = 1;
        }

        if (!options.percentage) {
            // the percentage value from 0-100
            options.percentage = 100;
        }

        var maxPageNum = Math.min(options.offsetPage + options.nrPages -1, docMeta.docInfo.nrPages);

        for(var pageNum = options.offsetPage; pageNum <= maxPageNum; ++pageNum ) {

            let pagemark = new Pagemark({
                // TODO: this shouldn't have a hard wired date here but we don't
                // have a dependency injector yet.
                created: new Date(),
                type: PagemarkType.SINGLE_COLUMN,
                percentage: options.percentage,
                column: 0
            });

            let pageMeta = docMeta.getPageMeta(pageNum);

            // set the pagemark that we just created.
            pageMeta.pagemarks[pagemark.column] = pagemark;

        }


    }

};

/**
 * Lightweight metadata about a document. We do not include full page metadata
 * with this object which makes it lightweight to pass around.
 */
class DocInfo extends SerializedObject {

    constructor(val) {

        super(val);

        /**
         * The title for the document.
         * @type {null}
         */
        this.title = null;

        /**
         * The network URL for the document where we originally fetched it.
         * @type string
         */
        this.url = null;

        /**
         * The number of pages in this document.
         *
         * @type number
         */
        this.nrPages = null;

        /**
         * A fingerprint for the document created from PDF.js
         * @type string
         */
        this.fingerprint = null;

        this.init(val);

    }

    validate() {
        this.validateMembers([
            {name: 'nrPages', type: "number"},
            {name: 'fingerprint', type: "string"}
        ]);
    }


}

export class PageMeta extends SerializedObject {

    constructor(val) {

        super(val);

        /**
         * The pageInfo for this page.
         */
        this.pageInfo = null;

        /**
         * The index of page number to pagemark which stores the data we need
         * for keeping track of pagemarks.  The index is the pagemark column.
         *
         * @type map<int,pagemark>.
         */
        this.pagemarks = {};

        this.init(val);

    }

    validate() {
        this.validateMembers([
            {name: 'pageInfo', instance: PageInfo}
        ]);
    }

}

class PageInfo extends SerializedObject {

    constructor(val) {

        super(val);

        /**
         * The page number of this page.
         *
         * @type number.
         */
        this.num = null;

        this.init(val);

    }

    validate() {
        this.validateMembers([
           {name: 'num', type: "number"}
        ]);
    }

}

/**
 *
 * Basic ISO8601 date and time format.
 */
class ISODateTime {

    constructor(value) {

        /**
         * The Date object representing this time.
         */
        this.date = null;

        if (typeof value === "string") {
            this.date = Date.parse(value);
        } else if(value instanceof Date) {
            this.date = value;
        } else {
            throw new Error("Invalid type: " + typeof value);
        }

    }

    toDate() {
        return this.date;
    }

    toJSON() {
        return this.date.toISOString();
    }

    toString() {
        return this.date.toISOString();
    }

}

class Symbol {

    constructor(name) {
        this.name = name;
    }


    toJSON() {
        return this.name;
    }

}

// this is I think a better pattern for typesafe enum:
// http://2ality.com/2016/01/enumify.html
const TextType = {
    MARKDOWN: new Symbol("MARKDOWN"),
    HTML: new Symbol("HTML")
}

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

/**
 * Private note describing this object.  Meant to last a long time.
 */
class Note extends SerializedObject {

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

/**
 * Basically just like a note but it's a comment in a discussion stream.
 */
class Comment extends Note {

    constructor() {
        super(val);
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

/* abstract */
class Annotation extends SerializedObject {

    constructor(val) {

        super(val);

        /**
         * The time this annotation was created
         * @type ISODateTime
         */
        this.created = null;

        /**
         * The last time this annotation was updated (note changed, moved, etc).
         * @type ISODateTime
         */
        this.lastUpdated = null;

        // TODO: add tags for annotations. This might be overkill but it might
        // be a good way to manage some of these types.

        this.init(val);

    }

    setup() {

        if(!this.lastUpdated && this.created) {
            this.lastUpdated = this.created;
        }

    }

    validate() {

        if(!this.created) {
            throw new Error("Created is required");
        }

        // FIXME: move this to validateMembers
        if(!this.created instanceof ISODateTime) {
            throw new Error("Member created has wrong type: ", typeof this.created);
        }

        if(!this.lastUpdated instanceof ISODateTime) {
            throw new Error("Member lastUpdated has wrong type: ", typeof this.lastUpdated);
        }

    }

}

/* abstract */
class AnnotationWithNote extends Annotation {

    constructor(val) {

        super(val);

        /**
         * The note for this annotation.
         *
         * @type Note
         */
        this.notes = {};

        // FIXME: the keys of these objects should be the hash of the time
        // sequenece, the user, and machine that this was generated on.

        // FIXME: should have comments (plural)

        // FIXME: should have tags (plural)

        // FIXME: should have flashcards (plural) for anki usage.

        this.init(val);

    }

    setup() {

        super.setup();

        if(!this.note) {
            this.note = new Note({text: "", created: this.created});
        }

    }

    validate() {
        super.validate();
    }

}

const PagemarkType = {
    SINGLE_COLUMN: new Symbol("SINGLE_COLUMN"),
    DOUBLE_COLUMN: new Symbol("DOUBLE_COLUMN")
}


class Pagemark extends AnnotationWithNote {

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

/**
 * All JSON must go through the metadata serializer so we can handle proper
 * serialization but also object validation once they are deserialized.
 */
export class MetadataSerializer {

    static replacer(key, value) {
        if(value instanceof ISODateTime) {
            return value.toJSON();
        }

        return value;

    }

    static serialize(object, spacing) {
        //return JSON.stringify(object, MetadataSerializer.replacer, "");

        // FIXME: if this is a SerializedObject, call validate() before we return it

        if (!spacing) {
            spacing = "";
        }

        return JSON.stringify(object, null, spacing);
    }

    /**
     * Given an instance of an object, and a JSON string, deserialize the string into
     * the object.
     * @param object
     * @param data
     */
    static deserialize(obj,data) {

        if(!data) {
            throw new Error("No data given!")
        }

        let parsed = JSON.parse(data);
        Object.assign(obj, parsed);
        return obj;
    }

}

class DocMetaWriter {

}

if(typeof exports !== "undefined") {
    exports.MetadataSerializer = MetadataSerializer;
    exports.DocMeta = DocMeta;
}
