import {Delegator, Styles, Elements, OffsetCalculator} from "./utils.js";

export class PagemarkCoverageEventListener {

    constructor(controller) {
        this.controller = controller;
        this.keyActivated = true;
    }

    /**
     * Track that we've selected 'e' on the keyboard,
     */
    keyListener(event) {
        //
        // if(!event) {
        //     throw new Error("no event");
        // }
        //
        // if (event.ctrlKey && event.altKey) {
        //
        //     const eCode = 69;
        //
        //     switch (event.which) {
        //
        //         case eCode:
        //
        //             this.keyActivated = true;
        //             break;
        //
        //         default:
        //
        //             this.keyActivated = false;
        //             break;
        //
        //     }
        //
        // }

    }

    mouseListener(event) {

        if(!event) {
            throw new Error("no event");
        }

        if(!this.keyActivated) {
            return;
        }

        this.onActivated(event);

    }


    // https://stackoverflow.com/questions/3234256/find-mouse-position-relative-to-element
    onActivated(event) {

        console.log("ACTIVATED");

        // FIXME: migrate this to use the event.target and search from the DOM
        // up to find the .page
        //let pageElement = this.controller.getCurrentPageElement();

        let pageElement = Elements.untilRoot(event.target, ".page");

        if(! pageElement) {
            console.log("Not within a pageElement");
            return;
        }

        let viewport = document.getElementById("viewer");

        let pageOffset = OffsetCalculator.calculate(pageElement, document);

        let mouseTop = event.pageY + viewport.scrollTop;

        if(mouseTop >= pageOffset.top && mouseTop <= pageOffset.bottom) {

            // make sure the current mouse position is within a page.

            let mousePageY = mouseTop - pageOffset.top;

            let percentage = (mousePageY / pageOffset.height) * 100;

            console.log("percentage: ", percentage);

        } else {
            console.log("Mouse click was outside of page.")
        }

    }

    startListening() {
        document.addEventListener("keyup", this.keyListener.bind(this));
        document.addEventListener("keydown", this.keyListener.bind(this));
        document.addEventListener("click", this.mouseListener.bind(this));
    }

}
