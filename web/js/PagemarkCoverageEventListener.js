//import $ from 'jquery';

console.log("FIXME6 module.exports", module.exports);

const {Delegator, Styles, Elements, OffsetCalculator} = require("./utils.js");
const {KeyEvents} = require("./KeyEvents.js");

module.exports.PagemarkCoverageEventListener = class {

    constructor(controller) {
        this.controller = controller;
        this.keyActivated = false;
    }

    /**
     * Track that we've selected 'e' on the keyboard,
     */
    keyListener(event) {

        console.log(event);

        if(!event) {
            throw new Error("no event");
        }

        // on MacOS t needs to be Alt + Meta. Control is already bound.
        if (KeyEvents.isKeyMetaActive(event)) {
            console.log("FIXME: active now");
            this.keyActivated = true;
        } else {

            console.log("FIXME: INactive now");
            this.keyActivated = false;
        }

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

        // FIXME: we're closer now.. but we have to factor in some sort of static offet.

        let pageElement = Elements.untilRoot(event.target, ".page");

        if(! pageElement) {
            console.log("Not within a pageElement");
            return;
        }

        var textLayerElement = pageElement.querySelector(".textLayer");

        if(!textLayerElement) {
            console.error("No text layer");
            return;
        }

        let viewport = document.getElementById("viewerContainer");

        let pageOffset = OffsetCalculator.calculate(textLayerElement, viewport.parentElement);

        // FIXME: this is lame.. this is for the border.
        pageOffset.top += 9;

        // manually adjust the offsets with correct jquery data.
        pageOffset.height = $(textLayerElement).height();
        pageOffset.bottom = pageOffset.top + pageOffset.height;

        let mouseTop = event.pageY + viewport.scrollTop;

        if(mouseTop >= pageOffset.top && mouseTop <= pageOffset.bottom) {

            // make sure the current mouse position is within a page.

            let mousePageY = mouseTop - pageOffset.top;

            let percentage = (mousePageY / pageOffset.height) * 100;

            console.log("percentage: ", percentage);

            let pageNum = this.controller.getPageNum(pageElement);
            this.controller.erasePagemark(pageNum);
            this.controller.createPagemark(pageNum, {percentage});

        } else {
            console.log("Mouse click was outside of page.")
        }

    }

    startListening() {
        document.addEventListener("keyup", this.keyListener.bind(this));
        document.addEventListener("keydown", this.keyListener.bind(this));
        document.addEventListener("click", this.mouseListener.bind(this));
    }

};
