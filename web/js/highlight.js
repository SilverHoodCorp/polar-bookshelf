function createHighlight() {
    // FIXME use all the lighlights

    var highlightElement = document.createElement("div");
    highlightElement.style.zIndex = 0;

    var boundingClientRect = window.getSelection().getRangeAt(0).getBoundingClientRect();

    console.log("FIXME: ", boundingClientRect);

    highlightElement.style.position = "absolute";
    highlightElement.style.left = `${boundingClientRect.left}px`;
    highlightElement.style.top = `${boundingClientRect.top}px`;
    highlightElement.style.width = `${boundingClientRect.width}px`;
    highlightElement.style.height = `${boundingClientRect.height}px`;

    highlightElement.style.backgroundColor = 'yellow';
    highlightElement.style.opacity="0.3";

    document.body.appendChild(highlightElement);

}


createHighlight();
