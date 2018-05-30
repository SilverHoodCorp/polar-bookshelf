
// controller for the web UI to update the model

class Controller {

    constructor(datastore) {

        /**
         * The document fingerprint that we have loaded to detect when the
         * documents have changed.
         * @type string
         */
        this.docFingerprint = null;

    }

    startListeners() {
        this.listenForDocumentFingerprint();
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

            this.onNewDocumentFingerprint(window.PDFViewerApplication.pdfDocument.pdfInfo.fingerprint);

        }

    }

    onNewDocumentFingerprint(newDocumentFingerprint) {

        console.log("New document loaded: " + newDocumentFingerprint);

        this.docFingerprint = newDocumentFingerprint;

    }

    /**
     * A new document was opened...
     */
    onDocumentLoaded() {

    }

}

function test() {
    var docFingerprint = null;


    var viewer = document.querySelector("#viewer");

    // this allows us to work with the reader...
    // window.PDFViewerApplication.pdfViewer.currentPageNumber=4

    // TODO: I don't think we can listen to the PDFViewerApplication lifecycle
    // properly but I might be wrong.

    viewer.addEventListener('DOMNodeInserted', function(event) {

        if (window.PDFViewerApplication &&
            window.PDFViewerApplication.pdfDocument &&
            window.PDFViewerApplication.pdfDocument.pdfInfo &&
            window.PDFViewerApplication.pdfDocument.pdfInfo.fingerprint != docFingerprint) {

            console.log("New document loaded");

            docFingerprint = window.PDFViewerApplication.pdfDocument.pdfInfo.fingerprint;
        }

    }, false );

}
