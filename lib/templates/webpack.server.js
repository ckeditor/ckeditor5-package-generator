'use strict';

/* eslint-env node */

const path = require( 'path' );
const { getPostCssConfig } = require( '@ckeditor/ckeditor5-dev-utils' ).styles;

const ROOT_DIRECTORY = __dirname;

const webpackConfig = {
	mode: 'development',

	performance: {
		hints: false
	},

	entry: path.join( ROOT_DIRECTORY, 'sample', 'script.js' ),

	output: {
		filename: 'script.dist.js',
		path: path.join( ROOT_DIRECTORY, 'sample' )
	},

	optimization: {
		minimize: false
	},

	devServer: {
		contentBase: [
			path.join( ROOT_DIRECTORY, 'sample' ),
			path.join( ROOT_DIRECTORY, 'build' ),
			path.join( ROOT_DIRECTORY, 'node_modules' )
		],
		contentBasePublicPath: [
			'/',
			'/build',
			'/node_modules'
		],
		compress: true,
		port: 9000,
		watchContentBase: true
	},

	module: {
		rules: [
			{
				test: /\.svg$/,
				use: [ 'raw-loader' ]
			},
			{
				test: /\.css$/,
				use: [
					{
						loader: 'style-loader',
						options: {
							injectType: 'singletonStyleTag',
							attributes: {
								'data-cke': true
							}
						}
					},
					'css-loader',
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: getPostCssConfig( {
								themeImporter: {
									themePath: require.resolve( '@ckeditor/ckeditor5-theme-lark' )
								},
								minify: true
							} )
						}
					}
				]
			}
		]
	}
};

module.exports = webpackConfig;
