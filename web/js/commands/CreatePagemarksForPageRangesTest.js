const {assertJSON} = require("../test/Assertions");

const {PersistenceLayer} = require("../datastore/PersistenceLayer.js");
const {DiskDatastore} = require("../datastore/DiskDatastore.js");

describe('Create ranges', function() {

    describe('with real data', function () {

        it("my bitcoin book.", async function () {

            let datastore = new DiskDatastore();
            let persistenceLayer = new PersistenceLayer(datastore);

            await persistenceLayer.init();

            // FIXME: now get the DocMeta

            // now create the ranges.

            // now commit it back out...

        });

    });

});
