//const {$} = require('jquery');
const {DocMeta} = require("./metadata/DocMeta");
const {DocMetas} = require("./metadata/DocMetas");
const {DocInfo} = require("./metadata/DocInfo");
const {Controller} = require("./controller/Controller.js");
const {WebController} = require("./controller/WebController.js");
const {WebView} = require("./view/WebView.js");
const {TextHighlightController} = require("./highlights/text/text-highlights.js");

const {SystemClock} = require("./time/SystemClock.js");
const {PersistenceLayer} = require("./datastore/PersistenceLayer.js");
const {MemoryDatastore} = require("./datastore/MemoryDatastore.js");
const {Model} = require("./model.js");

async function launchDev() {

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

    await start(datastore, controller, "dev");

}
//
// async function launchProd() {
//
//     console.log("Launching in prod mode.");
//     const remote = require('electron').remote;
//
//     console.log("Accessing datastore...");
//     let datastore = remote.getGlobal("diskDatastore" );
//     console.log("Accessing datastore...done");
//
//     let persistenceLayer = new PersistenceLayer(datastore);
//     let clock = new SystemClock();
//     let model = new Model(persistenceLayer, clock);
//     let controller = new WebController(model);
//     let view = new WebView(model);
//     view.init();
//
//     console.log("Starting ...");
//
//     await start(persistenceLayer, controller, "prod");
//
// }

async function start(persistenceLayer, controller, mode) {

    await persistenceLayer.init();

    controller.startListeners();
    console.log("Controller started in mode: " + mode);

}

function launch(launcherFunction) {

    if (document.readyState === "complete" || document.readyState === "loaded" || document.readyState === "interactive") {
        console.log("Already completed loading.");
        launcherFunction();
    } else {
        console.log("Waiting for DOM content to load");
        document.addEventListener('DOMContentLoaded', launcherFunction, true);
    }

}

/**
 * Init the page by loading all scripts, etc.
 */
async function init() {

    // await injectAllScripts();

    if(isElectron()) {
        launch(launchProd);
    } else {
        launch(launchDev);
    }

}

function isElectron() {
    var userAgent = navigator.userAgent.toLowerCase();
    return userAgent.indexOf(' electron/') !== -1;
}

init();
