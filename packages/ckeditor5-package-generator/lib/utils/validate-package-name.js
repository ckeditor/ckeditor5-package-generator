/**
 * @license Copyright (c) 2020-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import chalk from 'chalk';
import inquirer from 'inquirer';

const SCOPED_PACKAGE_REGEXP = /^@([^/]+)\/ckeditor5-([^/]+)$/;

/**
 * If the package name is not valid, prints the error and exits the process.
 *
 * @param {Logger} logger
 * @param {String|undefined} packageName
 * @returns {Promise<String>}
 */
export default async function validatePackageName( logger, packageName ) {
	logger.process( 'Verifying the specified package name.' );

	const validationResult = validator( packageName );

	if ( validationResult === true ) {
		return packageName;
	}

	logger.error( '❗ Found an error while verifying the provided package name:', { startWithNewLine: true } );
	logger.error( validationResult );

	logger.info( 'Expected pattern:            ' + chalk.green( '@[scope]/ckeditor5-[feature-name]' ), { startWithNewLine: true } );
	logger.info( 'The provided package name:   ' + chalk.red( packageName || '' ) );
	logger.info( 'Allowed characters list:     ' + chalk.blue( '0-9 a-z - . _' ) );

	const result = await inquirer.prompt( {
		required: true,
		message: 'Enter the valid package name:',
		type: 'input',
		name: 'validPackageName',
		validate: name => validator( name ),
		default: packageName
	} ).catch( error => {
		// Ctrl+C or prompt cancellation.
		if ( error.message && error.message.includes( 'SIGINT' ) ) {
			process.exit( 1 );
		} else {
			throw error;
		}
	} );

	if ( !result ) {
		return null;
	}

	return result.validPackageName;
}

/**
 * Checks if the package name is valid for the npm package, and if it follows the "@scope/ckeditor5-name" format.
 *
 * Returns a string containing the validation error, or `null` if no errors were found.
 *
 * @param {String|undefined} packageName
 * @returns {String|true}
 */
function validator( packageName ) {
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

	return true;
}
