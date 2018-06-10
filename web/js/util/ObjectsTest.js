const {Objects} = require("./Objects");
const {assertJSON} = require("../test/Assertions");

describe('Objects', function() {

    describe('defaults', function () {

        it("with no current", function () {

            let value = Objects.defaults(null, {hello: "world"});

            assertJSON(value, {hello: "world"});

        });

        it("with no value", function () {

            let value = Objects.defaults({}, {hello: "world"});

            assertJSON(value, {hello: "world"});

        });

        it("with existing", function () {

            let value = Objects.defaults({ hello: "buddy"}, {hello: "world"});

            assertJSON(value, {hello: "buddy"});

        });

    });


    describe('clear', function () {

        it("clear dictionary", function () {

            let myDict = {
                hello: "world"
            };

            Objects.clear(myDict);

            assertJSON(myDict, {});

        });

        it("clear array", function () {

            let myArr = [
                "world"
            ];

            Objects.clear(myArr);

            assertJSON(myArr, []);

        });

    });

});
