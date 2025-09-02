/**
 * @license Copyright (c) 2020-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import inquirer from 'inquirer';
import isYarnInstalled from './is-yarn-installed.js';
import isPnpmInstalled from './is-pnpm-installed.js';

/**
 * @param {Boolean} useNpm
 * @param {Boolean} useYarn
 * @param {Boolean} usePnpm
 * @returns {Promise<'npm'|'yarn'|'pnpm'>}
 */
export default async function choosePackageManager( useNpm, useYarn, usePnpm ) {
	const yarnInstalled = isYarnInstalled();
	const pnpmInstalled = isPnpmInstalled();

	if ( useYarn && !yarnInstalled ) {
		throw new Error( 'Detected --use-yarn option but yarn is not installed.' );
	}

	if ( usePnpm && !pnpmInstalled ) {
		throw new Error( 'Detected --use-pnpm option but pnpm is not installed.' );
	}

	if ( !yarnInstalled || !pnpmInstalled ) {
		return 'npm';
	}

	if ( useNpm && useYarn || useNpm && usePnpm || usePnpm && useYarn || useNpm && usePnpm && useYarn ) {
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

