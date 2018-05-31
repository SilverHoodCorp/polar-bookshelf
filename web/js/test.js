


let docFingerprint = null;

function listenToPageEvents() {

    let container = document.getElementById('viewerContainer');

    container.addEventListener('pagesinit', function () {
        console.log("Got PDF event: pagesinit");
    }.bind(this));

    container.addEventListener('pagechanging', function () {
        console.log("Got PDF event: pagechanging");
    }.bind(this));

    container.addEventListener('pagechange', function () {
        console.log("Got PDF event: pagechange");
    }.bind(this));

    container.addEventListener('pagerendered', function () {
        console.log("Got PDF event: pagerendered");
    }.bind(this));

    container.addEventListener('pageloaded', function (event) {
        console.log("Got PDF event: pageloaded");
    }.bind(this));

    container.addEventListener('updateviewarea', function () {
        console.log("Got PDF event: updateviewarea");
    }.bind(this));

    container.addEventListener('textlayerrendered', function (event) {
        console.log("Got PDF event: textlayerrendered");
    }.bind(this));

}


/**
 * Create a pagemark on the given page which marks it read.
 * @param pageElement
 */
function createPagemark(pageElement) {

    // do nothing if the current page already has a pagemark.

    if (pageElement.querySelector(".pagemark")) {
        console.warn("Pagemark already exists");
        return;
    }

    let pagemark = document.createElement("div");

    // make sure we have a reliable CSS classname to work with.
    pagemark.className="pagemark";

    // set CSS style

    //pagemark.style.backgroundColor="rgb(198, 198, 198)";
    pagemark.style.backgroundColor="#00CCFF";
    pagemark.style.opacity="0.3";

    pagemark.style.position="absolute";
    pagemark.style.left = "0";
    pagemark.style.top = "0";
    pagemark.style.width = pageElement.style.width;
    pagemark.style.height = pageElement.style.height;
    pagemark.style.zIndex = "0";

    let canvasWrapper = pageElement.querySelector(".canvasWrapper");

    // TODO: I don't think this is actually true right now and that we CAN
    // select the text layer.
    // this must be above the pagemark layer or you won't be able to select text
    // visually.
    //let textLayer = pageElement.querySelector(".textLayer");
    //textLayer.style.zIndex = "2";

    pageElement.insertBefore(pagemark, canvasWrapper);

}

function erasePagemarks(pageElement) {

    console.log("Erasing pagemarks...");

    let pagemarks = pageElement.querySelectorAll(".pagemark");

    pagemarks.forEach(function (pagemark) {
        pageElement.removeChild(pagemark);
        console.log("Erased pagemark.");
    });

    console.log("Erasing pagemarks...done");

}

/**
 * Setup a document once we detect that a new one has been loaded.
 */
function setupDocument() {

    var pageElements = document.querySelectorAll(".page");

    pageElements.forEach( function (pageElement) {

        if(pageElement.querySelector("canvas") != null) {
            this.createPagemark(pageElement);
        }

        pageElement.addEventListener('DOMNodeInserted', function(event) {

            if (event.target && event.target.className === "endOfContent") {

                console.log("Adding page mark again");

                // make sure to first remove all the existing pagemarks if there
                // are any
                this.erasePagemarks(pageElement);

                // we're done all the canvas and text nodes... so place the pagemark
                // back in again.

                this.createPagemark(pageElement);

            }

        }.bind(this), false );

    })

}

class WebController {

    constructor() {

        /**
         * The document fingerprint that we have loaded to detect when the
         * documents have changed.  Note that this isn't a secure fingerprint
         * so we might want to change it in the future.
         *
         * @type string
         */
        this.docFingerprint = null;

    }

    listenForDocumentLoad() {

        let container = document.getElementById('viewerContainer');

        container.addEventListener('pagesinit', this.pageEventListener.bind(this));
        container.addEventListener('updateviewarea', this.pageEventListener.bind(this));

    }



}

new WebController().listenForDocumentLoad();
