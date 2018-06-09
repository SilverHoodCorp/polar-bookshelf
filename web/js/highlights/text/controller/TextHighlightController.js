const {TextHighlightRecords} = require("../../../metadata/TextHighlightRecords");
const {TextHighlighterFactory} = require("./TextHighlighterFactory");
const {TextHighlightRows} = require("./TextHighlightRows");
const {PDFRenderer} = require("../../../PDFRenderer");
const {Preconditions} = require("../../../Preconditions");
const {KeyEvents} = require("../../../KeyEvents.js");

class TextHighlightController {

    constructor(model) {
        this.model = Preconditions.assertNotNull(model, "model");
        this.textHighlighter = this.createTextHighlighter();

        if(!this.textHighlighter) {
            throw new Error("No textHighlighter");
        }

    }

    start() {
        document.addEventListener("keyup", this.keyBindingListener.bind(this));
    }

    keyBindingListener(event) {

        if (KeyEvents.isKeyMetaActive(event)) {

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

    /**
     * Set text highlighting in the current document with the highlighter.
     */
    createTextHighlighter() {

        let sequence = 0;

        let controller = this;

        let textHighlighterOptions = {

            highlightedClass: "text-highlight-span",
            color: '', // this works and the color isn't changed.
            manual: true,

            onBeforeHighlight: function (range) {
                //console.log("onBeforeHighlight range: ", range);
                return true;
            }.bind(this),

            onAfterHighlight: function (range, highlightElements) {
                // console.log("onAfterHighlight range: ", range);
                // console.log("onAfterHighlight hlts: ", highlightElements);

                let id = sequence++;
                let highlightClazz = "text-highlight-" + id;

                highlightElements.forEach(function (highlightElement) {
                    //highlightElement.style.color = 'blue';
                    highlightElement.className = highlightElement.className + " " + highlightClazz;
                });

                controller.onTextHighlightCreated("." + highlightClazz)

            }.bind(this),

            onRemoveHighlight: function (hlt) {
                // console.log("onRemoveHighlight hlt: ", hlt);
            }

        };

        return TextHighlighterFactory.newInstance(document.body, textHighlighterOptions);

    }

    /**
     * Called by the controller when we have a new highlight created so that
     * we can update the model.
     */
    onTextHighlightCreated(selector) {

        console.log("TextHighlightController.onTextHighlightCreated");

        let textHighlightRows = TextHighlightRows.createFromSelector(selector);

        let rects = textHighlightRows.map(current => current.rect);

        let textSelections = {}; // FIXME: do this later
        let text = ""; // FIXME: do this later

        let textHighlightRecord = TextHighlightRecords.create(rects, textSelections, text);

        // now update the mode based on the current page metadata

        let currentPageMeta = PDFRenderer.getCurrentPageMeta();

        let pageMeta = this.model.docMeta.getPageMeta(currentPageMeta.pageNum);

        pageMeta.textHighlights[textHighlightRecord.id] = textHighlightRecord.value;

        console.log("Added text highlight to model");

    }

}

module.exports.TextHighlightController = TextHighlightController;
