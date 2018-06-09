const $ = require('jquery');

const {Elements, OffsetCalculator} = require("./utils.js");
const {KeyEvents} = require("./KeyEvents.js");

const BORDER_PADDING = 9;

module.exports.PagemarkCoverageEventListener = class {

    constructor(controller) {
        this.controller = controller;
        this.keyActivated = false;
    }

    start() {
        document.addEventListener("keyup", this.keyListener.bind(this));
        document.addEventListener("keydown", this.keyListener.bind(this));
        document.addEventListener("click", this.mouseListener.bind(this));
    }

    /**
     * Track that we've selected 'e' on the keyboard,
     */
    keyListener(event) {

        console.log(event);

        if(!event) {
            throw new Error("no event");
        }

        this.keyActivated = KeyEvents.isKeyMetaActive(event);

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

        let pageElement = Elements.untilRoot(event.target, ".page");

        if(! pageElement) {
            console.log("Not within a pageElement");
            return;
        }

        let textLayerElement = pageElement.querySelector(".textLayer");

        if(!textLayerElement) {
            console.error("No text layer");
            return;
        }

        let viewport = document.getElementById("viewerContainer");

        let pageOffset = OffsetCalculator.calculate(textLayerElement, viewport.parentElement);

        // this is lame.. this is for the border padding.  I don't like hard coding it.
        pageOffset.top += BORDER_PADDING;

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

};
