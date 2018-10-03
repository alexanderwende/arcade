const path = require('path');

module.exports = {
    entry  : './src/js/test-app.js',
    devtool: 'inline-source-map',
    output : {
        filename: 'main.js',
        path    : path.resolve(__dirname, 'dist')
    }
};