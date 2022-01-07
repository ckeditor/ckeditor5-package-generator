/**
 * @license Copyright (c) 2020-2022, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const SCOPED_PACKAGE_REGEXP = /^@([^/]+)\/ckeditor5-([^/]+)$/;

/**
 * Checks if the package name is valid for the npm package, and if it follows the "@scope/ckeditor5-name" format.
 *
 * Returns a string containing the validation error, or `null` if no errors were found.
 *
 * @param {String|undefined} packageName
 * @returns {String|null}
 */
module.exports = function validatePackageName( packageName ) {
	if ( !packageName ) {
		return 'The package name cannot be an empty string - pass the name as the first argument to the script.';
	}

	// Npm does not allow names longer than 214 characters.
	if ( packageName.length > 214 ) {
		return 'The length of the package name cannot be longer than 214 characters.';
	}

	// Npm does not allow new packages to contain capital letters.
	if ( /[A-Z]/.test( packageName ) ) {
		return 'The package name cannot contain capital letters.';
	}

	const match = packageName.match( SCOPED_PACKAGE_REGEXP );

	// The package name must follow the @scope/ckeditor5-name pattern.
	if ( !match ) {
		return 'The package name must match the "@[scope]/ckeditor5-[feature-name]" pattern.';
	}

	// encodeURIComponent() will escape majority of characters not allowed for the npm package name.
	if ( match[ 1 ] !== encodeURIComponent( match[ 1 ] ) || match[ 2 ] !== encodeURIComponent( match[ 2 ] ) ) {
		return 'The package name contains non-allowed characters.';
	}

	// Characters ~'!()*  will not be escaped by `encodeURIComponent()`, but they aren't allowed for the npm package name.
	if ( /[~'!()*]/.test( packageName ) ) {
		return 'The package name contains non-allowed characters.';
	}

	return null;
};
