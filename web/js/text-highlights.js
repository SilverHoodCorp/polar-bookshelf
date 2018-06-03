// code for dealing with text highlights

// given some text, compute a list of rects that can overlap the text to form
// one coherent highlight.

class TextHighlightController {

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
                console.log("onBeforeHighlight range: ", range);
                return true;
            },
            onAfterHighlight: function (range, highlightElements) {
                console.log("onAfterHighlight range: ", range);
                console.log("onAfterHighlight hlts: ", highlightElements);

                let id = sequence++;
                let highlightClazz = "text-highlight-" + id;

                highlightElements.forEach(function (highlightElement) {
                    //highlightElement.style.color = 'blue';
                    highlightElement.className = highlightElement.className + " " + highlightClazz;
                });

                // FIXME: use the highlightElements to get the text of the nodes
                // then compute a hashcode to determine the ID of the highlight.

                TextHighlight.create("." + highlightClazz);

            },

            onRemoveHighlight: function (hlt) {
                console.log("onRemoveHighlight hlt: ", hlt);
            }

        };

        return new TextHighlighter(document.body, textHighlighterOptions);

    }


}

class TextHighlight {

    constructor(textHighlightRows, selector) {
        this.textHighlightRows = textHighlightRows;
        this.selector = selector;
    }

    static create(selector) {

        let textHighlightRows = TextHighlightMarkers.createFromSelector(selector);

        // go through each marker and render them.
        textHighlightRows.forEach(function (textHighlightRow) {

            // FIXME: I think this only needs to be done ONCE for the entire
            // row and we just need the main element for a reference point.
            textHighlightRow.elements.forEach(function (element) {
                this.render(element, textHighlightRow.rect);
            }.bind(this));

        }.bind(this));

        return new TextHighlight(textHighlightRows, selector);

    }


    /**
     * Render a physical highlight on an element for the given rect
     *
     * @param element the <span> that was created to hold the text we are going to highlight.
     * @param highlightRect
     */
    static render(element, highlightRect) {

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

        // highlightElement.style.left = textLayerDivElement.style.left;
        // highlightElement.style.top = textLayerDivElement.style.top;
        //highlightElement.style.transform = textLayerDivElement.style.transform;

        // FIXME: I think this needs to always be implemented by reading the
        // CURRENT values from the element so that resize works.
        highlightElement.style.width = `${highlightRect.width}px`;
        highlightElement.style.height = `${highlightRect.height}px`;

        // FIXME: insert this into the page element.. to the parent div... there is a
        // get common parent method that I should probably use.

        // TODO: the problem with this strategy is that it inserts elements in the
        // REVERSE order they are presented visually.  This isn't a problem but
        // it might become confusing to debug this issue.  A quick fix is to
        // just reverse the array before we render the elements.
        pageElement.insertBefore(highlightElement, pageElement.firstChild);

        // FIXME: now clear the selection once this is done.

        // FIXME: the highlight should/could be BELOW the text and probably should
        // be until it's deleted I think.

        // I can implement it this way:.. I just need to insert it into the DOM
        // and copy the following from the reference element
        //  style.left
        //  style.top
        //  style.transform
        //
        //  then set:
        //
        //  style.opacity=0.5
        //  style.backgroundColor=yellow
        //  style.position=absolute
        //
        //  then calculate the current width and height
        //
        //  style.width
        //  style.height

    }

}

/**
 * The actual annotation that is rendered on the screen plus its reference
 * element so we can redraw when we need to.
 */
class TextHighlightAnnotation {


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

    constructor(rect, elements) {
        this.rect = rect;
        this.elements = elements;
    }

}

/**
 */
class TextHighlightMarkers {

