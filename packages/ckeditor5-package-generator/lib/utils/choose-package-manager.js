/**
 * @license Copyright (c) 2020-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import isYarnInstalled from './is-yarn-installed.js';
import isPnpmInstalled from './is-pnpm-installed.js';
import chalk from 'chalk';
import promptWithErrorHandling from './prompt-with-error-handling.js';

/**
 * @param {Logger} logger
 * @param {ChoosePackageManagerOptions} options
 * @returns {Promise<'npm'|'yarn'|'pnpm'>}
 */
export default async function choosePackageManager( logger, { useNpm, useYarn, usePnpm } ) {
	const yarnInstalled = isYarnInstalled();
	const pnpmInstalled = isPnpmInstalled();
	const selected = [ useNpm, useYarn, usePnpm ].filter( Boolean ).length;

	if ( !yarnInstalled && !pnpmInstalled ) {
		logger.info( chalk.yellow( 'Using npm as no other supported package manager is installed.' ) );

		return 'npm';
	}

	if ( useYarn && !yarnInstalled ) {
		throw new Error( 'Detected --use-yarn option but yarn is not installed.' );
	}

	if ( usePnpm && !pnpmInstalled ) {
		throw new Error( 'Detected --use-pnpm option but pnpm is not installed.' );
	}

	if ( selected > 1 ) {
		return await askUserToChoosePackageManager( { yarnInstalled, pnpmInstalled } );
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

	return await askUserToChoosePackageManager( { yarnInstalled, pnpmInstalled } );
}

/**
 * @returns {Promise<'npm'|'yarn'|'pnpm'>}
 */
async function askUserToChoosePackageManager( { yarnInstalled, pnpmInstalled } ) {
	const choices = [
		'npm',
		yarnInstalled && 'yarn',
		pnpmInstalled && 'pnpm'
	].filter( Boolean );

	const { packageManager } = await promptWithErrorHandling( [ {
		prefix: '📍',
		name: 'packageManager',
		message: 'Choose the package manager:',
		type: 'list',
		choices
	} ] );

	return packageManager;
}

/**
 * @typedef {Object} ChoosePackageManagerOptions
 * @property {boolean} useNpm Whether to use npm.
 * @property {boolean} useYarn Whether to use yarn.
 * @property {boolean} usePnpm Whether to use pnpm.
 */
