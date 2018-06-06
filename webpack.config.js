var path = require('path');
//
// module.exports = {
//     mode: 'development',
//     entry: path.resolve(__dirname, 'web/js/entry.js'),
//     output: {
//         path: path.resolve(__dirname, 'web/js'),
//         filename: 'bundle.js',
//         publicPath: '/web/js'
//     }
// };

module.exports = {
    mode: 'development',
    entry: {
        app: './web/js/app.js',
        test: './web/js/test.js'
    },
    output: {
        filename: '[name]-bundle.js',
        path: __dirname + '/web/js'
    }
}