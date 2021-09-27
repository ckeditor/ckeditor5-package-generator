/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

'use strict';

const validateNpmPackageName = require( 'validate-npm-package-name' );

/**
 * Checks if the package name is valid for npm package, and if it follows the "@scope/ckeditor5-name" format.
 *
 * Returns array of strings containing all found errors, or an empty array if no errors were found.
 *
 * @param {String} packageName
 * @returns {Array}
 */
module.exports = function validatePackageName( packageName ) {
	if ( !/^@[a-zA-Z]{1,}/.test( packageName ) ) {
		return 'Package name should start with the "@scope".';
	}
	if ( !/^@[a-zA-Z]{1,}\//.test( packageName ) ) {
		return '"@scope" should be followed by a slash (/) symbol.';
	}
	if ( !/^@[a-zA-Z]{1,}\/ckeditor5-/.test( packageName ) ) {
		return 'Package name should contain the "ckeditor5-" prefix.';
	}
	if ( !/^@[a-zA-Z]{1,}\/ckeditor5-[a-zA-Z]{1,}/.test( packageName ) ) {
		return '"ckeditor5-" prefix should be followed by the package name.';
	}
	// Capital letters are allowed in previous checks to show the user more important issues first
	if ( /[A-Z]/.test( packageName ) ) {
		return 'Capital letters are not allowed.';
	}

	const validateResult = validateNpmPackageName( packageName );

	if ( !validateResult.validForNewPackages ) {
		if ( validateResult.errors && validateResult.errors[ 0 ] ) {
			return validateResult.errors[ 0 ];
		}

		if ( validateResult.warnings && validateResult.warnings[ 0 ] ) {
			return validateResult.warnings[ 0 ];
		}
	}
};

