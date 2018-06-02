function injectScript(src) {

    let script = document.createElement('script');
    script.setAttribute('src', src);
    document.head.appendChild(script);

}

/**
 * Inject our customization around PDFs including custom CSS and custom scripts.
 */
function injectAllScripts() {

    // inject our customizations manually so that we can just depend on the
    // stock pdf.js viewer.html application.

    // TODO: make this into an if / then if we're running in a renderer process.
    if(isElectron()) {
        window.$ = window.jQuery = require('../../node_modules/jquery/dist/jquery.min.js');
    } else {
        injectScript('../../node_modules/jquery/dist/jquery.min.js');
    }

    injectScript('../../web/js/utils.js');
    injectScript('../../web/js/polar.js');
    //injectScript('../../web/js/annotations.js');
    injectScript('../../web/js/metadata.js');
    injectScript('../../web/js/model.js');
    injectScript('../../web/js/view.js');
    injectScript('../../web/js/controller.js');
    injectScript('../../web/js/clock.js');
    injectScript('../../web/js/datastore/datastore.js');

}



function launchDev() {

    var clock = new SystemClock();
    var datastore = new MemoryDatastore();
    var model = new Model(datastore, clock);
    var controller = new WebController(datastore, model);
    var view = new WebView(model);

    // create some fake documents for our example PDFs
    var fingerprint = "110dd61fd57444010b1ab5ff38782f0f";
    datastore.sync(fingerprint, DocMeta.createWithinInitialPagemarks(fingerprint, 14));

    view.init();

    start(datastore, controller, "dev");

}

async function launchProd() {

    const remote = require('electron').remote;
    var datastore = remote.getGlobal("diskDatastore" );

    var clock = new SystemClock();
    var model = new Model(datastore, clock);
    var controller = new WebController(datastore, model);
    var view = new WebView(model);
    view.init();

    start(datastore, controller, "prod");

}

async function start(datastore, controller, mode) {

    await datastore.init();

    controller.startListeners();
    console.log("Controller started in mode: " + mode);

}

function launch(launcherFunction) {

    if (document.readyState === "complete" || document.readyState === "loaded") {
        console.log("Already completed loading.");
        launcherFunction();
    } else {
        console.log("Waiting for DOM content to load");
        document.addEventListener('DOMContentLoaded', launcherFunction, true);
    }

}

function isElectron() {
    return typeof require !== "undefined";
}


injectAllScripts();

if(isElectron()) {
    launch(launchProd);
} else {
    launch(launchDev);
}
