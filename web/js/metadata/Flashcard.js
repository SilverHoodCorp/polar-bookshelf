const {Note} = require("./Note.js");

module.exports.Flashcard = class extends Note {

    constructor(val) {

        super(val);

        /**
         * The type of this flashcard.
         *
         * @type FlashcardType
         */
        this.type = null;

        /**
         * The content of this flashcard created by the user.
         *
         * @type {Text}
         */
        this.content = null;

        this.init(val);

    };

    onCreateNewFlashcard() {

    }

};
