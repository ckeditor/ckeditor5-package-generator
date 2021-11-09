/**
 * @license Copyright (c) 2020-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const path = require( 'path' );
const glob = require( 'glob' );

module.exports = options => {
	const sourceFilesGlob = path.posix.join( options.cwd, 'src', '**', '*.js' );
	const logger = require( '@ckeditor/ckeditor5-dev-utils' ).logger();

	return require( '@ckeditor/ckeditor5-dev-env' ).createPotFiles( {
		// An array containing absolute paths the package sources.
		sourceFiles: glob.sync( sourceFilesGlob ),

		// An absolute path to the package.
		packagePaths: [ options.cwd ],

		// A relative path to the `@ckeditor/ckeditor5-core` package where common translations are located.
		corePackagePath: path.join( 'node_modules', '@ckeditor', 'ckeditor5-core' ),

		// Ignore unused from the core package, as the shared context may but does not have to be used.
		ignoreUnusedCorePackageContexts: true,

		// Where to save translation files.
		translationsDirectory: path.join( options.cwd, 'tmp', '.transifex' ),

		// Skip the license header.
		skipLicenseHeader: true,

		// Logger instance.
		logger
	} );
};
