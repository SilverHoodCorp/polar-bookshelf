const {Symbol} = require("./Symbol.js");

/**
 * The type of the flashcard.
 */
module.exports.FlashcardType = Object.freeze({
    CLOZURE: new Symbol("CLOZURE"),
    QUESTION_ANSWER: new Symbol("QUESTION_ANSWER"),
    QUESTION_ANSWER_AND_REVERSE: new Symbol("QUESTION_ANSWER_AND_REVERSE"),
    QUESTION_ANSWER_OR_REVERSE: new Symbol("QUESTION_ANSWER_OR_REVERSE")
});
