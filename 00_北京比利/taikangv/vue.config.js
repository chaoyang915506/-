const { ProvidePlugin } = require('webpack')
module.exports = {
    publicPath: '/taikangv',
    pages: {
        goldschool: { entry: 'src/pages/goldschool/main.js', template: 'public/index.html', filename: 'goldschool/index.html' },
        webcast: { entry: 'src/pages/webcast/main.js', template: 'public/index.html', filename: 'webcast/index.html' },
        videolist: { entry: 'src/pages/videolist/main.js', template: 'public/index.html', filename: 'videolist/index.html' },
        playbackgroup: { entry: 'src/pages/playbackgroup/main.js', template: 'public/index.html', filename: 'playbackgroup/index.html' }
        
    },
    devServer: {
        contentBase: './dist',
        port: 39999,
    },
    configureWebpack: {
        plugins: [
            new ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery',
                'window.jQuery': 'jquery',
            })
        ]
    },
    pluginOptions: {
        i18n: {
            locale: '0',
            fallbackLocale: '0',
            localeDir: 'i18n/locales',
            enableInSFC: false
        }
    }
}
