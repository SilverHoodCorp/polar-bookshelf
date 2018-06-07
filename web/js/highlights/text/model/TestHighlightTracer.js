const {TextHighlightEvent} = require("./TextHighlightEvent");
const {forDict} = require("../../../utils.js");
const {MutationType} = require("../../../proxies/MutationType");

module.exports.TextHighlightTracer = class {

    register(docMeta, textHighlightListener) {

        forDict(docMeta.pageMetas, function (key, pageMeta) {

            if(!pageMeta.textHighlights) {
                throw new Error("No textHighlights field");
            }

            // this is really ugly and there has GOT to be a better way to do
            // this. RxJS is probably what I need or React

            pageMeta.textHighlights.addTraceListener(function (traceEvent) {

                let textHighlightEvent = new TextHighlightEvent(docMeta, pageMeta, traceEvent.value, traceEvent.mutationType, traceEvent);

                // FIXME: we could make this 100x easier if I did a special case
                // handling of 'delete' with setting null or undefined.

                if(traceEvent.mutationType === MutationType.SET || traceEvent.mutationType === MutationType.INITIAL) {
                    textHighlightListener.onTextHighlight(textHighlightEvent);
                } else if (traceEvent.mutationType === MutationType.DELETE) {
                    textHighlightListener.onTextHighlightDeleted(textHighlightEvent);
                }

            }.bind(this)).fireInitial();

        }.bind(this));

    }

    registerListener(docMeta, callback) {

        forDict(docMeta.pageMetas, function (key, pageMeta) {

            pageMeta.textHighlights.addTraceListener(function (traceEvent) {

                let event = {
                    docMeta,
                    pageMeta,
                    textHighlight: traceEvent.value,
                    mutationType: traceEvent.mutationType,
                    traceEvent
                };

                callback(event);

            }.bind(this)).fireInitial();

        }.bind(this));

    }

};
