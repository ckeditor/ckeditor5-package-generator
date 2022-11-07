/**
 * @license Copyright (c) 2020-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const chalk = require( 'chalk' );

const SCOPED_PACKAGE_REGEXP = /^@([^/]+)\/ckeditor5-([^/]+)$/;

/**
 * If the package name is not valid, prints the error and exits the process.
 *
 * @param {Logger} logger
 * @param {string} fullPackageName
 */
module.exports = function validatePackageName( logger, fullPackageName ) {
	logger.process( 'Verifying the specified package name.' );

	const validationError = validator( fullPackageName );

	if ( !validationError ) {
		return;
	}

	logger.error( '❗ Found an error while verifying the provided package name:', { startWithNewLine: true } );
	logger.error( validationError );

	logger.info( 'Expected pattern:            ' + chalk.green( '@[scope]/ckeditor5-[feature-name]' ), { startWithNewLine: true } );
	logger.info( 'The provided package name:   ' + chalk.red( fullPackageName || '' ) );
	logger.info( 'Allowed characters list:     ' + chalk.blue( '0-9 a-z - . _' ) );

	process.exit( 1 );
};

/**
 * Checks if the package name is valid for the npm package, and if it follows the "@scope/ckeditor5-name" format.
 *
 * Returns a string containing the validation error, or `null` if no errors were found.
 *
 * @param {String|undefined} fullPackageName
 * @returns {String|null}
 */
function validator( fullPackageName ) {
	if ( !fullPackageName ) {
		return 'The package name cannot be an empty string - pass the name as the first argument to the script.';
	}

	// Npm does not allow names longer than 214 characters.
	if ( fullPackageName.length > 214 ) {
		return 'The length of the package name cannot be longer than 214 characters.';
	}

	// Npm does not allow new packages to contain capital letters.
	if ( /[A-Z]/.test( fullPackageName ) ) {
		return 'The package name cannot contain capital letters.';
	}

	const match = fullPackageName.match( SCOPED_PACKAGE_REGEXP );

	// The package name must follow the @scope/ckeditor5-name pattern.
	if ( !match ) {
		return 'The package name must match the "@[scope]/ckeditor5-[feature-name]" pattern.';
	}

	// encodeURIComponent() will escape majority of characters not allowed for the npm package name.
	if ( match[ 1 ] !== encodeURIComponent( match[ 1 ] ) || match[ 2 ] !== encodeURIComponent( match[ 2 ] ) ) {
		return 'The package name contains non-allowed characters.';
	}

	// Characters ~'!()*  will not be escaped by `encodeURIComponent()`, but they aren't allowed for the npm package name.
	if ( /[~'!()*]/.test( fullPackageName ) ) {
		return 'The package name contains non-allowed characters.';
	}

	return null;
}
