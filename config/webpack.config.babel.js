import webpack from 'webpack';
import path from 'path';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

export default {
    entry: {
        bundle: path.resolve(__dirname, '../src/lib', 'sokhan.js'),
        main: path.resolve(__dirname, '../src/stylesheets', 'main.scss')
    },

    output: {
        path: path.resolve(__dirname, '../build'),
        publicPath: '/build/',
        filename: '[name].js'
    },

    resolve: {
        extensions: ['.js', '.css', '.scss'],
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
            from: '../src/_locales/**/*',
            to: 'images',
            flatten: false
        }, {
            from: '../src/icons/**/*',
            to: 'icons',
            flatten: false
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