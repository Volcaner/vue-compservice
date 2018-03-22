const webpack = require('webpack');
const path = require('path');
const ExtractTextOlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJSWebpackPlugin = require('uglifyjs-webpack-plugin');
// const WebpackDevServer = require('webpack-dev-server');
// const precss = require('precss');
// const express = require('express');
// const autoprefixer = require('autoprefixer');

// const extractcss = new ExtractTextOlugin({
// 	filename: 'css/[name].css'
// });
const extractless = new ExtractTextOlugin({
	filename: 'less/[name].css' 
});
const extractpic = new ExtractTextOlugin({
	filename: 'img/[hash].[ext]' 
});
const hotmodulereplace = new webpack.HotModuleReplacementPlugin();
const UglifyJSWebpackPluginConfig = new UglifyJSWebpackPlugin({
    uglifyOptions: {
        ie8: false,
        ecma: 8,
        output: {
            comments: false,
            beautify: false,
        },
        warnings: false,
    },
});

var srcDir = __dirname + '/src/coomadminapp';
var jsPath = path.resolve(srcDir, 'js');
var fs = require('fs');
var dirs = fs.readdirSync(jsPath);
console.log("-------------------------------------------------" + jsPath);

var config = {
	// entry: {
	// 	'localhost': 'webpack-dev-server/client?http://localhost:3000',
	// 	'regist': './src/coomadminapp/js/regist.js',
	// },
	output: {
		filename: 'js/[name].js',
		path: __dirname + '/dist',
		publicPath: './../../../../redev/wechat_service/dist',
	},
	module: {
		rules: [
			{
				test: /\.html$/,
				exclude: /node_modules/,
				use: {
					loader: 'html-loader'
				}
			}, {
				test: /\.(gif)$/i,
				exclude: /node_modules/,
				loaders: [
					{
						loader: 'url-loader',
						query: {
							name: 'images/[name].[ext]',
							publicPath: './../../../../redev/wechat_service/dist/',
							limit: 8192,
						}
					},
					{
						loader: 'image-webpack-loader',
						query: {
				            progressive: true,
				            optimizationLevel: 5,
				            interlaced: false,
				            gifsicle: {
				            	colors: 64,
				            	optimizationLevel: 3,
				            	interlaced: false,
				            },
				        }
					}
				]
			}, {
				test: /\.(png|jpe?g|svg)$/,
				exclude: /node_modules/,
				use: {
					loader: 'url-loader',
					options: {
						name: 'images/[name].[ext]',
						publicPath: './../../../../redev/wechat_service/dist/',
						limit: 8192,
					}
				}
			}
			// , {
			// 	test: /\.css$/,
			// 	exclude: /node_modules/,
			// 	use: [
			// 		{loader: 'style-loader'},
			// 		{loader: 'css-loader?limit=10000&name=css/[name].[ext]'},
			// 		{loader: 'px2rem-loader?remUnit=46.875&remPrecision=8'}
			// 	]
			// }
			, {
				test: /\.less$/,
				exclude: /node_modules/,
				use: extractless.extract({
					fallback: 'style-loader',
					use: [
						{loader: 'css-loader'},
						{loader: 'px2rem-loader?remUnit=46.875&remPrecision=8'},
						{loader: 'less-loader'},
					]
				})
			}, {
				test: /\.vue$/,
				exclude: /node_modules/,
				use: {
					loader: 'vue-loader'
				}
			}, {
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					query: {
						plugins: ['transform-runtime'],
						presets: ['es2015', 'stage-0']
					}
				}
			}
			// , {
			// 	test: /\.(woff|woff2|svg|eot|ttf)\??.*$/,
			// 	exclude: /node_modules/,
			// 	use: {
			// 		loader: 'file-loader?limit=5000&name=css/[name].[ext]'
			// 	}
		 //    }
		]
	},
	watch: true,
	plugins: [
		// extractcss,
		extractless,
		hotmodulereplace,
		UglifyJSWebpackPluginConfig,
	],
	devServer: {
		inline: true,
		port: 3000,
		hot: true,
		// host: 'localhost',
		host: '192.168.0.169',
	}
};

config.entry = getEntry();

function getEntry() {
	var files = {};
	var matchs = [];

	dirs.forEach(function(item, index) {
		matchs = item.match(/(.+)\.js$/);
		files["localhost"] = "webpack-dev-server/client?http://192.168.0.169:3000";
		if(matchs) {
			files[matchs[1]] = path.resolve(srcDir, 'js', item);

			var htmlplugin = new HtmlWebpackPlugin({
				filename: matchs[1] + '/' + matchs[1] + '.html',
				template: './src/coomadminapp/template/index.html',
				inject: 'body',
				title: 'this is index.html',
				chunks: [matchs[1]],
				hash: true,
			});
			config.plugins.push(htmlplugin);
		}
	});
	return files;
};

module.exports = config;