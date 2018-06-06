const {SerializedObject} = require("./SerializedObject.js");

/**
 * Lightweight metadata about a document. We do not include full page metadata
 * with this object which makes it lightweight to pass around.
 */
module.exports.DocInfo = class extends SerializedObject {

    constructor(val) {

        super(val);

        /**
         * The title for the document.
         * @type {null}
         */
        this.title = null;

        /**
         * The network URL for the document where we originally fetched it.
         * @type string
         */
        this.url = null;

        /**
         * The number of pages in this document.
         *
         * @type number
         */
        this.nrPages = null;

        /**
         * A fingerprint for the document created from PDF.js
         * @type string
         */
        this.fingerprint = null;

        this.init(val);

    }

    validate() {
        this.validateMembers([
            {name: 'nrPages', type: "number"},
            {name: 'fingerprint', type: "string"}
        ]);
    }

};
