'use strict';

/* eslint-env node */

const path = require( 'path' );
const webpack = require( 'webpack' );
const TerserPlugin = require( 'terser-webpack-plugin' );
const { getPostCssConfig } = require( '@ckeditor/ckeditor5-dev-utils' ).styles;
const packageJson = require( './package.json' );

const options = {
	isDevelopmentMode: process.argv.includes( '--dev' ),
};

const ROOT_DIRECTORY = __dirname;

// Configuration for output produces by webpack.
let dllLibrary, dllFilename;

if ( packageJson.name.startsWith( '@' ) ) {
	// For the scoped package, webpack exports it as `window[ scope ][ packageName ]`.
	const [ scope, packageName ] = packageJson.name.split( '/' );

	// The `packageName` represents the package name as a slug, and scope starts without the `at` (@) character.
	dllLibrary = [ scope.slice( 1 ), getGlobalKeyForPackage( packageName ) ];
	dllFilename = getIndexFileName( packageName );
} else {
	// For the non-scoped package, its name will be used as a key in the `window` object.
	dllLibrary = getGlobalKeyForPackage( packageJson.name );
	dllFilename = getIndexFileName( packageJson.name );
}

const webpackConfig = {
	mode: options.isDevelopmentMode ? 'development' : 'production',

	performance: {
		hints: false
	},

	entry: path.join( ROOT_DIRECTORY, 'src', 'index.js' ),

	output: {
		library: dllLibrary,
		filename: dllFilename,
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
			},
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

/**
 * Transforms `packageName` to a key for the `window` object.
 *
 * @param {String} packageName
 * @return {String}
 */
function getGlobalKeyForPackage( packageName ) {
	return packageName.replace( /^ckeditor5-|-ckeditor$/, '' )
		.replace( /-([a-z])/g, ( match, p1 ) => p1.toUpperCase() );
}

/**
 * Extracts the main file name from the package name.
 *
 * @param {String} packageName
 * @returns {String}
 */
function getIndexFileName( packageName ) {
	return packageName.replace( /^ckeditor5-|-ckeditor$/, '' ) + '.js';
}
