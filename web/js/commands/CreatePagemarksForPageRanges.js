

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


        }

    }

}

module.exports.CreatePagemarksForPageRanges = CreatePagemarksForPageRanges;
