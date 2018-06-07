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

        //console.log(JSON.stringify(documentLoadedEvent.docMeta, null, "  "));

        forDict(documentLoadedEvent.docMeta.pageMetas, function (key, pageMeta) {

            //console.log("=============== " + key)
            //console.log(JSON.stringify(pageMeta, null, "  "));

            if(!pageMeta.textHighlights) {
                throw new Error("No textHighlights field");
            }

            // trace the SET and DELETE of new text highlights.
            pageMeta.textHighlights.addTraceListener(function (pageMeta, traceEvent) {

                console.log("FIXMEasdf");

                if(traceEvent.mutationType === MutationType.SET || traceEvent.mutationType === MutationType.INITIAL) {
                    this.onTextHighlight(traceEvent.value);
                } else if (traceEvent.mutationType === MutationType.DELETE) {
                    this.onTextHighlightDeleted(traceEvent.value);
                }

            }.bind(this)).fireInitial();

        }.bind(this));


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

    onTextHighlight(pageMeta, textHighlight) {
        console.log("TextHighlightView.onTextHighlightCreated");
    }

    onTextHighlightDeleted(pageMeta, textHighlight) {
        console.log("TextHighlightView.onTextHighlightCreated");
    }

};
