/**
 * @license Copyright (c) 2020-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

/* eslint-env node */

const path = require( 'path' );
const webpack = require( 'webpack' );
const TerserPlugin = require( 'terser-webpack-plugin' );
const { getPostCssConfig } = require( '@ckeditor/ckeditor5-dev-utils' ).styles;

module.exports = options => {
	const packageJson = require( path.join( options.cwd, 'package.json' ) );

	// `dllName` is a short package name without the scope and the `ckeditor5-` prefix.
	// E.g. for the package called `@ckeditor/ckeditor5-example-package`, the short name is `example-package`.
	const dllName = packageJson.name.split( '/' )[ 1 ].replace( /^ckeditor5-/, '' );

	// `dllWindowKey` is a name of a key which will be used for exposing the DLL library under
	// the `window.CKEditor5` global variable. E.g. for the package called `@ckeditor/ckeditor5-example-package`,
	// its DLL file will be available under the `window.CKEditor5.examplePackage` variable.
	const dllWindowKey = dllName.replace( /-([a-z])/g, ( match, p1 ) => p1.toUpperCase() );

	// An absolute path to the manifest file that the `DllReferencePlugin` plugin uses for mapping dependencies.
	const ckeditor5manifestPath = path.join( options.cwd, 'node_modules', 'ckeditor5', 'build', 'ckeditor5-dll.manifest.json' );

	return {
		mode: 'production',

		performance: {
			hints: false
		},

		entry: path.join( options.cwd, 'src', 'index.js' ),

		output: {
			filename: dllName + '.js',
			library: [ 'CKEditor5', dllWindowKey ],
			path: path.join( options.cwd, 'build' ),
			libraryTarget: 'window'
		},

		optimization: {
			minimize: true,

			minimizer: [
				new TerserPlugin( {
					extractComments: false
				} )
			]
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
				manifest: require( ckeditor5manifestPath ),
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
							options: getPostCssConfig( {
								themeImporter: {
									themePath: getThemePath( options.cwd )
								},
								minify: true
							} )
						}
					]
				}
			]
		}
	};
};

/**
 * Returns an absolute path to the main file of the `@ckeditor/ckeditor5-theme-lark` package.
 *
 * The function does the same as what does `require.resolve()`. However, there is no option for mocking it in tests,
 * hence the value is obtained manually.
 *
 * @param {String} cwd
 * @return {String}
 */
function getThemePath( cwd ) {
	const packagePath = path.join( cwd, 'node_modules', '@ckeditor', 'ckeditor5-theme-lark' );
	const packageJson = require( path.join( packagePath, 'package.json' ) );

	return path.join( packagePath, packageJson.main );
}
