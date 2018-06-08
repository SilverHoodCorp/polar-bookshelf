const {forDict} = require("../../../utils.js");

// FIXME: this should become ModelListener

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

                return true;

            }.bind(this)).fireInitial();

        }.bind(this));

    }

};
