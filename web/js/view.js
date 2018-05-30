class View {

    constructor(model) {
        this.model = model;
    }

}



class WebView extends View {

    constructor(model) {
        super(model);

        this.model.registerListenerForCreatePagemark(this.onCreatePagemark.bind(this));
        this.model.registerListenerForErasePagemark(this.onErasePagemark.bind(this));

    }

    getPageElementByNum(num) {

        if(!num) {
            throw new Error("Page number not specified");
        }

        var pageElements = document.querySelectorAll(".page");

        // note that elements are 0 based indexes but our pages are 1 based
        // indexes.
        var pageElement = pageElements[num - 1];

        if(pageElement == null) {
            throw new Error("Unable to find page element for page num: " + num);
        }

        return pageElement;

    }

    onCreatePagemark(pageEvent) {

        console.log("View updating on page mark read.");

        this.createPagemark(this.getPageElementByNum(pageEvent.num));

    }

    onErasePagemark(pageEvent) {
        console.log("Erasing pagemark");

        this.erasePagemarks(this.getPageElementByNum(pageEvent.num));

    }

    /**
     * Create a pagemark on the given page which marks it read.
     * @param pageElement
     */
    createPagemark(pageElement) {

        // do nothing if the current page already has a pagemark.

        if (pageElement.querySelector(".pagemark")) {
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
        let textLayer = pageElement.querySelector(".textLayer");

        // this must be above the pagemark layer or you won't be able to select text
        // visually.

        textLayer.style.zIndex = "2";

        pageElement.insertBefore(pagemark, canvasWrapper);

        // add an event listener to listen for when the page is redrawn.  We only
        // call this event listener once, then it's removed so we should create the
        // pagemark, then put in protection code so that if it's removed, it will
        // go back in if the page is ever redrawn.
        pageElement.addEventListener('DOMNodeInserted', function(event) {

            if (event.target && event.target.className === "endOfContent") {

                console.log("Adding page mark again");

                // make sure to first remove all the existing pagemarks if there
                // are any
                removePagemarks(pageElement);

                // we're done all the canvas and text nodes... so place the pagemark
                // back in again.

                createPagemark(pageElement);

                // done listening so remove myself...
                pageElement.removeEventListener('DOMNodeInserted',arguments.callee,false);

            }

        }, false );

    }

    erasePagemarks(pageElement) {

        console.log("Erasing pagemarks...");

        let pagemarks = pageElement.querySelectorAll(".pagemark");

        pagemarks.forEach(function (pagemark) {
            pageElement.removeChild(pagemark);
            console.log("Erased pagemark.");
        });

        console.log("Erasing pagemarks...done");

    }

}
