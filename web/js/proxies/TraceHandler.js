const {Preconditions} = require("../Preconditions");
const {MutationType} = require("./MutationType");

module.exports.TraceHandler = class {

    // FIXME: add the ability to add our own listeners to a TraceHandler... this
    // way you can take an arbitrary object path, and register a handler for it
    // and perform some action when it changes.

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
