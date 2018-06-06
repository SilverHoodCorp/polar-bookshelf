/**
 * Build a listener
 */
const {TraceHandler} = require("./TraceHandler");
const {MutationHandler} = require("./MutationHandler");
const {ObjectPaths} = require("./ObjectPaths");

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

    /**
     *
     */
    trace(traceListener, options) {

        if(!options) {
            options = {};
        }

        if(!options.path) {
            options.path = "/";
        }

        return new Proxy(this.target, new TraceHandler(options.path, traceListener));

    }

    static _traceObject(path, value, traceListener) {

        return new Proxy(value, new TraceHandler(path, traceListener));

    }

    deepTrace(traceListener) {

        let objectPaths = ObjectPaths.recurse(this.target);

        let root = null;

        objectPaths.forEach(function (objectPathEntry) {

            let proxy = ProxyBuilder._traceObject(objectPathEntry.path, objectPathEntry.value, traceListener);

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
