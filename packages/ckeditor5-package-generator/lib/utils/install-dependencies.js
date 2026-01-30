/**
 * @license Copyright (c) 2020-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { spawn } from 'node:child_process';
import { tools } from '@ckeditor/ckeditor5-dev-utils';
import chalk from 'chalk';

/**
 * @param {String} directoryPath
 * @param {'npm'|'yarn'|'pnpm'} packageManager
 * @param {Boolean} verbose
 * @returns {Promise}
 */
export default async function installDependencies( directoryPath, packageManager, verbose ) {
	const installSpinner = tools.createSpinner( 'Installing dependencies... ' + chalk.gray.italic( 'It takes a while.' ), {
		isDisabled: verbose
	} );

	installSpinner.start();

	await installPackages( directoryPath, packageManager, verbose );

	installSpinner.finish();
}

/**
 * @param {String} directoryPath
 * @param {'npm'|'yarn'|'pnpm'} packageManager
 * @param {Boolean} verbose
 * @returns {Promise}
 */
function installPackages( directoryPath, packageManager, verbose ) {
	return new Promise( ( resolve, reject ) => {
		const spawnOptions = {
			encoding: 'utf8',
			shell: true,
			cwd: directoryPath,
			stderr: 'inherit'
		};

		if ( verbose ) {
			spawnOptions.stdio = 'inherit';
		}

		const COMMAND_MAP = {
			npm: 'npm',
			yarn: 'yarnpkg',
			pnpm: 'pnpm'
		};

		const pkgManager = COMMAND_MAP[ packageManager ];

		if ( !pkgManager ) {
			return reject( new Error( `Unknown package manager: ${ packageManager }.` ) );
		}

		const installTask = spawn(
			pkgManager,
			[ 'install' ],
			spawnOptions
		);

		installTask.on( 'close', exitCode => {
			if ( exitCode ) {
				return reject( new Error( 'Installing dependencies finished with an error.' ) );
			}

			return resolve();
		} );
	} );
}
