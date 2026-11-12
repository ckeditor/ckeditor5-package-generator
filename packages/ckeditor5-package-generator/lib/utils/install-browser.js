/**
 * @license Copyright (c) 2020-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { spawn } from 'node:child_process';
import { createSpinner, showNote } from './prompt.js';

/**
 * Commands that execute a binary installed in the package. The `spawn` command is executed by the generator
 * and the `display` command is shown to the user.
 */
const EXEC_COMMANDS = {
	npm: { spawn: 'npx', display: 'npx' },
	yarn: { spawn: 'yarnpkg', display: 'yarn' },
	pnpm: { spawn: 'pnpm exec', display: 'pnpm exec' }
};

/**
 * Downloads the Chromium browser used by Playwright to run the tests of the generated package.
 *
 * A failed download does not stop the generator. Instead, it shows the commands to run manually.
 *
 * @param {String} directoryPath
 * @param {'npm'|'yarn'|'pnpm'} packageManager
 * @param {Boolean} verbose
 * @returns {Promise}
 */
export default async function installBrowser( directoryPath, packageManager, verbose ) {
	const execCommand = EXEC_COMMANDS[ packageManager ];

	if ( !execCommand ) {
		throw new Error( `Unknown package manager: ${ packageManager }.` );
	}

	const installSpinner = verbose ? null : createSpinner();

	installSpinner?.start( 'Installing Chromium for tests' );

	const exitCode = await runCommand( `${ execCommand.spawn } playwright install chromium`, directoryPath, verbose );

	// The exit code is `null` when the process is terminated by a signal, which is not a success.
	if ( exitCode === 0 ) {
		installSpinner?.stop( 'Chromium installed.' );

		return;
	}

	installSpinner?.error( 'Installing Chromium failed.' );

	showNote( getFailureMessage( execCommand.display ), 'Installing Chromium failed' );
}

/**
 * @param {String} command
 * @param {String} directoryPath
 * @param {Boolean} verbose
 * @returns {Promise<Number|null>}
 */
function runCommand( command, directoryPath, verbose ) {
	return new Promise( resolve => {
		const spawnOptions = {
			encoding: 'utf8',
			shell: true,
			cwd: directoryPath,
			stderr: 'inherit'
		};

		if ( verbose ) {
			spawnOptions.stdio = 'inherit';
		}

		const installTask = spawn( command, spawnOptions );

		// Resolve with a non-zero exit code if the command cannot be started at all.
		installTask.on( 'error', () => resolve( 1 ) );
		installTask.on( 'close', resolve );
	} );
}

/**
 * @param {String} execCommand
 * @returns {String}
 */
function getFailureMessage( execCommand ) {
	const installCommand = `${ execCommand } playwright install chromium`;

	// Only Linux needs system libraries that Playwright can install. The `install-deps` command
	// uses `apt-get`, so it works on Debian and Ubuntu, and asks for `sudo` permissions.
	if ( process.platform === 'linux' ) {
		return [
			'Tests run in Chromium. Install its system dependencies and download it',
			'by running these commands in the package directory:',
			'',
			`${ execCommand } playwright install-deps chromium`,
			installCommand
		].join( '\n' );
	}

	return [
		'Tests run in Chromium. Download it by running this command',
		'in the package directory:',
		'',
		installCommand
	].join( '\n' );
}
