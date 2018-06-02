/**
 * Apply a given function, with arguments, to a list of delegates which have
 * that function name defined.
 */
class Delegator {

    constructor(delegates) {
        this.delegates = delegates;
    }

    /**
     * Apply the given function to all the delegates.
     */
    apply(functionName) {

        var args = Array.from(arguments);
        args.splice(0,1);

        this.delegates.forEach(function (delegate) {
            var func = delegate[functionName];
            func.apply(delegate, args);
        });
    }

}
