/**
 *
 * Basic ISO8601 date and time format.
 */
class ISODateTime {

    constructor(val) {

        /**
         * The Date object representing this time.
         */
        this.value = null;

        if (typeof val === "string") {
            this.value = val;
        } else if(val instanceof Date) {
            this.value = val.toISOString();
        } else {
            throw new Error("Invalid type: " + typeof val);
        }

    }

    toDate() {
        return Date.parse(this.value);
    }

    toJSON() {
        return this.value;
    }

    toString() {
        return this.value;
    }

    /**
     * Create a duplicate version of this object.
     */
    duplicate() {
        return new ISODateTime(this.value);
    }

}

module.exports.ISODateTime = ISODateTime;
