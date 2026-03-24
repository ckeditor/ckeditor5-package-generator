/**
 * @license Copyright (c) 2020-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { promptSelect } from './prompt.js';

const PROGRAMMING_LANGUAGES = [
	{ value: 'ts', displayName: 'TypeScript' },
	{ value: 'js', displayName: 'JavaScript' }
];

/**
 * Chooses programming language. If --lang option us used, and it has valid value, that is returned.
 * Otherwise, ask user to choose from available programming languages.
 *
 * @param {Logger} logger
 * @param {String} lang
 * @returns {Promise<String>}
 */
export default async function chooseProgrammingLanguage( logger, lang ) {
	if ( lang ) {
		const langShorthands = PROGRAMMING_LANGUAGES.map( ( { value } ) => value );

		if ( langShorthands.includes( lang ) ) {
			return lang;
		}

		logger.info( `The provided language "${ lang }" is not supported. Choose one of: ${ langShorthands.join( ', ' ) }.` );
	}

	return await promptSelect( {
		message: 'Programming language',
		initialValue: 'ts',
		options: PROGRAMMING_LANGUAGES.map( ( { value, displayName } ) => ( {
			value,
			label: displayName
		} ) )
	} );
}
