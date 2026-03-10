/* eslint-disable */
const vueLoaderPlugin = require('vue-loader/lib/plugin');
const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const utils = require('./utils');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const InsertHtmlSiteConfigPlugin = require('./webpack.config.plugin');

const envConfig = require('../config/envConfig');
const baseConfig = require('./webpack.base.conf');
const {
    srcPath,
    nodePath,
    assets,
    postcssLoaderOptions
} = require('../config');

// add hot-reload related code to entry chunks
Object.keys(baseConfig.entry).forEach(function (name) {
    baseConfig.entry[name] = ['webpack-hot-middleware/client'].concat(
        baseConfig.entry[name]
    );
});

module.exports = merge(baseConfig, {
    mode: 'development',
    output: {
        filename: `${assets}/js/[name].js`
    },
    module: {
        rules: [
            {
                test: /\.scss$/, // creates style nodes from JS strings | translates CSS into CommonJS | compiles Sass to CSS
                include: srcPath,
                use: [
                    'style-loader',
                    'css-loader',
                    postcssLoaderOptions,
                    'sass-loader',
                    {
                        loader: 'sass-resources-loader',
                        options: {
                            resources: path.resolve(__dirname, '../src/style/mixin.scss')
                        }
                    }
                ]
                // include: paths.appSrc,
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader', postcssLoaderOptions]
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                include: [srcPath, nodePath],
                options: {
                    loaders: {
                        css: [
                            'vue-style-loader',
                            /* 应该不用下面几个loader，待测试 */
                            'css-loader',
                            'sass-loader',
                            postcssLoaderOptions
                        ]
                    }
                }
            },

        ]
    },
    devtool: '#cheap-module-eval-source-map', // #eval-source-map
    plugins: [
        new HtmlWebpackPlugin({
            template: `${srcPath}/templates/index.ejs`,
            //filename: `${key}.html`,
            filename: 'index.html',
            favicon: './src/images/favicon.ico',
            chunks: ['manifest', 'vendor', 'common', 'index'],
            hash: false,
            minify: {
                removeComments: true,
                collapseWhitespace: true
            }
        }),
        // 自定义html插件处理系统常量配置
        new InsertHtmlSiteConfigPlugin({
            variableKey: 'ENV_CONFIG',
            variableValue: envConfig[process.env.NODE_MODE] || {}
        }),
        new vueLoaderPlugin(),
        // 配置环境变量 开发环境
        new webpack.DefinePlugin({
            'isMockEnv': process.env.NODE_MODE === 'demo',
            'prodTypeEnv': process.env.NODE_TYPE === 'module' ? true : false,
            'NODE_ENV': JSON.stringify(process.env.NODE_ENV), // node模式配置   production|development
            'NODE_MODE': JSON.stringify(process.env.NODE_MODE), // node打包环境配置 dev|sit|uat|pre|prod|demo...
            'osMac': JSON.stringify(require('os').networkInterfaces())
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new FriendlyErrorsPlugin()
    ]
});