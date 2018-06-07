const {TextHighlightModel} = require("./model/TestHighlightModel");
const {forDict} = require("../../utils.js");
const {MutationType} = require("../../proxies/MutationType");
const {PageRedrawHandler} = require("../../PageRedrawHandler");
const {TextHighlightRenderer} = require("./TextHighlightRenderer");
const {PDFRenderer} = require("../../PDFRenderer");

module.exports.TextHighlightView = class {

    constructor(model) {
        this.model = model;
    }

    init() {

        this.model.registerListenerForDocumentLoaded(this.onDocumentLoaded.bind(this));

        return this;

    }

    onDocumentLoaded(documentLoadedEvent) {

        console.log("TextHighlightView.onDocumentLoaded");

        let textHighlightModel = new TextHighlightModel();

        // listen for highlights from the model as highlights are added and deleted.

        textHighlightModel.registerListener(documentLoadedEvent.docMeta, this.onTextHighlight.bind(this));

    }

    onTextHighlight(textHighlightEvent) {

        console.log("TextHighlightView.onTextHighlight");

        let pageNum = textHighlightEvent.pageMeta.pageInfo.num;
        let pageElement = PDFRenderer.getPageElementFromPageNum(pageNum);

        // for each rect just call render on that pageElement...

        forDict(textHighlightEvent.textHighlight.rects, function (id, rect) {

            let callback = function() {
                TextHighlightRenderer.render(pageElement, rect);
            };

            // draw it manually the first time.
            callback();

            // then let the redraw handler do it after this.
            new PageRedrawHandler(pageElement).register(callback);

        });

    }

};
