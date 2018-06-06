const {TextHighlightRows} = require("./TextHighlightRows");
const {TextHighlight} = require("./TextHighlight");

module.exports.TextHighlightRenderer = class  {

    constructor(textHighlightRows, selector) {
        this.textHighlightRows = textHighlightRows;
        this.selector = selector;
    }

    static create(selector) {

        let textHighlightRows = TextHighlightRows.createFromSelector(selector);

        let rects = textHighlightRows.map(current => current.rect);

        var textSelections = {}; // FIXME: do this later
        var text = ""; // FIXME: do this later

        let textHighlight = new TextHighlight({rects, textSelections, text});

        // FIXME: this needs to be done in the VIEW and not in the controller...

        // go through each marker and render them.
        textHighlightRows.forEach(function (textHighlightRow) {

            // This only needs to be done ONCE for the entire row and we just
            // need the main element for a reference point.

            if(textHighlightRow.rectElements.length > 0) {

                var rectElement = textHighlightRow.rectElements[0];

                // We only need to call render on the first one because the row
                // has the rect we're using to highlight and we're only using
                // the element for positioning.
                this.render(rectElement.element, textHighlightRow.rect);

            }

        }.bind(this));

        return new TextHighlightRenderer(textHighlightRows, selector);

    }


    /**
     * Render a physical highlight on an element for the given rect
     *
     * @param element the <span> that was created to hold the text we are going to highlight.
     * @param highlightRect
     */
    static render(element, highlightRect) {

        // FIXME: rework this to take just a PAGE and not have any dependency on
        // the element as we JUST need to .textLayer

        Elements.requireClass(element, "text-highlight-span");

        // this is the overlay element we're goign to paint yellow to show
        // that we've highlighted the text.
        var highlightElement = document.createElement("div");

        // this is the 'div' within the textLayer holding the style information
        // we need to compute offset and location.
        var textLayerDivElement = element.parentElement;

        // this is the <div class='textLayer'> that holds all the <div> text
        var textLayerElement = textLayerDivElement.parentElement;

        Elements.requireClass(textLayerElement, "textLayer");

        // thisis the holder element which contains .canvasWrapper, .textLayer, etc.
        var pageElement = textLayerElement.parentElement;

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
