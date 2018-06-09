var assert = require('assert');

const {TextHighlightModel} = require("./TestHighlightModel");
const {DocMetas} = require("../../../metadata/DocMetas");
const {TextHighlightRecords} = require("../../../metadata/TextHighlightRecords");
const {assertJSON} = require("../../../test/Assertions");
const {Proxies} = require("../../../proxies/Proxies");

require("../../../test/TestingTime").freeze();

describe('TextHighlightModel', function() {

    // https://stackoverflow.com/questions/8024149/is-it-possible-to-get-the-non-enumerable-inherited-property-names-of-an-object

    describe('Listen for new highlights', function() {

        it("Initial values", function () {

            let docMeta = createDocMeta();

            let textHighlightModel = new TextHighlightModel();

            let mutations = [];

            textHighlightModel.registerListener(docMeta, function (textHighlightEvent) {
                mutations.push(summarize(textHighlightEvent));
            } );

            let expected = [
                {
                    "pageNum": 1,
                    "textHighlight": {
                        "created": "2012-03-02T11:38:49.321Z",
                        "lastUpdated": "2012-03-02T11:38:49.321Z",
                        "rects": {
                            "0": {
                                "top": 100,
                                "left": 100,
                                "right": 200,
                                "bottom": 200,
                                "width": 100,
                                "height": 100
                            }
                        },
                        "textSelections": {
                            "0": "hello world"
                        },
                        "text": "hello world",
                        "notes": {},
                        "thumbnail": null
                    },
                    "mutationType": "INITIAL"
                }
            ];

            assertJSON(mutations, expected);

        });

        it("New text highlights on new pages", function () {

            let docMeta = createDocMeta();

            let textHighlightModel = new TextHighlightModel();

            let mutations = [];

            textHighlightModel.registerListener(docMeta, function (textHighlightEvent) {
                mutations.push(summarize(textHighlightEvent));
            } );

            mutations = [];

            let textHighlightRecord = createTextHighlightRecord();

            docMeta.getPageMeta(3).textHighlights[textHighlightRecord.id] = textHighlightRecord.value;

            let expected = [
                {
                    "pageNum": 3,
                    "textHighlight": {
                        "created": "2012-03-02T11:38:49.321Z",
                        "lastUpdated": "2012-03-02T11:38:49.321Z",
                        "rects": {
                            "0": {
                                "top": 100,
                                "left": 100,
                                "right": 200,
                                "bottom": 200,
                                "width": 100,
                                "height": 100
                            }
                        },
                        "textSelections": {
                            "0": "hello world"
                        },
                        "text": "hello world",
                        "notes": {},
                        "thumbnail": null
                    },
                    "mutationType": "SET"
                }
            ];

            assertJSON(mutations, expected);

        });

    });

});

function summarize(textHighlightEvent) {
    return {pageNum: textHighlightEvent.pageMeta.pageInfo.num, textHighlight: textHighlightEvent.textHighlight, mutationType: textHighlightEvent.mutationType};
}

function createDocMeta() {

    let fingerprint = "110dd61fd57444010b1ab5ff38782f0f";

    let docMeta = DocMetas.createWithinInitialPagemarks(fingerprint, 14);
    DocMetas.addPagemarks(docMeta, {nrPages: 1, offsetPage: 4, percentage: 50})

    // create some initial highlights.

    let textHighlightRecord = createTextHighlightRecord();

    docMeta.getPageMeta(1).textHighlights[textHighlightRecord.id] = textHighlightRecord.value;

    return Proxies.create(docMeta).deepTrace();

}

function createTextHighlightRecord() {

    let rects = [ {top: 100, left: 100, right: 200, bottom: 200, width: 100, height: 100}];
    let textSelections = ["hello world"];
    let text = "hello world";

    return TextHighlightRecords.create(rects, textSelections, text);

}
