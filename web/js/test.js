//
// let container = document.getElementById('viewerContainer');
//
// container.addEventListener('pagesinit', function () {
//
//     console.log("FIXME: pagesinit");
// });
//
// container.addEventListener('pagechanging', function () {
//     console.log("FIXME: pagesinit");
// });
//
// container.addEventListener('pagechange', function () {
//     console.log("FIXME: pagechange");
//
// });
//
// container.addEventListener('pagerendered', function () {
//     console.log("FIXME: pagerendered");
//
// });
//
// container.addEventListener('pageloaded', function () {
//     console.log("FIXME: pageloaded");
// });
//
//
// container.addEventListener('updateviewarea', function () {
//     console.log("FIXME: updateviewarea");
// });
//
// // NOTE: we have to wait for textlayerrendered because pagerendered
// // doesn't give us the text but pagerendered is called before
// // textlayerrendered anyway so this is acceptable.
// container.addEventListener('textlayerrendered', function () {
//     console.log("FIXME: textlayerrendered");
// }
//
//

async test() {
    var promise = new Promise(resolve => {
        setTimeout(() => {
            resolve("yup");
        }, 2000);
    });

    console.log("Awaiting a first time: " + await promise);
    console.log("Awaiting a second time: " + await promise);

}

