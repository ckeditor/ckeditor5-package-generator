/**
 * @license Copyright (c) 2020-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import chalk from 'chalk';
import fs from 'fs';
import mkdirp from 'mkdirp';
import path from 'path';

/**
 * Checks whether its possible to create a directory, and either creates it or ends the process with an error.
 *
 * @param {Logger} logger
 * @param {String} packageName
 */
export default function createDirectory( logger, packageName ) {
	const directoryName = packageName.split( '/' )[ 1 ];
	const directoryPath = path.resolve( directoryName );

	logger.process( `Checking whether the "${ chalk.cyan( directoryName ) }" directory can be created.` );

	if ( fs.existsSync( directoryPath ) ) {
		logger.error( 'Cannot create a directory as the location is already taken.' );
		logger.error( 'Aborting.' );

		process.exit( 1 );
	}

	logger.process( `Creating the directory "${ chalk.cyan( directoryPath ) }".` );

	mkdirp.sync( directoryPath );

	return { directoryName, directoryPath };
}
