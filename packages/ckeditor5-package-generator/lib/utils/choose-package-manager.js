/**
 * @license Copyright (c) 2020-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import inquirer from 'inquirer';
import isYarnInstalled from './is-yarn-installed.js';

/**
 * @param {Boolean} useNpm
 * @param {Boolean} useYarn
 * @returns {Promise<'npm'|'yarn'>}
 */
export default async function choosePackageManager( useNpm, useYarn ) {
	const yarnInstalled = isYarnInstalled();

	if ( useYarn && !yarnInstalled ) {
		throw new Error( 'Detected --use-yarn option but yarn is not installed.' );
	}

	if ( !yarnInstalled ) {
		return 'npm';
	}

	if ( useNpm && useYarn ) {
		return await askUserToChoosePackageManager();
	}

	if ( useNpm ) {
		return 'npm';
	}

	if ( useYarn ) {
		return 'yarn';
	}

	return await askUserToChoosePackageManager();
}

/**
 * @returns {Promise<'npm'|'yarn'>}
 */
async function askUserToChoosePackageManager() {
	const { packageManager } = await inquirer.prompt( [ {
		prefix: '📍',
		name: 'packageManager',
		message: 'Choose the package manager:',
		type: 'list',
		choices: [ 'yarn', 'npm' ]
	} ] );

	return packageManager;
}

