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
     * @param highlightRect
     */
    static render(element, highlightRect) {

        var highlightElement = document.createElement("div");

        highlightElement.className = "text-highlight";
        highlightElement.style.position = "absolute";
        highlightElement.style.left = `${highlightRect.left}px`;
        highlightElement.style.top = `${highlightRect.top}px`;
        highlightElement.style.width = `${highlightRect.width}px`;
        highlightElement.style.height = `${highlightRect.height}px`;

        // FIXME: insert this into the page element.. to the parent div... there is a
        // get common parent method that I should probably use.

        element.parentElement.appendChild(highlightElement);

        // FIXME: now clear the selection once this is done.

        // FIXME: the highlight should/could be BELOW the text and probably should
        // be until it's deleted I think.

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


