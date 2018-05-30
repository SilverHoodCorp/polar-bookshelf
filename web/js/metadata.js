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

// if I do it like this I can't use the browser unless I use commons-js I think.

readDocMetaFromDisk = function(path) {



};

writeToDisk = function(path, docMeta) {

};

function createDocMeta(path) {

    return { title: null,
             path: null,
             hashcode: null,
             pagemarks: [] };

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

    validateMembers(members) {

        // TODO: needs testing.

        members.forEach(function (member) {

            if (member.instance) {
                this.validateMemberInstanceOf(member.name, member.instance);
            } else if(member.type) {
                this.validateMemberTypeOf(member.name, member.type);
            } else {
                throw new Error("Unable to handle member: ", member);
            }

        });

    }

}

/**
 * Root metadata for a document including page metadata, and metadata for
 * the specific document.
 */
class DocMeta extends SerializedObject {

    constructor(val) {

        super(val);

        /**
         * The DocInfo which includes information like title, nrPages, etc.
         * @type DocInfo
         */
        this.docInfo = null;

        /**
         * A sparse dictionary of page number to page metadata.
         * @type {{}}
         */
        this.pages = {}

    }

    validate() {
        this.validateMembers([
            {name: 'docInfo', instance: DocInfo}
        ]);
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

    }


    validate() {
        this.validateMembers([
            {name: 'nrPages', type: "number"}
        ]);
    }


}

class PageMeta {

    constructor(val) {

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

    }

}

class PageInfo {

    constructor(val) {

        /**
         * The page number of this page.
         *
         * @type number.
         */
        this.num = null;

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

        this.init();

    }

}

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

/* abstract */ class Annotation extends SerializedObject {

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

        // FIXME: make this into its own function
        if(!this.created instanceof ISODateTime) {
            throw new Error("Member created has wrong type: ", typeof this.created);
        }

        if(!this.lastUpdated instanceof ISODateTime) {
            throw new Error("Member lastUpdated has wrong type: ", typeof this.lastUpdated);
        }

    }

}

class AnnotationWithNote extends Annotation {

    constructor(val) {

        super(val);

        /**
         * The note for this annotation.
         *
         * @type Note
         */
        this.note = null;

        this.init();


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

class MetadataSerializer {

    static replacer(key, value) {
        if(value instanceof ISODateTime) {
            return value.toJSON();
        }

        return value;

    }

    static serialize(object, spacing) {
        //return JSON.stringify(object, MetadataSerializer.replacer, "");
        return JSON.stringify(object, null, spacing);
    }

}

class DocMetaWriter {

}

/**
 * Given an instance of an object, and a JSON string, deserialize the string into
 * the object.
 * @param object
 * @param data
 */
function deserialize(obj,data) {
    let parsed = JSON.parse(`{"text":"hello","created":"2018-05-30T02:47:44.411Z"}`);
    Object.assign(obj, parsed);
    return obj;
}

// FIXME: use a create() for the default constructor.. the default constructor
// is otherwise used for creating JSON.

console.log(typeof Note);
