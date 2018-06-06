//const {$} = require('jquery');
console.log("FIXME module.exports", module.exports);
const {DocMeta} = require("./metadata/DocMeta");
const {DocMetas} = require("./metadata/DocMetas");
const {DocInfo} = require("./metadata/DocInfo");
const {Controller} = require("./controller/Controller.js");
const {WebController} = require("./controller/WebController.js");
const {WebView} = require("./view/WebView.js");
const {TextHighlightController} = require("./text-highlights.js");

const {SystemClock} = require("./time/SystemClock.js");
const {MemoryDatastore} = require("./datastore/MemoryDatastore.js");
const {Model} = require("./model.js");


/// /
//
// // /**
// //  * Inject our customization around PDFs including custom CSS and custom scripts.
// //  */
// // async function injectAllScripts() {
// //
// //     // inject our customizations manually so that we can just depend on the
// //     // stock pdf.js viewer.html application.
// //
// //     // TODO: make this into an if / then if we're running in a renderer process.
// //     // if(isElectron()) {
// //     //     window.$ = window.jQuery = await require('/node_modules/jquery/dist/jquery.min.js');
// //     // } else {
// //     await injectScript('/node_modules/jquery/dist/jquery.min.js', 'module');
// //     window.$ = window.jQuery;
// //     // }
// //
// //     // TODO: use a Promise.all() on all of these to await them as a batch.
// //     // It's not going to make a massive performance difference though since we
// //     // are loading locally.
// //
// //     await injectScript('/web/js/utils.js', 'module');
// //     await injectScript('/web/js/polar.js');
// //     //injectScript('/web/js/annotations.js');
// //     await injectScript('/web/js/metadata.js');
// //     await injectScript('/web/js/model.js');
// //     await injectScript('/web/js/view.js', 'module');
// //     await injectScript('/web/js/controller.js', 'module');
// //     await injectScript('/web/js/clock.js');
// //     await injectScript('/web/js/optional.js');
// //     await injectScript('/web/js/datastore/datastore.js');
// //     await injectScript('/web/js/text-highlights.js', 'module');
// //     await injectScript('/lib/TextHighlighter.js');
// //
// // }

function launchDev() {

    console.log("Launching in dev mode.");

    var clock = new SystemClock();
    var datastore = new MemoryDatastore();
    var model = new Model(datastore, clock);
    var controller = new WebController(datastore, model);
    var view = new WebView(model);

    // create some fake documents for our example PDFs
    var fingerprint = "110dd61fd57444010b1ab5ff38782f0f";

    let docMeta = DocMetas.createWithinInitialPagemarks(fingerprint, 14);
    DocMetas.addPagemarks(docMeta, {nrPages: 1, offsetPage: 4, percentage: 50})
    datastore.sync(fingerprint, docMeta);

    view.init();

    start(datastore, controller, "dev");

}
//
// async function launchProd() {
//
//     console.log("Launching in prod mode.");
//
//     const remote = require('electron').remote;
//     var datastore = remote.getGlobal("diskDatastore" );
//
//     var clock = new SystemClock();
//     var model = new Model(datastore, clock);
//     var controller = new WebController(datastore, model);
//     var view = new WebView(model);
//     view.init();
//
//     start(datastore, controller, "prod");
//
// }
//
async function start(datastore, controller, mode) {

    await datastore.init();

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
