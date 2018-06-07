var assert = require('assert');

const {TextHighlight} = require("../../metadata/TextHighlight");
const {DocMeta} = require("../../metadata/DocMeta");
const {DocMetas} = require("../../metadata/DocMetas");
const {assertJSON} = require("../../test/Assertions");
const {TextHighlightView} = require("./TextHighlightView");
const {Proxies} = require("../../proxies/Proxies");

describe('TextHighlightView', function() {

    // https://stackoverflow.com/questions/8024149/is-it-possible-to-get-the-non-enumerable-inherited-property-names-of-an-object
    //
    // FIXME: teh bug is that : getOwnProperty returns addTraceListener..
    // I want to hide this to maybe add it to the Object prototype...

    describe('listen for new highlights', function() {

        it("basic highlight", function () {

            let fingerprint = "110dd61fd57444010b1ab5ff38782f0f";

            let docMeta = DocMetas.createWithinInitialPagemarks(fingerprint, 14);
            DocMetas.addPagemarks(docMeta, {nrPages: 1, offsetPage: 4, percentage: 50})

            // create some initial highlights.

            let pageMeta = docMeta.getPageMeta(1);

            // now create a TextHighlight for this page.

            new TextHighlight()

            docMeta = Proxies.create(docMeta).deepTrace(function () {
                return true;
            }.bind(this));

            let model = null;
            let textHighlightView = new TextHighlightView(model);

            textHighlightView.onDocumentLoaded({docMeta});

        });

    });

});
