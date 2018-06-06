const {BaseTest} = require("./BaseTest");

module.exports.MyTest = class extends BaseTest {

    constructor() {
        super();
        console.log("hello world");
    }

};
