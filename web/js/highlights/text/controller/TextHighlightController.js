const {TextHighlightRenderer} = require("./TextHighlightRenderer");
const {TextHighlighterFactory} = require("./TextHighlighterFactory");

// FIXME: make a view and controller package so that each class its roles isolated

class TextHighlightController {

    constructor() {
        this.textHighlighter = TextHighlightController.createTextHighlighter();
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

    /**
     * Set text highlighting in the current document with the highlighter.
     */
    static createTextHighlighter() {

        let sequence = 0;

        let textHighlighterOptions = {

            highlightedClass: "text-highlight-span",
            color: '', // this works and the color isn't changed.
            manual: true,

            onBeforeHighlight: function (range) {
                //console.log("onBeforeHighlight range: ", range);
                return true;
            },
            onAfterHighlight: function (range, highlightElements) {
                // console.log("onAfterHighlight range: ", range);
                // console.log("onAfterHighlight hlts: ", highlightElements);

                let id = sequence++;
                let highlightClazz = "text-highlight-" + id;

                highlightElements.forEach(function (highlightElement) {
                    //highlightElement.style.color = 'blue';
                    highlightElement.className = highlightElement.className + " " + highlightClazz;
                });

                // FIXME: this should NOT call a renderer but should instead
                // just create TextHighlight annotation and write to the model.
                //
                // then the model should just update the view.

                TextHighlightRenderer.create("." + highlightClazz);

            },

            onRemoveHighlight: function (hlt) {
                // console.log("onRemoveHighlight hlt: ", hlt);
            }

        };

        TextHighlighterFactory.newInstance(document.body, textHighlighterOptions);

    }


}

module.exports.TextHighlightController = TextHighlightController;
