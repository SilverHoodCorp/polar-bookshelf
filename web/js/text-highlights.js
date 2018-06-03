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

    constructor(markers, selector) {
        this.markers = markers;
        this.selector = selector;
    }

    static create(selector) {

        let markers = TextHighlightMarkers.createFromSelector(selector);

        // go through each marker and render them.
        markers.forEach(function (marker) {
            this.render(marker.element, marker.highlightRect);
        }.bind(this));

        return new TextHighlight(markers, selector);

    }


    /**
     * Render a physical highlight on an element for the given rect
     *
     * @param element the <span> that was created to hold the text we are going to highlight.
     * @param highlightRect
     */
    static render(element, highlightRect) {

        // this is the overlay element we're goign to paint yellow to show
        // that we've highlighted the text.
        var highlightElement = document.createElement("div");

        // this is the 'div' within the textLayer holding the style information
        // we need to compute offset and location.
        var textLayerDivElement = element.parentElement;

        // this is the <div class='textLayer'> that holds all the <div> text
        var textLayerElement = textLayerDivElement.parentElement;

        // thisis the holder element which contains .canvasWrapper, .textLayer, etc.
        var pageElement = textLayerElement.parentElement;

        highlightElement.className = "text-highlight";

        highlightElement.style.position = "absolute";
        highlightElement.style.backgroundColor = `yellow`;
        highlightElement.style.opacity = `0.5`;

        // highlightElement.style.left = `${highlightRect.left}px`;
        // highlightElement.style.top = `${highlightRect.top}px`;

        highlightElement.style.left = textLayerDivElement.style.left;
        highlightElement.style.top = textLayerDivElement.style.top;
        highlightElement.style.transform = textLayerDivElement.style.transform;

        // FIXME: I think this needs to always be implemented by reading the
        // CURRENT values from the element so that resize works.
        highlightElement.style.width = `${highlightRect.width}px`;
        highlightElement.style.height = `${highlightRect.height}px`;

        // FIXME: insert this into the page element.. to the parent div... there is a
        // get common parent method that I should probably use.

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

        var rects = elements.map(current => elementOffset(current));

        let contiguousRects = TextHighlightMarkers.computeContiguousRects(rects);

        // create a mapping between the element and the rect
        let markers = [];

        for (let idx = 0; idx < elements.length; ++idx) {
            var element = elements[idx];
            markers.push( {
                element,
                highlightRect: contiguousRects[idx]
            });
        }

        return markers;

    }

    static computeContiguousRects(rects) {

        let tuples = createSiblingTuples(rects);

        let result = [];

        tuples.forEach(function (tuple) {

            var adjusted = {
                left: tuple.curr.left,
                top: tuple.curr.top,
                right: tuple.curr.right,
                bottom: tuple.curr.bottom
            };

            if(tuple.next) {
                adjusted.bottom = tuple.next.top;
            }

            adjusted.width = adjusted.right - adjusted.left;
            adjusted.height = adjusted.bottom - adjusted.top;

            result.push(adjusted);

        })

        return result;

    }

}


