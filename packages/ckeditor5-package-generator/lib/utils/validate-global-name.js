/**
 * @license Copyright (c) 2020-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const chalk = require( 'chalk' );

/**
 * If the global name is not valid, prints the error.
 *
 * @param {Logger} logger
 * @param {String} globalName
 */
module.exports = function validateGlobalName( logger, globalName ) {
	if ( !globalName.length ) {
		return;
	}

	const validationError = validator( globalName );

	if ( !validationError ) {
		return true;
	}

	logger.error( '❗ Found an error while verifying the provided global name:', { startWithNewLine: true } );
	logger.error( validationError );

	logger.info( 'The provided global name:    ' + chalk.red( globalName ) );
	logger.info( 'Allowed characters list:     ' + chalk.blue( '0-9 A-Z a-z _ - / @' ) );
};

/**
 * Checks if the global name is valid.
 *
 * Returns a string containing the validation error, or `null` if no errors were found.
 *
 * @param {String} globalName
 * @returns {String|null}
 */
function validator( globalName ) {
	if ( !/^[a-zA-Z0-9_\-/@]+$/.test( globalName ) ) {
		return 'The global name contains non-allowed characters.';
	}

	if ( !/^(?!\/).*(?!\/)$/g.test( globalName ) ) {
		return 'The global name cannot start with "/" and end with "/" characters.';
	}

	if ( /^[0-9]/.test( globalName ) ) {
		return 'The global name can not start with a digit.';
	}

	return null;
}
