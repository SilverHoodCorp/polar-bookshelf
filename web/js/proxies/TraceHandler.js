module.exports.TraceHandler = class {

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
