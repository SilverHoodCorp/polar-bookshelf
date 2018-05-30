
// controller for the web UI to update the model

class Controller {

    constructor(datastore) {

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

        console.log(`New document loaded (fingerprint=${newDocumentFingerprint}, nrPages=${nrPages})`);

        this.docFingerprint = newDocumentFingerprint;

        this.onDocumentLoaded(fingerprint, nrPages);

    }

    /**
     * A new document was opened...
     */
    onDocumentLoaded(fingerprint, nrPages) {

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
