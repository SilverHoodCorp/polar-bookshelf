var {expect, assert} = require('chai');

const {ObjectPaths} = require("./ObjectPaths");
const {assertJSON} = require("../test/Assertions");

describe('Paths', function() {

    describe('basic tests', function() {

        it("basic paths", function () {

            let obj = {};

            let objectPaths = ObjectPaths.recurse(obj)

            let expected = [
                {
                    "path": "/",
                    "value": {}
                }
            ]

            assertJSON(objectPaths, expected);

        });

        it("basic paths with one non-object field", function () {

            let obj = {
                "cat": "dog"
            };

            let objectPaths = ObjectPaths.recurse(obj)

            let expected = [
                {
                    "path": "/",
                    "value": {
                        "cat": "dog"
                    }
                }
            ];

            assertJSON(objectPaths, expected);

        });


        it("basic paths with one object", function () {

            let obj = {
                "cat": {
                    "name": "leo"
                }
            };

            let objectPaths = ObjectPaths.recurse(obj)

            assert.equal(objectPaths.length, 2);

            assert.equal(objectPaths[0].path, "/");
            assert.equal(objectPaths[1].path, "/cat");

            //assertJSON(objectPaths, expected);

        });

        it("basic paths with complex paths", function () {

            let obj = {
                "cat": {
                    "name": "leo"
                },
                "dog": {
                    "name": "christopher",
                    "friend": {
                        "name": "kevin"
                    }
                }
            };

            let objectPaths = ObjectPaths.recurse(obj)

            assert.equal(objectPaths.length, 4);

            assert.equal(objectPaths[0].path, "/");
            assert.equal(objectPaths[1].path, "/cat");
            assert.equal(objectPaths[2].path, "/dog");
            assert.equal(objectPaths[3].path, "/dog/friend");

        });


    });

});
