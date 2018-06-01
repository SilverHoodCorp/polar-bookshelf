
function launchDev() {

    var clock = new SystemClock();
    var datastore = new MemoryDatastore();
    var model = new Model(datastore, clock);
    var controller = new WebController(datastore, model);
    var view = new WebView(model);
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
        launcherFunction();
    } else {
        document.addEventListener('DOMContentLoaded', launcherFunction(), true);
    }

}

function isElectron() {
    return typeof require !== "undefined";
}

if(isElectron()) {
    launch(launchProd);
} else {
    launch(launchDev);
}


