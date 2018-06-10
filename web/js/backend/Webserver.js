// start a simple static HTTP server only listening on localhost

const express = require('express');
const serveStatic = require('serve-static');
const {Paths} = require("../util/Paths");
const {Preconditions} = require("../Preconditions");

class Webserver {

    constructor(webserverConfig, fileRegistry) {

        this.webserverConfig = Preconditions.assertNotNull(webserverConfig);
        this.fileRegistry = fileRegistry;

        this.app = null;
        this.server = null;

    }

    start() {

        this.app = express();

        this.app.use(serveStatic(this.webserverConfig.dir));
        this.server = this.app.listen(this.webserverConfig.port, "127.0.0.1");

        this.app.get(/files\/.*/, function (req, res) {

            try {

                console.log("Handling data at path: " + req.path);

                let hashcode = Paths.basename(req.path);

                if(! hashcode) {
                    let msg = "No key given for /file";
                    console.error(msg);
                    res.status(404).send(msg);
                } else if (!this.fileRegistry.hasKey(hashcode)) {
                    let msg = "File not found with hashcode: " + hashcode;
                    console.error(msg);
                    res.status(404).send(msg);
                } else {

                    let keyMeta = this.fileRegistry.get(hashcode);
                    let filename = keyMeta.filename;

                    console.log(`Serving file at ${req.path} from ${filename}`);

                    return res.sendFile(filename);

                }

            } catch (e) {
                console.error(e);
            }

        }.bind(this));

        console.log(`Webserver up and running on port ${this.webserverConfig.port}`);

    }

    stop() {
        this.server.close();
    }


}

module.exports.Webserver = Webserver;
