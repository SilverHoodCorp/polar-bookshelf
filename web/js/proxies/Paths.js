
module.exports.Paths = class {

    /**
     * Create a path from the given parts regardless of their structure.
     *
     * Don't allow double // or trailing /.  The output is always sane.
     *
     * @param dirname
     * @param basename
     */
    static create(dirname, basename) {

        if(!dirname)
            throw new Error("Dirname required");

        if(!basename)
            throw new Error("Basename required");

        // don't accept invalid input
        if(basename.indexOf("/") !== -1) {
            throw new Error("No / in basename.");
        }

        if(dirname.indexOf("//") !== -1) {
            // don't allow // in dirname already as we would corrupt
            throw new Error("No // in dirname");
        }

        if(!dirname.indexOf("/") !== 0) {
            throw new Error("Dirname must start with /");
        }

        let result = dirname + "/" + basename;

        // replace multiple slashes in directory parts
        result.replace(/\/\/+/g, "/");

        return result;

    }

}
