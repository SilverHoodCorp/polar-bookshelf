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

// FIXME: I want this serialized as 'MARKDOWN'
var TextType = Object.freeze({"MARKDOWN":1, "HTML":2})

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

    constructor() {

        /**
         * The text of this note.
         * @type {Text}
         */
        this.text = null;

        /**
         * @type ISODateTime
         */
        this.created = null;

    };

    // @VisibleForTesting
    static create(text, created) {
        let note = new Note();

        note.text = text;

        // since we're calling create the timestamp that this is created is
        // obviously the current time but I should really use some type of
        // dependency injection for the clock.

        note.created = new ISODateTime(created);

        return note;
    }

}

class Annotation {

    // FIXME: created
    // FIXME: last updated

}

class AnnotationWithNote {

}


class Pagemark {

    // FIXME: type (whether we have 1, 2 or three column pagemarks)
    // FIXME: percentage
    //

}

class DocMetaWriter {

}

var date = new Date(Date.parse("2018-05-30T02:47:44.411Z"));

// FIXME: move this into a test framework...

console.log("FIXME: " + typeof date)
console.log("FIXME1: " + date);
console.log("FIXME1: " + date.toISOString());

console.log("FIXME1: " + new ISODateTime(date).toJSON());

console.log("FIXME: ", JSON.stringify(new ISODateTime(date)));

console.log("FIXME: ", JSON.stringify(Note.create("hello", date)));

// FIXME: how do we parse now...
console.log("FIXME: ", JSON.stringify(Note.create("hello", date)));



// FIXME: use a create() for the default constructor.. the default constructor
// is otherwise used for creating JSON.
