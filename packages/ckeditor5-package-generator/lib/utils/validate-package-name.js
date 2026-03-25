/**
 * @license Copyright (c) 2020-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { styleText } from 'node:util';
import { promptText, showNote } from './prompt.js';

const SCOPED_PACKAGE_REGEXP = /^@([^/]+)\/ckeditor5-([^/]+)$/;
const UNSCOPED_PACKAGE_REGEXP = /^ckeditor5-([^/]+)$/;

/**
 * If the package name is not valid, prints the error and exits the process.
 *
 * @param {String|undefined} packageName
 * @returns {Promise<String>}
 */
export default async function validatePackageName( packageName ) {
	const validationResult = validator( packageName );

	if ( validationResult === true ) {
		return packageName;
	}

	showNote( [
		validationResult,
		'',
		'Accepted formats:',
		'  ' + styleText( 'green', '@[scope]/ckeditor5-[feature-name]' ),
		'  ' + styleText( 'green', 'ckeditor5-[feature-name]' ),
		'',
		'Allowed characters: ' + styleText( 'blue', '0-9 a-z - . _' )
	].join( '\n' ), 'Package name' );

	return await promptText( {
		message: 'Package name',
		placeholder: '@scope/ckeditor5-my-feature',
		initialValue: packageName,
		validate: name => validationResultToPrompt( validator( name ) )
	} );
}

/**
 * Checks if the package name is valid for the npm package, and if it follows the
 * "@scope/ckeditor5-name" format.
 *
 * Returns a string containing the validation error, or `null` if no errors were found.
 *
 * @param {String|undefined} packageName
 * @returns {String|true}
 */
function validator( packageName ) {
	if ( !packageName ) {
		return 'Choose a package name to get started.';
	}

	// Npm does not allow names longer than 214 characters.
	if ( packageName.length > 214 ) {
		return 'The length of the package name cannot be longer than 214 characters.';
	}

	// Npm does not allow new packages to contain capital letters.
	if ( /[A-Z]/.test( packageName ) ) {
		return 'The package name cannot contain capital letters.';
	}

	const match = getPackageNameParts( packageName );

	// The package name must follow one of the accepted package name patterns.
	if ( !match ) {
		return 'The package name must match the "ckeditor5-[feature-name]" or "@[scope]/ckeditor5-[feature-name]" pattern.';
	}

	// encodeURIComponent() will escape majority of characters not allowed for the npm package name.
	if ( match.scope && match.scope !== encodeURIComponent( match.scope ) ) {
		return 'The package name contains non-allowed characters.';
	}

	if ( match.name !== encodeURIComponent( match.name ) ) {
		return 'The package name contains non-allowed characters.';
	}

	// Characters ~'!()*  will not be escaped by `encodeURIComponent()`, but they aren't allowed for the npm package name.
	if ( /[~'!()*]/.test( packageName ) ) {
		return 'The package name contains non-allowed characters.';
	}

	return true;
}

/**
 * @param {String|undefined} packageName
 * @returns {{ scope: string|null, name: string }|null}
 */
function getPackageNameParts( packageName ) {
	const scopedMatch = packageName.match( SCOPED_PACKAGE_REGEXP );

	if ( scopedMatch ) {
		return {
			scope: scopedMatch[ 1 ],
			name: scopedMatch[ 2 ]
		};
	}

	const unscopedMatch = packageName.match( UNSCOPED_PACKAGE_REGEXP );

	if ( unscopedMatch ) {
		return {
			scope: null,
			name: unscopedMatch[ 1 ]
		};
	}

	return null;
}

/**
 * @param {String|true} result
 * @returns {String|undefined}
 */
function validationResultToPrompt( result ) {
	return result === true ? undefined : result;
}
