const {TraceEvent} = require("./TraceEvent");
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

        this.reactor = new Reactor();
        this.reactor.registerEvent('onMutation');

        traceListener = FunctionalInterface.create("onMutation", traceListener);
        this.addTraceListener(function(traceEvent) {
            traceListener.onMutation(traceEvent);
        });

    }

    /**
     * Add a listener for a specific object.
     */
    addTraceListener(traceListener) {
        this.reactor.addEventListener('onMutation', traceListener);
    }

    set(target, property, value, receiver) {
        this.reactor.dispatchEvent('onMutation', new TraceEvent(this.path, MutationType.SET, target, property, value));
    }

    deleteProperty(target, property) {
        this.reactor.dispatchEvent('onMutation', new TraceEvent(this.path, MutationType.DELETE, target, property, undefined));
    }

};
