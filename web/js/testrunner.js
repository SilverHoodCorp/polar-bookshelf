// all our unit tests...

var assert = chai.assert;
var expect = chai.expect;

chai.config.truncateThreshold = 0;
chai.use(chaiDiff);

// stable reference date for all tests.
var date = new Date(Date.parse("2018-05-30T02:47:44.411Z"));


describe('Testing computeRectsForContiguousHighlightRegion.', function() {

    it('Test with no entries', function () {
        assert.deepEqual(TextHighlightMarkers.computeContiguousRects([]), []);
    });

    it('Test with one entry', function () {

        var boundingClientRects = [
            {top: 10, left: 10, bottom: 50, right: 50}
        ];

        var expected = [ { top: 10, left: 10, bottom: 50, right: 50, width: 40, height: 40 } ];

        assert.deepEqual(TextHighlightMarkers.computeContiguousRects(boundingClientRects), expected);
    });

    it('Test with two entries', function () {

        var boundingClientRects = [
            {top: 10, left: 10, bottom: 20, right: 50},
            {top: 50, left: 10, bottom: 70, right: 50}
        ];

        var expected = [
            { left: 10, top: 10, right: 50, bottom: 50, width: 40, height: 40 },
            { left: 10, top: 50, right: 50, bottom: 70, width: 40, height: 20 }
        ];

        assert.deepEqual(TextHighlightMarkers.computeContiguousRects(boundingClientRects), expected);
    });

});

describe('Testing createSiblingTupples.', function() {

    it('Test with no entries', function() {

        assert.deepEqual( createSiblingTuples([]), []);

    });

    it('Test with 1 entry', function() {

        assert.deepEqual( createSiblingTuples([1]), [ { curr: 1, prev: null, next: null } ]);

    });

    it('Test with 2 entries', function() {

        assert.deepEqual( createSiblingTuples([1,2]),
                          [
                              { curr: 1, prev: null, next: 2 },
                              { curr: 2, prev: 1, next: null }
                          ]);

    });

    it('Test with 3 entries', function() {

        assert.deepEqual( createSiblingTuples([1,2,3]),
            [
                { curr: 1, prev: null, next: 2 },
                { curr: 2, prev: 1, next: 3 },
                { curr: 3, prev: 2, next: null }
            ]);

    });

    it('Test with 4 entries', function() {

        assert.deepEqual( createSiblingTuples([1,2,3,4]),
            [
                { curr: 1, prev: null, next: 2 },
                { curr: 2, prev: 1, next: 3 },
                { curr: 3, prev: 2, next: 4 },
                { curr: 4, prev: 3, next: null }
            ]);

    });


});

describe('Testing bounding client rect utils.', function() {

    it('Test with one element', function() {

        var boundingClientRects = [
            {top: 10, left: 10, bottom: 50, right: 50}
        ];

        var cbr = getBoundingClientRectFromBCRs(boundingClientRects);

        assert.deepEqual(cbr, { left: 10, top: 10, bottom: 50, right: 50 });

    });

    it('Test with four elements', function() {

        var boundingClientRects = [
            {top: 10, left: 10, bottom: 50, right: 50},
            {top: 20, left: 5,  bottom: 50, right: 50},
            {top: 30, left: 10, bottom: 55, right: 50},
            {top: 40, left: 10, bottom: 50, right: 55}
        ];

        var cbr = getBoundingClientRectFromBCRs(boundingClientRects);

        assert.deepEqual(cbr, { left: 5, top: 10, bottom: 55, right: 55 });

    });

});


describe('Testing Delegates', function() {

    it('Test basic functionality', function() {

        class MyDelegate {

            constructor() {
                this.testArg0 = null;
                this.testArg1 = null;
            }

            testFunction(testArg0, testArg1) {
                this.testArg0 = testArg0;
                this.testArg1 = testArg1;
            }

        }

        var delegate0 = new MyDelegate();
        var delegate1 = new MyDelegate();

        var delegator = new Delegator([delegate0, delegate1]);

        delegator.apply("testFunction", "hello", "world");

        assert.equal(delegate0.testArg0, "hello");
        assert.equal(delegate0.testArg1, "world");

        assert.equal(delegate1.testArg0, "hello");
        assert.equal(delegate1.testArg1, "world");

    });

});

