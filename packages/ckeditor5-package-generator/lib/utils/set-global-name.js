/**
 * @license Copyright (c) 2020-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { promptText, showNote } from './prompt.js';
import { getGlobalNameValidationError } from './validate-global-name.js';

/**
 * Sets global name for generated package. It's used in UMD builds.
 * If `--global-name` option us used, and it has valid value, that is returned.
 * Otherwise, ask user to input the name.
 *
 * @param {String} globalName
 * @param {String} defaultGlobalName
 * @returns {Promise.<String>}
 */
export default async function setGlobalName( globalName, defaultGlobalName ) {
	if ( globalName ) {
		const validationError = getGlobalNameValidationError( globalName );

		if ( !validationError ) {
			return globalName;
		}

		showNote( [
			validationError,
			'',
			'Allowed characters: 0-9 A-Z a-z _ - / @'
		].join( '\n' ), 'Global name' );
	}

	return await promptText( {
		message: 'Global name for UMD build',
		initialValue: defaultGlobalName,
		validate: value => getGlobalNameValidationError( value || '' ) || undefined
	} );
}
