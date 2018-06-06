/**
 *
 * Basic ISO8601 date and time format.
 */
module.exports.ISODateTime = class {

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

};