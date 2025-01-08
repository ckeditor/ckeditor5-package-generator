/**
 * @license Copyright (c) 2020-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import inquirer from 'inquirer';
import validateGlobalName from './validate-global-name.js';

/**
 * Sets global name for generated package. It's used in UMD builds.
 * If `--global-name` option us used, and it has valid value, that is returned.
 * Otherwise, ask user to input the name.
 *
 * @param {Logger} logger
 * @param {String} globalName
 * @param {String} defaultGlobalName
 * @returns {Promise.<String>}
 */
export default async function setGlobalName( logger, globalName, defaultGlobalName ) {
	if ( globalName ) {
		if ( validateGlobalName( logger, globalName ) ) {
			return globalName;
		}

		logger.error(
			'--global-name does not match the pattern. Falling back to manual choice.'
		);
	}

	const globalNameFromInput = await inquirer.prompt( {
		required: true,
		message: 'Enter the global name for UMD build:',
		type: 'input',
		name: 'globalName',
		validate: validateGlobalName.bind( this, logger ),
		default: defaultGlobalName
	} );

	return globalNameFromInput.globalName;
}
