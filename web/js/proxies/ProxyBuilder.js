/**
 * Build a listener
 */
const {TraceHandler} = require("./TraceHandler");
const {MutationHandler} = require("./MutationHandler");

module.exports.ProxyBuilder = class  {

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

    deepTrace(traceListener, options) {

        if(!options) {
            options = {};
        }

        if(!options.path) {
            options.path = "/";
        }

        //FIXME:  go through each one of these and call deepTrace on each one...

        for (var key in this.target) {
            if (object.hasOwnProperty(key)) {

                var val = this.target[key];

                if (val && typeof val === "object") {
                    // FIXME: have change the this.target AND the path here..

                    let newPath = options.path + key;
                    this.target[key] = this.deepTrace(val, {});
                }

            }
        }
        return this.trace()

    }

    /**
     * Create a path from two strings
     */
    static path(s0, s1) {

    }

}
