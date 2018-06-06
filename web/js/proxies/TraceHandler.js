const {Preconditions} = require("../Preconditions");
const {MutationType} = require("./MutationType");

module.exports.TraceHandler = class {

    constructor(path, traceListener) {
        Preconditions.assertNotNull(path, "path");
        this.path = path;
        this.traceListener = traceListener;
    }

    set(target, property, value, receiver) {
        return this.traceListener.onTrace(this.path, MutationType.SET, target, property, value);
    }

    deleteProperty(target, property) {
        return this.traceListener.onTrace(this.path, MutationType.DELETE, target, property, undefined);
    }

};
