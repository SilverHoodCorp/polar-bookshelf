const assert = require('assert');
const {assertJSON} = require("../test/Assertions");
const {Texts} = require("./Texts");
const {TextType} = require("./TextType");
const {Flashcards} = require("./Flashcards");
const {FlashcardType} = require("./FlashcardType");

require("../test/TestingTime").freeze();

describe('Flashcards', function() {

    describe('create', function() {

        it("basic", function () {

            let text = Texts.create("This is the text", TextType.MARKDOWN);

            let flashcard = Flashcards.create(FlashcardType.CLOZURE, text);

            let expected = {
                "content": {
                    "body": "This is the text",
                    "type": "MARKDOWN"
                },
                "created": "2012-03-02T11:38:49.321Z",
                "author": null,
                "lastUpdated": "2012-03-02T11:38:49.321Z",
                "type": "CLOZURE"
            };

            assertJSON(flashcard, expected);

        });

    });

});
