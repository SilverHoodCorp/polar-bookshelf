const {TextHighlightEvent} = require("./TextHighlightEvent");
const {forDict} = require("../../../utils.js");
const {MutationType} = require("../../../proxies/MutationType");

module.exports.TextHighlightTracer = class {

    register(docMeta, textHighlightListener) {

        forDict(docMeta.pageMetas, function (key, pageMeta) {

            if(!pageMeta.textHighlights) {
                throw new Error("No textHighlights field");
            }

            pageMeta.textHighlights.addTraceListener(function (traceEvent) {

                let textHighlightEvent = new TextHighlightEvent(docMeta, pageMeta, traceEvent.value, traceEvent.mutationType);

                if(traceEvent.mutationType === MutationType.SET || traceEvent.mutationType === MutationType.INITIAL) {
                    textHighlightListener.onTextHighlight(textHighlightEvent);
                } else if (traceEvent.mutationType === MutationType.DELETE) {
                    textHighlightListener.onTextHighlightDeleted(textHighlightEvent);
                }

            }.bind(this)).fireInitial();

        }.bind(this));

    }

};
