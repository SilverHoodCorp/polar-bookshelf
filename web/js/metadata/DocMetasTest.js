var assert = require('assert');

const {DocMeta} = require("./DocMeta");
const {DocMetas} = require("./DocMetas");
const {PageMeta} = require("./PageMeta");

const {MetadataSerializer} = require("./MetadataSerializer");
const {assertJSON} = require("../test/Assertions");

describe('DocMetas', function() {

    describe('JSON', function() {

        it("Test basic JSON encoding and decoding", function () {

            let fingerprint = "0x001";

            let docMeta = DocMetas.createWithinInitialPagemarks(fingerprint, 14);
            DocMetas.addPagemarks(docMeta, {nrPages: 1, offsetPage: 4, percentage: 50})

            let json = MetadataSerializer.serialize(docMeta, "  ");

            let actual = MetadataSerializer.deserialize(new DocMeta(), json);

            assertJSON(docMeta, actual);

            assert.equal(actual.pageMetas[1] instanceof PageMeta, true);


        });

        it("Test with default values for serialized data", function () {

            let json = "{}";

            let actual = MetadataSerializer.deserialize(new PageMeta(), json);

            assert.equal(actual instanceof PageMeta, true);

            //assertJSON(actual, expected);

        });

    });

});
