/**
 * @license Copyright (c) 2020-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

/* eslint-env node */

const fs = require( 'fs' );
const path = require( 'path' );
const webpack = require( 'webpack' );
const CKEditorWebpackPlugin = require( '@ckeditor/ckeditor5-dev-webpack-plugin' );
const { loaderDefinitions } = require( './webpack-utils' );

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
			new CKEditorWebpackPlugin( {
				language: options.language,
				sourceFilesPattern: /src[/\\].+\.[jt]s$/
			} )
		);
	}

	const entryFileName = fs.readdirSync( path.join( options.cwd, 'sample' ) )
		.find( filePath => /^ckeditor\.[jt]s$/.test( filePath ) );

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
			extensions: [ '.ts', '...' ]
		},

		module: {
			rules: [
				loaderDefinitions.raw(),
				loaderDefinitions.styles( options.cwd ),
				loaderDefinitions.typescript()
			]
		}
	};
};
