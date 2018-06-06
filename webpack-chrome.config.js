var path = require('path');

module.exports = {
    mode: 'development',
    entry: {
        chrome: './web/js/apps/chrome.js',
    },
    output: {
        path: path.resolve(__dirname, 'web/js/apps'),
        filename: '[name]-bundle.js',
        publicPath: '/web/js/apps'
    },
    node: {
        //needed to make webpack work on chrome
        fs: 'empty'
    }

};

// move these to /dist
//
// module.exports = {
//     mode: 'development',
//     entry: {
//         app: './web/js/app.js',
//         test: './web/js/test.js'
//     },
//     output: {
//         filename: '[name]-bundle.js',
//         path: __dirname + '/web/js'
//     },
//     node: {
//         //needed to make webpack work.
//         fs: 'empty'
//     }
// }
