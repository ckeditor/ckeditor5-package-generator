/**
 * @license Copyright (c) 2020-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const chalk = require( 'chalk' );

/**
 * If the plugin name is not valid, prints the error and exits the process.
 *
 * @param {Logger} logger
 * @param {String|undefined} pluginName
 */
module.exports = function validatePluginName( logger, pluginName ) {
	// Custom plugin name is optional.
	if ( !pluginName ) {
		return;
	}

	logger.process( 'Verifying the specified plugin name.' );

	const validationError = validator( pluginName );

	if ( !validationError ) {
		return;
	}

	logger.error( '❗ Found an error while verifying the provided plugin name:', { startWithNewLine: true } );
	logger.error( validationError );

	logger.info( 'The provided plugin name:    ' + chalk.red( pluginName ) );
	logger.info( 'Allowed characters list:     ' + chalk.blue( '0-9 A-Z a-z' ) );

	process.exit( 1 );
};

/**
 * Checks if the plugin name is valid.
 *
 * Returns a string containing the validation error, or `null` if no errors were found.
 *
 * @param {String} pluginName
 * @returns {String|null}
 */
function validator( pluginName ) {
	if ( !/^[0-9A-Za-z]+$/.test( pluginName ) ) {
		return 'The plugin name contains non-allowed characters.';
	}

	if ( /^[0-9]/.test( pluginName ) ) {
		return 'The plugin name can not start with a digit.';
	}

	return null;
}
