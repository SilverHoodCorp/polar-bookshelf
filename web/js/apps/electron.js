const {WebController} = require("../controller/WebController.js");
const {WebView} = require("../view/WebView.js");

const {SystemClock} = require("../time/SystemClock.js");
const {PersistenceLayer} = require("../datastore/PersistenceLayer.js");
const {Model} = require("../model.js");
const {Launcher} = require("./Launcher");

async function launchProd(launcher) {

    console.log("Launching in prod mode.");
    const remote = require('electron').remote;

    console.log("Accessing datastore...");
    let datastore = remote.getGlobal("diskDatastore" );
    console.log("Accessing datastore...done");

    let persistenceLayer = new PersistenceLayer(datastore);
    let clock = new SystemClock();
    let model = new Model(persistenceLayer, clock);
    let controller = new WebController(model);
    let view = new WebView(model);
    view.init();

    console.log("Starting ...");

    await launcher.start(persistenceLayer, controller, "prod");

}

new Launcher(launchProd).launch();