describe('Testing progress computation', function() {

    it('Compute basic progress', function() {

        let docMeta = DocMeta.createWithinInitialPagemarks("0x0000", 10);

        let webView = new WebView();
        let progress = webView.computeProgress(docMeta);

        assert.equal(progress, 0.3);

    });

    it('Compute basic progress at 100 percent', function() {

        let docMeta = DocMeta.createWithinInitialPagemarks("0x0000", 3);

        let webView = new WebView();
        let progress = webView.computeProgress(docMeta);

        assert.equal(progress, 1.0);

    });

});

describe('testing docMeta creation', function() {

    it('Create basic docMeta objects', function() {

        let docInfo = new DocInfo({nrPages: 10, fingerprint: '0xdecafbad'});

        expect(docInfo.nrPages).to.equal(10);

        let docMeta = new DocMeta({docInfo});

        let serialized = MetadataSerializer.serialize(docMeta, "");

        expect(serialized).to.equal("{\"docInfo\":{\"title\":null,\"url\":null,\"nrPages\":10,\"fingerprint\":\"0xdecafbad\"},\"pageMetas\":{},\"version\":1}");

    });

    it('Create basic docMeta objects with pages', function() {

        let docInfo = new DocInfo({nrPages: 1, fingerprint: '0xdecafbad'});

        expect(docInfo.nrPages).to.equal(1);

        let pageInfo = new PageInfo({num: 1});
        let pageMeta = new PageMeta({pageInfo: pageInfo});

        let docMeta = new DocMeta({docInfo, pageMetas: { 1: pageMeta }});

        let serialized = MetadataSerializer.serialize(docMeta, "");

        expect(serialized).to.equal("{\"docInfo\":{\"title\":null,\"url\":null,\"nrPages\":1,\"fingerprint\":\"0xdecafbad\"},\"pageMetas\":{\"1\":{\"pageInfo\":{\"num\":1},\"pagemarks\":{}}},\"version\":1}");

    });

    it('Create basic DocMeta.create', function() {

        let fingerprint = "0xdecafbad";

        let docMeta = DocMeta.create(fingerprint, 2);

        assertJSON(docMeta, "{\n" +
                            "  \"docInfo\": {\n" +
                            "    \"title\": null,\n" +
                            "    \"url\": null,\n" +
                            "    \"nrPages\": 2,\n" +
                            "    \"fingerprint\": \"0xdecafbad\"\n" +
                            "  },\n" +
                            "  \"pageMetas\": {\n" +
                            "    \"1\": {\n" +
                            "      \"pageInfo\": {\n" +
                            "        \"num\": 1\n" +
                            "      },\n" +
                            "      \"pagemarks\": {}\n" +
                            "    },\n" +
                            "    \"2\": {\n" +
                            "      \"pageInfo\": {\n" +
                            "        \"num\": 2\n" +
                            "      },\n" +
                            "      \"pagemarks\": {}\n" +
                            "    }\n" +
                            "  },\n" +
                            "  \"version\": 1\n" +
                            "}");


    });

});

describe('testing metadata', function() {

    it('Test ISO8601 date/time serialization and deserialization', function() {

        expect(new ISODateTime(date).toJSON()).to.equal("2018-05-30T02:47:44.411Z");

    });

    it('Note serialization', function() {

        expect(JSON.stringify(new Note(
            {
                text: new Text("hello"),
                created: new ISODateTime(date)
            })))
            .to.equal(`{"text":{"body":"","type":"MARKDOWN"},"created":"2018-05-30T02:47:44.411Z"}`);

        let note = MetadataSerializer.deserialize(new Note(), `{"text":"hello","created":"2018-05-30T02:47:44.411Z"}`);

        expect(note).to.deep.equal({ text: 'hello', created: '2018-05-30T02:47:44.411Z' });

    });

});

