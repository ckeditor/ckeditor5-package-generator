/**
 * @license Copyright (c) 2020-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { tools } from '@ckeditor/ckeditor5-dev-utils';
import chalk from 'chalk';
import { spawn } from 'child_process';

/**
 * @param {String} directoryPath
 * @param {'npm'|'yarn'} packageManager
 * @param {Boolean} verbose
 * @param {Boolean} dev
 * @returns {Promise}
 */
export default async function installDependencies( directoryPath, packageManager, verbose, dev ) {
	const installSpinner = tools.createSpinner( 'Installing dependencies... ' + chalk.gray.italic( 'It takes a while.' ), {
		isDisabled: verbose
	} );

	installSpinner.start();

	await installPackages( directoryPath, packageManager, verbose, dev );

	installSpinner.finish();
}

/**
 * @param {String} directoryPath
 * @param {'npm'|'yarn'} packageManager
 * @param {Boolean} verbose
 * @param {Boolean} dev
 * @returns {Promise}
 */
function installPackages( directoryPath, packageManager, verbose, dev ) {
	return new Promise( ( resolve, reject ) => {
		const spawnOptions = {
			encoding: 'utf8',
			shell: true,
			cwd: directoryPath,
			stderr: 'inherit'
		};

		let installTask;

		if ( verbose ) {
			spawnOptions.stdio = 'inherit';
		}

		if ( packageManager === 'npm' ) {
			const npmArguments = [
				'install'
			];

			// Flag required for npm 8 to install linked packages' dependencies
			if ( dev ) {
				npmArguments.push( '--install-links' );
			}

			installTask = spawn( 'npm', npmArguments, spawnOptions );
		} else {
			installTask = spawn( 'yarnpkg', [], spawnOptions );
		}

		installTask.on( 'close', exitCode => {
			if ( exitCode ) {
				return reject( new Error( 'Installing dependencies finished with an error.' ) );
			}

			return resolve();
		} );
	} );
}
