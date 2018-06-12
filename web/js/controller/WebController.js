const $ = require('jquery');
const jcm = require("jquery-contextmenu");

const {TextHighlightController} = require("../highlights/text/controller/TextHighlightController");
const {PagemarkCoverageEventListener} = require("../PagemarkCoverageEventListener.js");
const {KeyEvents} = require("../KeyEvents.js");
const {Preconditions} = require("../Preconditions.js");
const {Controller} = require("./Controller.js");
const {polar} = require("../polar");

module.exports.WebController = class extends Controller {

    constructor(model) {
        super(Preconditions.assertNotNull(model, "model"));

        /**
         * The document fingerprint that we have loaded to detect when the
         * documents have changed.  Note that this isn't a secure fingerprint
         * so we might want to change it in the future.
         *
         * @type string
         */
        this.docFingerprint = null;

    }


    start() {
        this.listenForDocumentLoad();
        this.listenForKeyBindings();
    }


    onDocumentLoaded(fingerprint, nrPages, currentlySelectedPageNum) {

        super.onDocumentLoaded(fingerprint, nrPages, currentlySelectedPageNum);
        this.setupContextMenu();

    }

    setupContextMenu() {

        console.log("Registered context listener...");

        $(function() {
            $.contextMenu({
                selector: '.page .textLayer',
                callback: function(key, options) {
                    let m = "clicked: " + key;
                    window.console && console.log(m) || alert(m);
                },
                items: {
                    //"new-pagemark": {name: "New pagemark", icon: "edit"},
                    "new-pagemark-from-here": {name: "New Pagemark Starting Here", icon: "edit"},
                    // "cut": {name: "Cut", icon: "cut"},
                    // copy: {name: "Copy", icon: "copy"},
                    // "paste": {name: "Paste", icon: "paste"},
                    // "delete": {name: "Delete", icon: "delete"},
                    // "sep1": "---------",
                    // "quit": {name: "Quit", icon: function() {
                    //         return 'context-menu-icon context-menu-icon-quit';
                    //     }
                    // }
                }
            });

            $('.page .textLayer').on('click', function(e){
                console.log('clicked', this);
            })
        });

    }

    listenForDocumentLoad() {

        let container = document.getElementById('viewerContainer');

        container.addEventListener('pagesinit', this.detectDocumentLoadedEventListener.bind(this));
        container.addEventListener('updateviewarea', this.detectDocumentLoadedEventListener.bind(this));

    }

    detectDocumentLoadedEventListener(event) {

        if (window.PDFViewerApplication &&
            window.PDFViewerApplication.pdfDocument &&
            window.PDFViewerApplication.pdfDocument.pdfInfo &&
            window.PDFViewerApplication.pdfDocument.pdfInfo.fingerprint != this.docFingerprint) {

            console.log("controller: New document loaded!")

            let newDocumentFingerprint = window.PDFViewerApplication.pdfDocument.pdfInfo.fingerprint;
            let nrPages = window.PDFViewerApplication.pagesCount;
            let currentPageNumber = window.PDFViewerApplication.pdfViewer.currentPageNumber;

            let pageElement = event.target.parentElement;
            let pageNum = this.getPageNum(pageElement);

            this.onNewDocumentFingerprint(newDocumentFingerprint, nrPages, currentPageNumber);

        }

    }

    onNewDocumentFingerprint(newDocumentFingerprint, nrPages, currentPageNumber) {

        console.log(`Detected new document fingerprint (fingerprint=${newDocumentFingerprint}, nrPages=${nrPages}, currentPageNumber=${currentPageNumber})`);

        this.docFingerprint = newDocumentFingerprint;

        this.onDocumentLoaded(newDocumentFingerprint, nrPages, currentPageNumber);

    }

    traceEventOnPage(event, eventName) {
        let pageElement = event.target.parentElement;
        let pageNum = this.getPageNum(pageElement);

        console.log(`Found event ${eventName} on page number ${pageNum}`);

    }

    onViewerElementInserted() {

        // FIXME: try to use window.PDFViewerApplication.eventBus with:
        //
        // documentload, pagerendered, textlayerrendered, pagechange, and pagesinit...

        if (window.PDFViewerApplication &&
            window.PDFViewerApplication.pdfDocument &&
            window.PDFViewerApplication.pdfDocument.pdfInfo &&
            window.PDFViewerApplication.pdfDocument.pdfInfo.fingerprint != this.docFingerprint) {

            let newDocumentFingerprint = window.PDFViewerApplication.pdfDocument.pdfInfo.fingerprint;
            let nrPages = window.PDFViewerApplication.pagesCount;

            let pages = document.querySelectorAll("#viewer .page");

            // FIXME:: I need to find the current selected page
            let currentPageNumber = window.PDFViewerApplication.pdfViewer.currentPageNumber;

            if (pages.length === nrPages) {
                this.onNewDocumentFingerprint(newDocumentFingerprint, nrPages, currentPageNumber);
            }

        }

    }

    // FIXME: move to using PDFRenderer for this functionality.
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

    // TODO: refactor use Elements.calculateVisibilityForDiv
    calculateVisibilityForDiv(div) {

        if(div == null)
            throw Error("Not given a div");

        let windowHeight = $(window).height(),
            docScroll = $(document).scrollTop(),
            divPosition = $(div).offset().top,
            divHeight = $(div).height();

        let hiddenBefore = docScroll - divPosition,
            hiddenAfter = (divPosition + divHeight) - (docScroll + windowHeight);

        if ((docScroll > divPosition + divHeight) || (divPosition > docScroll + windowHeight)) {
            return 0;
        } else {
            let result = 100;

            if (hiddenBefore > 0) {
                result -= (hiddenBefore * 100) / divHeight;
            }

            if (hiddenAfter > 0) {
                result -= (hiddenAfter * 100) / divHeight;
            }

            return result;
        }

    }

    // TODO/REFACTOR migrate this to use PDFRenderer
    getPageNum(pageElement) {
        let dataPageNum = pageElement.getAttribute("data-page-number");
        return parseInt(dataPageNum);
    }

    // FIXME: remake this binding to CreatePagemarkEntirePage
    keyBindingPagemarkEntirePage(event) {

        console.log("Marking entire page as read.");

        let pageElement = this.getCurrentPageElement();
        let pageNum = this.getPageNum(pageElement);

        this.erasePagemarks(pageNum);
        this.createPagemark(pageNum);

    }

    keyBindingPagemarkUpToMouse(event) {
        console.log("Marking page as read up to mouse point");
    }

    keyBindingErasePagemark(event) {
        console.log("Erasing pagemark.");
        let pageElement = this.getCurrentPageElement();
        let pageNum = this.getPageNum(pageElement);
        this.erasePagemark(pageNum);
    }

    keyBindingListener(event) {

        if (KeyEvents.isKeyMetaActive(event)) {

            const eCode = 69;

            const mCode = 77;
            const nCode = 78;

            // used for MacOS where it generates an 'N' for some reason.
            const NCode = 192;

            switch (event.which) {

                case eCode:
                    this.keyBindingErasePagemark(event);
                    break;

                case mCode:
                    // FIXME this is no longer used here and has migrated to
                    // PagemarkCoverageEventListener
                    this.keyBindingPagemarkUpToMouse(event);
                    break;

                case nCode:
                    this.keyBindingPagemarkEntirePage(event);
                    break;

                case NCode:
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

        document.addEventListener("keydown", this.keyBindingListener.bind(this));

        polar.state.listenForKeyBindings = true;

        console.log("Key bindings registered");

        new TextHighlightController(this.model).start();

        new PagemarkCoverageEventListener(this).start();

    }

};

