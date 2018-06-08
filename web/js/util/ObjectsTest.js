const {Objects} = require("./Objects");
const {assertJSON} = require("../test/Assertions");

describe('Objects', function() {

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
