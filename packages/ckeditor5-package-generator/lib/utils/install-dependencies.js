/**
 * @license Copyright (c) 2020-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { spawn } from 'node:child_process';
import { createSpinner } from './prompt.js';
import SUPPORTED_PACKAGE_MANAGERS from './supported-package-managers.js';

/**
 * @param {String} directoryPath
 * @param {'npm'|'pnpm'} packageManager
 * @param {Boolean} verbose
 * @returns {Promise}
 */
export default async function installDependencies( directoryPath, packageManager, verbose ) {
	const installSpinner = verbose ? null : createSpinner();

	installSpinner?.start( 'Installing dependencies' );

	try {
		await installPackages( directoryPath, packageManager, verbose );
		installSpinner?.stop( 'Dependencies installed.' );
	} catch ( error ) {
		installSpinner?.stop( 'Installing dependencies failed.', 1 );

		throw error;
	}
}

/**
 * @param {String} directoryPath
 * @param {'npm'|'pnpm'} packageManager
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

		if ( !SUPPORTED_PACKAGE_MANAGERS.includes( packageManager ) ) {
			return reject( new Error( `Unknown package manager: ${ packageManager }.` ) );
		}

		const installTask = spawn( `${ packageManager } install`, spawnOptions );

		// Collect the output that is not shown in the non-verbose mode, so it can be shown when the installation fails.
		let output = '';

		installTask.stdout?.on( 'data', data => {
			output += data;
		} );

		installTask.stderr?.on( 'data', data => {
			output += data;
		} );

		installTask.on( 'close', exitCode => {
			if ( exitCode !== 0 ) {
				const error = new Error( 'Installing dependencies finished with an error.' );

				error.output = output;

				return reject( error );
			}

			return resolve();
		} );
	} );
}
