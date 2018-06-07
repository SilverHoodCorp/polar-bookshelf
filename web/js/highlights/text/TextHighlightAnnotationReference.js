/**
 * The actual annotation that is rendered on the screen plus its reference
 * element so we can redraw when we need to.
 */
module.exports.TextHighlightAnnotationReference = class {

    constructor(element, highlightRect) {
        this.element = element;
        this.highlightRect = highlightRect;
    }

    render() {

    }

};
