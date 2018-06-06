const {SerializedObject} = require("./SerializedObject.js");
const {PageInfo} = require("./PageInfo");

module.exports.PageMeta = class extends SerializedObject {

    constructor(val) {

        super(val);

        /**
         * The pageInfo for this page.
         */
        this.pageInfo = null;

        /**
         * The index of page number to pagemark which stores the data we need
         * for keeping track of pagemarks.  The index is the pagemark column.
         *
         * @type map<int,pagemark>.
         */
        this.pagemarks = {};

        this.init(val);

    }

    validate() {
        this.validateMembers([
            {name: 'pageInfo', instance: PageInfo}
        ]);
    }

}
