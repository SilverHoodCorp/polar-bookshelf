var assert = require('assert');

const {Hashcodes} = require("./Hashcodes");
const {assertJSON} = require("./test/Assertions");

describe('Hashcodes', function() {

    describe('create', function() {

        it("basic", function () {

            let hashcode = Hashcodes.create("asdf");

            assert.equal(hashcode, "1aibZzMnnHwqHd9cmMb2QrRdgyBj5ppNHgCTqxqggN8KRN4jtu");

        });


    });

});
