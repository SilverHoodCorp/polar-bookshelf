// start a simple static HTTP server only listening on localhost


let express = require('express');
let serveStatic = require('serve-static');

class WebserverDaemon {

    constructor(dir, port) {
        this.dir = dir;
        this.port = port;
        this.app = null;
    }

    start() {

        this.app = express();

        //this.app.use(serveStatic('public/ftp', {'index': ['default.html', 'default.htm']}));
        this.app.use(serveStatic(this.dir));
        this.app.listen(this.port, "127.0.0.1");
        console.log(`Webserver up and running on port ${this.port}`);

    }

}

exports.WebserverDaemon = WebserverDaemon;
