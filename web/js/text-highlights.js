import {TextHighlightView} from "./TextHighlightView.js";
import {createSiblingTuples} from "./utils.js";

// code for dealing with text highlights

// given some text, compute a list of rects that can overlap the text to form
// one coherent highlight.

export class TextHighlightController {

    constructor(textHighlighter) {
        this.textHighlighter = textHighlighter;
    }

    keyBindingListener(event) {

        if (event.ctrlKey && event.altKey) {

            const tCode = 84;

            switch (event.which) {

                case tCode:
                    this.textHighlighter.doHighlight();
                    break;

                default:
                    break;

            }

        }

    }

    listenForKeyBindings() {
        document.addEventListener("keyup", this.keyBindingListener.bind(this));
    }

    static create() {

        return new TextHighlightController(TextHighlightController.createTextHighlighter());

    }

    /**
     * Set text highlighting in the current document with the highlighter.
     */
    static createTextHighlighter() {

        var sequence = 0;

        var textHighlighterOptions = {

            highlightedClass: "text-highlight-span",
            color: '', // this works and the color isn't changed.
            manual: true,

            onBeforeHighlight: function (range) {
                //console.log("onBeforeHighlight range: ", range);
                return true;
            },
            onAfterHighlight: function (range, highlightElements) {
                // console.log("onAfterHighlight range: ", range);
                // console.log("onAfterHighlight hlts: ", highlightElements);

                let id = sequence++;
                let highlightClazz = "text-highlight-" + id;

                highlightElements.forEach(function (highlightElement) {
                    //highlightElement.style.color = 'blue';
                    highlightElement.className = highlightElement.className + " " + highlightClazz;
                });

                // FIXME: use the highlightElements to get the text of the nodes
                // then compute a hashcode to determine the ID of the highlight.

                TextHighlightRenderer.create("." + highlightClazz);

            },

            onRemoveHighlight: function (hlt) {
                // console.log("onRemoveHighlight hlt: ", hlt);
            }

        };

        return new TextHighlighter(document.body, textHighlighterOptions);

    }


}

class TextHighlightRenderer {

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

/**
 * The actual annotation that is rendered on the screen plus its reference
 * element so we can redraw when we need to.
 */
class TextHighlightAnnotationReference {


    constructor(element, highlightRect) {
        this.element = element;
        this.highlightRect = highlightRect;
    }

    render() {

    }

}


/**
 * Represents a row of highlighted text including the rect around it, and the
 * elements it contains.
 */
class TextHighlightRow {

    constructor(rect, rectElements) {
        this.rect = rect;
        this.rectElements = rectElements;
    }

}

/**
 * TODO:
 *
 * I designed this incorrectly and should refactor it into a problem of geometry.
 *
 * What I need to do is form this into a polygon with points decorating the polygon.
 *
 * Then I need to take the outlier points, which contain all the points inside
 * the plane, then break it down into rows by looking down the polygon vertically
 * and bisecting it until it forms a collection of rectangles.
 *
 * The code for this would be a LOT cleaner and I think less error prone.
 *
 * This wasn't immediately evident because I was thinking about the problem
 * as a stream of text, not of geometric points.
 *
 */
export class TextHighlightRows {

    /**
     * Create a highlight from a CSS selector.
     */
    static createFromSelector(selector) {

        let elements = Array.from(document.querySelectorAll(selector));

        if(! elements) {
            throw new Error("No elements");
        }

        var rectElements = elements.map(current => this.computeOffset(current));

        let textHighlightRows = TextHighlightRows.computeContiguousRects(rectElements);

        // FIXME: now this is returning TextHighlightRows not TextHighlightRows...
        // so refactor this to TextHighlightRows.

        return textHighlightRows;

    }

