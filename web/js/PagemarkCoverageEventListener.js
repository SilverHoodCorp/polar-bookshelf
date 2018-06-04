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

        // FIXME: we're closer now.. but we have to factor in some sort of static offet.

        let pageElement = Elements.untilRoot(event.target, ".page");

        if(! pageElement) {
            console.log("Not within a pageElement");
            return;
        }

        // FIXME: we need to do this from the textLayer not the pageElement. the
        // page has a bit of padding in it...
        var textLayerElement = pageElement.querySelector(".textLayer");

        if(!textLayerElement) {
            console.error("No text layer");
            return;
        }

        let viewport = document.getElementById("viewerContainer");

        // FIXME: this is part of the problem too.. the textLayerElement is
        // returning 0 for the top for some reason... perhaps because it's
        // absolutely positioned?

        // FIXME: this must be the bug now...
        let pageOffset = OffsetCalculator.calculate(textLayerElement, viewport.parentElement);

        console.log("FIXME: pageOffset: ", JSON.stringify(pageOffset, null, "  "));

        let mouseTop = event.pageY + viewport.scrollTop;

        console.log("FIXME: mouseTop: ", mouseTop);

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
