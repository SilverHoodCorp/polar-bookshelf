/**
 * Create a pagemark on the given page which marks it read.
 * @param page
 */
function createPagemark(page) {

    // FIXME: listen to canvasWrapper parent to see when its width/height change
    // then adjust accordingly.

    // TODO: how do I reliably:

    // get the page width?

    // tell when the page is reloaded?



    let pagemark = document.createElement("div");
    pagemark.className="pagemark";

    // TODO: needs to be configured.
    pagemark.style.backgroundColor="rgb(198, 198, 198, 0.5)";
    pagemark.style.position="absolute";
    pagemark.style.left = "0";
    pagemark.style.top = "0";
    pagemark.style.width = page.style.width;
    pagemark.style.height = page.style.height;
    pagemark.style.zIndex = "0";

    // adjust the zIndexes of the text layer so it is above the page mark.

    // TODO: needs to AFTER the canvas wrapper

    let canvasWrapper = page.querySelector(".canvasWrapper");
    let textLayer = page.querySelector(".textLayer");

    // this must be above the pagemark layer.  We might want to experiment
    // with using different layers.
    textLayer.style.zIndex = "1";

    // FIXME: not being inserted before for some reason!
    page.insertBefore(pagemark, canvasWrapper);

}

console.log("Annotation code loaded.");
