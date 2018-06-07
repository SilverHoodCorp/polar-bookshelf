/**
 * Build a listener
 */
const {TraceHandler} = require("./TraceHandler");
const {MutationHandler} = require("./MutationHandler");
const {ObjectPaths} = require("./ObjectPaths");

/**
 * A sequence identifier generator so that we can assign objects a unique value.
 */
var sequence = 0;

class ProxyBuilder {

    constructor(target) {
        this.target = target;
    }

    /**
     * Listen to just a specific property.  This could be done with Observer filters in the future.
     */
    forProperty(name) {

    }

    /**
     * Listen to the stream of mutations and receive callbacks which you can handle directly.
     * @param onMutation
     */
    forMutations(mutationListener) {
        return new Proxy(this.target, new MutationHandler(mutationListener));
    }

    static trace(path, value, traceListener) {

        let traceHandler = new TraceHandler(path, traceListener);

        if(!value.__traceIdentifier) {
            Object.defineProperty(value, "__traceIdentifier", {
                value: sequence++,
                enumerable: false,
                writable: false
            });
            }

        if(!value.__traceListener) {

            // keep the traceListener registers with the object so that I can
            // verify that the object we're working with is actually being used
            // with the same trace and not being re-traced by something else.

            Object.defineProperty(value, "__traceListener", {
                value: traceListener,
                enumerable: false,
                writable: false
            });

        }

        if(value.__traceListener && value.__traceListener !== traceListener) {
            throw new Error("Value being traced already by another trace listener.");
        }

        if(!value.addTraceListener) {
            Object.defineProperty(value, "addTraceListener", {
                value: traceHandler.addTraceListener.bind(traceHandler),
                enumerable: false,
                writable: false
            });
        }

        return new Proxy(value, traceHandler);

    }

    /**
     * Deeply trace the given object and call back on the traceListener every time
     * we notice a mutation.  The trace listener receives the following arguments:
     *
     *
     */
    deepTrace(traceListener) {

        let objectPathEntries = ObjectPaths.recurse(this.target);

        let root = null;

        objectPathEntries.forEach(function (objectPathEntry) {

            let proxy = ProxyBuilder.trace(objectPathEntry.path, objectPathEntry.value, traceListener);

            // replace the object key in the parent with a new object that is
            // traced.
            if(objectPathEntry.parent != null) {
                objectPathEntry.parent[objectPathEntry.parentKey] = proxy;
            } else {
                root = proxy;
            }

        });

        return root;

    }

    /**
     * Create a path from two strings
     */
    static path(s0, s1) {

    }

}

module.exports.ProxyBuilder = ProxyBuilder;
