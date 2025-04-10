const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

let webpackConfig = {
    watch: false,
    entry: './src/ui/index.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                    },
                },
            },
            { test: /\.css$/, use: [MiniCssExtractPlugin.loader, 'css-loader'] },
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    plugins: [
        new MiniCssExtractPlugin(),
        new HtmlWebpackPlugin({
            title: 'Auto Tools',
            inject: 'body',
        }),
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /(en)$/),
    ],
    optimization: {
        minimizer: [
            new TerserPlugin({
                extractComments: false,
            }),
            new CssMinimizerPlugin(),
        ],
    },
}

module.exports = (env, argv) => {
    if (argv.mode === 'development') {
        webpackConfig.devtool = 'source-map'
    }
    if (argv.mode === 'production') {
        webpackConfig.plugins.push(new BundleAnalyzerPlugin({ analyzerMode: 'static', openAnalyzer: false }))
    }

    return webpackConfig
}
