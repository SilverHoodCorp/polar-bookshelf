var path = require('path');

module.exports = {
    mode: 'development',
    //target: "electron-renderer",
    entry: {
        app: './web/js/app.js',
        //test: './web/js/test.js'
    },
    output: {
        path: path.resolve(__dirname, 'web/js'),
        filename: '[name]-bundle.js',
        publicPath: '/web/js'
    },
    node: {
        //needed to make webpack work.
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
