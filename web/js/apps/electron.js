
const {PersistenceLayer} = require("../datastore/PersistenceLayer.js");
const {Launcher} = require("./Launcher");

async function persistenceLayerFactory() {

    const remote = require('electron').remote;

    console.log("Accessing datastore...");
    let datastore = remote.getGlobal("diskDatastore" );
    console.log("Accessing datastore...done");

    return new PersistenceLayer(datastore);

}

new Launcher(persistenceLayerFactory).launch().then(function () {
    console.log("App now loaded.");
});
