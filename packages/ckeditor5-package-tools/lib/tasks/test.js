/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

'use strict';

const path = require( 'path' );
const chalk = require( 'chalk' );
const { Server: KarmaServer } = require( 'karma' );

const generateEntryFile = require( '../utils/generate-entry-file' );
const getKarmaConfig = require( '../utils/get-karma-config' );

// An absolute path to the tests entry point file.
const ENTRY_FILE_PATH = path.join( process.cwd(), 'tmp', 'tests-entry-point.js' );

module.exports = options => {
	options.cwd = process.cwd();
	options.entryFile = ENTRY_FILE_PATH;

	generateEntryFile( ENTRY_FILE_PATH );

	return runKarma( options );
};

function runKarma( options ) {
	return new Promise( ( resolve, reject ) => {
		const config = getKarmaConfig( options );

		const server = new KarmaServer( config, exitCode => {
			if ( exitCode === 0 ) {
				resolve();
			} else {
				reject( new Error( `Karma finished with "${ exitCode }" code.` ) );
			}
		} );

		if ( options.coverage ) {
			const coveragePath = path.join( process.cwd(), 'coverage' );

			server.on( 'run_complete', () => {
				// Use timeout to not write to the console in the middle of Karma's status.
				setTimeout( () => {
					const { logger } = require( '@ckeditor/ckeditor5-dev-utils' );
					const log = logger();

					log.info( `Coverage report saved in '${ chalk.cyan( coveragePath ) }'.` );
				} );
			} );
		}

		server.start();
	} );
}
