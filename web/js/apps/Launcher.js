const {SystemClock} = require("../time/SystemClock.js");
const {Model} = require("../model.js");
const {WebController} = require("../controller/WebController.js");
const {WebView} = require("../view/WebView.js");
const {TextHighlightView} = require("../highlights/text/view/TextHighlightView");

/**
 * Basic class for connecting event listeners and then running a launchFunction
 * once the browser is ready.
 *
 * @type {Launcher}
 */
module.exports.Launcher = class {

    /**
     * Launch the app with the given launch function.
     *
     * @param persistenceLayerFactory
     */
    constructor(persistenceLayerFactory) {
        this.persistenceLayerFactory = persistenceLayerFactory;
    }

    /**
     * Trigger the launch function.
     */
    async trigger() {

        let persistenceLayer = await this.persistenceLayerFactory();

        let clock = new SystemClock();
        let model = new Model(persistenceLayer, clock);
        let controller = new WebController(model);
        let view = new WebView(model);

        view.start();
        new TextHighlightView(model).start();

        await persistenceLayer.init();

        controller.start();

    }

    async launch() {

        if (document.readyState === "complete" || document.readyState === "loaded" || document.readyState === "interactive") {
            console.log("Already completed loading.");
            await this.trigger();
        } else {
            console.log("Waiting for DOM content to load");
            document.addEventListener('DOMContentLoaded', this.trigger.bind(this), true);
        }

    }

};
