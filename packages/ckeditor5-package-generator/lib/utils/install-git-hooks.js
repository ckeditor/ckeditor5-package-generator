/**
 * @license Copyright (c) 2020-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { spawn } from 'node:child_process';

/**
 * @param {string} directoryPath
 * @param {Logger} logger
 * @param {CKeditor5PackageGeneratorOptions} options
 */
export default function installGitHooks( directoryPath, logger, verbose ) {
	logger.process( 'Installing Git hooks...' );

	return new Promise( ( resolve, reject ) => {
		const spawnOptions = {
			encoding: 'utf8',
			shell: true,
			cwd: directoryPath,
			stderr: 'inherit'
		};

		const spawnArguments = [ 'rebuild', 'husky' ];

		if ( verbose ) {
			spawnOptions.stdio = 'inherit';
		}

		// 'rebuild' was added to yarn in version 2, but we use yarn 1, thus only npm can be used.
		const rebuildTask = spawn( 'npm', spawnArguments, spawnOptions );

		rebuildTask.on( 'close', exitCode => {
			if ( exitCode ) {
				return reject( new Error( 'Rebuilding finished with an error.' ) );
			}

			return resolve();
		} );
	} );
}
