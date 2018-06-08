const {Elements} = require("./utils");

/**
 * Utility for working with the main PDF renderer and dealing with pages, the
 * DOM, etc.
 *
 * @type {PDFRenderer}
 */
class PDFRenderer {

    static currentScale() {
        return window.PDFViewerApplication.pdfViewer._currentScale;
    }

    static getPageNumFromPageElement(pageElement) {
        let dataPageNum = pageElement.getAttribute("data-page-number");
        return parseInt(dataPageNum);
    }

    static getPageElementFromPageNum(pageNum) {

        if(!pageNum) {
            throw new Error("Page number not specified");
        }

        let pageElements = document.querySelectorAll(".page");

        // note that elements are 0 based indexes but our pages are 1 based
        // indexes.
        let pageElement = pageElements[pageNum - 1];

        if(pageElement == null) {
            throw new Error("Unable to find page element for page num: " + pageNum);
        }

        return pageElement;

    }

    /**
     * Get the current page number based on which page is occupying the largest
     * percentage of the viewport.
     */
    static getCurrentPageElement() {

        let pages = document.querySelectorAll(".page");

        let result = { element: null, visibility: 0};

        pages.forEach(function (page) {
            let visibility = Elements.calculateVisibilityForDiv(page);

            if ( visibility > result.visibility) {
                result.element = page;
                result.visibility = visibility;
            }

        });

        return result.element;

    }

    /**
     * Get all the metadata about the current page.
     */
    static getCurrentPageMeta() {

        let pageElement = PDFRenderer.getCurrentPageElement();
        let pageNum = PDFRenderer.getPageNumFromPageElement(pageElement);

        return { pageElement, pageNum }

    }

};

module.exports.PDFRenderer = PDFRenderer;
