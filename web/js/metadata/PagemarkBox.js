/**
 *
 *
 */
module.exports.PagemarkBox = class {

    constructor(start, end) {

        /**
         * The row range that this pagemark represents.
         *
         * @type {PagemarkRange}
         */
        this.rows = null;

        /**
         * The column range that this pagemark represents.
         *
         * @type {PagemarkRange}
         */
        this.columns = null;

    }

};
