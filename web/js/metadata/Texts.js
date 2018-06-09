const {Text} = require("./Text.js");

module.exports.Texts = class {

    static create(body, type) {
        return new Text({body,type});
    }

};
