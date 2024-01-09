/**
 * @license Copyright (c) 2020-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

/* eslint-env node */

const fs = require( 'fs' );
const path = require( 'path' );
const webpack = require( 'webpack' );
const { CKEditorTranslationsPlugin } = require( '@ckeditor/ckeditor5-dev-translations' );
const { loaderDefinitions, getModuleResolutionPaths } = require( './webpack-utils' );

const PACKAGE_ROOT_DIR = path.join( __dirname, '..', '..' );

module.exports = options => {
	const webpackPlugins = [
		new webpack.DefinePlugin( {
			EDITOR_LANGUAGE: JSON.stringify( options.language )
		} ),
		new webpack.ProvidePlugin( {
			process: 'process/browser',
			Buffer: [ 'buffer', 'Buffer' ]
		} )
	];

	if ( options.language !== 'en' ) {
		webpackPlugins.push(
			new CKEditorTranslationsPlugin( {
				language: options.language,
				sourceFilesPattern: /src[/\\].+\.[jt]s$/
			} )
		);
	}

	const entryFileName = fs.readdirSync( path.join( options.cwd, 'sample' ) )
		.find( filePath => /^ckeditor\.[jt]s$/.test( filePath ) );

	const moduleResolutionPaths = getModuleResolutionPaths( PACKAGE_ROOT_DIR );

	return {
		mode: options.production ? 'production' : 'development',

		performance: {
			hints: false
		},

		entry: path.join( options.cwd, 'sample', entryFileName ),

		output: {
			filename: 'ckeditor.dist.js',
			path: path.join( options.cwd, 'sample' )
		},

		optimization: {
			minimize: false
		},

		plugins: webpackPlugins,

		devServer: {
			static: {
				directory: path.join( options.cwd, 'sample' )
			},
			compress: true
		},

		resolve: {
			// Triple dots syntax allows extending default extension list instead of overwriting it.
			extensions: [ '.ts', '...' ],
			modules: moduleResolutionPaths
		},

		resolveLoader: {
			modules: moduleResolutionPaths
		},

		module: {
			rules: [
				loaderDefinitions.raw(),
				loaderDefinitions.styles( options.cwd ),
				loaderDefinitions.typescript( options.cwd )
			]
		}
	};
};
