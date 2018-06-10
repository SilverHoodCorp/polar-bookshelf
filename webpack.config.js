var path = require('path');

module.exports = [
    {
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

    },
    {
        mode: 'development',
        target: "electron-renderer",
        entry: {
            electron: './web/js/apps/electron.js',
        },
        output: {
            path: path.resolve(__dirname, 'web/js/apps'),
            filename: '[name]-bundle.js',
            publicPath: '/web/js/apps'
        }

    },
    {
        mode: 'development',
        entry: {
            injector: './web/js/apps/injector.js',
        },
        output: {
            path: path.resolve(__dirname, 'web/js/apps'),
            filename: '[name]-bundle.js',
            publicPath: '/web/js/apps'
        }
    }

];