    /**
     * Given the span of our highlight, compute the offset looking at the CSS
     * styles of the element we're trying to map.
     *
     * @param element The element which we're computing over.
     * @return A RectElement for the rect (result) and the element
     */
    static computeOffset(element) {

        // FIXME... record if this row height is too small!!! this is where the bug is I think...

        // make sure we're working on the right element or our math won't be right.
        Elements.requireClass(element, "text-highlight-span");

        let textHighlightSpanOffset = Elements.offset(element);

        var textLayerDivElement = element.parentElement;

        var textLayerDivOffset = elementOffset(textLayerDivElement);
        var rect = textLayerDivOffset;

        let scaleX = Styles.parseTransformScaleX(textLayerDivElement.style.transform);
        if(! scaleX) {
            scaleX = 1.0;
        }

        rect.left = rect.left + (textHighlightSpanOffset.left * scaleX);
        rect.top = rect.top + textHighlightSpanOffset.top;

        rect.height = textHighlightSpanOffset.height;
        rect.width = textHighlightSpanOffset.width * scaleX;

        rect.width = Math.min(rect.width, textLayerDivOffset.width);

        rect.bottom = rect.top + rect.height;
        rect.right = rect.left + rect.width;

        return new RectElement(rect, element);

    }

    /**
     * Go through ALL the rects and build out rows of elements that are
     * horizontally all on the same plane.
     *
     * @param rectElements
     */
    static computeRows(rectElements) {

        let tuples = createSiblingTuples(rectElements);

        let result = [];

        // the current row
        let row = [];

        tuples.forEach(function (tuple) {

            if(!tuple.curr.rect) {
                throw new Error("Not a RectElement");
            }

            row.push(tuple.curr);

            if(tuple.next == null || (tuple.next && tuple.curr.rect.top !== tuple.next.rect.top)) {
                result.push(row);
                row = [];
            }

        })

        if (row.length !== 0)
            result.push(row);

        return result;

    }

    // given a row of rects, compute a rect that covers the entire row maximizing
    // the height and width.
    static computeRectForRow(row) {

        if (row.length == null || row.length == 0)
            throw new Error("Invalid row data");

        // duplicate the first entry... we will keep maximixing the bounds.
        let result = JSON.parse(JSON.stringify(row[0].rect));

        row.forEach(function (rectElement) {

            if(rectElement.rect.left < result.left) {
                result.left = rectElement.rect.left;
            }

            if(rectElement.rect.top < result.top) {
                result.top = rectElement.rect.top;
            }

            if(rectElement.rect.bottom > result.bottom) {
                result.bottom = rectElement.rect.bottom;
            }

            if(rectElement.rect.right > result.right) {
                result.right = rectElement.rect.right;
            }

            result.width = result.right - result.left;
            result.height = result.bottom - result.top;

        })

        return result;

    }

    static computeIntermediateRows(rectElements) {

        let rows = TextHighlightRows.computeRows(rectElements)
        let result = [];

        rows.forEach(function (rectElementsWithinRow) {
            var rect = TextHighlightRows.computeRectForRow(rectElementsWithinRow);
            let intermediateRow = new IntermediateRow(rect, rectElementsWithinRow);
            result.push(intermediateRow);
        });

        return result;

    }

    static computeContiguousRects(rectElements) {

        let intermediateRows = TextHighlightRows.computeIntermediateRows(rectElements);

        let intermediateRowPager = createSiblingTuples(intermediateRows);

        let result = [];

        intermediateRowPager.forEach(function (page) {

            if(!page.curr.rect || !page.curr.rectElements) {
                throw new Error("Not a IntermediateRow");
            }

            var adjustedRect = {
                left: page.curr.rect.left,
                top: page.curr.rect.top,
                right: page.curr.rect.right,
                bottom: page.curr.rect.bottom
            };

            // adjust the bottom of this div but ONLY if the next div is not on
            // the same rows.  I might need to have some code to first build
            // this into ROWS.

            if(page.next && page.next.rect.top != page.curr.rect.top) {
                adjustedRect.bottom = Math.max(page.next.rect.top, adjustedRect.bottom);
            }

            adjustedRect.width = adjustedRect.right - adjustedRect.left;
            adjustedRect.height = adjustedRect.bottom - adjustedRect.top;

            let textHighlightRow = new TextHighlightRow(adjustedRect, page.curr.rectElements);

            result.push(textHighlightRow);

        })

        return result;

    }

}


/**
 * A rect and element pair.
 */
class RectElement {

    constructor(rect, element) {
        this.rect = rect;
        this.element = element;
    }

}

/**
 * An intermediate row with a rect covering the whole row and the rectElements
 * it contains.
 */
class IntermediateRow {

    constructor(rect, rectElements) {
        this.rect = rect;
        this.rectElements = rectElements;
    }

}
