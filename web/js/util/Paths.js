
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

        if(dirname.indexOf("//") !== -1 || basename.indexOf("//") !== -1  ) {
            // don't allow // in dirname already as we would corrupt
            throw new Error("No // in dirname");
        }

        let result = dirname + "/" + basename;

        // replace multiple slashes in directory parts
        result = result.replace(/\/\/+/g, "/");

        // remove any trailing slashes
        result = result.replace(/\/$/g, "");

        return result;

    }

    static basename(data) {

        let end = data.lastIndexOf("/");

        if(end <= -1) {
            return null;
        }

        return data.substring(end+1, data.length);

    }

};
