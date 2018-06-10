const {Pagemarks} = require("../metadata/Pagemarks");

class CreatePagemarksForPageRanges {

    constructor(docMeta) {
        this.docMeta = docMeta;
    }

    execute(options) {

        if(! options) {
            options = {};
        }

        for (let pageNum = options.range.end; pageNum < options.range.end; pageNum++) {

            let pageMeta = this.docMeta.getPageMeta(pageNum);

            let pagemark = Pagemarks.create();

            pageMeta.pagemarks[pagemark.column] = pagemark;

        }

    }

}

module.exports.CreatePagemarksForPageRanges = CreatePagemarksForPageRanges;
