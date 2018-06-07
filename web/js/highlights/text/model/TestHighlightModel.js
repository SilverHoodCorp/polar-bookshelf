const {forDict} = require("../../../utils.js");

module.exports.TextHighlightModel = class {

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