describe('testing pagemarks', function() {

    it('Test basic pagemark creation', function() {

        var pagemark = new Pagemark(
            {
                created: new ISODateTime(date)
            });

        //expect(pagemark).to.deep.equal({});


        let serialized = MetadataSerializer.serialize(pagemark, "");
        console.log(serialized);
        // FIXME: figure out how to make this multiple lines so that it's readable
        // as a test.
        expect(serialized).to.equal("{\"created\":\"2018-05-30T02:47:44.411Z\",\"lastUpdated\":\"2018-05-30T02:47:44.411Z\",\"note\":{\"text\":\"\",\"created\":\"2018-05-30T02:47:44.411Z\"},\"type\":\"SINGLE_COLUMN\",\"percentage\":100,\"column\":0}");

    });

});



describe('testing dataserialization', function() {

    it('Test basic serialization ... both ways.', function() {
        let fingerprint = "0xdecafbad";

        let docMeta = DocMeta.create(fingerprint, 2);

        let serialized = MetadataSerializer.serialize(docMeta, "  ");

        assertJSON(serialized, "{\n" +
                               "  \"docInfo\": {\n" +
                               "    \"title\": null,\n" +
                               "    \"url\": null,\n" +
                               "    \"nrPages\": 2,\n" +
                               "    \"fingerprint\": \"0xdecafbad\"\n" +
                               "  },\n" +
                               "  \"pageMetas\": {\n" +
                               "    \"1\": {\n" +
                               "      \"pageInfo\": {\n" +
                               "        \"num\": 1\n" +
                               "      },\n" +
                               "      \"pagemarks\": {}\n" +
                               "    },\n" +
                               "    \"2\": {\n" +
                               "      \"pageInfo\": {\n" +
                               "        \"num\": 2\n" +
                               "      },\n" +
                               "      \"pagemarks\": {}\n" +
                               "    }\n" +
                               "  },\n" +
                               "  \"version\": 1\n" +
                               "}");

        let docMetaDeserialized = MetadataSerializer.deserialize(new DocMeta(), serialized);

        expect(docMetaDeserialized).to.deep.equal(docMeta);


    });

});

