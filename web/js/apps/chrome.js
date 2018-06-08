//const {$} = require('jquery');
const {DocMeta} = require("../metadata/DocMeta");
const {DocMetas} = require("../metadata/DocMetas");
const {DocInfo} = require("../metadata/DocInfo");
const {Controller} = require("../controller/Controller.js");

const {PersistenceLayer} = require("../datastore/PersistenceLayer.js");
const {MemoryDatastore} = require("../datastore/MemoryDatastore.js");
const {Electron} = require("../Electron");
const {Launcher} = require("./Launcher");

async function persistenceLayerFactory() {

    console.log("Launching in dev mode.");

    let datastore = new MemoryDatastore();
    let persistenceLayer = new PersistenceLayer(datastore);

    await persistenceLayer.init();

    // create some fake documents for our example PDFs
    let fingerprint = "110dd61fd57444010b1ab5ff38782f0f";

    let docMeta = DocMetas.createWithinInitialPagemarks(fingerprint, 14);
    DocMetas.addPagemarks(docMeta, {nrPages: 1, offsetPage: 4, percentage: 50})
    await persistenceLayer.sync(fingerprint, docMeta);

    return persistenceLayer;

}

new Launcher(persistenceLayerFactory).launch().then(function () {
    console.log("App now loaded.");
});
