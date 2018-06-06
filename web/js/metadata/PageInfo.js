const {SerializedObject} = require("./SerializedObject.js");

module.exports.PageInfo = class extends SerializedObject {

    constructor(val) {

        super(val);

        /**
         * The page number of this page.
         *
         * @type number.
         */
        this.num = null;

        this.init(val);

    }

    validate() {
        this.validateMembers([
            {name: 'num', type: "number"}
        ]);
    }

}
