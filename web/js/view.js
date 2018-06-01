class View {

    constructor(model) {
        this.model = model;
    }

}



class WebView extends View {

    constructor(model) {
        super(model);
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

    }

    computeProgress(docMeta) {

        var total = 0;

        // TODO: this isn't going to work with multiple columns...

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

            // FIXME: have a new method called recreatePagemarkWhenNecessary
            // which will look at the pagemarks and only draw the data
            // when the model has the right data.

            if(pageElement.querySelector("canvas") != null) {
                this.recreatePagemarksFromPagemarks(pageElement);
            }

            pageElement.addEventListener('DOMNodeInserted', function(event) {

                if (event.target && event.target.className === "endOfContent") {
                    this.recreatePagemarksFromPagemarks(pageElement);
                }

            }.bind(this), false );

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
    createPagemark(pageElement) {

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

