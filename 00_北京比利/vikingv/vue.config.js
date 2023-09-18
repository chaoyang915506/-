const webpack = require('webpack');

module.exports = {
    publicPath: '/vikingv',
    devServer: {
        contentBase: './dist',
        port: 59998,
    },
    pages: {
        device: {
            entry: 'src/pages/device/main.js', template: 'public/index.html', filename: 'device/index.html'
        },
        notice: {
            entry: 'src/pages/notice/main.js', template: 'public/index.html', filename: 'notice/index.html'
        }
    },
    configureWebpack: {
        plugins: [
            new webpack.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery',
                'window.jQuery': 'jquery',
            })
        ],
    }
};