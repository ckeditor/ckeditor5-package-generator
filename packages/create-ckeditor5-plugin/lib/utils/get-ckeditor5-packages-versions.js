
/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

'use strict';

const path = require( 'path' );
const getLatestVersionOfPackage = require( './get-latest-version-of-package' );

/**
 * Returns an object containing string values:
 *
 * {
 *   ckeditor5: (version),
 *   devUtils: (version),
 *   packageTools: (version|path)
 * }
 *
 * Last value is dependent on the devMode parameter:
 *
 * True: Path to where locally cloned package should be.
 * False: Latest NPM version.
 *
 * @param {Boolean} devMode whether or not to use locally cloned packageTools.
 * @returns {Object}
 */
module.exports = function getCKEditor5PackagesVersions( devMode ) {
	return {
		ckeditor5: getLatestVersionOfPackage( 'ckeditor5' ),
		devUtils: getLatestVersionOfPackage( '@ckeditor/ckeditor5-dev-utils' ),
		packageTools: devMode ?
			// Windows accepts unix-like paths in `package.json`, so let's unify it to avoid errors with paths.
			'file:' + path.resolve( __dirname, '..', '..', '..', 'ckeditor5-package-tools' ).split( path.sep ).join( path.posix.sep ) :
			'^' + getLatestVersionOfPackage( '@ckeditor/ckeditor5-package-tools' )
	};
};
