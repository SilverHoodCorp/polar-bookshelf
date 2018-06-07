var assert = require('assert');

const {Arrays} = require("./Arrays");
const {assertJSON} = require("../test/Assertions");

// const {DocMeta} = require("../../metadata/DocMeta");
// const {DocMetas} = require("../../metadata/DocMetas");
// const {TextHighlightView} = require("./TextHighlightView");
// const {Proxies} = require("../../proxies/Proxies");

describe('Arrays', function() {

    describe('toDict', function() {

        it("basic", function () {
            assertJSON(Arrays.toDict(["hello"]), { '0': 'hello' })
        });

        it("already a dict", function () {
            let expected = {
                "hello": "world"
            };
            assertJSON({hello: "world"}, expected)
        });

    });

});
