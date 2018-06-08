const {TextHighlightRecords} = require("../../../metadata/TextHighlightRecords");
const {PageRedrawHandler} = require("../../../PageRedrawHandler");
const {Elements} = require("../../../utils");
const {TextHighlightRows} = require("./TextHighlightRows");
const {PDFRenderer} = require("../../../PDFRenderer");
const {Rects} = require("../../../Rects");

// FIXME: remove this whole class.

class TextHighlightRenderer {

    constructor(textHighlightRows, selector) {
        this.textHighlightRows = textHighlightRows;
        this.selector = selector;
    }

    static create(selector) {

        // FIXME: textHighlightRows has the elements that we need to get the
        // text from...

        let rects = textHighlightRows.map(current => current.rect);

        let textSelections = {}; // FIXME: do this later
        let text = ""; // FIXME: do this later

        let textHighlightRecord = TextHighlightRecords.create(rects, textSelections, text);

        // now we just have to write this into the model I think.

        // FIXME: clean this up.. remove this ..


        // let textHighlightRows = TextHighlightRows.createFromSelector(selector);
        //
        // // FIXME: this needs to be done in the VIEW and not in the controller...
        // // We can fix this by listening to the highlights as they are created /
        // // registered and then only updating the model in the controller and
        // // having the view repaint itself.
        //
        // // go through each marker and render them.
        // textHighlightRows.forEach(function (textHighlightRow) {
        //
        //     // This only needs to be done ONCE for the entire row and we just
        //     // need the main element for a reference point.
        //
        //     if(textHighlightRow.rectElements.length > 0) {
        //
        //         let rectElement = textHighlightRow.rectElements[0];
        //
        //         let pageElement = Elements.untilRoot(rectElement.element, ".page");
        //
        //         if( !pageElement) {
        //             throw new Error("Unable to find pageElement");
        //         }
        //
        //         let callback = function() {
        //
        //             // We only need to call render on the first one because the row
        //             // has the rect we're using to highlight and we're only using
        //             // the element for positioning.
        //             TextHighlightRenderer.render(pageElement, textHighlightRow.rect);
        //
        //         };
        //
        //         callback();
        //
        //         new PageRedrawHandler(pageElement).register(callback);
        //
        //     }
        //
        // }.bind(this));
        //
        // return new TextHighlightRenderer(textHighlightRows, selector);

    }

    // FIXME: miggrate this to use TextHighlightView

    /**
     * Render a physical highlight on an element for the given rect
     *
     * @param pageElement the page to hold the highlight.
     * @param highlightRect
     */
    static render(pageElement, highlightRect) {

        console.log("Rendering annotation at: ", highlightRect);

        let highlightElement = document.createElement("div");

        highlightElement.className = "text-highlight";

        highlightElement.style.position = "absolute";
        highlightElement.style.backgroundColor = `yellow`;
        highlightElement.style.opacity = `0.5`;

        let currentScale = PDFRenderer.currentScale();

        highlightRect = Rects.scale(highlightRect, currentScale);

        highlightElement.style.left = `${highlightRect.left}px`;
        highlightElement.style.top = `${highlightRect.top}px`;

        highlightElement.style.width = `${highlightRect.width}px`;
        highlightElement.style.height = `${highlightRect.height}px`;

        // TODO: the problem with this strategy is that it inserts elements in the
        // REVERSE order they are presented visually.  This isn't a problem but
        // it might become confusing to debug this issue.  A quick fix is to
        // just reverse the array before we render the elements.
        pageElement.insertBefore(highlightElement, pageElement.firstChild);

    }

}

module.exports.TextHighlightRenderer = TextHighlightRenderer;
