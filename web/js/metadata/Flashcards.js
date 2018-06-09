const {Preconditions} = require("../Preconditions");
const {Flashcard} = require("./Flashcard");
const {Text} = require("./Text");
const {ISODateTime} = require("./ISODateTime");

module.exports.Flashcards = class {

    static create(type, content) {

        Preconditions.assertInstanceOf(content, "content", Text.constructor);

        let now = new Date();

        return new Flashcard({
            created: new ISODateTime(now),
            lastUpdated: new ISODateTime(now),
            type,
            content
        });

    }

};
