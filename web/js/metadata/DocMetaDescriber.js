
const {forDict} = require("../utils.js");

module.exports.DocMetaDescriber = class {

    static describe(docMeta) {

        var nrPagemarks = 0;

        forDict(docMeta.pageMetas, function (key, pageMeta) {
            forDict(pageMeta.pagemarks, function (column, pagemark) {
                ++nrPagemarks;
            }.bind(this));

        }.bind(this));


        return `PDF with ${docMeta.docInfo.nrPages} pages and ${nrPagemarks} pagemarks.`
    }

}