    /**
     * Create a highlight from a CSS selector.
     */
    static createFromSelector(selector) {

        let elements = Array.from(document.querySelectorAll(selector));

        if(! elements) {
            throw new Error("No elements");
        }

        // FIXME: these are made over the .text-highlight-span SPAN not the
        // 'div' so the offset is wrong...

        // var rects = elements.map(current => elementOffset(current));
        var rectElements = elements.map(current => this.computeOffset(current));

        let textHighlightRows = TextHighlightMarkers.computeContiguousRects(rectElements);

        console.log({rectElements, textHighlightRows});

        // FIXME: now this is returning TextHighlightRows not TextHighlightMarkers...
        // so refactor this to TextHighlightRows.

        return textHighlightRows;

        // // create a mapping between the element and the rect
        // let markers = [];
        //
        // for (let idx = 0; idx < elements.length; ++idx) {
        //     var element = elements[idx];
        //     markers.push( {
        //         element,
        //         highlightRect: contiguousRects[idx]
        //     });
        // }
        //
        // return markers;

    }

    /**
     * Given the span of our highlight, compute the offset looking at the CSS
     * styles of the element we're trying to map.
     *
     * @param element The element which we're computing over.
     * @return A RectElement for the rect (result) and the element
     */
    static computeOffset(element) {

        // make sure we're working on the right element or our math won't be right.
        Elements.requireClass(element, "text-highlight-span");

        let textHighlightSpanOffset = elementOffset(element);

        var textLayerDivElement = element.parentElement;

        // FIXME: this might also have to factor in scaleX and scaleY in the
        // future....

        var textLayerDivOffset = elementOffset(textLayerDivElement);
        var rect = textLayerDivOffset;

        let scaleX = Styles.parseTransformScaleX(textLayerDivElement.style.transform);

        if(! scaleX)
            throw new Error("No scaleX");

        rect.left = rect.left + textHighlightSpanOffset.left;
        rect.top = rect.top + textHighlightSpanOffset.top;
        rect.height = textHighlightSpanOffset.height;
        rect.width = textHighlightSpanOffset.width * scaleX;

        rect.width = Math.min(rect.width, textLayerDivOffset.width);

        rect.bottom = rect.top + rect.height;
        rect.right = rect.left + rect.width;

        return new RectElement(rect, element);

    }

    /**
     * Go through ALL the rects and build out rows of text elements that are
     * horizontally all on the same plane.
     *
     * @param rects
     */
    static computeRows(rects) {

        let tuples = createSiblingTuples(rects);

        let result = [];

        // the current row
        let row = [];

        tuples.forEach(function (tuple) {

            row.push(tuple.curr);

            if(tuple.next == null || (tuple.next && tuple.curr.top !== tuple.next.top)) {
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
        let result = JSON.parse(JSON.stringify(row[0]));

        row.forEach(function (entry) {

            if(entry.left < result.left) {
                result.left = entry.left;
            }

            if(entry.top < result.top) {
                result.top = entry.top;
            }

            if(entry.bottom > result.bottom) {
                result.bottom = entry.bottom;
            }

            if(entry.right > result.right) {
                result.right = entry.right;
            }

            result.width = result.right - result.left;
            result.height = result.bottom - result.top;

        })

        return result;

    }

    static computeIntermediateRows(rectElements) {



    }

    static computeContiguousRects(rectElements) {

        let tuples = createSiblingTuples(rectElements);

        let result = [];

        // FIXME: make this return 'row' objects with the elements witin that row.

        tuples.forEach(function (tuple) {

            if(!tuple.curr.rect) {
                throw new Error("Not a RectElement");
            }

            var adjusted = {
                left: tuple.curr.rect.left,
                top: tuple.curr.rect.top,
                right: tuple.curr.rect.right,
                bottom: tuple.curr.rect.bottom
            };

            // adjust the bottom of this div but ONLY if the next div is not on
            // the same rows.  I might need to have some code to first build
            // this into ROWS.

            if(tuple.next && tuple.next.rect.top != tuple.curr.rect.top) {
                adjusted.bottom = tuple.next.rect.top;
            }

            adjusted.width = adjusted.right - adjusted.left;
            adjusted.height = adjusted.bottom - adjusted.top;

            let textHighlightRow = new TextHighlightRow(adjusted, [tuple.curr.element]);

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

    constructor(rect, rectElement) {
        this.rect = rect;
        this.rectElement = rectElement;
    }

}

