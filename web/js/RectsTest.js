var assert = require('assert');

const {Rects} = require("./Rects");
const {assertJSON} = require("./test/Assertions");

describe('Rects', function() {

    describe('scale', function() {

        it("basic scale", function () {

            let rect = {
                top: 100,
                left: 100,
                bottom: 200,
                right: 200,
                width: 100,
                height: 100,
            };

            let actual = Rects.scale(rect, 2.0);
            let expected = {
                "top": 200,
                "left": 200,
                "bottom": 400,
                "right": 400,
                "width": 200,
                "height": 200
            };

            assertJSON(actual, expected);

        });


    });

});
