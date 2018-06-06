
const {Pagemark} = require("./metadata/Pagemark");
const {PagemarkType} = require("./metadata/PagemarkType");
const {DocMeta} = require("./metadata/DocMeta");
const {DocMetas} = require("./metadata/DocMetas");

module.exports.Model = class {

    constructor(datastore, clock) {

        this.datastore = datastore;
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

        console.log("model: New document loaded!");

        // docMetaPromise is used for future readers after the document is loaded
        this.docMetaPromise = this.datastore.getDocMeta(fingerprint);

        this.docMeta = await this.docMetaPromise;

        if(this.docMeta == null) {
            // this is a new document...
            //this.docMeta = DocMeta.createWithinInitialPagemarks(fingerprint, nrPages);
            this.docMeta = DocMetas.create(fingerprint, nrPages);
            this.datastore.sync(fingerprint, this.docMeta);
        }

        this.reactor.dispatchEvent('documentLoaded', {fingerprint, nrPages, currentPageNumber});

        return this.docMeta;

    }

    // FIXME: remiove this:
    computeInitialPagemarkPageNumbers(docMeta, nrPages, currentPageNumber) {

        var result = [];

        var range = computeRangeBuffer(currentPageNumber, 3, 1, nrPages);

        for(var pageNum = range.start; pageNum <= range.end; ++pageNum) {

            var pageMeta = docMeta.pageMetas[pageNum];

            forDict(pageMeta.pagemarks, function (pagemarkId, pagemark) {
                result.push(pageNum);
            });

        }

        return result;

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

        let pageMeta = this.docMeta.getPageMeta(pageNum);

        // set the pagemark that we just created.
        pageMeta.pagemarks[pagemark.column] = pagemark;

        // FIXME: this can be done with a mutation listener...
        this.reactor.dispatchEvent('createPagemark', {pageNum, pagemark});

        // FIXME: we need a fingerprint in the docInfo too.

        // TODO: consider only marking the page read once the datastore has
        //        been written.
        this.datastore.sync(this.docMeta.docInfo.fingerprint, this.docMeta);

    }

    erasePagemark(pageNum) {

        console.log("Model sees erasePagemark");

        this.assertPageNum(pageNum);

        let pageMeta = this.docMeta.getPageMeta(pageNum);

        pageMeta.pagemarks = {};

        // FIXME: this can be done with a mutation listener...
        this.reactor.dispatchEvent('erasePagemark', {pageNum});

        // TODO: consider only marking the page read once the datastore has
        //        been written.
        this.datastore.sync(this.docMeta.docInfo.fingerprint, this.docMeta);

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

// https://stackoverflow.com/questions/15308371/custom-events-model-without-using-dom-events-in-javascript

// TODO: move this to a util library

class Event {

    constructor(name) {
        this.name = name;
        this.callbacks = [];
    }

    registerCallback(callback){
        this.callbacks.push(callback);
    }

}

// TODO: move this to a util library

class Reactor {

    constructor() {
        this.events = {};
    }

    registerEvent(eventName){
        var event = new Event(eventName);
        this.events[eventName] = event;
    }

    dispatchEvent(eventName, eventArgs){
        this.events[eventName].callbacks.forEach(function(callback){
            callback(eventArgs);
        });
    }

    addEventListener(eventName, callback){
        this.events[eventName].registerCallback(callback);
    }

}

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

