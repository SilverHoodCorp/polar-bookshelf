const {Preconditions} = require("../Preconditions");
const {MutationType} = require("./MutationType");
const {FunctionalInterface} = require("../util/FunctionalInterface");
const {Reactor} = require("../reactor/Reactor");

module.exports.TraceHandler = class {

    // FIXME: add the ability to add our own listeners to a TraceHandler... this
    // way you can take an arbitrary object path, and register a handler for it
    // and perform some action when it changes.

    constructor(path, traceListener) {
        Preconditions.assertNotNull(path, "path");
        this.path = path;
        this.traceListener = FunctionalInterface.create("onTrace", traceListener);

        this.reactor = new Reactor();
        this.reactor.registerEvent('trace');

    }

    set(target, property, value, receiver) {
        this.reactor.dispatchEvent('trace', {path: this.path, type: MutationType.SET, target, property, value});
        return this.traceListener.onTrace(this.path, MutationType.SET, target, property, value);
    }

    deleteProperty(target, property) {
        this.reactor.dispatchEvent('trace', {path: this.path, type: MutationType.DELETE, target, property, value});
        return this.traceListener.onTrace(this.path, MutationType.DELETE, target, property, undefined);
    }

};
