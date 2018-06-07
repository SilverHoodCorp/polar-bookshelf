
module.exports.TextHighlightEvent = class {

    constructor(docMeta, pageMeta, textHighlight, mutationType) {
        this.docMeta = docMeta;
        this.pageMeta = pageMeta;
        this.textHighlight = textHighlight;
        this.mutationType = mutationType;
    }

};
