const {FunctionalInterface} = require("../util/FunctionalInterface");
const {TraceEvent} = require("./TraceEvent");
const {MutationType} = require("./MutationType");

module.exports.TraceListenerExecutor = class {

    /**
     * @param traceListener The specific traceListener we're working with.
     * @param traceHandler The TraceHandler that this traceListener is registered with.
     */
    constructor(traceListener, traceHandler) {
        this.traceListener = traceListener;
        this.traceHandler = traceHandler;
    }

    /**
     * Fire the initial values on this object.
     */
    fireInitial() {

        // FIXME: this should not be onMutation because teh initial value isn't a mutation.

        let path = this.traceHandler.path;
        let target = this.traceHandler.target;

        let traceListener = FunctionalInterface.create("onMutation", this.traceListener);

        for (let key in target) {

            if (target.hasOwnProperty(key)) {
                let val = target[key];
                traceListener.onMutation(new TraceEvent(path, MutationType.INITIAL, target, key, val));
            }

        }

    }

};
