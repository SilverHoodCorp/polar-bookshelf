//const $ = require('jquery');

// FIXME: this is not working for soem reason and I ahve NO ideawhy.. module.exports is setup properly.

//const simplemde = require("simplemde");
const {SimpleMDE} = require("../../node_modules/simplemde/src/js/simplemde.js");
let foo = require("../../node_modules/simplemde/src/js/simplemde.js");;

console.log("FIXME foo", foo);
console.log("FIXME foo.SimpleMDE", foo.SimpleMDE);
console.log("FIXME SimpleMDE", SimpleMDE);

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


function doLoad() {

    console.log("FIXME: SimpleMDE: ", SimpleMDE);

    let element = document.getElementById("editor");
    if (! element)
        throw new Error("No editor element");

    let simplemde = new SimpleMDE({ element, spellChecker: false });
    simplemde.value();

}


if (document.readyState === "complete" || document.readyState === "loaded" || document.readyState === "interactive") {
    console.log("Already completed loading.");
    doLoad();
} else {
    console.log("Waiting for DOM content to load");
    document.addEventListener('DOMContentLoaded', doLoad, true);
}

window.setTimeout(function () {
    console.log("FIXME2: SimpleMDE: ", SimpleMDE);

}, 2500);
