import path from 'path';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

export default {
    entry: {
        bundle: path.resolve(__dirname, '../src/lib', 'sokhan.js'),
        background: path.resolve(__dirname, '../src/lib', 'background.js'),
        menu: path.resolve(__dirname, '../src/menu', 'menu.js'),
        main: path.resolve(__dirname, '../src/stylesheets', 'main.scss')
    },

    output: {
        path: path.resolve(__dirname, '../build'),
        publicPath: '/build/',
        filename: '[name].js'
    },

    resolve: {
        modules: [
            'client',
            'common',
            'node_modules'
        ]
    },

    module: {
        rules: [{
            test: /\.js$/,
            loader: 'babel-loader'
        }, {
            test: /\.scss$/,
            loader: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: [{
                    loader: 'css-loader',
                    options: {
                        sourceMap: false
                    }
                }, {
                    loader: 'sass-loader',
                    options: {
                        sourceMap: false
                    }
                }]
            })
        }]
    },

    plugins: [
        new CopyWebpackPlugin([{
            context: './src/',
            from: '_locales/**/*.json',
            to: '../build/'
        }, {
            context: './src/',
            from: 'images/**/*.png',
            to: '../build/'
        }, {
            context: './src/',
            from: 'menu/**/*.html',
            to: '../build/'
        }, {
            context: './src/',
            from: 'sound/**/*.mp3',
            to: '../build/'
        }, {
            from: './src/manifest.json',
            to: '../build/manifest.json'
        }]),
        new ExtractTextPlugin({
            filename: '[name].css'
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        }),
        new webpack.optimize.UglifyJsPlugin({
            comments: false,
            compress: {
                warnings: false
            }
        })
    ],

    devtool: 'source-map'
};