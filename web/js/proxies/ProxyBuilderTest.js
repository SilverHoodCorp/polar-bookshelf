var assert = require('assert');

const {Proxies} = require("./Proxies");
const {assertJSON} = require("../test/Assertions");

class MyTraceListener {

    constructor() {
        this.mutations = [];
    }

    onTrace(path, mutationType, target, property, value) {
        // in practice we would write this to a journaled log file.
        this.mutations.push({path, mutationType, target, property, value});
        return true;
    }

}

describe('ProxyBuilder', function() {

    describe('tracing', function() {

        it("deep tracing", function () {

            let myDict = {'foo': 'bar'};

            let myTraceListener = new MyTraceListener();

            myDict = Proxies.create(myDict).deepTrace(myTraceListener);

            myDict.foo = 'frog';

            let expected = [
                {
                    "path": "/",
                    "mutationType": "SET",
                    "target": {
                        "foo": "bar"
                    },
                    "property": "foo",
                    "value": "frog"
                }
            ];

            assertJSON(myTraceListener.mutations, expected);

        });

        it("deep tracing with nested path", function () {

            let myDict = {
                foo: 'bar',
                cat: {
                    name: "leo"
                }
            };

            let myTraceListener = new MyTraceListener();

            myDict = Proxies.create(myDict).deepTrace(myTraceListener);

            myDict.cat.name = "monster";

            let expected = [
                {
                    "path": "/cat",
                    "mutationType": "SET",
                    "target": {
                        "name": "leo"
                    },
                    "property": "name",
                    "value": "monster"
                }
            ];

            assertJSON(myTraceListener.mutations, expected);

        });


    });

});
