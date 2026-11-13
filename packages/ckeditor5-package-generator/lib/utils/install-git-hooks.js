/**
 * @license Copyright (c) 2020-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { spawn } from 'node:child_process';

/**
 * @param {String} directoryPath
 * @param {Boolean} verbose
 * @returns {Promise}
 */
export default function installGitHooks( directoryPath, verbose ) {
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

		const rebuildTask = spawn( 'npm rebuild husky', spawnOptions );

		rebuildTask.on( 'close', exitCode => {
			if ( exitCode ) {
				return reject( new Error( 'Rebuilding finished with an error.' ) );
			}

			return resolve();
		} );
	} );
}
