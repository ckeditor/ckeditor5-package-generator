/**
 * @license Copyright (c) 2020-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const { prompt } = require( 'inquirer' );
const isYarnInstalled = require( './is-yarn-installed' );

/**
 * @param {CKeditor5PackageGeneratorOptions} options
 * @returns {Promise<'npm'|'yarn'>}
 */
module.exports = async function choosePackageManager( options ) {
	const yarnInstalled = isYarnInstalled();

	if ( options.useYarn && !yarnInstalled ) {
		throw new Error( 'Detected --use-yarn option but yarn is not installed.' );
	}

	if ( !yarnInstalled ) {
		return 'npm';
	}

	if ( options.useNpm && options.useYarn ) {
		return await askUserToChoosePackageManager();
	}

	if ( options.useNpm ) {
		return 'npm';
	}

	if ( options.useYarn ) {
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

