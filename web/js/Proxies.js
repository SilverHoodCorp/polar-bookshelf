/**
 * Framework to create listeners to watch changes in dictionaries.  We can
 * change these into observables if we want by making them streams of SET and
 * DELETE operations but since we're not really using RxJS or anything of the
 * sort yet our options are open.
 */
export class Proxies {

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
     * @param onSet
     * @param onDelete
     */
    static createProxy(target) {
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
    forMutations(onMutation) {
        return new Proxy(this.target, new MutationHandler(onMutation));
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

export const MutationType {

    SET = 0;
    DELETE = 1;

}

/**
 *
 */
class MutationHandler {

    constructor(onMutation) {
        this.onMutation = onMutation;
    }

    set(target, property, value, receiver) {
        return this.onMutation(MutationType.SET, target, property, value);
    }

    deleteProperty(target, property) {
        return this.onMutation(MutationType.DELETE, target, property, undefined);
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
    onMutation(mutationType, target, property, value);

}