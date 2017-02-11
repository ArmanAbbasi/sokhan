import webpack from 'webpack';
import path from 'path';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import  HtmlWebpackPlugin from 'html-webpack-plugin';

export default {
    entry: {
        bundle: path.resolve(__dirname, '../lib', 'App.js'),
        main: path.resolve(__dirname, 'src/stylesheets', 'main.scss')
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
            use: [
                'react-hot-loader',
                'babel-loader'
            ]
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
        new ExtractTextPlugin({
            filename: `[name].${process.env.NODE_ENV === 'production' ? '[chunkhash].' : ''}css`
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        }),
        new webpack.optimize.UglifyJsPlugin({
            comments: false,
            compress: {
                warnings: false
            }
        }),
        new HtmlWebpackPlugin({
            filename: '../src/views/partials/embeds.hbs',
            template: 'src/views/partials/embeds.template.html',
            inject: false,
            genFileText: '<!-- This is a generated file -->'
        })
    ],

    devtool: 'source-map'
};