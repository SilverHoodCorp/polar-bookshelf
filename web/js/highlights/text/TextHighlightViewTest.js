var assert = require('assert');

const {DocMeta} = require("../metadata/DocMeta");
const {DocMetas} = require("../metadata/DocMetas");
const {Proxies} = require("./Proxies");
const {assertJSON} = require("../test/Assertions");
const {TextHighlightView} = require("./TextHighlightView");

describe('TextHighlightView', function() {

    describe('listen for new highlights', function() {

        it("basic highlight", function () {

            let docMeta = DocMetas.createWithinInitialPagemarks(fingerprint, 14);
            DocMetas.addPagemarks(docMeta, {nrPages: 1, offsetPage: 4, percentage: 50})

            let textHighlightView = new TextHighlightView();

        });

    });

});
