// all our unit tests...

var assert = chai.assert;
var expect = chai.expect;

chai.config.truncateThreshold = 0;

// stable reference date for all tests.
var date = new Date(Date.parse("2018-05-30T02:47:44.411Z"));


describe('testing core functions', function() {

    it('test assignOwnProperties', function() {

        class ParentObject {

            constructor() {
                this.foo = null;
            }

        }

        ParentObject.prototype.foo = null;

        class ChildObject extends ParentObject {

            constructor() {
                super();
                this.bar = null;
            }

        }

        let child = new ChildObject();

        child.foo = "foo";
        child.bar = "bar";

        expect(child.hasOwnProperty("foo")).to.equal(false);
        expect(child.hasOwnProperty("bar")).to.equal(true);


        let target = new ChildObject();

        assignOwnProperties(child, target);

        expect(target.foo).to.equal(null);
        expect(target.bar).to.equal("bar");

    });

});

//
//
// describe('testing metadata', function() {
//
//     it('Test ISO8601 date/time serialization and deserialization', function() {
//
//         expect(new ISODateTime(date).toJSON()).to.equal("2018-05-30T02:47:44.411Z");
//
//
//
//         //console.log("FIXME1: " + new ISODateTime(date).toJSON());
// //
// //         console.log("FIXME: ", JSON.stringify(new ISODateTime(date)));
// //
// //         console.log("FIXME: ", JSON.stringify(Note.create("hello", date)));
// //
// // // FIXME: how do we parse now...
// //         console.log("FIXME: ", JSON.stringify(Note.create("hello", date)));
//
//
//
//
//     });
//
//     it('Note serialization', function() {
//
//         expect(JSON.stringify(new Note(
//             {
//                 text: new Text("hello"),
//                 created: new ISODateTime(date)
//             })))
//             .to.equal(`{"text":{"body":"","type":"MARKDOWN"},"created":"2018-05-30T02:47:44.411Z"}`);
//
//         let note = deserialize(new Note(), `{"text":"hello","created":"2018-05-30T02:47:44.411Z"}`);
//
//         expect(note).to.deep.equal({ text: 'hello', created: '2018-05-30T02:47:44.411Z' });
//
//         //console.log("FIXME1: " + new ISODateTime(date).toJSON());
// //
// //         console.log("FIXME: ", JSON.stringify(new ISODateTime(date)));
// //
// //         console.log("FIXME: ", JSON.stringify(Note.create("hello", date)));
// //
// // // FIXME: how do we parse now...
// //         console.log("FIXME: ", JSON.stringify(Note.create("hello", date)));
//
//
//     });
//
// });
//
