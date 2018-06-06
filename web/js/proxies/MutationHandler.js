const {MutationType} = require("./MutationType");

/**
 *
 */
module.exports.MutationHandler = class {

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
