
module.exports.Objects = class {

    /**
     * Take the current object, and use given object as a set of defaults.
     */
    static defaults(current, def) {

        let result = current;

        if (!result) {
            result = {};
        }

        for(let key in def) {
            if(def.hasOwnProperty(key) && ! result.hasOwnProperty(key)) {
                result[key] = def[key];
            }
        }

        return result;

    }

    /**
     * Clear an array or dictionary of all its values so it is reset.
     * This modifies the object directly.
     *
     * @param obj
     */
    static clear(obj) {

        if(obj instanceof Array) {

            for(let idx = 0; idx < obj.length; ++idx) {
                obj.pop();
            }

            return obj;

        }

        if(typeof obj === "object") {

            for(let key in obj) {
                delete obj[key];
            }

            return obj;

        }

        throw new Error("Only works for arrays or objects");

    }

    static duplicate(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

};
