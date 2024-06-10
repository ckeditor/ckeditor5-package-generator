/**
 * @license Copyright (c) 2020-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const { prompt } = require( 'inquirer' );

const INSTALLATION_METHODS = [
	{
		value: 'current',
		displayName: 'Current (v42.0.0+) [recommended]'
	},
	{
		value: 'current-and-legacy',
		displayName: 'Current and legacy methods with DLLs (pre-42.0.0). [⚠️ Requires additional work with imports. See: <link>]'
	}
];

/**
 * Chooses installation method. If --installation-methods option us used, and it has valid value, that is returned.
 * Otherwise, ask user to choose from available installation methods.
 *
 * @param {Logger} logger
 * @param {String} method
 * @returns {Promise<String>}
 */
module.exports = async function chooseIn( logger, method ) {
	if ( method ) {
		const methodShorthands = INSTALLATION_METHODS.map( ( { value } ) => value );

		if ( methodShorthands.includes( method ) ) {
			return method;
		}

		logger.error(
			`--installation-methods option has to be one of: ${ methodShorthands.join( ', ' ) }. Falling back to manual choice.`
		);
	}

	const { installationMethod } = await prompt( [ {
		prefix: '📍',
		name: 'installationMethod',
		message: 'Which installation methods of CKEditor 5 do you want to support?',
		type: 'list',
		choices: INSTALLATION_METHODS.map( ( { displayName } ) => displayName )
	} ] );

	return INSTALLATION_METHODS.find( p => p.displayName === installationMethod ).value;
};
