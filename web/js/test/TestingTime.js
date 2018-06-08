
const tk = require('timekeeper');
const time = new Date(1330688329321);

class TestingTime {

    static freeze() {

        // freeze time for testing...
        tk.freeze(time);
    }

}

module.exports.TestingTime = TestingTime;

module.exports.freeze = function() {
    TestingTime.freeze();
};
