
module.exports.TextHighlightListener = class {

    onTextHighlight(docMeta, pageMeta, textHighlight) {
        console.log("TextHighlightView.onTextHighlightCreated");
    }

    onTextHighlightDeleted(docMeta, pageMeta, textHighlight) {
        console.log("TextHighlightView.onTextHighlightCreated");
    }

};
