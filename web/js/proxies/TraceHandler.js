const {TraceListenerExecutor} = require("./TraceListenerExecutor");
const {TraceEvent} = require("./TraceEvent");
const {Preconditions} = require("../Preconditions");
const {MutationType} = require("./MutationType");
const {FunctionalInterface} = require("../util/FunctionalInterface");
const {Reactor} = require("../reactor/Reactor");

const EVENT_NAME = "onMutation";

module.exports.TraceHandler = class {

    /**
     *
     * @param path The path to this object.
     * @param traceListener The main TraceListener to use.
     * @param target The object that is the target of this handler.
     */
    constructor(path, traceListener, target) {

        Preconditions.assertNotNull(path, "path");
        this.path = path;

        this.target = target;

        this.reactor = new Reactor();
        this.reactor.registerEvent(EVENT_NAME);

        traceListener = FunctionalInterface.create(EVENT_NAME, traceListener);
        this.addTraceListener(function(traceEvent) {
            traceListener.onMutation(traceEvent);
        });

    }

    /**
     * Add a listener for a specific object.
     */
    addTraceListener(traceListener) {
        // TODO: I do not think this supports adding a TraceListener object
        // and I think we will have to clean up our support for functional
        // interfaces here.  We're not using them consistently.
        this.reactor.addEventListener(EVENT_NAME, traceListener);
        return new TraceListenerExecutor(traceListener, this);
    }

    getTraceListeners() {
        return this.reactor.getEventListeners()
    }

    set(target, property, value, receiver) {

        let previousValue = target[property];

        let result = Reflect.set(...arguments);
        this.reactor.dispatchEvent(EVENT_NAME, new TraceEvent(this.path, MutationType.SET, target, property, value, previousValue));
        return result;
    }

    deleteProperty(target, property) {
        let previousValue = target[property];

        let result = Reflect.deleteProperty(...arguments);
        this.reactor.dispatchEvent(EVENT_NAME, new TraceEvent(this.path, MutationType.DELETE, target, property, undefined, previousValue));
        return result;
    }

};
