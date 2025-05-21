/**
 * @license Copyright (c) 2020-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import path from 'path';
import fs from 'fs-extra';

import webpack from 'webpack';
import TerserPlugin from 'terser-webpack-plugin';
import { CKEditorTranslationsPlugin } from '@ckeditor/ckeditor5-dev-translations';
import { loaderDefinitions, getModuleResolutionPaths } from './webpack-utils.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath( import.meta.url );
const __dirname = path.dirname( __filename );

const PACKAGE_ROOT_DIR = path.join( __dirname, '..', '..' );

export default options => {
	const pkgJson = fs.readJsonSync( path.join( options.cwd, 'package.json' ) );

	// `dllName` is a short package name without the scope and the `ckeditor5-` prefix.
	// E.g. for the package called `@ckeditor/ckeditor5-example-package`, the short name is `example-package`.
	const packageName = pkgJson.name.includes( '/' ) ? pkgJson.name.split( '/' ).pop() : pkgJson.name;
	const dllName = packageName.replace( /^ckeditor5-/, '' );

	// `dllWindowKey` is a name of a key which will be used for exposing the DLL library under
	// the `window.CKEditor5` global variable. E.g. for the package called `@ckeditor/ckeditor5-example-package`,
	// its DLL file will be available under the `window.CKEditor5.examplePackage` variable.
	const dllWindowKey = dllName.replace( /-([a-z])/g, ( match, p1 ) => p1.toUpperCase() );

	// An absolute path to the manifest file that the `DllReferencePlugin` plugin uses for mapping dependencies.
	const ckeditor5manifestPath = path.join( options.cwd, 'node_modules', 'ckeditor5', 'build', 'ckeditor5-dll.manifest.json' );

	const webpackPlugins = [
		new webpack.DllReferencePlugin( {
			manifest: fs.readJsonSync( ckeditor5manifestPath ),
			scope: 'ckeditor5/src',
			name: 'CKEditor5.dll'
		} ),
		new webpack.ProvidePlugin( {
			process: 'process/browser',
			Buffer: [ 'buffer', 'Buffer' ]
		} )
	];

	// If the package contains localization for the English language, which is the default option for the DLL build,
	// include the CKEditor 5 Webpack plugin that produces translation files.
	if ( fs.existsSync( path.join( options.cwd, 'lang', 'translations', 'en.po' ) ) ) {
		webpackPlugins.push(
			new CKEditorTranslationsPlugin( {
				language: 'en',
				additionalLanguages: 'all',
				sourceFilesPattern: /^src[/\\].+\.[jt]s$/,
				skipPluralFormFunction: true
			} )
		);
	}

	const entryFileName = fs.readdirSync( path.join( options.cwd, 'src' ) )
		.find( filePath => /^index\.[jt]s$/.test( filePath ) );

	const moduleResolutionPaths = getModuleResolutionPaths( PACKAGE_ROOT_DIR );

	return {
		mode: 'production',

		performance: {
			hints: false
		},

		entry: path.join( options.cwd, 'src', entryFileName ),

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

		watch: options.watch,

		plugins: webpackPlugins,

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
				loaderDefinitions.raw(),
				loaderDefinitions.styles( options.cwd ),
				loaderDefinitions.typescript( options.cwd )
			]
		}
	};
};
