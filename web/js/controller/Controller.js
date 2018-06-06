//import $ from 'jquery';

module.exports.Controller = class {

    constructor(model) {

        if(! model) {
            throw new Error("No model");
        }

        this.model = model;
    }

    /**
     * Called when a new document has been loaded.
     */
    onDocumentLoaded(fingerprint, nrPages, currentlySelectedPageNum) {

        this.model.documentLoaded(fingerprint, nrPages, currentlySelectedPageNum);

    }

    /**
     * Mark the given page number as read.
     */
    createPagemark(pageNum, options) {
        console.log("Controller sees pagemark created: " + pageNum);
        this.model.createPagemark(pageNum, options);
    }

    erasePagemarks(pageNum, options) {
        console.log("Controller sees pagemarks erased: " + pageNum);
        this.model.erasePagemark(pageNum, options);
    }

    /**
     * Mark the given page number as read.
     */
    erasePagemark(num) {
        console.log("Controller sees pagemark erased: " + num);
        this.model.erasePagemark(num);
    }

    getCurrentPageElement() {

    }

};
