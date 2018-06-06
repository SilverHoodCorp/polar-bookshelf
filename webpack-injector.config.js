var path = require('path');

module.exports = {
    mode: 'development',
    entry: {
        injector: './web/js/apps/injector.js',
    },
    output: {
        path: path.resolve(__dirname, 'web/js/apps'),
        filename: '[name]-bundle.js',
        publicPath: '/web/js/apps'
    }
};
