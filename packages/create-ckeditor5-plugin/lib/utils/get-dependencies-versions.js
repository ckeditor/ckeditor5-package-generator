/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const path = require( 'path' );
const getPackageVersion = require( './get-package-version' );

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
module.exports = function getDependenciesVersions( devMode ) {
	return {
		ckeditor5: getPackageVersion( 'ckeditor5' ),
		devUtils: getPackageVersion( '@ckeditor/ckeditor5-dev-utils' ),
		eslintConfigCkeditor5: getPackageVersion( 'eslint-config-ckeditor5' ),
		stylelintConfigCkeditor5: getPackageVersion( 'stylelint-config-ckeditor5' ),
		packageTools: devMode ?
			// Windows accepts unix-like paths in `package.json`, so let's unify it to avoid errors with paths.
			'file:' + path.resolve( __dirname, '..', '..', '..', 'ckeditor5-package-tools' ).split( path.sep ).join( path.posix.sep ) :
			'^' + getPackageVersion( '@ckeditor/ckeditor5-package-tools' )
	};
};
