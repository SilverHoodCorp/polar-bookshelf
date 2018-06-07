const {TextHighlightModel} = require("./model/TestHighlightModel");
const {forDict} = require("../../utils.js");
const {MutationType} = require("../../proxies/MutationType");

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
        console.log("TextHighlightView.onTextHighlightCreated");
    }

};
