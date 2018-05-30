class Model {

    constructor(datastore) {

        this.datastore = datastore;

        this.reactor = new Reactor();
        this.reactor.registerEvent('documentLoaded');
        this.reactor.registerEvent('markPageRead');

    }

    /**
     * Called when a new document has been loaded.
     */
    documentLoaded(fingerprint, nrPages) {

        // TODO: test this method.

        console.log("New document loaded!");

        let docMeta = DocMeta.create(nrPages);

        // TODO: track the fingerprint too?

        this.datastore.addDocMeta(fingerprint,docMeta);

        this.reactor.dispatchEvent('documentLoaded', {fingerprint, nrPages});

    }

    registerListenerForDocumentLoaded(eventListener) {
        this.reactor.addEventListener('documentLoaded', eventListener);
    }

    markPageRead(num) {
        this.reactor.dispatchEvent('markPageRead', {num});
    }

    registerListenerForMarkPageRead(eventListener) {
        this.reactor.addEventListener('markPageRead', eventListener);
    }

}

// https://stackoverflow.com/questions/15308371/custom-events-model-without-using-dom-events-in-javascript

class Event {

    constructor(name) {
        this.name = name;
        this.callbacks = [];
    }

    registerCallback(callback){
        this.callbacks.push(callback);
    }

}

class Reactor {

    constructor() {
        this.events = {};
    }

    registerEvent(eventName){
        var event = new Event(eventName);
        this.events[eventName] = event;
    }

    dispatchEvent(eventName, eventArgs){
        this.events[eventName].callbacks.forEach(function(callback){
            callback(eventArgs);
        });
    }

    addEventListener(eventName, callback){
        this.events[eventName].registerCallback(callback);
    }

}

