const {Annotation} = require("./Annotation.js");
const {Note} = require("./Note.js");

/* abstract */
// FIXME: make this an ExtendedAnnotation (which has notes, comments, tags, etc).
module.exports.AnnotationWithNote = class extends Annotation {

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
