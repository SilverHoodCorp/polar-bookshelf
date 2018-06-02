/**
 * Apply a given function, with arguments, to a list of delegates which have
 * that function name defined.
 */
class Delegator {

    constructor(delegates) {
        this.delegates = delegates;
    }

    /**
     * Apply the given function to all the delegates.
     */
    apply(functionName) {

        var args = Array.from(arguments);
        args.splice(0,1);

        this.delegates.forEach(function (delegate) {
            var func = delegate[functionName];
            func.apply(delegate, args);
        });
    }

}

/**
 * Get the bounding box for a list of elements, not just one.  This would be
 * the minimum bounding box for all the elements.
 */
function getClientBoundingRectFromElements() {

}

/**
 * Get the bounding box from a list of BCRs.
 */
function getClientBoundingRectFromBCRs(boundingClientRects) {

    console.log("FIXME0: ", boundingClientRects.map((brc) => brc.left));
    console.log("FIXME1: ", boundingClientRects.map((brc) => brc.left).reduce((a,b) => Math.min(a,b)));

    var left = boundingClientRects.map((brc) => brc.left).reduce((a,b) => Math.min(a,b));
    var top = boundingClientRects.map((brc) => brc.top).reduce((a,b) => Math.min(a,b));
    var bottom = boundingClientRects.map((brc) => brc.bottom).reduce((a,b) => Math.max(a,b));
    var right = boundingClientRects.map((brc) => brc.right).reduce((a,b) => Math.max(a,b));

    console.log("FIXME: top ", top);

    return {left, top, bottom, right};

}
