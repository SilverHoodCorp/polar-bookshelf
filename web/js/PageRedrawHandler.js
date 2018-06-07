/**
 * Calls an event handler when the page has been redrawn so that we can
 * attach annotations, pagemarks, etc.
 *
 * @type {PageRedrawHandler}
 */
module.exports.PageRedrawHandler = class {

    constructor(pageElement) {

        this.pageElement = pageElement;

    }

    register(callback) {

        this.pageElement.addEventListener('DOMNodeInserted', function(event) {

            if (event.target && event.target.className === "endOfContent") {
                callback(this.pageElement);
            }

        }.bind(this), false );

    };

};
