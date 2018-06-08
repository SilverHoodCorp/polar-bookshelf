const {forDict} = require("../../../utils.js");

module.exports.TextHighlightModel = class {

    registerListener(docMeta, callback) {

        forDict(docMeta.pageMetas, function (key, pageMeta) {

            pageMeta.textHighlights.addTraceListener(function (traceEvent) {

                let event = {
                    docMeta,
                    pageMeta,
                    textHighlight: traceEvent.value,
                    previousTextHighlight: traceEvent.previousValue,
                    mutationType: traceEvent.mutationType,
                    traceEvent
                };

                callback(event);

                return true;

            }.bind(this)).fireInitial();

        }.bind(this));

    }

};
