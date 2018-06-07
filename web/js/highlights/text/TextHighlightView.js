

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

};
