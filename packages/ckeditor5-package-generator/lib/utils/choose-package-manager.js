/**
 * @license Copyright (c) 2020-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const { prompt } = require( 'inquirer' );
const isYarnInstalled = require( './is-yarn-installed' );

/**
 * @param {{isNpmFlagUsed: Boolean, isYarnFlagUsed: Boolean}} args
 * @returns {'npm'|'yarn'}
 */
module.exports = async function choosePackageManager( { isNpmFlagUsed, isYarnFlagUsed } ) {
	const yarnInstalled = isYarnInstalled();

	if ( isYarnFlagUsed && !yarnInstalled ) {
		throw new Error( 'Detected --use-yarn option but yarn is not installed.' );
	}

	if ( isNpmFlagUsed && isYarnFlagUsed ) {
		return await askUserToChoosePackageManager();
	}

	if ( !yarnInstalled ) {
		return 'npm';
	}

	if ( isNpmFlagUsed ) {
		return 'npm';
	}

	if ( isYarnFlagUsed ) {
		return 'yarn';
	}

	return await askUserToChoosePackageManager();
};

/**
 * @returns {'npm'|'yarn'}
 */
async function askUserToChoosePackageManager() {
	const { packageManager } = await prompt( [ {
		prefix: '📍',
		name: 'packageManager',
		message: 'Choose the package manager:',
		type: 'list',
		choices: [ 'yarn', 'npm' ]
	} ] );

	return packageManager;
}

