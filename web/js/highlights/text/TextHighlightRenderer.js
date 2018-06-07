const PageRedrawHandler = require("../../PageRedrawHandler").PageRedrawHandler;
const {Elements} = require("../../utils");
const {TextHighlightRows} = require("./TextHighlightRows");
const {TextHighlight} = require("../../metadata/TextHighlight");

class TextHighlightRenderer {

    constructor(textHighlightRows, selector) {
        this.textHighlightRows = textHighlightRows;
        this.selector = selector;
    }

    static create(selector) {

        let textHighlightRows = TextHighlightRows.createFromSelector(selector);

        let rects = textHighlightRows.map(current => current.rect);

        let textSelections = {}; // FIXME: do this later
        let text = ""; // FIXME: do this later

        // FIXME: before we can position it, we need to figure out how to
        // reliably paint it on the screen... and how to anchor it.
        let textHighlight = new TextHighlight({rects, textSelections, text});

        // FIXME: this needs to be done in the VIEW and not in the controller...

        // go through each marker and render them.
        textHighlightRows.forEach(function (textHighlightRow) {

            // This only needs to be done ONCE for the entire row and we just
            // need the main element for a reference point.

            if(textHighlightRow.rectElements.length > 0) {

                let rectElement = textHighlightRow.rectElements[0];

                let pageElement = Elements.untilRoot(rectElement.element, ".page");

                if( !pageElement) {
                    throw new Error("Unable to find pageElement");
                }

                let callback = function() {

                    // We only need to call render on the first one because the row
                    // has the rect we're using to highlight and we're only using
                    // the element for positioning.
                    TextHighlightRenderer.render(pageElement, textHighlightRow.rect);

                };

                callback();

                new PageRedrawHandler(pageElement).register(callback);

            }

        }.bind(this));

        return new TextHighlightRenderer(textHighlightRows, selector);

    }


    /**
     * Render a physical highlight on an element for the given rect
     *
     * @param pageElement the page to hold the highlight.
     * @param highlightRect
     */
    static render(pageElement, highlightRect) {

        // FIXME: rework this to take just a PAGE and not have any dependency on
        // the element as we JUST need to .textLayer

        // Elements.requireClass(element, "text-highlight-span");
        //
        // // this is the overlay element we're goign to paint yellow to show
        // // that we've highlighted the text.
        // let highlightElement = document.createElement("div");
        //
        // // this is the 'div' within the textLayer holding the style information
        // // we need to compute offset and location.
        // let textLayerDivElement = element.parentElement;
        //
        // // this is the <div class='textLayer'> that holds all the <div> text
        // let textLayerElement = textLayerDivElement.parentElement;
        //
        // Elements.requireClass(textLayerElement, "textLayer");
        //
        // // thisis the holder element which contains .canvasWrapper, .textLayer, etc.
        // let pageElement = textLayerElement.parentElement;

        let highlightElement = document.createElement("div");

        highlightElement.className = "text-highlight";

        highlightElement.style.position = "absolute";
        highlightElement.style.backgroundColor = `yellow`;
        highlightElement.style.opacity = `0.5`;

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
