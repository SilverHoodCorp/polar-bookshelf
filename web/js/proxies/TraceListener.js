
/**
 * Like a mutation listener, but we also include a 'path' to the object that represents the target that is being
 * mutated.  This way we proxy deep objects, replacing their objects with proxies if necessary.
 *
 * @constructor
 */
module.exports.TraceListener = class {

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
    onMutation(path, mutationType, target, property, value) {

    }

};
