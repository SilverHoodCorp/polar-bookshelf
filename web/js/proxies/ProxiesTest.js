var assert = require('assert');

const {Proxies} = require("./Proxies");
const {assertJSON} = require("../test/Assertions");

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

        it("test with object.Freeze", function () {

            let myDict = Object.freeze({
                animal: "cat",
                types: {
                    SINGLE_COLUMN: "SINGLE_COLUMN",
                    DOUBLE_COLUMN: "DOUBLE_COLUMN"
                },
            });

            let myMutationListener = new MyMutationListener();

            myDict = Proxies.create(myDict).forMutations(myMutationListener);

            delete myDict.foo;

            let expected = [
                {
                    "mutationType": "DELETE",
                    "target": {
                        "animal": "cat",
                        "types": {
                            "SINGLE_COLUMN": "SINGLE_COLUMN",
                            "DOUBLE_COLUMN": "DOUBLE_COLUMN"
                        }
                    },
                    "property": "foo"
                }
            ];

            assertJSON(myMutationListener.mutations, expected);

        });

    });

});
