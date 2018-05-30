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
 * Root metadata for a document including page metadata, and metadata for
 * the specific document.
 */
class DocMeta {

    constructor() {

        /**
         * The title for the document.
         * @type {null}
         */
        this.title = null;

        /**
         * The network URL for the document where we originally fetched it.
         * @type {null}
         */
        this.url = null;

        /**
         * A sparse dictionary of page number to page metadata.
         * @type {{}}
         */
        this.pages = {}

    }

};

/**
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

class Text {

    constructor() {

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

    }

}

class Note {

    constructor(val) {

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

        if(arguments.length > 1) {
            throw new Error("Too many arguments");
        }

        if(typeof val === "object") {
            assignOwnProperties(val, this);

            if(!this.text) {
                this.text = "";
            }

            if(!this.created) {
                throw new Error("The field `created` is required.");
            }

        }

    };

}

/* abstract */ class Annotation {

    constructor(val) {

        /**
         * The time this annotation was created
         * @type ISODateTime
         */
        this.created = created;

        /**
         * The last time this annotation was updated (note changed, moved, etc).
         * @type ISODateTime
         */
        this.lastUpdated = lastUpdated;

        // TODO: add tags for annotations. This might be overkill but it might
        // be a good way to manage some of these types.

        if(arguments.length > 1) {
            throw new Error("Too many arguments");
        }

        if(typeof val === "object") {
            assignOwnProperties(val, this);

            if(!this.created) {
                throw new Error("Created is required");
            }

            if(!this.lastUpdated) {
                this.lastUpdated = this.created;
            }

        }

    }

}

class AnnotationWithNote extends Annotation {

    constructor(val) {

        /**
         * The note for this annotation.
         *
         * @type Note
         */
        this.note = note;

        if(arguments.length > 1) {
            throw new Error("Too many arguments");
        }

        if(typeof val === "object") {

            if(!this.created) {
                throw new Error("Created is required");
            }

            if(!this.lastUpdated) {
                this.lastUpdated = this.created;
            }

        }

    }

}


class Pagemark extends AnnotationWithNote {

    // FIXME: type (whether we have 1, 2 or three column pagemarks)
    // FIXME: percentage - the percentage of the page the pagemark covers

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

function assignOwnProperties(source, target) {

    for (var prop in source) {
        console.log("FIXME: " + prop)
        if (source.hasOwnProperty(prop)) {

            console.log("FIXME2: " + prop)
            target[prop] = source[prop];
            console.log("FIXME3: " + target[prop]);
        }
    }
}

// FIXME: use a create() for the default constructor.. the default constructor
// is otherwise used for creating JSON.

console.log(typeof Note);
