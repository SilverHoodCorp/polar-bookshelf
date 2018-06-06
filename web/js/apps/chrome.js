//const {$} = require('jquery');
const {DocMeta} = require("../metadata/DocMeta");
const {DocMetas} = require("../metadata/DocMetas");
const {DocInfo} = require("../metadata/DocInfo");
const {Controller} = require("../controller/Controller.js");
const {WebController} = require("../controller/WebController.js");
const {WebView} = require("../view/WebView.js");

const {SystemClock} = require("../time/SystemClock.js");
const {PersistenceLayer} = require("../datastore/PersistenceLayer.js");
const {MemoryDatastore} = require("../datastore/MemoryDatastore.js");
const {Model} = require("../model.js");
const {Electron} = require("../Electron");
const {Launcher} = require("./Launcher");

async function launchDev(launcher) {

    console.log("Launching in dev mode.");

    let datastore = new MemoryDatastore();

    let persistenceLayer = new PersistenceLayer(datastore);
    let clock = new SystemClock();
    let model = new Model(persistenceLayer, clock);
    let controller = new WebController(model);
    let view = new WebView(model);

    // create some fake documents for our example PDFs
    let fingerprint = "110dd61fd57444010b1ab5ff38782f0f";

    let docMeta = DocMetas.createWithinInitialPagemarks(fingerprint, 14);
    DocMetas.addPagemarks(docMeta, {nrPages: 1, offsetPage: 4, percentage: 50})
    await persistenceLayer.sync(fingerprint, docMeta);

    view.init();

    await launcher.start(datastore, controller, "dev");

}

new Launcher(launchDev).launch();
