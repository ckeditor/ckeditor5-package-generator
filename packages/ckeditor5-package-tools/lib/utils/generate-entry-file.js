/**
 * @license Copyright (c) 2020-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

/* eslint-env node */

const fs = require( 'fs' );
const path = require( 'path' );
const glob = require( 'glob' );
const mkdirp = require( 'mkdirp' );

/**
 * CKEditor 5 files must be compiled in a single process to avoid duplicating the `CKEDITOR_VERSION` global variable.
 * The purpose of this function is to create an entry test file processed by karma when executing tests.
 *
 * @param {String} entryFilePath An entry file to create.
 */
module.exports = entryFilePath => {
	// Creates a directory for saving the entry point file.
	mkdirp.sync( path.dirname( entryFilePath ) );

	let filesImports = glob.sync( 'tests/**/*.js', { nodir: true } )
		.map( file => `import '${ normalizePath( path.resolve( file ) ) }';` )
		.join( '\n' );

	if ( filesImports ) {
		filesImports += '\n';
	}

	fs.writeFileSync( entryFilePath, filesImports );

	console.info( 'Entry file saved in "%s".', entryFilePath );

	// The webpack watcher compiles the file in a loop. It causes to Karma runs tests multiple times when the watch mode is enabled
	// An ugly hack blocks the loop and tests are executed once. See: https://github.com/webpack/watchpack/issues/25.
	const now = Date.now() / 1000;
	// 10 sec is default value of the `FS_ACCURENCY` variable which is hardcoded in the webpack watcher.
	const time = now - 10;

	fs.utimesSync( entryFilePath, time, time );
};

// TODO: Consider creating the common utils between all packages in the repository.
/**
 * @param {String} file
 * @returns {String}
 */
function normalizePath( file ) {
	return file.split( path.sep ).join( path.posix.sep );
}
