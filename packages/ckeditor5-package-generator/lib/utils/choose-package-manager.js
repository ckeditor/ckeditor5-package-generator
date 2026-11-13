/**
 * @license Copyright (c) 2020-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { styleText } from 'node:util';
import isPnpmInstalled from './is-pnpm-installed.js';
import { promptSelect } from './prompt.js';
import SUPPORTED_PACKAGE_MANAGERS from './supported-package-managers.js';

/**
 * @param {Logger} logger
 * @param {'npm'|'pnpm'|undefined} packageManager
 * @returns {Promise<'npm'|'pnpm'>}
 */
export default async function choosePackageManager( logger, packageManager ) {
	if ( packageManager && !SUPPORTED_PACKAGE_MANAGERS.includes( packageManager ) ) {
		logger.info(
			`The provided package manager "${ packageManager }" is not supported. ` +
			`Choose one of: ${ SUPPORTED_PACKAGE_MANAGERS.join( ', ' ) }.`
		);

		packageManager = undefined;
	}

	if ( packageManager === 'npm' ) {
		return 'npm';
	}

	if ( !isPnpmInstalled() ) {
		if ( packageManager === 'pnpm' ) {
			logger.info( 'Ignoring unavailable package manager choice: pnpm.' );
		}

		logger.info( styleText( 'yellow', 'Using npm because pnpm is not installed.' ) );

		return 'npm';
	}

	if ( packageManager ) {
		return packageManager;
	}

	return await promptSelect( {
		message: 'Package manager',
		initialValue: 'npm',
		options: SUPPORTED_PACKAGE_MANAGERS.map( name => ( { value: name, label: name } ) )
	} );
}
