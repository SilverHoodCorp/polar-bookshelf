
// controller for the web UI to update the model

class Controller {

    constructor(datastore) {

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

    /**
     * A new document was opened...
     */
    onDocumentLoaded(fingerprint, nrPages) {

        // TODO: test this method.

        console.log("New document loaded!");

        let docMeta = DocMeta.create(nrPages);

        // TODO: track the fingerprint too?

        this.datastore.addDocMeta(fingerprint,docMeta);

    }

}
