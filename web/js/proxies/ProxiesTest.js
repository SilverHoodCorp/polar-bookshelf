var assert = require('assert');

const {Proxies} = require("./Proxies");
const {assertJSON} = require("../test/Assertions");

describe('Proxies', function() {

    describe('listenForEvents', function() {
        //
        // let myDict = {'foo': 'bar'};
        //
        // class MyListener {
        //
        //     constructor() {
        //         this.mutations = [];
        //     }
        //
        //     onMutation(mutationType, target, property, value) {
        //         // in practice we would write this to a journaled log file.
        //         this.mutations.push({mutationType, target, property, value});
        //         return true;
        //     }
        //
        // }
        //
        // var myListener = new MyListener();
        //
        // myDict = Proxies.create(myDict).forMutations(myListener);
        //
        // myDict.animal = 'frog';
        //
        // assertJSON(myListener.mutations, [
        //     {
        //         "mutationType": "SET",
        //         "target": {
        //             "foo": "bar"
        //         },
        //         "property": "animal",
        //         "value": "frog"
        //     }
        // ]);
        //
        // delete myDict.animal;
        //
        // class MyObject {
        //
        //     constructor() {
        //         this.animal = "lion";
        //     }
        //
        // }
        //
        // var myObject = new MyObject();
        // myObject = Proxies.create(myObject).forMutations(myListener);
        //
        // myObject.animal = 'frog';
        //
        // delete myObject.animal;

    });
});
