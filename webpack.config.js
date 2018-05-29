var path = require('path');

module.exports = {
    mode: 'development',
    entry: path.resolve(__dirname, 'web/wp-entry.js'),
    output: {
        path: path.resolve(__dirname, 'web'),
        filename: 'bundle.js',
        publicPath: '/web'
    }
};
