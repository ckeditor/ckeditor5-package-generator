/**
 * @license Copyright (c) 2020-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import fs from 'node:fs';
import mkdirp from 'mkdirp';
import upath from 'upath';

/**
 * Checks whether its possible to create a directory, and either creates it or ends the process with an error.
 *
 * @param {Logger} logger
 * @param {String} packageName
 */
export default function createDirectory( logger, packageName ) {
	const directoryName = packageName.startsWith( '@' ) ? packageName.split( '/' )[ 1 ] : packageName;
	const directoryPath = upath.resolve( directoryName );

	if ( fs.existsSync( directoryPath ) ) {
		logger.error( 'Cannot create a directory as the location is already taken.' );
		logger.error( 'Aborting.' );

		process.exit( 1 );
	}

	mkdirp.sync( directoryPath );

	return { directoryName, directoryPath };
}
