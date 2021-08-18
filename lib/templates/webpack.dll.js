'use strict';

/* eslint-env node */

const path = require( 'path' );
const webpack = require( 'webpack' );
const TerserPlugin = require( 'terser-webpack-plugin' );
const { getPostCssConfig } = require( '@ckeditor/ckeditor5-dev-utils' ).styles;

const options = {
	isDevelopmentMode: process.argv.includes( '--dev' )
};

const ROOT_DIRECTORY = __dirname;

const webpackConfig = {
	mode: options.isDevelopmentMode ? 'development' : 'production',

	performance: {
		hints: false
	},

	entry: path.join( ROOT_DIRECTORY, 'src', 'index.js' ),

	output: {
		filename: '<%= dllFileName %>',
		library: <%= dllLibrary %>,
		path: path.join( ROOT_DIRECTORY, 'build' ),
		libraryTarget: 'window'
	},

	optimization: {
		minimize: false
	},

	plugins: [
		// Uncomment the `CKEditorWebpackPlugin` definition if your plugin contains translations files.
		// Read more about creating localization files.
		// See: https://ckeditor.com/docs/ckeditor5/latest/framework/guides/deep-dive/ui/localization.html.
		// new CKEditorWebpackPlugin( {
		// 	// UI language. Language codes follow the https://en.wikipedia.org/wiki/ISO_639-1 format.
		// 	language: 'en',
		// 	additionalLanguages: 'all',
		// 	sourceFilesPattern: /^src[/\\].+\.js$/,
		// 	skipPluralFormFunction: true
		// } ),
		new webpack.DllReferencePlugin( {
			manifest: require( 'ckeditor5/build/ckeditor5-dll.manifest.json' ),
			scope: 'ckeditor5/src',
			name: 'CKEditor5.dll'
		} )
	],

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

if ( options.isDevelopmentMode ) {
	webpackConfig.devtool = 'source-map';
} else {
	webpackConfig.optimization.minimize = true;

	webpackConfig.optimization.minimizer = [
		new TerserPlugin( {
			extractComments: false
		} )
	];
}

module.exports = webpackConfig;
