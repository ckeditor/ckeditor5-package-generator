/**
 * @license Copyright (c) 2020-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const { prompt } = require( 'inquirer' );

const PROGRAMMING_LANGUAGES = {
	JavaScript: 'js',
	TypeScript: 'ts'
};

/**
 * Ask user to choose from available programming languages.
 *
 * @returns {string}
 */
module.exports = async function chooseProgrammingLanguage() {
	const { programmingLanguage } = await prompt( [ {
		prefix: '📍',
		name: 'programmingLanguage',
		message: 'Choose your programming language:',
		type: 'list',
		choices: Object.keys( PROGRAMMING_LANGUAGES )
	} ] );

	// Full name to shorthand: "JavaScript" => "js"
	return PROGRAMMING_LANGUAGES[ programmingLanguage ];
};
