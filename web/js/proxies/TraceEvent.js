/**
 * Listen to a mutation and we're given a list of names and types.
 */
module.exports.TraceEvent = class  {

    /**
     *
     * @param path The path in the object tree of the object being mutated.
     * @param mutationType The type of the mutation.
     * @param target The object being mutated.
     * @param property The name of the field in the object.
     * @param value The new value of the field or undefined if it's a delete operation.
     * @return True if the mutation should continue.
     */
    constructor(path, mutationType, target, property, value) {
        this.path = path;
        this.mutationType = mutationType;
        this.target = target;
        this.property = property;
        this.value = value;
    }

};
