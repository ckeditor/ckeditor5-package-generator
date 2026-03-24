/**
 * @license Copyright (c) 2020-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import isYarnInstalled from './is-yarn-installed.js';
import isPnpmInstalled from './is-pnpm-installed.js';
import chalk from 'chalk';
import { promptSelect } from './prompt.js';

/**
 * @param {Logger} logger
 * @param {ChoosePackageManagerOptions} options
 * @returns {Promise<'npm'|'yarn'|'pnpm'>}
 */
export default async function choosePackageManager( logger, { useNpm, useYarn, usePnpm } ) {
	const yarnInstalled = isYarnInstalled();
	const pnpmInstalled = isPnpmInstalled();
	const availablePackageManagers = [
		'npm',
		yarnInstalled && 'yarn',
		pnpmInstalled && 'pnpm'
	].filter( Boolean );
	const requestedPackageManagers = [
		useNpm && 'npm',
		useYarn && 'yarn',
		usePnpm && 'pnpm'
	].filter( Boolean );
	const availableRequestedPackageManagers = requestedPackageManagers.filter( manager => availablePackageManagers.includes( manager ) );
	const unavailableRequestedPackageManagers = requestedPackageManagers.filter( manager => !availablePackageManagers.includes( manager ) );

	if ( !yarnInstalled && !pnpmInstalled ) {
		logger.info( chalk.yellow( 'Using npm as no other supported package manager is installed.' ) );

		return 'npm';
	}

	if ( unavailableRequestedPackageManagers.length ) {
		logger.info(
			'Ignoring unavailable package manager choices: ' + unavailableRequestedPackageManagers.join( ', ' ) + '.'
		);
	}

	if ( availableRequestedPackageManagers.length === 1 ) {
		return availableRequestedPackageManagers[ 0 ];
	}

	if ( availableRequestedPackageManagers.length > 1 ) {
		logger.info( 'Multiple package managers were requested. Choose one to continue.' );
	}

	return await askUserToChoosePackageManager( {
		availablePackageManagers,
		initialValue: availableRequestedPackageManagers[ 0 ] || 'npm'
	} );
}

/**
 * @returns {Promise<'npm'|'yarn'|'pnpm'>}
 */
async function askUserToChoosePackageManager( { availablePackageManagers, initialValue } ) {
	return await promptSelect( {
		message: 'Package manager',
		initialValue,
		options: availablePackageManagers.map( packageManager => ( {
			value: packageManager,
			label: packageManager
		} ) )
	} );
}

/**
 * @typedef {Object} ChoosePackageManagerOptions
 * @property {boolean} useNpm Whether to use npm.
 * @property {boolean} useYarn Whether to use yarn.
 * @property {boolean} usePnpm Whether to use pnpm.
 */
