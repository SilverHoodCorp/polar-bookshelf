/**
 * Represents a row of highlighted text including the rect around it, and the
 * elements it contains.
 */
module.exports.TextHighlightRow = class  {

    constructor(rect, rectElements) {
        this.rect = rect;
        this.rectElements = rectElements;
    }

};
