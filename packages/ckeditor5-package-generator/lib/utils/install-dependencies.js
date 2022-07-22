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
 * @param {CKeditor5PackageGeneratorOptions} options
 */
module.exports = async function installDependencies( directoryPath, options ) {
	const installSpinner = tools.createSpinner( 'Installing dependencies... ' + chalk.gray.italic( 'It takes a while.' ), {
		isDisabled: options.verbose
	} );

	installSpinner.start();

	await installPackages( directoryPath, {
		useNpm: options.useNpm,
		verbose: options.verbose
	} );

	installSpinner.finish();
};

/**
 * @param {String} directoryPath
 * @param {CKeditor5PackageGeneratorOptions} options
 * @returns {Promise}
 */
function installPackages( directoryPath, options ) {
	return new Promise( ( resolve, reject ) => {
		const spawnOptions = {
			encoding: 'utf8',
			shell: true,
			cwd: directoryPath,
			stderr: 'inherit'
		};

		let installTask;

		if ( options.verbose ) {
			spawnOptions.stdio = 'inherit';
		}

		if ( options.useNpm ) {
			const npmArguments = [
				'install',
				'--prefix',
				directoryPath
			];

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
