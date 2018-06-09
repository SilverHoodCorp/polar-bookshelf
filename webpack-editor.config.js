var path = require('path');

module.exports = {
    mode: 'development',
    entry: {
        editor: './web/js/editor.js',
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
