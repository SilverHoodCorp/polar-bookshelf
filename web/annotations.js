/**
 * Create a pagemark on the given page which marks it read.
 * @param page
 */
function createPagemark(page) {

    // do nothing if the current page already has a pagemark.

    if (page.querySelector(".pagemark")) {
        return;
    }

    let pagemark = document.createElement("div");

    // make sure we have a reliable CSS classname to work with.
    pagemark.className="pagemark";

    // set CSS style
    pagemark.style.backgroundColor="rgb(198, 198, 198, 0.5)";
    pagemark.style.position="absolute";
    pagemark.style.left = "0";
    pagemark.style.top = "0";
    pagemark.style.width = page.style.width;
    pagemark.style.height = page.style.height;
    pagemark.style.zIndex = "0";

    let canvasWrapper = page.querySelector(".canvasWrapper");
    let textLayer = page.querySelector(".textLayer");

    // this must be above the pagemark layer or you won't be able to select text
    // visually.

    textLayer.style.zIndex = "2";

    page.insertBefore(pagemark, canvasWrapper);

    // add an event listener to listen for when the page is redrawn.  We only
    // call this event listener once, then it's removed so we should create the
    // pagemark, then put in protection code so that if it's removed, it will
    // go back in if the page is ever redrawn.
    page.addEventListener('DOMNodeInserted', function(event) {

        if (event.target && event.target.className === "endOfContent") {

            console.log("Adding page mark again");

            // make sure to first remove all the existing pagemarks if there
            // are any
            removePagemarks(page);

            // we're done all the canvas and text nodes... so place the pagemark
            // back in again.

            createPagemark(page);

            // done listening so remove myself...
            page.removeEventListener('DOMNodeInserted',arguments.callee,false);

        }

    }, false );

}

function removePagemarks(page) {

    console.log("Removing pagemarks...");

    let pagemarks = page.querySelectorAll(".pagemark");

    pagemarks.forEach(function (pagemark) {
        page.removeChild(pagemark);
        console.log("Removed pagemark.");
    });

    console.log("Removing pagemarks...done");

}

function getCurrentPage() {

    // TODO: It is probably easier to use pdf.pageNum but I'm not sure if this
    // is actively updated or not.
    let pages = document.querySelectorAll(".page");

    let result = { element: null, visibility: 0};

    pages.forEach(function (page) {
        let visibility = calculateVisibilityForDiv(page);

        if ( visibility > result.visibility) {
            result.element = page;
            result.visibility = visibility;
        }

    });

    return result.element;

}

function calculateVisibilityForDiv(div) {

    if(div == null)
        throw Error("Not given a div");

    var windowHeight = $(window).height(),
        docScroll = $(document).scrollTop(),
        divPosition = $(div).offset().top,
        divHeight = $(div).height();

    var hiddenBefore = docScroll - divPosition,
        hiddenAfter = (divPosition + divHeight) - (docScroll + windowHeight);

    if ((docScroll > divPosition + divHeight) || (divPosition > docScroll + windowHeight)) {
        return 0;
    } else {
        var result = 100;

        if (hiddenBefore > 0) {
            result -= (hiddenBefore * 100) / divHeight;
        }

        if (hiddenAfter > 0) {
            result -= (hiddenAfter * 100) / divHeight;
        }

        return result;
    }

}

function keyBindingPagemarkEntirePage(event) {
    console.log("Marking entire page as read.");

    let page = getCurrentPage();
    createPagemark(page);

}

function keyBindingPagemarkUpToMouse(event) {
    console.log("Marking page as read up to mouse point");
}

function keyBindingRemovePagemark(event) {
    console.log("Removing pagemark.");
    let page = getCurrentPage();
    removePagemarks(page);
}

function keyBindingListener(event) {

    if (event.ctrlKey && event.altKey) {

        const mCode = 77;
        const nCode = 78;
        const rCode = 82;

        switch (event.which) {

            case mCode:
                keyBindingPagemarkUpToMouse(event);
                break;

            case nCode:
                keyBindingPagemarkEntirePage(event);
                break;

            case rCode:
                keyBindingRemovePagemark(event);
                break;

            default:
                break;

        }

    }

}

function registerKeyBindings() {

    if(polar.state.registerKeyBindings) {
        return;
    }

    document.addEventListener("keyup", keyBindingListener);

    polar.state.registerKeyBindings = true;

    console.log("Key bindings registered");

}

registerKeyBindings();
//getCurrentPage();

console.log("Annotation code loaded.");


