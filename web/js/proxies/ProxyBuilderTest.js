var assert = require('assert');

const {Proxies} = require("./Proxies");
const {assertJSON} = require("../test/Assertions");

class MyTraceListener {

    constructor() {
        this.mutations = [];
    }

    onMutation(traceEvent) {
        // in practice we would write this to a journaled log file.
        this.mutations.push(traceEvent);
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

        it("mutation of all fields", function () {

            let myDict = {
                foo: 'bar',
                cat: {
                    name: "leo"
                }
            };

            let myTraceListener = new MyTraceListener();

            myDict = Proxies.create(myDict).deepTrace(myTraceListener);

            myDict.foo="cat";
            myDict.cat.name = "monster";

            let expected = [
                {
                    "path": "/",
                    "mutationType": "SET",
                    "target": {
                        "foo": "bar",
                        "cat": {
                            "name": "leo"
                        }
                    },
                    "property": "foo",
                    "value": "cat"
                },
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

        it("as function", function () {

            let myDict = {'foo': 'bar'};

            let mutations = [];

            myDict = Proxies.create(myDict).deepTrace(function(traceEvent) {
                mutations.push(traceEvent);
            });

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

            assertJSON(mutations, expected);

        });

        it("as nested dictionaries", function () {

            let myDict = {
                'pages': {
                    1: {
                        marked: true
                    },
                    2: {
                        marked: false
                    },
                }
            };

            let mutations = [];

            myDict = Proxies.create(myDict).deepTrace(function(traceEvent) {
                mutations.push(traceEvent);
            });

            myDict.pages[1].marked=false;

            let expected = [
                {
                    "path": "/pages/1",
                    "mutationType": "SET",
                    "target": {
                        "marked": true
                    },
                    "property": "marked",
                    "value": false
                }
            ];

            // make a pattern of /pages/[int]/foo so that we can listen to the
            // stream of objects and then handle the right one.

            assertJSON(mutations, expected);

        });



        it("add listener to object", function () {

            let myDict = {
                "cat": "dog"
            };


            myDict = Proxies.create(myDict).deepTrace(function(traceEvent) {
                // noop
            });

            let mutations = [];

            myDict.addTraceListener(function (traceEvent) {
                mutations.push(traceEvent);
            });

            myDict["asdf"] = "bar";

            // make a pattern of /pages/[int]/foo so that we can listen to the
            // stream of objects and then handle the right one.

            let expected = [
                {
                    "path": "/",
                    "mutationType": "SET",
                    "target": {
                        "cat": "dog"
                    },
                    "property": "asdf",
                    "value": "bar"
                }
            ];

            assertJSON(mutations, expected);

        });


        it("fire initial values", function () {

            let myDict = {
                "cat": "dog"
            };

            let mutations = [];

            myDict = Proxies.create(myDict).deepTrace(function(traceEvent) {
                // noop
            });

            myDict.addTraceListener(function (traceEvent) {
                mutations.push(traceEvent);
            }).fireInitial();

            let expected = [
                {
                    "path": "/",
                    "mutationType": "INITIAL",
                    "target": {
                        "cat": "dog"
                    },
                    "property": "cat",
                    "value": "dog"
                }
            ];

            assertJSON(mutations, expected);

        });


    });

});
