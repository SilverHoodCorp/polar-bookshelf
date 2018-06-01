
// FIXME: this script BASICALLY works but it shares a LOT in common with the
// other createPagemark function so I think I should clean these up.  Maybe
// pass in a few things like the referenceElement and so forth.]
//
// I think I need to pass in a wrapperElement and then a referenceElement
//
// wrapperElement: the .page or .thumbnail which holds the object we want to
// wrap.

/**
 * Create a pagemark on the given page which marks it read.
 * @param pageElement
 */
function createPagemark(pageElement, options) {

    if(! options) {
        options = {};
    }

    if(! options.zIndex)
        options.zIndex = 0;

    // do nothing if the current page already has a pagemark.

    if (pageElement.querySelector(".pagemark")) {
        console.warn("Pagemark already exists");
        return;
    }

    // the templateElement is what we should use as a reference to style our pagemark.

    var templateElement = pageElement.querySelector(".page, .thumbnailImage");

    let pagemark = document.createElement("div");

    // make sure we have a reliable CSS classname to work with.
    pagemark.className="pagemark";

    // set CSS style

    //pagemark.style.backgroundColor="rgb(198, 198, 198)";
    pagemark.style.backgroundColor="#00CCFF";
    pagemark.style.opacity="0.3";

    pagemark.style.position="absolute";

    // FIXME there is no width and height on this element so get it

    pagemark.style.left = templateElement.offsetLeft;
    pagemark.style.top = templateElement.offsetTop;
    pagemark.style.width = templateElement.style.width;
    pagemark.style.height = templateElement.style.height;
    pagemark.style.zIndex = options.zIndex;

    if(!pagemark.style.width)
        throw new Error("Could not determine width");

    // FIXME: I think this is the last thing we need to refactor.. the
    // thumbnailImage needs to be passed in and be the canvasWrapper with
    // real pages and the thumbnailImage on other pages.

    // the placement element allows us to deteremine, where in the DOM to place
    // our pagemark element.
    let placementElement = pageElement.querySelector(".thumbnailImage");

    // TODO: I don't think this is actually true right now and that we CAN
    // select the text layer.
    // this must be above the pagemark layer or you won't be able to select text
    // visually.
    //let textLayer = pageElement.querySelector(".textLayer");
    //textLayer.style.zIndex = "2";

    // must be BEFORE the img.. not after...

    targetElement.parentElement.insertBefore(pagemark, targetElement);

}

document.querySelectorAll(".thumbnail").forEach(function (thumbnailElement) {

    if (thumbnailElement.querySelector("img") == null)
        return;

    createPagemark(thumbnailElement, {zIndex: 1});
})

