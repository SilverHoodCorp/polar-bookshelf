const {ISODateTime} = require("./ISODateTime");
const {TextHighlight} = require("./TextHighlight");
const {Hashcodes} = require("../Hashcodes");
const {Arrays} = require("../util/Arrays");

module.exports.TextHighlights = class {

    /**
     * Create a TextHighlight by specifying all required rows.
     *
     * We also automatically assign the created and lastUpdated values of this
     * object as we're working with it.
     *
     * @return an object with an "id" for a unique hash and a "value" of the
     * TextHighlight to use.
     */
    static create(rects, textSelections, text) {

        let id = Hashcodes.create(JSON.stringify(rects));

        // FIXME: lastUpdated and created times.

        let created = new ISODateTime(new Date());
        let lastUpdated = created.duplicate();

        let textHighlight = new TextHighlight({
            created,
            lastUpdated,
            rects: Arrays.toDict(rects),
            textSelections: Arrays.toDict(textSelections),
            text
        });

        return {id, value: textHighlight};

    }

};
