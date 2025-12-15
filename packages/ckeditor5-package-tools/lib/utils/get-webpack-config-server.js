/**
 * @license Copyright (c) 2020-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import fs from 'node:fs';
import path from 'node:path';
import upath from 'upath';
import webpack from 'webpack';
import { CKEditorTranslationsPlugin } from '@ckeditor/ckeditor5-dev-translations';
import { loaderDefinitions, getModuleResolutionPaths } from './webpack-utils.js';

const PACKAGE_ROOT_DIR = upath.join( import.meta.dirname, '..', '..' );

export default options => {
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

	const entryFileName = fs.readdirSync( upath.join( options.cwd, 'sample' ) )
		.find( filePath => /^ckeditor\.[jt]s$/.test( filePath ) );

	const moduleResolutionPaths = getModuleResolutionPaths( PACKAGE_ROOT_DIR );

	return {
		mode: options.production ? 'production' : 'development',

		performance: {
			hints: false
		},

		entry: upath.join( options.cwd, 'sample', entryFileName ),

		output: {
			filename: 'ckeditor.dist.js',
			path: upath.join( options.cwd, 'sample' )
		},

		optimization: {
			minimize: false
		},

		plugins: webpackPlugins,

		devServer: {
			static: {
				// Convert POSIX-style path from upath to a native OS path (needed for Windows).
				// `webpack-dev-server` checks if a path starts with `[a-z]:/`.If so, it treats it as URL and emits an error.
				directory: upath.join( options.cwd, 'sample' ).split( '/' ).join( path.sep )
			},
			compress: true
		},

		resolve: {
			// Triple dots syntax allows extending default extension list instead of overwriting it.
			extensions: [ '.ts', '...' ],
			extensionAlias: {
				'.js': [ '.js', '.ts' ]
			},
			modules: moduleResolutionPaths
		},

		resolveLoader: {
			modules: moduleResolutionPaths
		},

		module: {
			rules: [
				{
					oneOf: [
						loaderDefinitions.raw(),
						loaderDefinitions.rawWithQuery(),
						loaderDefinitions.styles( options.cwd ),
						loaderDefinitions.typescript( options.cwd )
					]
				},
				loaderDefinitions.js()
			]
		}
	};
};
