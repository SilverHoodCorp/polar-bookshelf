
const {Datastore} = require("./Datastore.js");
const {MetadataSerializer} = require("../metadata/MetadataSerializer");
const {DocMeta} = require("../metadata/DocMeta");

const fs = require("fs");
const os = require("os");
const util = require('util');

/**
 * A disk based datastore with long term persistence.
 */
module.exports.DiskDatastore = class extends Datastore {

    constructor() {

        super();

        this.dataDir = this.getDataDir();

        this.readFileAsync = util.promisify(fs.readFile);
        this.writeFileAsync = util.promisify(fs.writeFile);
        this.mkdirAsync = util.promisify(fs.mkdir);
        this.accessAsync = util.promisify(fs.access);
        this.statAsync = util.promisify(fs.stat);
        this.unlinkAsync = util.promisify(fs.unlink);
        this.rmdirAsync = util.promisify(fs.rmdir);

    }

    async init() {

        let dirStat = await this.statAsync(this.dataDir);

        if ( ! dirStat.isDirectory()) {
            await this.mkdirAsync(this.dataDir);
        }
    }

    /**
     * Get the DocMeta object we currently in the datastore for this given
     * fingerprint or null if it does not exist.
     */
    async getDocMeta(fingerprint) {

        let docDir = this.dataDir + "/" + fingerprint;

        if(! await this.existsAsync(docDir)) {
            return null;
        }

        let statePath = docDir + "/state.json";

        let statePathStat = await this.statAsync(statePath);

        if( ! statePathStat.isFile() ) {
            return null;
        }

        let canAccess =
            await this.accessAsync(statePath, fs.constants.R_OK | fs.constants.W_OK)
                      .then(() => true)
                      .catch(() => false);

        if(! canAccess) {
            return null;
        }

        let data = await this.readFileAsync(statePath);

        return MetadataSerializer.deserialize(new DocMeta(), data);

    }

    async existsAsync(path) {
        return await this.accessAsync(path, fs.constants.R_OK | fs.constants.W_OK)
                  .then(() => true)
                  .catch(() => false);
    }

    /**
     * Write the datastore to disk.
     */
    async sync(fingerprint, docMeta) {

        console.log("Performing sync of content into disk datastore.");

        let docDir = this.dataDir + "/" + fingerprint;

        let dirExists =
            await this.statAsync(docDir)
                      .then(() => true)
                      .catch(() => false)

        if ( ! dirExists) {
            // the directory for this file is missing.
            await this.mkdirAsync(docDir)
        }

        let statePath = docDir + "/state.json";

        // NOTE that we always write the state with JSON pretty printing.
        // Otherwise tools like git diff , etc will be impossible to deal with
        // in practice.
        //
        // The ledger system would also have a similar problem but we can work
        // on that by making it inherently something that can't conflict
        let data = MetadataSerializer.serialize(docMeta, "  ");

        return this.writeFileAsync(statePath, data);

    }

    getUserHome() {

        let result = process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];

        if(!result) {
            result = os.homedir();
        }

        return result;
    }

    getDataDir() {
        return this.getUserHome() + "/.polar";
    }

};
