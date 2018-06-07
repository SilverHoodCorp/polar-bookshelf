var assert = require('assert');

const {Proxies} = require("./Proxies");
const {assertJSON} = require("../test/Assertions");
const {Symbol} = require("../metadata/Symbol");

class MyMutationListener {

    constructor() {
        this.mutations = [];
    }

    onMutation(mutationType, target, property, value) {
        // in practice we would write this to a journaled log file.
        this.mutations.push({mutationType, target, property, value});
        return true;
    }

}

describe('Proxies', function() {

    describe('listenForEvents', function() {

        it("test set", function () {
            let myDict = {'foo': 'bar'};

            let myMutationListener = new MyMutationListener();

            myDict = Proxies.create(myDict).forMutations(myMutationListener);

            myDict.animal = 'frog';

            assertJSON(myMutationListener.mutations, [
                {
                    "mutationType": "SET",
                    "target": {
                        "foo": "bar"
                    },
                    "property": "animal",
                    "value": "frog"
                }
            ]);

        });

        it("test delete", function () {
            let myDict = {'foo': 'bar'};

            let myMutationListener = new MyMutationListener();

            myDict = Proxies.create(myDict).forMutations(myMutationListener);

            delete myDict.foo;

            assertJSON(myMutationListener.mutations, [
                {
                    "mutationType": "DELETE",
                    "target": {
                        "foo": "bar"
                    },
                    "property": "foo"
                }
            ]);

        });


    });

    describe('deepTrace', function() {

        it("test with object.Freeze", function () {

            let TYPE = Object.freeze({
                MAMMAL: new Symbol("MAMMAL"),
                MARSUPIAL: new Symbol("MARSUPIAL")
            });

            let myDict = {
                cat: {
                    type: TYPE.MAMMAL
                },
                dog: {
                    type: TYPE.MAMMAL
                },
            };

            let mutations = [];

            myDict = Proxies.create(myDict).deepTrace(function (traceEvent) {
                mutations.push(traceEvent);
            });

            delete myDict.foo;

            let expected = [
                {
                    "path": "/",
                    "mutationType": "DELETE",
                    "target": {
                        "cat": {
                            "type": "MAMMAL"
                        },
                        "dog": {
                            "type": "MAMMAL"
                        }
                    },
                    "property": "foo"
                }
            ];

            assertJSON(mutations, expected);

        });

    });

});
