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
 * @returns {Promise<'npm'|'yarn'>}
 */
module.exports = async function choosePackageManager( useNpm, useYarn ) {
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
		choices: [ 'yarn', 'npm' ]
	} ] );

	return packageManager;
}

