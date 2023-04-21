/**
 * @license Copyright (c) 2020-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const { prompt } = require( 'inquirer' );
const isYarnInstalled = require( './is-yarn-installed' );

/**
 * @param {Boolean} useNpm
 * @param {Boolean} useYarn
 * @param {Boolean} usePnpm
 * @returns {Promise<'npm'|'yarn'|'pnpm'}
 */
module.exports = async function choosePackageManager( useNpm, useYarn, usePnpm ) {
	const yarnInstalled = isYarnInstalled();
	// TODO: Is pnpm available?

	if ( useYarn && !yarnInstalled ) {
		throw new Error( 'Detected --use-yarn option but yarn is not installed.' );
	}

	if ( !yarnInstalled ) {
		return 'npm';
	}

	if ( [ useNpm, useYarn, usePnpm ].filter( Boolean ).length >= 2 ) {
		return await askUserToChoosePackageManager();
	}

	if ( usePnpm ) {
		return 'pnpm';
	}

	if ( useNpm ) {
		return 'npm';
	}

	if ( useYarn ) {
		return 'yarn';
	}

	return await askUserToChoosePackageManager();
};

/**
 * @returns {Promise<'npm'|'yarn'>}
 */
async function askUserToChoosePackageManager() {
	const { packageManager } = await prompt( [ {
		prefix: '📍',
		name: 'packageManager',
		message: 'Choose the package manager:',
		type: 'list',
		choices: [ 'yarn', 'npm', 'pnpm' ]
	} ] );

	return packageManager;
}

