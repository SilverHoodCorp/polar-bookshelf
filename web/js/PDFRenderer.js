/**
 * Utility for working with the main PDF renderer.
 *
 * @type {PDFRenderer}
 */
module.exports.PDFRenderer = class {

    static currentScale() {
        return window.PDFViewerApplication.pdfViewer._currentScale;
    }

};
