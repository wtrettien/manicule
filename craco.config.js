const { loaderByName, addBeforeLoader } = require('@craco/craco')
const path = require('path')

module.exports = {
    webpack: {
        configure: (webpackConfig) => {
            webpackConfig.resolve.extensions.push('.xml')
            //webpackConfig.resolve.extensions.push('.html')
            const xmlLoader = {
                loader: require.resolve('xml-loader'),
                test: /\.xml$/,
                exclude: /node_modules/
            }
            const htmlLoader = {
                loader: require.resolve('html-loader'),
                test: /\.html$/,
                exclude: /node_modules/,
                include: path.resolve(__dirname, 'src/data')
            }

            addBeforeLoader(webpackConfig, loaderByName('file-loader'), xmlLoader)
            addBeforeLoader(webpackConfig, loaderByName('file-loader'), htmlLoader)

            return webpackConfig
        }
    }
}
