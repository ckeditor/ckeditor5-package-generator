/**
 * @license Copyright (c) 2020-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import isYarnInstalled from './is-yarn-installed.js';
import isPnpmInstalled from './is-pnpm-installed.js';
import chalk from 'chalk';
import { promptSelect } from './prompt.js';

const SUPPORTED_PACKAGE_MANAGERS = [ 'npm', 'yarn', 'pnpm' ];

/**
 * @param {Logger} logger
 * @param {'npm'|'yarn'|'pnpm'|undefined} packageManager
 * @returns {Promise<'npm'|'yarn'|'pnpm'>}
 */
export default async function choosePackageManager( logger, packageManager ) {
	const yarnInstalled = isYarnInstalled();
	const pnpmInstalled = isPnpmInstalled();
	const availablePackageManagers = [
		'npm',
		yarnInstalled && 'yarn',
		pnpmInstalled && 'pnpm'
	].filter( Boolean );
	let requestedPackageManager = packageManager;

	if ( requestedPackageManager && !SUPPORTED_PACKAGE_MANAGERS.includes( requestedPackageManager ) ) {
		logger.info(
			`The provided package manager "${ requestedPackageManager }" is not supported. ` +
			`Choose one of: ${ SUPPORTED_PACKAGE_MANAGERS.join( ', ' ) }.`
		);

		requestedPackageManager = undefined;
	}

	if ( requestedPackageManager && !availablePackageManagers.includes( requestedPackageManager ) ) {
		logger.info( `Ignoring unavailable package manager choice: ${ requestedPackageManager }.` );

		requestedPackageManager = undefined;
	}

	if ( !yarnInstalled && !pnpmInstalled ) {
		logger.info( chalk.yellow( 'Using npm as no other supported package manager is installed.' ) );

		return 'npm';
	}

	if ( requestedPackageManager ) {
		return requestedPackageManager;
	}

	return await askUserToChoosePackageManager( {
		availablePackageManagers,
		initialValue: 'npm'
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
