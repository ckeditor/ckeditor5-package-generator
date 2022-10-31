/**
 * @license Copyright (c) 2020-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const chalk = require( 'chalk' );

const SCOPED_PACKAGE_REGEXP = /^@([^/]+)\/ckeditor5-([^/]+)$/;
const WORD_REGEXP = /[A-Za-z][a-z]+/g;

/**
 * This function verifies the provided package name. If it is not valid, it logs a message and exits the process.
 * If it is valid, returns an object with the name in the following formats:
 *
 *   fullScoped: @scope/ckeditor5-super-feature-name
 *    lowerCase: superfeaturename
 *   pascalCase: SuperFeatureName
 *    camelCase: superFeatureName
 *    kebabCase: super-feature-name
 *    spacedOut: Super feature name
 *
 * @param {Logger} logger
 * @param {String} fullPackageName
 * @param {CKeditor5PackageGeneratorOptions} options
 * @returns {PackageName}
 */
module.exports = function getPackageName( logger, fullPackageName, options ) {
	logger.process( 'Verifying the specified package name.' );

	if ( !fullPackageName ) {
		rejectPackageName( logger, fullPackageName, 'The package name is missing - pass the name as the first argument to the script.' );
	}

	// Npm does not allow names longer than 214 characters.
	if ( fullPackageName.length > 214 ) {
		rejectPackageName( logger, fullPackageName, 'The length of the package name cannot be longer than 214 characters.' );
	}

	// Npm does not allow new packages to contain capital letters.
	if ( /[A-Z]/.test( fullPackageName ) ) {
		rejectPackageName( logger, fullPackageName, 'The package name cannot contain capital letters.' );
	}

	const match = fullPackageName.match( SCOPED_PACKAGE_REGEXP );

	// The package name must follow the @scope/ckeditor5-name pattern.
	if ( !match ) {
		rejectPackageName( logger, fullPackageName, 'The package name must match the "@[scope]/ckeditor5-[feature-name]" pattern.' );
	}

	const [ fullScoped, packageScope, featureName ] = match;

	if ( hasInvalidChars( packageScope ) || hasInvalidChars( featureName ) ) {
		rejectPackageName( logger, fullPackageName, 'The package name contains non-allowed characters.' );
	}

	let baseName = featureName;

	if ( options.name ) {
		if ( !/^[A-Za-z]+$/.test( options.name ) ) {
			logger.error( 'Class name should only contain letters!' );
			logger.error( `Provided name: "${ options.name }"` );

			process.exit( 1 );
		}

		baseName = options.name;
	}

	return {
		fullScoped,
		lowerCase: baseName.toLowerCase(),
		pascalCase: toPascalCase( baseName ),
		camelCase: toCamelCase( baseName ),
		kebabCase: toKebabCase( baseName ),
		spacedOut: toSpacedOut( baseName )
	};
};

/**
 * Logs provided error message along with guidelines for correct package name, and exits the process.
 *
 * @param {Logger} logger
 * @param {String} fullPackageName
 * @param {String} errorMessage
 */
function rejectPackageName( logger, fullPackageName, errorMessage ) {
	logger.error( '❗ Found an error while verifying the provided package name:', { startWithNewLine: true } );
	logger.error( errorMessage );

	logger.info( 'Expected pattern:            ' + chalk.green( '@[scope]/ckeditor5-[feature-name]' ), { startWithNewLine: true } );
	logger.info( 'The provided package name:   ' + chalk.red( fullPackageName || '' ) );
	logger.info( 'Allowed characters list:     ' + chalk.blue( '0-9 a-z - . _' ) );

	process.exit( 1 );
}

/**
 * @param {String} string
 * @returns {Boolean}
 */
function hasInvalidChars( string ) {
	// encodeURIComponent() will escape majority of characters not allowed for the npm package name.
	if ( string !== encodeURIComponent( string ) ) {
		return true;
	}

	// Characters ~'!()* will not be escaped by `encodeURIComponent()`, but they aren't allowed for the npm package name.
	if ( /[~'!()*]/.test( string ) ) {
		return true;
	}

	return false;
}

/**
 * @param {String} string
 * @returns {String}
 */
function toSpacedOut( string ) {
	const words = string.match( WORD_REGEXP ).map( word => word.toLowerCase() );
	words[ 0 ] = uppercaseFirstChar( words[ 0 ] );
	return words.join( ' ' );
}

/**
 * @param {String} string
 * @returns {String}
 */
function toPascalCase( string ) {
	return string.match( WORD_REGEXP ).map( uppercaseFirstChar ).join( '' );
}

/**
 * @param {String} string
 * @returns {String}
 */
function toCamelCase( string ) {
	const pascalCase = toPascalCase( string );
	return pascalCase.charAt( 0 ).toLowerCase() + pascalCase.slice( 1 );
}

/**
 * @param {String} string
 * @returns {String}
 */
function toKebabCase( string ) {
	return string.match( WORD_REGEXP ).join( '-' );
}

/**
 * @param {String} string
 * @returns {String}
 */
function uppercaseFirstChar( string ) {
	return string.charAt( 0 ).toUpperCase() + string.slice( 1 );
}

/**
 * @typedef {Object} PackageName
 *
 * @property {String} fullScoped @scope/ckeditor5-super-feature-name
 *
 * @property {String} lowerCase superfeaturename
 *
 * @property {String} pascalCase SuperFeatureName
 *
 * @property {String} camelCase superFeatureName
 *
 * @property {String} kebabCase super-feature-name
 *
 * @property {String} spacedOut Super feature name
 */
