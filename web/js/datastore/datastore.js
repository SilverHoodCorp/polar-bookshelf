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

};