const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer')

const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev

const filename = ext => isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`
const plugins = () => {
    const base = [new HtmlWebpackPlugin({
        filename: "index.html",
        template: "./index.html",
        minify: {
            collapseWhitespace: isProd
        }
    }),
        new MiniCssExtractPlugin({
            filename: filename('css')
        }),
        new CleanWebpackPlugin(),
    ]
    if (isProd) {
 base.push(new BundleAnalyzerPlugin())
    }
    return base;
}
const babelOptions = () => {
    const options = {
        loader: 'babel-loader',
        options: {
            plugins: ['@babel/plugin-proposal-class-properties']
        }
    }
    return options;
}
const cssLoaders = (extra) => {
    const loaders = [{
        loader: MiniCssExtractPlugin.loader,
        options: {
            hmr: isDev,
            reloadAll: true,
        }
    }, 'css-loader']
    if (extra) {
        loaders.push(extra)
    }
    return loaders;
}
const optimization = () => {
    const config = {
        splitChunks: {
            chunks: 'all'
        }
    }
    if (isProd) {
        config.minimizer = [
            new TerserWebpackPlugin(),
            new OptimizeCssAssetsPlugin()
        ]
    }
    return config;
}
const path = require('path')

module.exports = {
    context: path.resolve(__dirname, 'src'),
    entry: ['@babel/polyfill', './index.js'],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: filename('js')
    },
    resolve: {
        extensions: ['.js']
    },
    optimization: optimization(),
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: babelOptions()
            }, {
                test: /\/html$/,
                use: [{
                    loader: "html-loader"
                }]
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                use: [{
                    loader: 'file-loader'
                }]
            },
            {
                test: /\.css$/i,
                use: cssLoaders()
            }, {
                test: /\.(ttf|woff|woff2|eot)$/,
                use: ['file-loader']
            }
        ]
    },

    plugins: plugins(),
    devtool: isDev ? 'source-map' : false,
    devServer: {
        historyApiFallback: true,
        port: 3000,
        hot: isDev
    }
}