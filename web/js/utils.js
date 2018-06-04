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
function getBoundingClientRectFromElements(elements) {

    var boundingClientRects = elements.map(Element.getBoundingClientRect);
    return getBoundingClientRectFromBCRs(boundingClientRects);

}

/**
 * Get the bounding box from a list of BCRs.
 */
function getBoundingClientRectFromBCRs(boundingClientRects) {

    var left = boundingClientRects.map((brc) => brc.left).reduce((a,b) => Math.min(a,b));
    var top = boundingClientRects.map((brc) => brc.top).reduce((a,b) => Math.min(a,b));
    var bottom = boundingClientRects.map((brc) => brc.bottom).reduce((a,b) => Math.max(a,b));
    var right = boundingClientRects.map((brc) => brc.right).reduce((a,b) => Math.max(a,b));

    return {left, top, bottom, right};

}

/**
 * Go over the array-like object and return tuples with prev, curr, and next
 * properties so that we can peek at siblings easily.  If the prev and / or next
 * are not present these values are null.
 *
 */
function createSiblingTuples(arr) {

    let result = [];

    for(var idx = 0; idx < arr.length; ++idx) {

        result.push( {
            curr: arr[idx],
            prev: Optional.of(arr[idx-1]).getOrElse(null),
            next: Optional.of(arr[idx+1]).getOrElse(null)
        });

    }

    return result;

}

/**
 * @Deprecated use Elements.offset instead.
 */
function elementOffset(element) {

    let result = {
        left: element.offsetLeft,
        top: element.offsetTop,
        width: element.offsetWidth,
        height: element.offsetHeight
    };

    result.right = result.left + result.width;
    result.bottom = result.top + result.height;

    return result

}

class Elements {

    static offset(element) {

        let result = {
            left: element.offsetLeft,
            top: element.offsetTop,
            width: element.offsetWidth,
            height: element.offsetHeight
        };

        result.right = result.left + result.width;
        result.bottom = result.top + result.height;

        return result

    }

    /**
     * Require that the element have the given classname.
     */
    static requireClass(element, clazz) {

        var classValue = element.getAttribute("class");

        if( ! classValue || classValue.indexOf(clazz) === -1) {

            // element isn't the proper class we're expecting.
            throw new Error("Element does not have the proper class: " + clazz)

        }

    }

}

class Styles {

    static parseTransformScaleX(transform) {

        var result = transform;

        if( ! result)
            return null;

        result = result.replace("scaleX(", "");
        result = result.replace(")", "");

        return parseFloat(result);

    }

    /**
     * Take a string of '50px' and return a number of just the pixel count.
     */
    static parsePixels(value) {

        value = value.replace("px", "");
        return parseInt(value);

    }

}

class Objects {
      
    static duplicate(obj) {
          return JSON.parse(JSON.stringify(obj));
    }
    
}
