/**
 * @license Copyright (c) 2020-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const { tools } = require( '@ckeditor/ckeditor5-dev-utils' );
const chalk = require( 'chalk' );
const { spawn } = require( 'child_process' );

/**
 * @param {String} directoryPath
 * @param {Boolean} verbose
 * @param {'npm'|'yarn'} packageManager
 * @param {Boolean} isDevModeFlagUsed
 */
module.exports = async function installDependencies( directoryPath, verbose, packageManager, isDevModeFlagUsed ) {
	const installSpinner = tools.createSpinner( 'Installing dependencies... ' + chalk.gray.italic( 'It takes a while.' ), {
		isDisabled: verbose
	} );

	installSpinner.start();

	await installPackages( directoryPath, verbose, packageManager, isDevModeFlagUsed );

	installSpinner.finish();
};

/**
 * @param {String} directoryPath
 * @param {Boolean} verbose
 * @param {'npm'|'yarn'} packageManager
 * @param {Boolean} isDevModeFlagUsed
 * @returns {Promise}
 */
function installPackages( directoryPath, verbose, packageManager, isDevModeFlagUsed ) {
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
				'install',
				'--prefix',
				directoryPath
			];

			// Flag required for npm 8 to install linked packages' dependencies
			if ( isDevModeFlagUsed ) {
				npmArguments.push( '--install-links' );
			}

			installTask = spawn( 'npm', npmArguments, spawnOptions );
		} else {
			const yarnArguments = [
				'--cwd',
				directoryPath
			];

			installTask = spawn( 'yarnpkg', yarnArguments, spawnOptions );
		}

		installTask.on( 'close', exitCode => {
			if ( exitCode ) {
				return reject( new Error( 'Installing dependencies finished with an error.' ) );
			}

			return resolve();
		} );
	} );
}
