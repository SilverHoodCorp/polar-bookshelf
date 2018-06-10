var assert = require('assert');

const {Paths} = require("./Paths");

describe('Paths', function() {

    describe('basename', function() {

        it("basic", function () {
            assert.equal(Paths.basename("asdf"), null);
        });

        it("basic", function () {
            assert.equal(Paths.basename("/files/0x000"), "0x000");
        });

    });

});
