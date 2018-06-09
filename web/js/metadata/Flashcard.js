module.exports.Flashcard = class extends TemporalObject {

    constructor(val) {

        super(val);

        /**
         * The type of this flashcard.
         *
         * @type FlashcardType
         */
        this.type = null;

        this.init(val);

    };

    onCreateNewFlashcard() {

    }

};
