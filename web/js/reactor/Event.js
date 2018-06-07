
// https://stackoverflow.com/questions/15308371/custom-events-model-without-using-dom-events-in-javascript

// TODO: move this to a util library

module.exports.Event = class {

    constructor(name) {
        this.name = name;
        this.callbacks = [];
    }

    registerCallback(callback){
        this.callbacks.push(callback);
    }

};
