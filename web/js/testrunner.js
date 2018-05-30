// all our unit tests...

var assert = chai.assert;
var expect = chai.expect;

chai.config.truncateThreshold = 0;

// stable reference date for all tests.
var date = new Date(Date.parse("2018-05-30T02:47:44.411Z"));

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
        expect(serialized).to.equal("{\"created\":\"2018-05-30T02:47:44.411Z\",\"lastUpdated\":\"2018-05-30T02:47:44.411Z\",\"note\":{\"text\":\"\",\"created\":\"2018-05-30T02:47:44.411Z\"},\"type\":\"SINGLE_COLUMN\",\"percentage\":100,\"column\":0}");

    });

});

