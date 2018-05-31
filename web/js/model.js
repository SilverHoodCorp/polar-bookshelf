class Model {

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

        console.log("New document loaded!");

        // docMetaPromise is used for future readers after the document is loaded
        this.docMetaPromise = this.datastore.getDocMeta(fingerprint);

        this.docMeta = await this.docMetaPromise;

        if(this.docMeta == null) {
            // this is a new document...
            this.docMeta = DocMeta.create(fingerprint, nrPages);
            this.datastore.sync(fingerprint, this.docMeta);
        }

        this.reactor.dispatchEvent('documentLoaded', {fingerprint, nrPages, currentPageNumber});

        // // fire events for the first N pages since we don't properly receive
        // // events for them for some reason.
        //
        // // FIXME: break this out in a testable function...
        // //
        // // var pageStart = Math.min(1, currentPageNumber);
        // // var pageEnd = pageStart + 3;
        // // for(var pageNum = pageStart; pageNum < pageEnd; ++pageNum) {
        // //
        // //     console.log("Potential initial page load for page: " + pageNum);
        // //
        // //     var pageMeta = this.docMeta.pageMetas[pageNum];
        // //
        // //     forDict(pageMeta.pagemarks, function (pagemarkId, pagemark) {
        // //
        // //         console.log("Triggered initial page load for page: " + pageNum);
        // //
        // //         this.reactor.dispatchEvent('createPagemark', {num: pageNum});
        // //
        // //     }.bind(this));
        // //
        // // }
        //
        // // // go through all the pagemarks and other annotations fire the events
        // // // necessary for them so that the view can update...
        // forDict(this.docMeta.pageMetas, function (pageNum, pageMeta) {
        //     this.pageLoaded(pageNum);
        // }.bind(this));

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
     * @param num The page num to use for our created pagemark.
     */
    async createPagemark(num) {

        console.log("Model sees createPagemark");

        this.assertPageNum(num);

        // FIXME: this can be done with a mutation listener...
        this.reactor.dispatchEvent('createPagemark', {num});

        // FIXME: determine the type and the column

        // FIXME: just set docMeta pageMarkType = PagemarkType.SINGLE_COLUMN by default.

        let pagemark = new Pagemark({
            created: this.clock.getDate(),
            type: PagemarkType.SINGLE_COLUMN,
            percentage: 100,
            column: 0
        });

        let docMeta = await this.docMetaPromise;

        let pageMeta = this.docMeta.getPageMeta(num);

        // set the pagemark that we just created.
        pageMeta.pagemarks[pagemark.column] = pagemark;

        // FIXME: we need a fingerprint in the docInfo too.

        // TODO: consider only marking the page read once the datastore has
        //        been written.
        this.datastore.sync(this.docMeta.docInfo.fingerprint, this.docMeta);

    }

    erasePagemark(num) {

        console.log("Model sees erasePagemark");

        this.assertPageNum(num);

        // FIXME: this can be done with a mutation listener...
        this.reactor.dispatchEvent('erasePagemark', {num});

        let pageMeta = this.docMeta.getPageMeta(num);

        pageMeta.pagemarks = {};

        // FIXME: we need a fingerprint in the docInfo too.

        // TODO: consider only marking the page read once the datastore has
        //        been written.
        this.datastore.sync(this.docMeta.docInfo.fingerprint, this.docMeta);

    }

    /**
     *
     * @param num
     */
    async pageLoaded(num) {

        let docMeta = await this.docMetaPromise;
        let pageMeta = this.docMeta.getPageMeta(num);

        forDict(pageMeta.pagemarks, function (pagemarkId, pagemark) {

            // FIXME: this is wrong and we should fire with the right
            // pagemark type.

            // FIXME: this IS working but the document isn't finished
            // loading yet.  We can SEE that a new document was loaded
            // but not that it was finished loading...

            console.log("Dispatching event to create pagemark for page: " + num);

            this.reactor.dispatchEvent('createPagemark', {num});

        }.bind(this));

    }

    assertPageNum(num) {

        if(num == null)
            throw new Error("Must specify page num");

        if(num <= 0) {
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

class Event {

    constructor(name) {
        this.name = name;
        this.callbacks = [];
    }

    registerCallback(callback){
        this.callbacks.push(callback);
    }

}

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

function forDict(dict, callback) {
    Object.keys(dict).forEach(function (key) {
        let value = dict[key];
        callback(key,value);
    })
}

/**
 * Given an integer, compute the first N pages..
 */
function computeRangeBuffer(initial, offset, min, max) {
    var start = Math.max(min, initial - offset);
    var end = Math.min(max, initial + offset);
    return {start, end};
}

