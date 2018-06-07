const {Event} = require("./Event");

module.exports.Reactor = class {

    constructor() {
        this.events = {};
    }

    registerEvent(eventName){
        let event = new Event(eventName);
        this.events[eventName] = event;
    }

    dispatchEvent(eventName, eventArgs){
        this.events[eventName].callbacks.forEach(function(callback){
            callback(eventArgs);
        });
    }

    addEventListener(eventName, callback){
        if(typeof callback !== "function") {
            throw new Error("Callback is not a function: " + typeof callback);
        }

        this.events[eventName].registerCallback(callback);
    }

};
