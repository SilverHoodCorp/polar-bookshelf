/**
 * Framework to create listeners to watch changes in dictionaries.  We can
 * change these into observables if we want by making them streams of SET and
 * DELETE operations but since we're not really using RxJS or anything of the
 * sort yet our options are open.
 */
export class Proxies {

    // FIXME:
    //
    // now I need a way to replace full object graphs with proxies so I can replace / setup mutation listeners on objects.
    //
    // I'm going to need to have ___path defined which we ignore in JSON serializers.

    // FIXME: it should be possible to listen to a specific property not just
    // all the properties...
    //
    // maybe soemthing like
    //
    // createDictListener().forProperty("asdf")
    //
    // also .asMutations() 
    // asListener(onSet,onDelete)

    /**
     * Create a listener for the dictionary and call onSet and onDelete when
     * the dictionary has had keys set or deleted.
     *
     * @param target
     * @return ProxyBuilder
     */
    static create(target) {

        if(typeof target !== "object") {
            throw new Error("Only works on objects");
        }

        //return new Proxy(target, new ProxyHandler(onSet, onDelete));
        return new ProxyBuilder(target);
    }

}

/**
 * Build a listener
 */
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
            options.path = ".";
        }

        return new Proxy(this.target, new TraceHandler(options.path, traceListener));

    }

    deepTrace(traceListener) {

        //FIXME:  go through each one of these and call deepTrace on each one...

        return trace()

    }

}

class ProxyHandler {

    constructor(onSet, onDelete) {
        this.onSet = onSet;
        this.onDelete = onDelete;
    }

    set(target, property, value, receiver) {
        this.onSet(property, value);
        return true;
    }

    deleteProperty(target, property) {
        this.onDelete(property);
        return true;
    }

}



/**
 * Delegate the onSet and onDelete methods
 */
class ProxyDelegate {

}

/**
 * Listen to changes across the entire object.
 */
class ObjectListener {

    constructor(onSet, onDelete) {
        this.onSet = onSet;
        this.onDelete = onDelete;
    }


}

export const MutationType = {

    SET: "SET",
    DELETE: "DELETE"

}

/**
 *
 */
class MutationHandler {

    constructor(mutationListener) {
        this.mutationListener = mutationListener;
    }

    set(target, property, value, receiver) {
        return this.mutationListener.onMutation(MutationType.SET, target, property, value);
    }

    deleteProperty(target, property) {
        return this.mutationListener.onMutation(MutationType.DELETE, target, property, undefined);
    }

}

class MutationListener {

    /**
     * Listen to a mutation and we're given a list of names and types.
     *
     * @param mutationType
     * @param target The object being mutated.
     * @param name The name of the field in the object.
     * @param value The new value of the field or undefined if it's a delete operation.
     * @return True if the mutation should continue.
     */
    onMutation(mutationType, target, property, value) {

    }

}

class TraceHandler {

    constructor(path, traceListener) {
        this.path = path;
        this.traceListener = traceListener;
    }

    set(target, property, value, receiver) {
        return this.traceListener.onTrace(this.path, MutationType.SET, target, property, value);
    }

    deleteProperty(target, property) {
        return this.traceListener.onTrace(this.path, MutationType.DELETE, target, property, undefined);
    }

}


/**
 * Like a mutation listener, but we also include a 'path' to the object that represents the target that is being
 * mutated.  This way we proxy deep objects, replacing their objects with proxies if necessary.
 *
 * @constructor
 */
function TraceListener {

    /**
     * Listen to a mutation and we're given a list of names and types.
     *
     * @param path The path in the object tree of the object being mutated.
     * @param mutationType
     * @param target The object being mutated.
     * @param name The name of the field in the object.
     * @param value The new value of the field or undefined if it's a delete operation.
     * @return True if the mutation should continue.
     */
    onTrace(path, mutationType, target, property, value) {

    }

}