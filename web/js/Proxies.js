/**
 * Framework to create listeners to watch changes in dictionaries.  We can
 * change these into observables if we want by making them streams of SET and
 * DELETE operations but since we're not really using RxJS or anything of the
 * sort yet our options are open.
 */
export class Proxies {

    /**
     * Create a listener for the dictionary and call onSet and onDelete when
     * the dictionary has had keys set or deleted.
     *
     * @param target
     * @param onSet
     * @param onDelete
     */
    static createDictListener(target, onSet, onDelete) {
        return new Proxy(target, new ProxyHandler(onSet, onDelete));
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
