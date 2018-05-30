function injectScript(src) {

    let script = document.createElement('script');
    script.setAttribute('src', src);
    document.head.appendChild(script);

}

/**
 * Inject our customization around PDFs including custom CSS and custom scripts.
 */
function injectAllScripts() {

    // inject our customizations manually so that we can just depend on the
    // stock pdf.js viewer.html application.

    // window.$ = window.jQuery = require('../../node_modules/jquery/dist/jquery.min.js');

    injectScript('../../node_modules/jquery/dist/jquery.min.js');
    injectScript('../../web/js/polar.js');
    injectScript('../../web/js/annotations.js');
    injectScript('../../web/js/metadata.js');
    injectScript('../../web/js/model.js');
    injectScript('../../web/js/view.js');
    injectScript('../../web/js/controller.js');
    injectScript('../../web/js/clock.js');
    injectScript('../../web/js/datastore/datastore.js');
    injectScript('../../web/js/controller-dev.js');

}

injectAllScripts();
