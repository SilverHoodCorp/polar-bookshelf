class View {

    constructor(model) {
        this.model = model;
    }

}



class WebView extends View {

    constructor(model) {
        super(model);

        this.pagemarkRenderer = null;

    }

    init() {

        this.model.registerListenerForCreatePagemark(this.onCreatePagemark.bind(this));
        this.model.registerListenerForErasePagemark(this.onErasePagemark.bind(this));
        this.model.registerListenerForDocumentLoaded(this.onDocumentLoaded.bind(this));

        this.pagemarkRenderer = new MainPagemarkRenderer(this);

        return this;

    }

    updateProgress() {

        var perc = this.computeProgress(this.model.docMeta);

        console.log("Percentage is now: " + perc);

        document.querySelector("#pagemark-process").value = perc;

    }

    computeProgress(docMeta) {

        // I think this is an issue of being async maybel?

        var total = 0;

        // TODO: this isn't going to work with multiple columns...

        console.log(docMeta.pageMetas);

        forDict(docMeta.pageMetas, function (key, pageMeta) {

            forDict(pageMeta.pagemarks, function (column, pagemark) {

                total += pagemark.percentage;

            }.bind(this));

        }.bind(this));

        var perc = total / (docMeta.docInfo.nrPages * 100);

        return perc;
    }

    /**
     * Setup a document once we detect that a new one has been loaded.
     */
    onDocumentLoaded() {

        console.log("WebView.onDocumentLoaded");

        var pageElements = document.querySelectorAll(".page");

        pageElements.forEach( function (pageElement) {

            if(this.pagemarkRenderer.requiresPagemark(pageElement)) {
                this.recreatePagemarksFromPagemarks(pageElement);
            }

            this.pagemarkRenderer.registerListener(pageElement);

        }.bind(this));

        this.updateProgress();

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

        console.log("Creating pagemark on page: " + pageEvent.num);

        this.createPagemark(this.getPageElementByNum(pageEvent.num));
        this.updateProgress();

    }

    onErasePagemark(pageEvent) {
        console.log("Erasing pagemark");

        this.erasePagemarks(this.getPageElementByNum(pageEvent.num));
        this.updateProgress();
    }

    async recreatePagemarksFromPagemarks(pageElement) {

        var pageNum = this.getPageNum(pageElement);

        var docMeta = this.model.docMeta;

        var pageMeta = docMeta.pageMetas[pageNum];

        forDict(pageMeta.pagemarks, function (column, pagemark) {

            console.log("Creating pagemarks for page: " + pageNum);

            this.recreatePagemark(pageElement, pagemark);

        }.bind(this));

        //this.recreatePagemark(pageElement);

    }

    getPageNum(pageElement) {
        let dataPageNum = pageElement.getAttribute("data-page-number");
        return parseInt(dataPageNum);
    }

    recreatePagemark(pageElement) {

        if( pageElement.querySelector(".pagemark") != null &&
            pageElement.querySelector(".canvasWrapper") != null &&
            pageElement.querySelector(".textLayer") != null ) {

            // Do not recreate the pagemark if:
            //   - we have a .pagemark element
            //   - we also have a .canvasWrapper and a .textLayer

            return;

        }

        // make sure to first remove all the existing pagemarks if there
        // are any
        this.erasePagemarks(pageElement);

        // we're done all the canvas and text nodes... so place the pagemark
        // back in again.

        this.createPagemark(pageElement);

    }

    /**
     * Create a pagemark on the given page which marks it read.
     * @param pageElement
     */
    createPagemark(pageElement, options) {

        if(! options) {
            options = {};
        }

        if(! options.zIndex)
            options.zIndex = 0;

        if(! options.templateElement) {
            options.templateElement = pageElement;
        }

        if (! options.placementElement) {
            // TODO: move this to the object dealing with pages only.
            options.placementElement = pageElement.querySelector(".canvasWrapper");
        }

        if (pageElement.querySelector(".pagemark")) {
            // do nothing if the current page already has a pagemark.
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
        pagemark.style.left = options.templateElement.offsetLeft;
        pagemark.style.top = options.templateElement.offsetTop;
        pagemark.style.width = options.templateElement.style.width;
        pagemark.style.height = options.templateElement.style.height;
        pagemark.style.zIndex = options.zIndex;

        if(!pagemark.style.width)
            throw new Error("Could not determine width");

        options.placementElement.parentElement.insertBefore(pagemark, options.placementElement);

    }

    redrawPagemark() {

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

/**
 *
 */
class PagemarkRenderer {

    constructor(view) {
        this.view = view;
    }

    init() {
    }

    init(pageElement) {
    }

    /**
     * Return true if the target needs a pagemark.
     */
    requiresPagemark(pageElement) {

    }

    /**
     * Register future listeners to monitor status.
     */
    registerListener(pageElement) {

    }

}

/**
 * Handles attaching pagemarks to the pages (as opposed to thumbnails).
 */
class MainPagemarkRenderer extends PagemarkRenderer {

    constructor(view) {
        super(view);
    }

    requiresPagemark(pageElement) {
        return pageElement.querySelector("canvas");
    }

    registerListener(pageElement) {

        pageElement.addEventListener('DOMNodeInserted', function(event) {

            if (event.target && event.target.className === "endOfContent") {
                this.view.recreatePagemarksFromPagemarks(pageElement);
            }

        }.bind(this), false );

    }
}

/**
 * Handles attaching pagemarks to the pages (as opposed to thumbnails).
 */
class ThumbnailPagemarkRenderer extends PagemarkRenderer {

    constructor(view) {
        super(view);
    }

    requiresPagemark(pageElement) {
        return pageElement.querySelector("img");
    }

}
