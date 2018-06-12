var path = require('path');

module.exports = [
    {
        mode: 'development',
        entry: {
            contextmenu: './sandbox/jquery-contextmenu/contextmenu.js',
        },
        output: {
            path: path.resolve(__dirname, 'sandbox/jquery-contextmenu'),
            filename: '[name]-bundle.js',
        }
    },
    {
        mode: 'development',
        entry: {
            editor: './sandbox/editormd/editormd.js',
        },
        output: {
            path: path.resolve(__dirname, 'sandbox/editormd/'),
            filename: '[name]-bundle.js',
            publicPath: 'sandbox/editormd/'
        }
    },
    {
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

    }

];
