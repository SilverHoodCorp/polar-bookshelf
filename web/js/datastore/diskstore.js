
const datastore = require("./datastore");
const metadata = require("../metadata");

const fs = require("fs");
const os = require("os");
const util = require('util');

/**
 * Datastore just in memory with no on disk persistence.
 */
class DiskDatastore extends datastore.Datastore {

    constructor() {

        super();
        /**
         *
         * @type map<string,DocMeta>
         */
        this.docMetas = {}

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
        // FIXME: what about the second call where the dir will already exist..?

        var dirStat = await this.statAsync(this.dataDir);

        if ( ! dirStat.isDirectory()) {
            await this.mkdirAsync(this.dataDir);
        }
    }

    /**
     * Get the DocMeta object we currently in the datastore for this given
     * fingerprint or null if it does not exist.
     */
    async getDocMeta(fingerprint) {

        var docDir = this.dataDir + "/" + fingerprint;

        var dirStat = await this.statAsync(docDir);

        if ( ! dirStat.isDirectory()) {
            // the directory for this file is missing.
            return null;
        }

        var statePath = docDir + "/state.json";

        var statePathStat = await this.statAsync(statePath);

        if( ! statePathStat.isFile() ) {
            return null;
        }

        var canAccess =
            await this.accessAsync(statePath, fs.constants.R_OK | fs.constants.W_OK)
                      .then(() => true)
                      .catch(() => false);

        if(! canAccess) {
            return null;
        }

        var data = await this.readFileAsync(statePath);

        return metadata.MetadataSerializer.deserialize(new metadata.DocMeta(), data);

    }

    /**
     * Write the datastore to disk.
     */
    async sync(fingerprint, docMeta) {

        var docDir = this.dataDir + "/" + fingerprint;

        var dirExists =
            await this.statAsync(docDir)
                      .then(() => true)
                      .catch(() => false)

        if ( ! dirExists) {
            // the directory for this file is missing.
            await this.mkdirAsync(docDir)
        }

        var statePath = docDir + "/state.json";

        var data = metadata.MetadataSerializer.serialize(docMeta)

        return this.writeFileAsync(statePath, data);

    }

    getUserHome() {

        var result = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];

        if(!result) {
            result = os.homedir();
        }

        return result;
    }

    getDataDir() {
        return this.getUserHome() + "/.polar";
    }

}

exports.DiskDatastore = DiskDatastore;
