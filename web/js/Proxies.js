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
