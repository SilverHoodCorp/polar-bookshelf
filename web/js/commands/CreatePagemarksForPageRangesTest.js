const {assertJSON} = require("../test/Assertions");

const {PersistenceLayer} = require("../datastore/PersistenceLayer.js");
const {DiskDatastore} = require("../datastore/DiskDatastore.js");
const {CreatePagemarksForPageRanges} = require("./CreatePagemarksForPageRanges");


describe('Create ranges', function() {

    describe('with real data', function () {

        it("my bitcoin book.", async function () {

            let datastore = new DiskDatastore();
            let persistenceLayer = new PersistenceLayer(datastore);

            await persistenceLayer.init();

            let fingerprint = "65393761393531623135393737626562666234373866653365396535313036623631346666376461623662383239616439666637353064393132643133353030";

            let docMeta = await persistenceLayer.getDocMeta(fingerprint)

            let createPagemarksForPageRanges = new CreatePagemarksForPageRanges(docMeta);

            createPagemarksForPageRanges.execute({range: {start: 1, end: 204}});

            await persistenceLayer.sync(fingerprint, docMeta);

            // to 204...

            // FIXME: now get the DocMeta

            // now create the ranges.

            // now commit it back out...

        });

    });

});
