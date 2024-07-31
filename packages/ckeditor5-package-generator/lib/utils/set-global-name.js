/**
 * @license Copyright (c) 2020-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const { prompt } = require( 'inquirer' );
const validateGlobalName = require( './validate-global-name' );

/**
 * Sets global name for generated package. It's used in UMD builds.
 * If `--global-name` option us used, and it has valid value, that is returned.
 * Otherwise, ask user to input the name.
 *
 * @param {Logger} logger
 * @param {String} globalName
 * @returns {Promise<String>}
 */
module.exports = async function setGlobalName( logger, globalName ) {
	if ( globalName ) {
		if ( validateGlobalName( logger, globalName ) ) {
			return globalName;
		}

		logger.error(
			`--global-name ${ globalName } provided is not align with the pattern.`
		);
	}

	const globalNameFromInput = await prompt( {
		required: true,
		message: 'Enter the global name for plugin (important in UMD build)',
		type: 'input',
		name: 'globalName',
		validate: validateGlobalName.bind( this, logger )
	} );

	return globalNameFromInput.globalName;
};
