/**
 * @license Copyright (c) 2020-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import inquirer from 'inquirer';

/**
 * @param {Boolean} useNpm
 * @param {Boolean} useYarn
 * @param {Boolean} usePnpm
 * @returns {Promise<'npm'|'yarn'|'pnpm'>}
 */
export default async function choosePackageManager( useNpm, useYarn, usePnpm ) {
	const selected = [ useNpm, useYarn, usePnpm ].filter( Boolean ).length;

	if ( selected > 1 ) {
		return await askUserToChoosePackageManager();
	}

	if ( useNpm ) {
		return 'npm';
	}

	if ( useYarn ) {
		return 'yarn';
	}

	if ( usePnpm ) {
		return 'pnpm';
	}

	return await askUserToChoosePackageManager();
}

/**
 * @returns {Promise<'npm'|'yarn'|'pnpm'>}
 */
async function askUserToChoosePackageManager() {
	const { packageManager } = await inquirer.prompt( [ {
		prefix: '📍',
		name: 'packageManager',
		message: 'Choose the package manager:',
		type: 'list',
		choices: [ 'yarn', 'npm', 'pnpm' ]
	} ] );

	return packageManager;
}

