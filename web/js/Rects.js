const {Objects} = require("./utils");

module.exports.Rects = class {

    /**
     * Scale the rect based on the current values and the given scale.
     */
    static scale(rect, scale) {

        rect = Objects.duplicate(rect);

        for(let key in rect) {

            if(! rect.hasOwnProperty(key))
                continue;

            rect[key] = rect[key] * scale;

        }

        return rect;

    };
}
