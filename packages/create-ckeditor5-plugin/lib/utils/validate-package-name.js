/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

'use strict';

/**
 * Checks if the package name is valid for npm package, and if it follows the "@scope/ckeditor5-name" format.
 *
 * Returns a string containing the validation error, or `null` if no errors were found.
 *
 * @param {String} packageName
 * @returns {String|null}
 */
module.exports = function validatePackageName( packageName ) {
	if ( packageName.length > 214 ) {
		return 'Name can not be longer than 214 characters.';
	}
	if ( /[A-Z]/.test( packageName ) ) {
		return 'Capital letters are not allowed.';
	}

	const match = packageName.match( /^@([^/]+)\/ckeditor5-([^/]+)$/ );

	if ( !match ) {
		return 'Name has to follow the correct pattern.';
	}
	if ( match[ 1 ].length !== encodeURIComponent( match[ 1 ] ).length || /[~'!()*]/.test( match[ 1 ] ) ) {
		return 'Scope contains invalid characters.';
	}
	if ( match[ 2 ].length !== encodeURIComponent( match[ 2 ] ).length || /[~'!()*]/.test( match[ 2 ] ) ) {
		return 'Name contains invalid characters.';
	}

	return null;
};

