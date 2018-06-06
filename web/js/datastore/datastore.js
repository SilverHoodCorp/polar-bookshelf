const {MetadataSerializer, DocMeta} = require("../metadata.js");

// A datastore that supports ledgers and checkpoints.
module.exports.Datastore = class {

    /**
     * Init the datastore, potentially reading files of disk, the network, etc.
     */
    async init() {

    }

    /**
     * Get the DocMeta object we currently in the datastore for this given
     * fingerprint or null if it does not exist.
     */
    async getDocMeta(fingerprint) {

    }

    /**
     * Write the datastore to disk.
     */
    async sync(fingerprint, docMeta) {

    }

}

/**
 * Datastore just in memory with no on disk persistence.
 */
module.exports.MemoryDatastore = class extends Datastore {

    constructor() {

        super();
        /**
         *
         * @type map<string,DocMeta>
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

        var nrDocs = Object.keys(this.docMetas).length;

        console.log(`Fetching document from datastore with fingerprint ${fingerprint} of ${nrDocs} docs.`)

        return this.docMetas[fingerprint];
    }

    /**
     * Write the datastore to disk.
     */
    async sync(fingerprint, docMeta) {

        // create a copy of the docMeta so that the version we store is NOT
        // the same version we have in memory.
        docMeta = MetadataSerializer.deserialize(new DocMeta(), MetadataSerializer.serialize(docMeta));
        this.docMetas[fingerprint] = docMeta;
    }

}
