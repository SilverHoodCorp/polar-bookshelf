
const {Proxies} = require("./proxies/Proxies");
const {Pagemark} = require("./metadata/Pagemark");
const {PagemarkType} = require("./metadata/PagemarkType");
const {DocMeta} = require("./metadata/DocMeta");
const {DocMetas} = require("./metadata/DocMetas");
const {DocMetaDescriber} = require("./metadata/DocMetaDescriber");
const {Reactor} = require("./reactor/Reactor");
const {Event} = require("./reactor/Event");

module.exports.Model = class {

    constructor(persistenceLayer, clock) {

        this.persistenceLayer = persistenceLayer;
        this.clock = clock;

        this.reactor = new Reactor();
        this.reactor.registerEvent('documentLoaded');
        this.reactor.registerEvent('createPagemark');
        this.reactor.registerEvent('erasePagemark');

        // The currently loaded document.
        this.docMetaPromise = null;

        // FIXME: this.docMeta should go away in favor of docMetaPromise
        this.docMeta = null;

    }

    /**
     * Called when a new document has been loaded.
     */
    async documentLoaded(fingerprint, nrPages, currentPageNumber) {

        // docMetaPromise is used for future readers after the document is loaded
        this.docMetaPromise = this.persistenceLayer.getDocMeta(fingerprint);

        this.docMeta = await this.docMetaPromise;

        if(this.docMeta == null) {

            // this is a new document...
            //this.docMeta = DocMeta.createWithinInitialPagemarks(fingerprint, nrPages);
            this.docMeta = DocMetas.create(fingerprint, nrPages);
            this.persistenceLayer.sync(fingerprint, this.docMeta);

            // I'm not sure this is the best way to resolve this as swapping in
            // the docMetaPromise without any synchronization seems like we're
            // asking for a rae condition.

        }

        this.docMeta = Proxies.create(this.docMeta).deepTrace(function () {

            // right now we just sync the datastore on mutation.  We do not
            // attempt to use a journal yet.

            console.log("sync of persistence layer via deep trace... ");
            this.persistenceLayer.sync(this.docMeta.docInfo.fingerprint, this.docMeta);

            return true;

        }.bind(this));

        this.docMetaPromise = new Promise(function (resolve, reject) {
            // always provide this promise for the metadata.  For NEW documents
            // we have to provide the promise but we ALSO have to provide it
            // to swap out the docMeta with the right version.
            resolve(this.docMeta);
        }.bind(this));

        let documentLoadedEvent = {fingerprint, nrPages, currentPageNumber, docMeta: this.docMeta};
        this.reactor.dispatchEvent('documentLoaded', documentLoadedEvent);

        return this.docMeta;

    }

    registerListenerForDocumentLoaded(eventListener) {
        this.reactor.addEventListener('documentLoaded', eventListener);
    }

    /**
     *
     * @param pageNum The page num to use for our created pagemark.
     */
    async createPagemark(pageNum, options) {

        if(!options) {
            options = {};
        }

        if(!options.percentage) {
            options.percentage = 100;
        }

        console.log("Model sees createPagemark");

        this.assertPageNum(pageNum);

        // FIXME: determine the type and the column

        // FIXME: just set docMeta pageMarkType = PagemarkType.SINGLE_COLUMN by default.

        let pagemark = new Pagemark({
            created: this.clock.getDate(),
            type: PagemarkType.SINGLE_COLUMN,
            percentage: options.percentage,
            column: 0
        });

        let docMeta = await this.docMetaPromise;

        let pageMeta = docMeta.getPageMeta(pageNum);

        // set the pagemark that we just created into the map
        pageMeta.pagemarks[pagemark.column] = pagemark;

        // TODO: this can be done with a mutation listener in the future
        this.reactor.dispatchEvent('createPagemark', {pageNum, pagemark});

        console.log("Performing sync of content into disk persistenceLayer.");
        console.log("DocMeta described as: " + DocMetaDescriber.describe(docMeta));

        // TODO: consider only marking the page read once the persistenceLayer has
        // been written or some sort of UI update that the data is persisted.
        //this.persistenceLayer.sync(this.docMeta.docInfo.fingerprint, docMeta);

    }

    erasePagemark(pageNum) {

        console.log("Model sees erasePagemark");

        this.assertPageNum(pageNum);

        let pageMeta = this.docMeta.getPageMeta(pageNum);

        pageMeta.pagemarks = {};

        // FIXME: this can be done with a mutation listener...
        this.reactor.dispatchEvent('erasePagemark', {pageNum});

        // TODO: consider only marking the page read once the persistenceLayer has
        // been written or some sort of UI update that the data is persisted.
        //this.persistenceLayer.sync(this.docMeta.docInfo.fingerprint, this.docMeta);

    }

    createTextHighlight() {

    }

    /**
     *
     * @param pageNum
     */
    async pageLoaded(pageNum) {

        let docMeta = await this.docMetaPromise;
        let pageMeta = this.docMeta.getPageMeta(pageNum);

        forDict(pageMeta.pagemarks, function (pagemarkId, pagemark) {

            // FIXME: this is wrong and we should fire with the right
            // pagemark type.

            // FIXME: this IS working but the document isn't finished
            // loading yet.  We can SEE that a new document was loaded
            // but not that it was finished loading...

            console.log("Dispatching event to create pagemark for page: " + pageNum);

            this.reactor.dispatchEvent('createPagemark', {pageNum});

        }.bind(this));

    }

    assertPageNum(pageNum) {

        if(pageNum == null)
            throw new Error("Must specify page pageNum");

        if(pageNum <= 0) {
            throw new Error("Page numbers begin at 1");
        }

    }

    registerListenerForCreatePagemark(eventListener) {
        this.reactor.addEventListener('createPagemark', eventListener);
    }

    registerListenerForErasePagemark(eventListener) {
        this.reactor.addEventListener('erasePagemark', eventListener);
    }

}

// TODO: move this to a util library


// TODO: move this to a util library

// TODO: move this to a util library

/**
 * Given an integer, compute the first N pages..
 */
function computeRangeBuffer(initial, offset, min, max) {
    var start = Math.max(min, initial - offset);
    var end = Math.min(max, initial + offset);
    return {start, end};
}

