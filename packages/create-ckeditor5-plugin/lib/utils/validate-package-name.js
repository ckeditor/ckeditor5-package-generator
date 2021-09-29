/**
 * @license Copyright (c) 2020-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
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
	const errorLogs = [];

	const validateResult = validateNpmPackageName( packageName );

	if ( !validateResult.validForNewPackages ) {
		errorLogs.push( 'Provided <packageName> is not valid name for a npm package:' );

		for ( const error of ( validateResult.errors || [] ) ) {
			errorLogs.push( '  * ' + error );
		}

		for ( const warning of ( validateResult.warnings || [] ) ) {
			errorLogs.push( '  * ' + warning );
		}
	}

	const [ scope, name ] = packageName.split( '/' );

	if ( !scope || !scope.match( /^@./ ) ) {
		errorLogs.push( 'Provided <packageName> should start with the "@scope".' );
	}

	if ( !name || !name.match( /^ckeditor5-./ ) ) {
		errorLogs.push( 'Package name should contain the "ckeditor5-" prefix followed by the package name.' );
	}

	return errorLogs;
};
