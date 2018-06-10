// start a simple static HTTP server only listening on localhost


const path = require('path');
const express = require('express');
const serveStatic = require('serve-static');
const {Paths} = require("./Paths");

class Webserver {

    constructor(dir, port) {
        this.dir = dir;
        this.port = port;
        this.app = null;
        this.server = null;

        /**
         * The registry of hashcodes to the file path it should be served from.
         *
         * @type {{}}
         */
        this.registry = {};

    }

    start() {

        this.app = express();

        //this.app.use(serveStatic('public/ftp', {'index': ['default.html', 'default.htm']}));
        this.app.use(serveStatic(this.dir));
        this.server = this.app.listen(this.port, "127.0.0.1");

        this.app.get(/files\/.*/, function (req, res) {

            try {

                console.log("FIXME: " + JSON.stringify(this.registry, null, "  ") );

                console.log("Handling data at path: " + req.path);

                let hashcode = Paths.basename(req.path);

                if(! hashcode) {
                    let msg = "No key given for /file";
                    console.error(msg);
                    res.status(404).send(msg);
                } else if (! (hashcode in this.registry)) {
                    let msg = "File not found with hashcode: " + hashcode;
                    console.error(msg);
                    res.status(404).send(msg);
                } else {

                    let path = this.registry[hashcode];

                    console.log(`Serving file at ${req.path} from ${path}`);

                    return res.sendFile(path);

                }

            } catch (e) {
                console.error(e);
            }

        }.bind(this));

        console.log(`Webserver up and running on port ${this.port}`);

    }

    stop() {
        this.server.close();
    }

    /**
     * Register a file to be served with the given checksum.
     */
    registerFile(hashcode, filename) {

        filename = path.resolve(filename);

        let reqPath = "/files/" + hashcode;
        this.registry[hashcode] = filename;

        console.log(`Registered new file at: ${reqPath} to ${filename}`)

    }

}

module.exports.Webserver = Webserver;
