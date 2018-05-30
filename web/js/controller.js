
class Controller {

    constructor(datastore, model) {
        this.datastore = datastore;
        this.model = model;
    }

    /**
     * Called when a new document has been loaded.
     */
    onDocumentLoaded(fingerprint, nrPages) {

        this.model.documentLoaded(fingerprint, nrPages);

    }

    /**
     * Mark the given page number as read.
     */
    createPagemark(num) {
        console.log("Controller sees pagemark created: " + num);
        this.model.createPagemark(num);
    }

    /**
     * Mark the given page number as read.
     */
    erasePagemark(num) {
        console.log("Controller sees pagemark erased: " + num);
        this.model.erasePagemark(num);
    }

}

// controller for the web UI to update the model

class WebController extends Controller {

    constructor(datastore, model) {
        super(datastore, model);

        this.datastore = datastore;

        /**
         * The document fingerprint that we have loaded to detect when the
         * documents have changed.  Note that this isn't a secure fingerprint
         * so we might want to change it in the future.
         *
         * @type string
         */
        this.docFingerprint = null;

    }

    startListeners() {
        this.listenForDocumentFingerprint();
        this.listenForKeyBindings();

        console.log("Controller listeners registered.");
    }

    listenForDocumentFingerprint() {

        // viewerContainer -> viewer

        // TODO: I don't think we can listen to the PDFViewerApplication
        // lifecycle properly but I might be wrong so in the fugure we should
        // clean this up.

        viewer.addEventListener('DOMNodeInserted', this.onViewerElementInserted.bind(this), false );

    }

    onViewerElementInserted() {

        if (window.PDFViewerApplication &&
            window.PDFViewerApplication.pdfDocument &&
            window.PDFViewerApplication.pdfDocument.pdfInfo &&
            window.PDFViewerApplication.pdfDocument.pdfInfo.fingerprint != this.docFingerprint) {

            let newDocumentFingerprint = window.PDFViewerApplication.pdfDocument.pdfInfo.fingerprint;
            let nrPages = window.PDFViewerApplication.pagesCount;

            this.onNewDocumentFingerprint(newDocumentFingerprint, nrPages);

        }

    }

    onNewDocumentFingerprint(newDocumentFingerprint, nrPages) {

        console.log(`Detected new document fingerprint (fingerprint=${newDocumentFingerprint}, nrPages=${nrPages})`);

        this.docFingerprint = newDocumentFingerprint;

        this.onDocumentLoaded(newDocumentFingerprint, nrPages);

    }

    getCurrentPageElement() {

        // TODO: It is probably easier to use pdf.pageNum but I'm not sure if this
        // is actively updated or not.
        let pages = document.querySelectorAll(".page");

        let result = { element: null, visibility: 0};

        pages.forEach(function (page) {
            let visibility = this.calculateVisibilityForDiv(page);

            if ( visibility > result.visibility) {
                result.element = page;
                result.visibility = visibility;
            }

        }.bind(this));

        return result.element;

    }

    calculateVisibilityForDiv(div) {

        if(div == null)
            throw Error("Not given a div");

        var windowHeight = $(window).height(),
            docScroll = $(document).scrollTop(),
            divPosition = $(div).offset().top,
            divHeight = $(div).height();

        var hiddenBefore = docScroll - divPosition,
            hiddenAfter = (divPosition + divHeight) - (docScroll + windowHeight);

        if ((docScroll > divPosition + divHeight) || (divPosition > docScroll + windowHeight)) {
            return 0;
        } else {
            var result = 100;

            if (hiddenBefore > 0) {
                result -= (hiddenBefore * 100) / divHeight;
            }

            if (hiddenAfter > 0) {
                result -= (hiddenAfter * 100) / divHeight;
            }

            return result;
        }

    }

    getPageNum(pageElement) {

        var pageElement = this.getCurrentPageElement();

        let dataPageNum = pageElement.getAttribute("data-page-number");

        return parseInt(dataPageNum);

    }

    // FIXME: remake this binding to CreatePagemarkEntirePage
    keyBindingPagemarkEntirePage(event) {

        console.log("Marking entire page as read.");

        var pageElement = this.getCurrentPageElement();
        var pageNum = this.getPageNum(pageElement);

        this.createPagemark(pageNum);

    }

    keyBindingPagemarkUpToMouse(event) {
        console.log("Marking page as read up to mouse point");
    }

    keyBindingErasePagemark(event) {
        console.log("Erasing pagemark.");
        var pageElement = this.getCurrentPageElement();
        let pageNum = this.getPageNum(pageElement);
        this.erasePagemark(pageNum);
    }

    keyBindingListener(event) {

        if (event.ctrlKey && event.altKey) {

            const eCode = 69;

            const mCode = 77;
            const nCode = 78;

            switch (event.which) {

                case eCode:
                    this.keyBindingErasePagemark(event);
                    break;

                case mCode:
                    this.keyBindingPagemarkUpToMouse(event);
                    break;

                case nCode:
                    this.keyBindingPagemarkEntirePage(event);
                    break;

                default:
                    break;

            }

        }

    }

    listenForKeyBindings() {

        if(polar.state.listenForKeyBindings) {
            return;
        }

        document.addEventListener("keyup", this.keyBindingListener.bind(this));

        polar.state.listenForKeyBindings = true;

        console.log("Key bindings registered");

    }

}
