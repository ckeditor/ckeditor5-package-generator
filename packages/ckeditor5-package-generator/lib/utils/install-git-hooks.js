/**
 * @license Copyright (c) 2020-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const { spawn } = require( 'child_process' );

/**
 * @param {string} directoryPath
 * @param {Logger} logger
 * @param {CKeditor5PackageGeneratorOptions} options
 */
module.exports = function installGitHooks( directoryPath, logger, options ) {
	logger.process( 'Installing Git hooks...' );

	return new Promise( ( resolve, reject ) => {
		const spawnOptions = {
			encoding: 'utf8',
			shell: true,
			cwd: directoryPath,
			stderr: 'inherit'
		};

		const spawnArguments = [ 'rebuild', 'husky' ];

		if ( options.verbose ) {
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
};
