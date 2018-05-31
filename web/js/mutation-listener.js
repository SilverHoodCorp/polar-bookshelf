
// basic framework on how to do a mutation listener.  We should return
// special with registerSetListener and registerDeleteListeners and then we
// can listen to these in the UI and also in the transaction log.

const handler1 = {

    set(obj, prop, value) {
        console.log("set prop: " + prop );
        return Reflect.set(...arguments);
    },

    deleteProperty(target, prop) {
        console.log("delete prop: " + prop );
        return Reflect.set(...arguments);
    }

};

var pagemarks =  new Proxy({}, handler1);
pagemarks['asdf']="bar";
delete pagemarks['asdf'];
