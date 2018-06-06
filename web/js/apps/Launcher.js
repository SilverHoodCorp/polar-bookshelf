
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
     * @param launchFunction
     */
    constructor(launchFunction) {
        this.launchFunction = launchFunction;
    }


    async start(persistenceLayer, controller, mode) {

        await persistenceLayer.init();

        controller.startListeners();
        console.log("Controller started in mode: " + mode);

    }

    /**
     * Trigger the launch function.
     */
    trigger() {
        this.launchFunction(this);
    }

    launch() {

        if (document.readyState === "complete" || document.readyState === "loaded" || document.readyState === "interactive") {
            console.log("Already completed loading.");
            this.trigger();
        } else {
            console.log("Waiting for DOM content to load");
            document.addEventListener('DOMContentLoaded', this.trigger.bind(this), true);
        }

    }

};
