const {Pagemarks} = require("../metadata/Pagemarks");

class CreatePagemarksForPageRanges {

    constructor(docMeta) {
        this.docMeta = docMeta;
    }

    execute(options) {

        if(! options) {
            options = {};
        }

        for (let pageNum = options.range.start; pageNum < options.range.end; pageNum++) {

            console.log("Creating pagemark for page: " + pageNum);

            let pageMeta = this.docMeta.getPageMeta(pageNum);

            let pagemark = Pagemarks.create();

            pageMeta.pagemarks[pagemark.column] = pagemark;

        }

    }

}

module.exports.CreatePagemarksForPageRanges = CreatePagemarksForPageRanges;
