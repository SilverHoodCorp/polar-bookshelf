module.exports.FunctionalInterface = class {

    /**
     * Create a functional interface for the given object so that a function OR
     * an object can be used.  We prefer the object form.
     */
    static create(name, object) {

        if (!object[name] && typeof object === "function") {
            let functionalInterface = {};
            functionalInterface[name] = object;

            return functionalInterface;
        }

        return object;

    }

}
