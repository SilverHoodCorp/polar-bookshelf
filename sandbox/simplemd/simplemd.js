const $ = require('jquery')
jQuery = $;
//const bootstrap = require('bootstrap');
const featherlight = require('featherlight');
const {Elements} = require("../../web/js/util/Elements.js");

// FIXME: this is not working for soem reason and I ahve NO ideawhy.. module.exports is setup properly.

const SimpleMDE = require("simplemde");
//const SimpleMDE = require("../../node_modules/simplemde/src/js/simplemde.js");

// require("marked");
// require("prettify");
// require("raphael");
// require("underscore");
//require("flowchart");

//require('editormd');
//
// jquery          : "../examples/js/jquery.min",
//     marked          : "marked.min",
//     prettify        : "prettify.min",
//     raphael         : "raphael.min",
//     underscore      : "underscore.min",
//     flowchart       : "flowchart.min",
//     jqueryflowchart : "jquery.flowchart.min",
//     sequenceDiagram : "sequence-diagram.min",
//     katex           : "//cdnjs.cloudflare.com/ajax/libs/KaTeX/0.1.1/katex.min",
//     editormd        : "../editormd.amd" // Using Editor.md amd version for Require.js


function createElementHTML(innerHTML) {

    let div = document.createElement("div");
    div.innerHTML = innerHTML;

    return div;

}

function createModal2() {

    let innerHTML = `<div id="mylightbox" class="polar-lightbox" style="">
        <div id="editor-content">
            <textarea id="editor" autofocus></textarea>
        </div>
    </div>
    `;

    let element = createElementHTML(innerHTML);

    $(element).show();
    document.body.appendChild(element);

    let editor = document.getElementById("editor");

    if (! editor)
        throw new Error("No editor element");

    console.log("Setting up simplemde");

    // TODO: why no spell checker?
    let simplemde = new SimpleMDE({ editor, spellChecker: false });
    simplemde.value();

    editor.focus();

};

function createModal() {

    let innerHTML = `<div id="mylightbox" class="polar-lightbox">

        <div id="editor-content">
            <textarea id="editor" autofocus></textarea>
        </div>
        
        <div class="modal-footer">
            <button>Save</button>
        </div>
        
    </div>
    `;

    let lightbox = createElementHTML(innerHTML);

    $.featherlight($(lightbox).show());

    let editorElement = document.querySelector("#editor");

    if (! editorElement)
        throw new Error("No editor element");

    console.log("Setting up simplemde");

    // TODO: why no spell checker?
    let simplemde = new SimpleMDE({ editorElement, spellChecker: false, hideIcons: ["side-by-side", "fullscreen"] });
    //simplemde.toggleSideBySide(editor);
    simplemde.value();

    console.log("FIXME6", simplemde._rendered);

    attachImagePasteListener($(".CodeMirror"));

    $(".CodeMirror").on('paste', function (e) {

        console.log("Got paste event in editor... ");

    });

    handlePaste(editorElement);

}

function attachImagePasteListener(element) {

    $(element).on('paste', function (e) {

        console.log("Got paste event!")

        let orgEvent = e.originalEvent;
        for (let i = 0; i < orgEvent.clipboardData.items.length; i++) {
            if (orgEvent.clipboardData.items[i].kind === "file" && orgEvent.clipboardData.items[i].type === "image/png") {
                let imageFile = orgEvent.clipboardData.items[i].getAsFile();
                let fileReader = new FileReader();

                fileReader.onloadend = function () {

                    console.log(fileReader.result);

                    //$('#result').html();
                }

                fileReader.readAsDataURL(imageFile);
                break;
            }
        }
    });

}

function createImageMarkdownElement(url, altText) {

    let imageElementHTML = `
    
    <div class="CodeMirror-code polar-image-pasted" role="presentation">
        <pre class=" CodeMirror-line " role="presentation">
            <span role="presentation" style="padding-right: 0.1px;">
                <span class="cm-formatting cm-formatting-image cm-image cm-image-marker">!</span>
                <span class="cm-formatting cm-formatting-image cm-image cm-image-alt-text cm-link">[]</span>
                <span class="cm-formatting cm-formatting-link-string cm-string cm-url">(</span>
                <span class="cm-string cm-url">http://</span>
                <span class="cm-formatting cm-formatting-link-string cm-string cm-url">)</span>
            </span>
        </pre>
    </div>

    `

    let imageElementHTMLolde = `
        <div class="CodeMirror-code " role="presentation">
            <pre class=" CodeMirror-line" role="presentation">
                <span role="presentation" style="padding-right: 0.1px;">
                <span class="cm-formatting cm-formatting-image cm-image cm-image-marker">!</span>
                <span class="cm-formatting cm-formatting-image cm-image cm-image-alt-text cm-link">[</span>
                <span class="cm-image cm-image-alt-text cm-link">this is the text of the image</span>
                <span class="cm-formatting cm-formatting-image cm-image cm-image-alt-text cm-link">]</span>
                <span class="cm-formatting cm-formatting-link-string cm-string cm-url">(</span>
                <span class="cm-string cm-url">https://example.com/image.jpg</span>
                <span class="cm-formatting cm-formatting-link-string cm-string cm-url">)</span>
                </span>
            </pre>
        </div>    
    `;

    // create the markdown that we want to inject
    // FIXME: I think this should be firstChild but for some reason it's #text..

    let imageMarkdownElement
        = Elements.createElementHTML(imageElementHTML)
                  .querySelector(".CodeMirror-code");

    $(imageMarkdownElement).find(".cm-url").text();
    $(imageMarkdownElement).find(".cm-image-alt-text").text(altText);

    return imageMarkdownElement;

}

function handlePaste(editorElement) {

    let url = "https://cdn.cnn.com/cnnnext/dam/assets/180612003916-05-trump-kim-summit-unfurled-exlarge-tease.jpg";
    let altText = "alt text";

    let imageMarkdownElement = createImageMarkdownElement(url, altText);

    console.log("FIXME the markdown element we're going to insert: ", imageMarkdownElement);

    let cursorElement = editorElement.querySelector(".CodeMirror-cursors");

    if(cursorElement) {
        console.log("FIXME1");
        cursorElement.parentElement.insertBefore( imageMarkdownElement, cursorElement);
    } else {
        console.log("FIXME2");
        console.log("FIXMe3", editorElement);

        let codemirrorLines = editorElement.parentElement.querySelector(".CodeMirror-lines div");
        codemirrorLines.appendChild(imageMarkdownElement);
        console.log("FIXMKE inserted", imageMarkdownElement);
    }


}


function doLoad() {

    createModal();

    //console.log("FIXME1");
    //document.getElementById("open-button").addEventListener("click", createModal);

    // $("textarea").on('paste', function (e) {
    //
    //     console.log("Got paste event!");
    //
    // });

    attachImagePasteListener(document.querySelector("textarea"));

}


if (document.readyState === "complete" || document.readyState === "loaded" || document.readyState === "interactive") {
    console.log("Already completed loading.");
    doLoad();
} else {
    console.log("Waiting for DOM content to load");
    document.addEventListener('DOMContentLoaded', doLoad, true);
}
//
// window.setTimeout(function () {
//     console.log("FIXME2: SimpleMDE: ", SimpleMDE);
//
// }, 2500);







