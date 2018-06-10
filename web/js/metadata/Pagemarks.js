const {Pagemark} = require("./Pagemark");
const {PagemarkType} = require("./PagemarkType");
const {ISODateTime} = require("./ISODateTime");
const {Objects} = require("../util/Objects");

class Pagemarks {

    static create(options) {

        options = Objects.defaults( {

            // just set docMeta pageMarkType = PagemarkType.SINGLE_COLUMN by
            // default for now until we add multiple column types and handle
            // them properly.

            type: PagemarkType.SINGLE_COLUMN,

            percentage: 100,

            column: 0

        });

        return new Pagemark({

            created: new ISODateTime(new Date()),

            type: options.type,
            percentage: options.percentage,
            column: options.column

        });

    }


}

module.exports.Pagemarks = Pagemarks;
