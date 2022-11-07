/**
 * @license Copyright (c) 2020-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const chalk = require( 'chalk' );

/**
 * If the class name is not valid, prints the error and exits the process.
 *
 * @param {Logger} logger
 * @param {CKeditor5PackageGeneratorOptions} options
 */
module.exports = function validateClassName( logger, options ) {
	// Custom class name is optional.
	if ( !options.name ) {
		return null;
	}

	logger.process( 'Verifying the specified class name.' );

	const validationError = validator( options.name );

	if ( !validationError ) {
		return;
	}

	logger.error( '❗ Found an error while verifying the provided class name:', { startWithNewLine: true } );
	logger.error( validationError );

	logger.info( 'The provided class name:     ' + chalk.red( options.name ) );
	logger.info( 'Allowed characters list:     ' + chalk.blue( '0-9 A-Z a-z' ) );

	process.exit( 1 );
};

/**
 * Checks if the class name is valid.
 *
 * Returns a string containing the validation error, or `null` if no errors were found.
 *
 * @param {String|undefined} className
 * @returns {String|null}
 */
function validator( className ) {
	if ( !/^[0-9A-Za-z]+$/.test( className ) ) {
		return 'The class name contains non-allowed characters.';
	}

	if ( /^[0-9]/.test( className ) ) {
		return 'The class name has to start with a letter.';
	}

	return null;
}
