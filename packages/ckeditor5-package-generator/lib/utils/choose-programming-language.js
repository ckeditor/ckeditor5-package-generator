/**
 * @license Copyright (c) 2020-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const { prompt } = require( 'inquirer' );

const PROGRAMMING_LANGUAGES = [
	{ value: 'js', displayName: 'JavaScript' },
	{ value: 'ts', displayName: 'TypeScript (experimental)' }
];

/**
 * Chooses programming language. If --lang option us used, and it has valid value, that is returned.
 * Otherwise, ask user to choose from available programming languages.
 *
 * @param {Logger} logger
 * @param {String} lang
 * @returns {Promise<String>}
 */
module.exports = async function chooseProgrammingLanguage( logger, lang ) {
	if ( lang ) {
		const langShorthands = PROGRAMMING_LANGUAGES.map( ( { value } ) => value );

		if ( langShorthands.includes( lang ) ) {
			return lang;
		}

		logger.error( `--lang option has to be one of: ${ langShorthands.join( ', ' ) }. Falling back to manual choice.` );
	}

	const { programmingLanguage } = await prompt( [ {
		prefix: '📍',
		name: 'programmingLanguage',
		message: 'Choose your programming language:',
		type: 'list',
		choices: PROGRAMMING_LANGUAGES.map( ( { displayName } ) => displayName )
	} ] );

	// Full name to shorthand: "JavaScript" => "js"
	return PROGRAMMING_LANGUAGES.find( p => p.displayName === programmingLanguage ).value;
};
