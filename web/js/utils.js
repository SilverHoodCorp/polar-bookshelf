
/**
 * Apply a given function, with arguments, to a list of delegates which have
 * that function name defined.
 */
module.exports.Delegator = class {

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

module.exports.forDict = function(dict, callback) {

    if(!dict) {
        throw new Error("dict required");
    }

    if(!callback) {
        throw new Error("callback required");
    }

    Object.keys(dict).forEach(function (key) {
        let value = dict[key];
        callback(key,value);
    })
}

/**
 * Get the bounding box for a list of elements, not just one.  This would be
 * the minimum bounding box for all the elements.
 */
module.exports.getBoundingClientRectFromElements = function(elements) {

    var boundingClientRects = elements.map(Element.getBoundingClientRect);
    return getBoundingClientRectFromBCRs(boundingClientRects);

}

/**
 * Get the bounding box from a list of BCRs.
 */
module.exports.getBoundingClientRectFromBCRs = function(boundingClientRects) {

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
module.exports.createSiblingTuples = function(arr) {

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
module.exports.elementOffset = function(element) {

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

module.exports.Elements = class {

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

    static offsetRelative(element, parentElement) {

        var offset = {left: 0, top: 0, bottom: 0, right: 0};

        do {

            if ( !isNaN( elem.offsetLeft ) ) {
                offsetLeft += elem.offsetLeft;
            }

        } while(element = elem.offsetParent && element != parentElement);

        return offsetLeft;

    }

    /**
     * Keep searching parent notes until we find an element matching the selector,
     * or return null when one was not found.
     *
     * @param selector
     */
    static untilRoot(element, selector) {

        if (!element)
            throw new Error("element required");

        if (!selector)
            throw new Error("selector required");

        if(element.matches(selector)) {
            return element;
        }

        if (element.parentElement == null) {
            // we have hit the root.
            return null;
        }

        return this.untilRoot(element.parentElement, selector);

    }

}

/**
 * Support the ability to calculate an offset relative to another element.
 */
module.exports.OffsetCalculator = class {

    // https://stackoverflow.com/questions/5598743/finding-elements-position-relative-to-the-document
    static calculate(element, rootElement) {

        var offset = {left: 0, top: 0, width: 0, height: 0};

        while(true) {

            if(element == null)
                break;

            // FIXME: log the full offsets of EACH element...

            offset.left += this._toInt(element.offsetLeft)
            offset.top += this._toInt(element.offsetTop)
            // offset.width += OffsetCalculator._toInt(element.offsetWidth)
            // offset.height += OffsetCalculator._toInt(element.offsetHeight)
            offset.width = this._toInt(element.offsetWidth)
            offset.height = this._toInt(element.offsetHeight)

            if(element === rootElement)
                break;

            element = element.offsetParent;

        }

        offset.right = offset.left + offset.width;
        offset.bottom = offset.top + offset.height;

        return offset;

    }

    static _toInt(value) {

        if ( isNaN( value ) ) {
            return 0;
        }

        return value;

    }

}

module.exports.Styles = class {

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

module.exports.Objects = class {

    static duplicate(obj) {
          return JSON.parse(JSON.stringify(obj));
    }

}