describe('testing model interaction', function() {

    class MockView extends View {

        constructor(model) {
            super(model);

            this.pagemarks = [];

            this.model.registerListenerForCreatePagemark(function (pagemark) {
                this.pagemarks.push(pagemark);
            }.bind(this));

        }

    }

    it('Test basic model support.', async function() {

        var clock = new SyntheticClock();
        var datastore = new MemoryDatastore();
        var model = new Model(datastore, clock);
        var view = new MockView(model);

        let fingerprint = "fake-fingerprint";

        var docMeta = await model.documentLoaded(fingerprint, 1);

        assert.isNotNull(docMeta);

        assertJSON(docMeta, "{\n" +
                            "  \"docInfo\": {\n" +
                            "    \"title\": null,\n" +
                            "    \"url\": null,\n" +
                            "    \"nrPages\": 1,\n" +
                            "    \"fingerprint\": \"fake-fingerprint\"\n" +
                            "  },\n" +
                            "  \"pageMetas\": {\n" +
                            "    \"1\": {\n" +
                            "      \"pageInfo\": {\n" +
                            "        \"num\": 1\n" +
                            "      },\n" +
                            "      \"pagemarks\": {}\n" +
                            "    }\n" +
                            "  },\n" +
                            "  \"version\": 1\n" +
                            "}");

        assert.isNotNull(docMeta.pageMetas);

        assert.isNotNull(docMeta.pageMetas[1]);

        await model.createPagemark(1);

        // TODO: test failure around marking the wrong pages.

        // verify that we have a pagemark now...
        docMeta = await datastore.getDocMeta(fingerprint);

        assertJSON(docMeta, "{\n" +
                            "  \"docInfo\": {\n" +
                            "    \"title\": null,\n" +
                            "    \"url\": null,\n" +
                            "    \"nrPages\": 1,\n" +
                            "    \"fingerprint\": \"fake-fingerprint\"\n" +
                            "  },\n" +
                            "  \"pageMetas\": {\n" +
                            "    \"1\": {\n" +
                            "      \"pageInfo\": {\n" +
                            "        \"num\": 1\n" +
                            "      },\n" +
                            "      \"pagemarks\": {\n" +
                            "        \"0\": {\n" +
                            "          \"created\": \"2018-05-30T02:47:44.411Z\",\n" +
                            "          \"lastUpdated\": \"2018-05-30T02:47:44.411Z\",\n" +
                            "          \"type\": \"SINGLE_COLUMN\",\n" +
                            "          \"percentage\": 100,\n" +
                            "          \"column\": 0,\n" +
                            "          \"note\": {\n" +
                            "            \"text\": \"\",\n" +
                            "            \"created\": \"2018-05-30T02:47:44.411Z\"\n" +
                            "          }\n" +
                            "        }\n" +
                            "      }\n" +
                            "    }\n" +
                            "  },\n" +
                            "  \"version\": 1\n" +
                            "}");

        model.erasePagemark(1);

        // TODO: test failure around marking the wrong pages.

        // verify that we have a pagemark now...
        docMeta = await datastore.getDocMeta(fingerprint);

        assertJSON(docMeta, "{\n" +
                            "  \"docInfo\": {\n" +
                            "    \"title\": null,\n" +
                            "    \"url\": null,\n" +
                            "    \"nrPages\": 1,\n" +
                            "    \"fingerprint\": \"fake-fingerprint\"\n" +
                            "  },\n" +
                            "  \"pageMetas\": {\n" +
                            "    \"1\": {\n" +
                            "      \"pageInfo\": {\n" +
                            "        \"num\": 1\n" +
                            "      },\n" +
                            "      \"pagemarks\": {}\n" +
                            "    }\n" +
                            "  },\n" +
                            "  \"version\": 1\n" +
                            "}");


    });

    it('Test existing pagemark event firing in view.',async function() {

        class MockView extends View {

            constructor(model) {
                super(model);

                this.pagemarks = [];

                this.model.registerListenerForCreatePagemark(function (pagemarkEvent) {
                    if( ! pagemarkEvent.num){
                        throw new Error("No pagemark number");
                    }

                    this.pagemarks.push(pagemarkEvent);
                }.bind(this));

            }

        }

        var clock = new SyntheticClock();
        var datastore = new MemoryDatastore();
        var model = new Model(datastore, clock);
        var view = new MockView(model);

        let fingerprint = "fake-fingerprint";

        var docMeta = await model.documentLoaded(fingerprint, 1);
        assert.equal(view.pagemarks.length, 0);

        await model.createPagemark(1);

        assert.equal(view.pagemarks.length, 1);

        // now reload the model to trigger more pagemarks
        docMeta = await model.documentLoaded(fingerprint, 1);
        await model.pageLoaded(1);

        assert.equal(view.pagemarks.length, 2);

    });


    // it('Test compute initial .', async function() {
    //
    //     var clock = new SyntheticClock();
    //     var datastore = new MemoryDatastore();
    //     var model = new Model(datastore, clock);
    //     var view = new MockView(model);
    //
    //     let fingerprint = "fake-fingerprint";
    //
    //     var docMeta = await model.documentLoaded(fingerprint, 1);
    //
    //     assert.equal(model.computeInitialPagemarkPageNumbers(docMeta, 1), []);
    //
    // });

    it('Test computing the range buffers.', async function() {

        assert.deepEqual(computeRangeBuffer(1, 3, 1, 10), { start: 1, end: 4 });
        assert.deepEqual(computeRangeBuffer(1, 3, 1, 3), { start: 1, end: 3 });
        assert.deepEqual(computeRangeBuffer(3, 3, 1, 10), { start: 1, end: 6 });

    });


});

function assertJSON(actual,expected) {

    // first convert both to JSON if necessary.
    actual = toJSON(actual);
    expected = toJSON(expected);

    if ( actual !== expected) {
        console.log(actual);
    }

    //assert.equal(actual,expected);

    expect(expected).not.differentFrom(actual);

}

function toJSON(obj) {

    if(typeof obj === "string") {
        return obj;
    }

    return JSON.stringify(obj, null, "  ");

}
