const {Preconditions} = require("../Preconditions");

class WebserverConfig {

    constructor(dir, port) {
        this.dir = Preconditions.assertNotNull(dir, "dir");
        this.port = Preconditions.assertNotNull(port, "port");
    }

}

module.exports.WebserverConfig = WebserverConfig;
