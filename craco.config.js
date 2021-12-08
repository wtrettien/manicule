const { loaderByName, addBeforeLoader } = require('@craco/craco')

module.exports = {
    webpack: {
        configure: (webpackConfig) => {
            webpackConfig.resolve.extensions.push('.xml')
            webpackConfig.resolve.extensions.push('.html')
            const xmlLoader = {
                loader: require.resolve('xml-loader'),
                test: /\.xml$/,
                exclude: /node_modules/
            }

            addBeforeLoader(webpackConfig, loaderByName('file-loader'), xmlLoader)

            return webpackConfig
        }
    }
}
