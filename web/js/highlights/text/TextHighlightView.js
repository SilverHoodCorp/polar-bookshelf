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

        //console.log(JSON.stringify(documentLoadedEvent.docMeta, null, "  "));

        forDict(documentLoadedEvent.docMeta.pageMetas, function (key, pageMeta) {

            console.log("=============== " + key)
            console.log(JSON.stringify(pageMeta, null, "  "));

            if(!pageMeta.textHighlights) {
                throw new Error("No textHighlights field");
            }

            // trace the SET and DELETE of new text highlights.
            pageMeta.textHighlights.addTraceListener(function (path, mutationType, target, property, value) {

                if(mutationType === MutationType.SET) {
                    this.onTextHighlightCreated(value);
                } else if (mutationType === MutationType.DELETE) {
                    this.onTextHighlightDeleted(value);
                }

            }.bind(this)).fireInitial();

        }.bind(this));

        console.log("TextHighlightView.onDocumentLoaded");

        // register existing annotations

        // var pagemarkRendererDelegates = [
        //     new MainPagemarkRenderer(this),
        //     new ThumbnailPagemarkRenderer(this)
        // ];
        //
        // this.pagemarkRenderer = new CompositePagemarkRenderer(this, pagemarkRendererDelegates);
        // this.pagemarkRenderer.setup();
        //
        // this.updateProgress();

    }

    onTextHighlightCreated(textHighlight) {
        console.log("TextHighlightView.onTextHighlightCreated");
    }

    onTextHighlightDeleted(textHighlight) {
        console.log("TextHighlightView.onTextHighlightCreated");
    }

};
