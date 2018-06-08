//
// TODO:
//
// - Much of this code needs to be refactored to use
//   Rect objects {top,left,bottom,right,width,height} instead of a box with
//   two points. Rects are easier to work with and more DOM-centric.
//
// - I'm using getBoundingClientRect which I think is wrong.

/**
 * Given a box, extract the text within the box.
 *
 * @type {TextExtractor}
 */
class TextExtractor {

    /**
     * Extract the text from all highlightRects given.
     *
     * @param highlightRects An array of rects for the highlights
     * @return {Array}
     */
    static extract(highlightRects) {

        let result = [];

        highlightRects.forEach(function (highlightRect) {

            let textElements = page.querySelectorAll(".textLayer div");

            // TODO: this needs to be migrated to using an index.  Right now we do a
            // brute force comparison of every element to see if it's within the
            // rect but this is slow.  A better strategy would be to create a 2D index
            // creating a binary tree where we sort the tree based on the four points
            // of the box.

            textElements.forEach(function(textElement) {

                let elementRect = toElementRect(textElement);
                let elementBox = rectToBox(elementRect);

                if (isElementHighlighted(elementBox, highlightRect)) {
                    result.push(textElement.outerText);
                }

            });

        });

        return result;

    };

};

function toElementRectUsingOffset(element) {

    // TODO: I could return this just as a box.
    return createRect(element.offsetLeft, element.offsetTop, element.offsetWidth, element.offsetHeight);
}

function toElementRect(element) {

    let clientRect = element.getBoundingClientRect();

    // TODO: I could return this just as a box.
    return createRect(clientRect.left, clientRect.top, clientRect.right - clientRect.left, clientRect.bottom - clientRect.top);
}

function createRect(left, top, width, height) {
    let area = width * height;
    return {left: left, top: top, width: width, height: height, area: area};
}

// return true if the element is highlighted
function isElementHighlighted(b0,b1) {

    return isOverlapped(b0, b1);

}

function isOverlapped(child, parent) {

    // FIXME we should require that the overlap at LEAST have say a certain
    // percentage of the Y dimension to be at least 35% of the text.  This way
    // if we get partial text we still allow it but we don't accidentally pull
    // in the previous paragraph.

    let computedOverlap = computeOverlap(child, parent);

    return computedOverlap.overlap > 0 && computedOverlap.overlapX.childCoverage > 0.5;

}


/**
 * Compute the amount of overlap between parent and child.  Return additional
 * metadata including the overlap per dimension.
 *
 * @param child
 * @param parent
 */
function computeOverlap(child, parent) {

    let result = {};

    result.overlapX = computeOverlapWithinDimension(child, parent, function(box) { return box.x;} );
    result.overlapY = computeOverlapWithinDimension(child, parent, function(box) { return box.y;} );

    result.overlap = result.overlapX.overlap & result.overlapY.overlap;

    return result;

}


/**
 * Compute the overlap in a specific dimension (x, or y) with the given function.
 *
 */
function computeOverlapWithinDimension(child, parent, extractDim) {

    let result = {};

    // the number of coordinates in the given dimension that are overlapped.
    result.overlap
        = Math.max(0,
        Math.min(extractDim(child[1]), extractDim(parent[1])) -
        Math.max(extractDim(child[0]), extractDim(parent[0])));

    // now compute the child and parent coverage
    result.childCoverage = computeDimensionCoverage(result.overlap, child, extractDim);
    result.parentCoverage = computeDimensionCoverage(result.overlap, parent, extractDim);

    return result;

}

function computeDimensionCoverage(overlap,box,extractDim) {
    return overlap / Math.abs(extractDim(box[0]) - extractDim(box[1]));
}

// Take a rect and convert it to a box.
function rectToBox(rect) {

    return createBox(createPoint(rect.left, rect.top),
           createPoint(rect.left + rect.width, rect.top + rect.height));

}

// A euclidian point
function createPoint(x,y) {
    return {x: x, y: y};
}

// create a tuple with two points
function createBox(point0, point1) {
    return [point0, point1];
}

module.exports.TextExtractor = TextExtractor;
