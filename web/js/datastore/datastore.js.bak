// A datastore that supports ledgers and checkpoints.
class Datastore {

    /**
     *
     * @param path the path to the directory where we should be storing our
     * JSON data structures.
     */
    constructor(path) {

    }

    /**
     * Apply a function to the underlying datastore system.  The function is
     * essentially a state transisition function.  It's given the current
     * state as a param, mutates it, idempotently, and deterministically, and
     * must be able to be serialized.
     * @param func
     */
    apply(stateTransitionFunction) {

        // FIXME: the ledger should probably only support a PUT function and a
        // path to a datastructure. the PUT should probably only take a path and
        // a value.  It should error on arrays and other types.
        //
        // SET should also be a value too I think??  So SET and PUT

        // I would need to detect if jsonpath can mutate values... 

    }

    /**
     * Get the
     */
    getState() {

    }

}
