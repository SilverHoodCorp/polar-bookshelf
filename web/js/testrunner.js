// all our unit tests...

var assert = chai.assert;
var expect = chai.expect;

chai.config.truncateThreshold = 0;

console.log("FIXME: diff" , chai.config.showDiff)

// stable reference date for all tests.
var date = new Date(Date.parse("2018-05-30T02:47:44.411Z"));


// FIXME: what I want in the diff formatter
//
// - print the expected and actual values on different lines.
// - colored diffs across multiple lines
// - diff objects, not just strings.

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

        let serialized = MetadataSerializer.serialize(docMeta, "");

        expect(serialized).to.equal("{\"docInfo\":{\"title\":null,\"url\":null,\"nrPages\":2,\"fingerprint\":\"0xdecafbad\"},\"pageMetas\":[{\"pageInfo\":{\"num\":1},\"pagemarks\":{}},{\"pageInfo\":{\"num\":2},\"pagemarks\":{}}],\"version\":1}");

    });


    // FIXME: test deserializing BROKEN json and validating the objects.

});

describe('testing metadata', function() {

    it('Test ISO8601 date/time serialization and deserialization', function() {

        expect(new ISODateTime(date).toJSON()).to.equal("2018-05-30T02:47:44.411Z");



        //console.log("FIXME1: " + new ISODateTime(date).toJSON());
//
//         console.log("FIXME: ", JSON.stringify(new ISODateTime(date)));
//
//         console.log("FIXME: ", JSON.stringify(Note.create("hello", date)));
//
// // FIXME: how do we parse now...
//         console.log("FIXME: ", JSON.stringify(Note.create("hello", date)));




    });

    it('Note serialization', function() {

        expect(JSON.stringify(new Note(
            {
                text: new Text("hello"),
                created: new ISODateTime(date)
            })))
            .to.equal(`{"text":{"body":"","type":"MARKDOWN"},"created":"2018-05-30T02:47:44.411Z"}`);

        let note = deserialize(new Note(), `{"text":"hello","created":"2018-05-30T02:47:44.411Z"}`);

        expect(note).to.deep.equal({ text: 'hello', created: '2018-05-30T02:47:44.411Z' });

        //console.log("FIXME1: " + new ISODateTime(date).toJSON());
//
//         console.log("FIXME: ", JSON.stringify(new ISODateTime(date)));
//
//         console.log("FIXME: ", JSON.stringify(Note.create("hello", date)));
//
// // FIXME: how do we parse now...
//         console.log("FIXME: ", JSON.stringify(Note.create("hello", date)));


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
