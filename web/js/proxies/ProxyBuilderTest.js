var assert = require('assert');

const {Objects} = require("../utils");
const {Proxies} = require("./Proxies");
const {assertJSON} = require("../test/Assertions");

class MyTraceListener {

    constructor() {
        this.mutations = [];
    }

    onMutation(traceEvent) {
        // in practice we would write this to a journaled log file.
        this.mutations.push(Objects.duplicate(traceEvent));
        return true;
    }

}

describe('ProxyBuilder', function() {

    describe('traceListeners', function() {

        // unfortunately , there are 4 types we have to test
        //
        // the default (function or object)
        // additional (function or object).

        it("default as object", function () {

            let myDict = {
                cat: "leo"
            };

            let myTraceListener = new MyTraceListener();

            myDict = Proxies.create(myDict).deepTrace(myTraceListener);

            myDict.cat = "monster";

            let expected = [
                {
                    "path": "/",
                    "mutationType": "SET",
                    "target": {
                        "cat": "monster"
                    },
                    "property": "cat",
                    "value": "monster",
                    "previousValue": "leo"
                }
            ];

            assertJSON(myTraceListener.mutations, expected);

        })

        it("default as function", function () {

            let myDict = {
                cat: "leo"
            };

            let mutations = [];
            myDict = Proxies.create(myDict).deepTrace(function (traceEvent) {
                mutations.push(Objects.duplicate(traceEvent));
            });

            myDict.cat = "monster";

            let expected = [
                {
                    "path": "/",
                    "mutationType": "SET",
                    "target": {
                        "cat": "monster"
                    },
                    "property": "cat",
                    "value": "monster",
                    "previousValue": "leo"
                }
            ];

            assertJSON(mutations, expected);

        })


        it("addListener as object", function () {

            let myDict = {
                cat: "leo"
            };

            let myTraceListener = new MyTraceListener();

            myDict = Proxies.create(myDict).deepTrace(function () {

            });

            myDict.addTraceListener(myTraceListener);

            myDict.cat = "monster";

            let expected = [
                {
                    "path": "/",
                    "mutationType": "SET",
                    "target": {
                        "cat": "monster"
                    },
                    "property": "cat",
                    "value": "monster",
                    "previousValue": "leo"
                }
            ];

            assertJSON(myTraceListener.mutations, expected);

        })

        it("addListener as function", function () {

            let myDict = {
                cat: "leo"
            };

            myDict = Proxies.create(myDict).deepTrace(function () {

            });

            let mutations = [];

            myDict.addTraceListener(function (traceEvent) {
                mutations.push(Objects.duplicate(traceEvent));
            });

            myDict.cat = "monster";

            let expected = [
                {
                    "path": "/",
                    "mutationType": "SET",
                    "target": {
                        "cat": "monster"
                    },
                    "property": "cat",
                    "value": "monster",
                    "previousValue": "leo"
                }
            ];

            assertJSON(mutations, expected);

        })


    });

    describe('deepTrace', function() {

        // if we have a shared object reference, make sure we receive two events
        // for it, one at each path.
        it("shared object reference", function () {

            let address = {
                street: "101 Fake Street",
                city: "San Francisco",
                state: "California"
            };

            let myDict = {
                alice: {
                    address
                },
                bob: {
                    address
                }
            };

            let myTraceListener = new MyTraceListener();

            myDict = Proxies.create(myDict).deepTrace(myTraceListener);

            myDict.alice.address.city = "Oakland";

            assert.equal(myDict.alice.address.city, "Oakland");
            assert.equal(myDict.bob.address.city, "Oakland");

            // FIXME: this is broken.. we change the value in two places but only
            // fire one event listener.

            let expected = [

            ];

            assertJSON(myTraceListener.mutations, expected);

        });

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
                        "foo": "frog"
                    },
                    "property": "foo",
                    "value": "frog",
                    "previousValue": "bar"
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
                        "name": "monster"
                    },
                    "property": "name",
                    "value": "monster",
                    "previousValue": "leo"
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
                        "foo": "cat",
                        "cat": {
                            "name": "leo"
                        }
                    },
                    "property": "foo",
                    "value": "cat",
                    "previousValue": "bar"
                },
                {
                    "path": "/cat",
                    "mutationType": "SET",
                    "target": {
                        "name": "monster"
                    },
                    "property": "name",
                    "value": "monster",
                    "previousValue": "leo"
                }
            ];

            assertJSON(myTraceListener.mutations, expected);

        });

        it("as function", function () {

            let myDict = {'foo': 'bar'};

            let mutations = [];

            myDict = Proxies.create(myDict).deepTrace(function(traceEvent) {
                mutations.push(Objects.duplicate(traceEvent));
            });

            myDict.foo = 'frog';

            let expected = [
                {
                    "path": "/",
                    "mutationType": "SET",
                    "target": {
                        "foo": "frog"
                    },
                    "property": "foo",
                    "value": "frog",
                    "previousValue": "bar"
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
                mutations.push(Objects.duplicate(traceEvent));
            });

            myDict.pages[1].marked=false;

            let expected = [
                {
                    "path": "/pages/1",
                    "mutationType": "SET",
                    "target": {
                        "marked": false
                    },
                    "property": "marked",
                    "value": false,
                    "previousValue": true
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
                mutations.push(Objects.duplicate(traceEvent));
            });

            myDict["asdf"] = "bar";

            // make a pattern of /pages/[int]/foo so that we can listen to the
            // stream of objects and then handle the right one.

            let expected = [
                {
                    "path": "/",
                    "mutationType": "SET",
                    "target": {
                        "cat": "dog",
                        "asdf": "bar"
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

        it("delete value", function () {

            let myDict = {
                "cat": "dog"
            };

            let mutations = [];

            myDict = Proxies.create(myDict).deepTrace(function(traceEvent) {
                mutations.push(traceEvent);
            });

            delete myDict['cat'];

            let expected = [
                {
                    "path": "/",
                    "mutationType": "DELETE",
                    "target": {},
                    "property": "cat",
                    "previousValue": "dog"
                }
            ];

            assert.equal( mutations[0].value === undefined, true);
            assert.equal( "value" in mutations[0], true);

            assertJSON(mutations, expected);

        });

        it("make sure value actually replaced", function () {

            let myDict = {
                "cat": "leo"
            };

            myDict = Proxies.create(myDict).deepTrace(function(traceEvent) {
                return true;
            });

            myDict['cat']="monster";

            assert.equal( myDict['cat'], "monster");

        });

    });

    describe('mutations', function() {

        it("deep tracing", function () {

            let myDict = {
                "cat": "leo"
            };

            class MutationListener {

                onMutation(mutationType, target, property, value) {
                    return true;
                }

            }

            myDict = Proxies.create(myDict).forMutations(new MutationListener());

            myDict['cat']="monster";

            assert.equal( myDict['cat'], "monster");

            delete myDict['cat'];

            assert.equal( 'cat' in myDict, false);

        });

    });

});
