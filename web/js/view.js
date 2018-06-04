import {Delegator, Styles, Elements} from "./utils.js";

export class View {

    constructor(model) {
        this.model = model;
    }

}



export class WebView extends View {

    constructor(model) {
        super(model);

        /**
         * The currently defined renderer for pagemarks.
         */
        this.pagemarkRenderer = null;

    }

    init() {

        this.model.registerListenerForCreatePagemark(this.onCreatePagemark.bind(this));
        this.model.registerListenerForErasePagemark(this.onErasePagemark.bind(this));
        this.model.registerListenerForDocumentLoaded(this.onDocumentLoaded.bind(this));

        return this;

    }

    updateProgress() {

        var perc = this.computeProgress(this.model.docMeta);

        console.log("Percentage is now: " + perc);

        document.querySelector("#pagemark-process").value = perc;

        // now update the description of the doc at the bottom.

        var description = DocMetaDescriber.describe(this.model.docMeta);

        document.querySelector("#polar-doc-overview").textContent = description;

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

        var pagemarkRendererDelegates = [
            new MainPagemarkRenderer(this),
            new ThumbnailPagemarkRenderer(this)
        ];

        this.pagemarkRenderer = new CompositePagemarkRenderer(this, pagemarkRendererDelegates);
        this.pagemarkRenderer.setup();

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

    onCreatePagemark(pagemarkEvent) {

        console.log("Creating pagemark on page: " + pagemarkEvent.pageNum);

        //this.createPagemark(this.getPageElementByNum(pageEvent.num));

        this.pagemarkRenderer.create(pagemarkEvent.pageNum, pagemarkEvent.pagemark);
        this.updateProgress();

    }

    onErasePagemark(pagemarkEvent) {
        console.log("Erasing pagemark");

        //let pageElement = this.getPageElementByNum(pageEvent.num);
        //this.erasePagemarks(pageElement);

        this.pagemarkRenderer.erase(pagemarkEvent.pageNum);
        this.updateProgress();

    }

    async recreatePagemarksFromPagemarks(pageElement, options) {

        var pageNum = this.getPageNum(pageElement);

        var docMeta = this.model.docMeta;

        var pageMeta = docMeta.pageMetas[pageNum];

        forDict(pageMeta.pagemarks, function (column, pagemark) {

            console.log("Creating pagemarks for page: " + pageNum);

            var recreatePagemarkOptions = Object.assign({}, options);

            recreatePagemarkOptions.pagemark = pagemark;

            this.recreatePagemark(pageElement, recreatePagemarkOptions);

        }.bind(this));

        //this.recreatePagemark(pageElement);

    }

    getPageNum(pageElement) {
        let dataPageNum = pageElement.getAttribute("data-page-number");
        return parseInt(dataPageNum);
    }

    recreatePagemark(pageElement, options) {

        if(! options.pagemark) {
            throw new Error("No pagemark.");
        }

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

        this.createPagemark(pageElement, options);

    }

    /**
     * Create a pagemark on the given page which marks it read.
     * @param pageElement
     */
    createPagemark(pageElement, options) {

        if(! options) {
            throw new Error("Options are required");
        }

        if(! options.pagemark) {
            throw new Error("Pagemark is required");
        }

        if(! options.pagemark.percentage) {
            throw new Error("Pagemark has no percentage");
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

        if(! options.templateElement) {
            throw new Error("No templateElement");
        }

        if(! options.placementElement) {
            throw new Error("No placementElement");
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

        // FIXME: the height should actually be a percentage of the pagemark
        // percentage.

        var height = Styles.parsePixels(options.templateElement.style.height);

        // FIXME: read the percentate coverage from the pagemark and adjust the
        // height to reflect the portion we've actually read.
        height = height * (options.pagemark.percentage / 100);

        pagemark.style.height = `${height}px`;

        pagemark.style.zIndex = options.zIndex;

        if(!pagemark.style.width)
            throw new Error("Could not determine width");

        options.placementElement.parentElement.insertBefore(pagemark, options.placementElement);

    }

    redrawPagemark() {

    }

    erasePagemarks(pageElement) {

        if(!pageElement) {
            throw new Error("No pageElement");
        }

        console.log("Erasing pagemarks...");

        let pagemarks = pageElement.querySelectorAll(".pagemark");

        pagemarks.forEach(function (pagemark) {
            pagemark.parentElement.removeChild(pagemark);
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
        this.pageElements = [];

        // the CSS selector for pulling out the right pageElements.
        this.pageElementSelector = null;
    }

    setup() {

    }

    __setup() {

        // FIXME: now we need a way to clear a given page by keeping a reference
        // to the page renderer for that page and then call erase on it once it
        // has been removed.

        this.__updatePageElements();

        console.log(`Working with ${this.pageElements.length} elements for selector ${this.pageElementSelector}` );

        this.pageElements.forEach( function (pageElement) {
            this.init(pageElement);
        }.bind(this));

    }

    __updatePageElements() {
        this.pageElements = document.querySelectorAll(this.pageElementSelector);
    }

    init(pageElement) {

        if(this.__requiresPagemark(pageElement)) {
            this.__render(pageElement);
        }

        this.__registerListener(pageElement);

    }

    /**
     * Return true if the target needs a pagemark.
     */
    __requiresPagemark(pageElement) {

    }

    /**
     * Register future listeners to monitor status.
     */
    __registerListener(pageElement) {

    }

    __render(pageElement) {
    }

    /**
     * Erase the page elements on the give page number.
     */
    create(pageNum, pagemark) {

        if(typeof pageNum !== "number") {
            throw new Error("pageNum is not a number");
        }

        if(!pagemark) {
            throw new Error("No pagemark.");
        }

        this.__updatePageElements();

        var pageElement = this.pageElements[pageNum-1];

        if(!pageElement) {
            throw new Error(`No pageElement for pageNum ${pageNum} out of ${this.pageElements.length} pageElements`);
        }

        this.__render(pageElement);
    }

    /**
     * Erase the pagemarks on the give page number.
     */
    erase(pageNum) {

        if(typeof pageNum !== "number") {
            throw new Error("pageNum is not a number");
        }

        this.__updatePageElements();

        var pageElement = this.pageElements[pageNum-1];

        if(!pageElement) {
            throw new Error(`No pageElement for pageNum ${pageNum} out of ${this.pageElements.length} pageElements`);
        }

        this.view.erasePagemarks(pageElement);
    }

}

/**
 * Handles attaching pagemarks to the pages (as opposed to thumbnails).
 */
class MainPagemarkRenderer extends PagemarkRenderer {

    constructor(view) {
        super(view);
        this.pageElementSelector = ".page";

    }

    setup() {
        this.__setup();
    }

    __requiresPagemark(pageElement) {
        return pageElement.querySelector("canvas") != null;
    }

    __registerListener(pageElement) {

        pageElement.addEventListener('DOMNodeInserted', function(event) {

            if (event.target && event.target.className === "endOfContent") {
                this.__render(pageElement);
            }

        }.bind(this), false );

    }

    __render(pageElement) {
        this.view.recreatePagemarksFromPagemarks(pageElement);
    }

}

/**
 * Handles attaching pagemarks to the pages (as opposed to thumbnails).
 */
class ThumbnailPagemarkRenderer extends PagemarkRenderer {

    constructor(view) {
        super(view);
        this.pageElementSelector = ".thumbnail";
    }

    setup() {
        this.__setup();
    }

    __requiresPagemark(pageElement) {
        let thumbnailImage = pageElement.querySelector(".thumbnailImage");
        return thumbnailImage != null && thumbnailImage.getAttribute("src") != null;
    }

    __registerListener(pageElement) {

        pageElement.querySelector(".thumbnailSelectionRing").addEventListener('DOMNodeInserted', function(event) {

            if (event.target && event.target.className === "thumbnailImage") {
                this.__render(pageElement);
            }

        }.bind(this), false );

    }

    __render(pageElement) {

        var templateElement = pageElement.querySelector(".thumbnailImage");

        if( ! templateElement) {
            throw new Error("No templateElement");
        }

        var options = {zIndex: 1, templateElement, placementElement: templateElement};

        this.view.recreatePagemarksFromPagemarks(pageElement, options);

    }

}

class CompositePagemarkRenderer extends PagemarkRenderer {

    constructor(view, delegates) {
        super(view);

        if(!delegates) {
            throw new Error("No delegates");
        }

        this.delegator = new Delegator(delegates);
    }

    setup() {
        this.delegator.apply("setup");
    }

    create(pageNum, pagemark) {
        this.delegator.apply("create", pageNum, pagemark);
    }

    erase(pageNum) {
        this.delegator.apply("erase", pageNum);
    }

}
