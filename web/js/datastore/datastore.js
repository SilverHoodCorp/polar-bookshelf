// A datastore that supports ledgers and checkpoints.
class Datastore {

    /**
     * Init the datastore, potentially reading files of disk, the network, etc.
     */
    init() {

    }

    /**
     * Get the DocMeta object we currently in the datastore for this given
     * fingerprint.
     */
    getDocMeta(fingerprint) {

    }

    /**
     * Add a new docMeta to the store with the given ID.
     *
     */
    addDocMeta(id, docMeta) {

    }

    /**
     * Write the datastore to disk.
     */
    sync() {

    }

}

/**
 * Datastore just in memory with no on disk persistence.
 */
class MemoryDatastore extends Datastore {

    constructor() {
        super();
        /**
         *
         * @type map<string,DocMeta>
         */
        this.docMetas = {}
    }


    addDocMeta(id, docMeta) {
        this.docMetas[id] = docMeta;
    }

    status() {

    }

    sync() {
        // this is a noop for the in memory version.
    }

}
