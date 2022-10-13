/**
 * @license Copyright (c) 2020-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const { prompt } = require( 'inquirer' );
const isYarnInstalled = require( './is-yarn-installed' );

const NPM = 'npm';
const YARN = 'yarn';

/**
 * @typedef {Object} ChoosePackageManagerArgs
 * @property {Boolean} useNpm
 * @property {Boolean} useYarn
 */

/**
 * @param {ChoosePackageManagerArgs} args
 * @returns {NPM|YARN}
 */
module.exports = async function choosePackageManager( { useNpm = false, useYarn = false } = {} ) {
	if ( useNpm ) {
		return NPM;
	}

	if ( useYarn || isYarnInstalled() ) {
		return YARN;
	}

	const { packageManager } = await prompt( [ {
		prefix: '📍',
		name: 'packageManager',
		message: 'Choose the package manager:',
		type: 'list',
		choices: [ NPM, YARN ]
	} ] );

	return packageManager;
};
