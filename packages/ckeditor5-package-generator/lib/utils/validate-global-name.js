/**
 * @license Copyright (c) 2020-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * Checks if the global name is valid.
 *
 * Returns a string containing the validation error, or `null` if no errors were found.
 *
 * @param {String} globalName
 * @returns {String|null}
 */
export function getGlobalNameValidationError( globalName ) {
	if ( !globalName || !globalName.length ) {
		return 'The global name can not be an empty string.';
	}
	if ( !/^[a-zA-Z0-9_\-/@]+$/.test( globalName ) ) {
		return 'The global name contains non-allowed characters.';
	}

	if ( !/^(?!\/).*(?!\/)$/g.test( globalName ) ) {
		return 'The global name can not start with "/" and end with "/" characters.';
	}

	if ( /^[0-9]/.test( globalName ) ) {
		return 'The global name can not start with a digit.';
	}

	return null;
}
