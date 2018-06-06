const {Datastore} = require("./Datastore.js");
const {Preconditions} = require("../Preconditions");

/**
 * Datastore just in memory with no on disk persistence.
 */
module.exports.MemoryDatastore = class extends Datastore {

    constructor() {

        super();

        /**
         *
         * @type map<string,string>
         */
        this.docMetas = {}

    }

    async init() {

    }

    /**
     * Get the DocMeta object we currently in the datastore for this given
     * fingerprint or null if it does not exist.
     */
    async getDocMeta(fingerprint) {

        let nrDocs = Object.keys(this.docMetas).length;

        console.log(`Fetching document from datastore with fingerprint ${fingerprint} of ${nrDocs} docs.`)

        return this.docMetas[fingerprint];
    }

    /**
     * Write the datastore to disk.
     */
    async sync(fingerprint, data) {

        Preconditions.assertTypeof(data, "data", "string");

        this.docMetas[fingerprint] = data;
    }

};
