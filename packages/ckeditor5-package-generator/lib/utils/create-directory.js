/**
 * @license Copyright (c) 2020-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const chalk = require( 'chalk' );
const fs = require( 'fs' );
const mkdirp = require( 'mkdirp' );
const path = require( 'path' );

/**
 * Checks whether its possible to create a directory, and either creates it or ends the process with an error.
 *
 * @param {Logger} logger
 * @param {string} packageName
 */
module.exports = function createDirectory( logger, packageName ) {
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
};
