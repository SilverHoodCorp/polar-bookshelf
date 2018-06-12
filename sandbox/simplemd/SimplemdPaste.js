const {Elements} = require("../../web/js/util/Elements.js");

/**
 * Support for easily handling pasting images into simplemd.
 *
 * @type {SimplemdPaste}
 */
module.exports.SimplemdPaste = class {

    /**
     * Register with the given element.
     *
     * @param element
     */
    register(element) {

    }

    /**
     * Called when data is pasted to the clipboard.
     */
    onPaste() {

    }

    /**
     * Called when an IMAGE is pasted to the clipboard so that we can convert
     * it to a data URL.
     */
    onImagePaste() {

    }

};
