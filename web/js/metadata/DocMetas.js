const {Pagemark} = require("./Pagemark");
const {DocMeta} = require("./DocMeta");
const {DocInfo} = require("./DocInfo");
const {PageInfo} = require("./PageInfo");
const {PageMeta} = require("./PageMeta");
const {PagemarkType} = require("./PagemarkType");
const {ISODateTime} = require("./ISODateTime");

module.exports.DocMetas = class {

    /**
     * Create the basic DocInfo structure that we can use with required / basic
     * field structure.
     * @param nrPages The number of pages in this document.
     * @returns {DocMeta}
     */
    static create(fingerprint, nrPages) {

        let docInfo = new DocInfo({fingerprint, nrPages});

        let pageMetas = {};

        for(let idx = 1; idx <= nrPages; ++idx) {
            let pageInfo = new PageInfo({num: idx});
            let pageMeta = new PageMeta({pageInfo: pageInfo});
            pageMetas[idx] = pageMeta;
        }

        return new DocMeta({docInfo, pageMetas});

    }

    /**
     * Create a DocMeta object but place initial pagemarks on it. This is useful
     * for testing.
     */
    static createWithinInitialPagemarks(fingerprint, nrPages) {

        let result = this.create(fingerprint, nrPages);

        let maxPages = 3;
        for(let pageNum = 1; pageNum <= Math.min(nrPages, maxPages); ++pageNum ) {

            let pagemark = new Pagemark({
                // TODO: this shouldn't have a hard wired date here but we don't
                // have a dependency injector yet.
                created: new ISODateTime(new Date()),
                type: PagemarkType.SINGLE_COLUMN,
                percentage: 100,
                column: 0
            });

            let pageMeta = result.getPageMeta(pageNum);

            // set the pagemark that we just created.
            pageMeta.pagemarks[pagemark.column] = pagemark;

        }

        return result;

    }

    /**
     */
    static addPagemarks(docMeta, options) {

        if (!options) {
            options = {};
        }

        if (!options.nrPages) {
            options.nrPages = 3;
        }

        if (!options.offsetPage) {
            // the starting page
            options.offsetPage = 1;
        }

        if (!options.percentage) {
            // the percentage value from 0-100
            options.percentage = 100;
        }

        let maxPageNum = Math.min(options.offsetPage + options.nrPages -1, docMeta.docInfo.nrPages);

        for(let pageNum = options.offsetPage; pageNum <= maxPageNum; ++pageNum ) {

            let pagemark = new Pagemark({
                // TODO: this shouldn't have a hard wired date here but we don't
                // have a dependency injector yet.
                created: new ISODateTime(new Date()),
                type: PagemarkType.SINGLE_COLUMN,
                percentage: options.percentage,
                column: 0
            });

            let pageMeta = docMeta.getPageMeta(pageNum);

            // set the pagemark that we just created.
            pageMeta.pagemarks[pagemark.column] = pagemark;

        }

    }

}
