module.exports.Arrays = class {

    /**
     * Convert an array to a dictionary.
     */
    static toDict(arr) {

        if(typeof arr === "object" && ! arr instanceof Array ) {
            // already done.
            return arr;
        }

        if (! arr instanceof Array) {
            throw new Error("Not an array");
        }

        let result = {};

        for(let idx = 0; idx < arr.length; ++idx) {
            result[idx] = arr[idx];
        }

        return result;

    }

}
