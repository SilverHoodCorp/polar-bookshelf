
function launchDev() {

    var datastore = new MemoryDatastore();
    var model = new Model(datastore);
    var controller = new WebController(datastore, model);
    var view = new WebView(model);

    controller.startListeners();
    console.log("Controller started in dev mode");

}

function launch(launcherFunction) {

    if (document.readyState === "complete" || document.readyState === "loaded") {
        launcherFunction();
    } else {
        document.addEventListener('DOMContentLoaded', launcherFunction(), true);
    }

}

launch(launchDev);
