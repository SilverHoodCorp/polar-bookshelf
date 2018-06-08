// FIXME: I should probably create some code to just statically render a page
// with various highlights and then make sure they work properly by (probably)
// comparing the DOM before and AFTER.

function createHighlight() {

    let highlightElement = document.createElement("div");
    highlightElement.style.zIndex = 0;

    let boundingClientRect = window.getSelection().getRangeAt(0).getBoundingClientRect();

    highlightElement.style.position = "absolute";
    highlightElement.style.left = `${boundingClientRect.left}px`;
    highlightElement.style.top = `${boundingClientRect.top}px`;
    highlightElement.style.width = `${boundingClientRect.width}px`;
    highlightElement.style.height = `${boundingClientRect.height}px`;

    highlightElement.style.backgroundColor = 'yellow';
    highlightElement.style.opacity="0.3";

    // FIXME: insert this into the page element.. to the parent div... there is a
    // get common parent method that I should probably use.

    document.body.appendChild(highlightElement);

    // FIXME: now clear the selection once this is done.

    // FIXME: the highlight should/could be BELOW the text and probably should
    // be until it's deleted I think.

}


createHighlight();
