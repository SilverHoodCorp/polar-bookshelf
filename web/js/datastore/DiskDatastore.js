const {Preconditions} = require("../Preconditions");
const {Datastore} = require("./Datastore.js");

const fs = require("fs");
const util = require('util');

class DiskDatastore extends Datastore {

    constructor(dataDir) {

        super();

        if(dataDir) {
            // use a configured dataDir for testing.
            this.dataDir = dataDir;
        } else {
            this.dataDir = DiskDatastore.getDataDir();
        }

        this.readFileAsync = util.promisify(fs.readFile);
        this.writeFileAsync = util.promisify(fs.writeFile);
        this.mkdirAsync = util.promisify(fs.mkdir);
        this.accessAsync = util.promisify(fs.access);
        this.statAsync = util.promisify(fs.stat);
        this.unlinkAsync = util.promisify(fs.unlink);
        this.rmdirAsync = util.promisify(fs.rmdir);
        //this.existsAsync = fileExists;

    }

    async init() {

        let result = {
            dataDir: this.dataDir
        };

        if(await this.existsAsync(this.dataDir)) {
            result.exists=true;
        } else {
            result.dataDirCreated = true;
            await this.mkdirAsync(this.dataDir);
        }

        return result;

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

        return await this.readFileAsync(statePath);

    }

    async existsAsync(path) {

        return new Promise(function(resolve,reject) {

            this.statAsync(path)
                .then(function() {
                    resolve(true);
                })
                .catch(function(err) {
                    if(err.code === 'ENOENT') {
                        resolve(false);
                    } else {
                        // some other error
                        reject(err);
                    }
                });

        }.bind(this));

    }

    /**
     * Write the datastore to disk.
     */
    async sync(fingerprint, data) {

        Preconditions.assertTypeof(data, "data", "string");

        console.log("Performing sync of content into disk datastore.");

        let docDir = this.dataDir + "/" + fingerprint;

        let dirExists =
            await this.statAsync(docDir)
                      .then(() => true)
                      .catch(() => false)

        if ( ! dirExists) {
            // the directory for this file is missing.
            console.log(`Doc dir does not exist. Creating ${docDir}`);
            await this.mkdirAsync(docDir)
        }

        let statePath = docDir + "/state.json";

        console.log(`Writing data to state file: ${statePath}`);

        return await this.writeFileAsync(statePath, data);

    }

    static getUserHome() {

        let result = process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];

        if(!result) {
            result = os.homedir();
        }

        return result;
    }

    static getDataDir() {
        return DiskDatastore.getUserHome() + "/.polar";
    }

}

/**
 * A disk based datastore with long term persistence.
 */
module.exports.DiskDatastore = DiskDatastore;
