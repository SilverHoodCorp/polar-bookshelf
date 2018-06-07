
const {forDict} = require("../utils.js");

module.exports.DocMetaDescriber = class {

    static describe(docMeta) {

        let nrPagemarks = 0;
        let nrTextHighlights = 0;

        forDict(docMeta.pageMetas, function (key, pageMeta) {

            forDict(pageMeta.pagemarks, function (id, pagemark) {
                ++nrPagemarks;
            }.bind(this));

            forDict(pageMeta.textHighlights, function (id, textHighlight) {
                ++nrTextHighlights;
            }.bind(this));

        }.bind(this));

        return `PDF with ${docMeta.docInfo.nrPages} pages with ${nrTextHighlights} text highlights and ${nrPagemarks} pagemarks.`

    }

};

