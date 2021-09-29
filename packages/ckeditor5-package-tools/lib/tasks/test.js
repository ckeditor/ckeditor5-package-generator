/**
 * @license Copyright (c) 2020-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const path = require( 'path' );
const chalk = require( 'chalk' );
const { Server: KarmaServer } = require( 'karma' );

const generateEntryFile = require( '../utils/generate-entry-file' );
const getKarmaConfig = require( '../utils/get-karma-config' );

module.exports = options => {
	// An absolute path to the tests entry point file.
	options.entryFile = path.join( options.cwd, 'tmp', 'tests-entry-point.js' );

	generateEntryFile( options.entryFile );

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
			const coveragePath = path.join( options.cwd, 'coverage' );

			server.on( 'run_complete', () => {
				// Use timeout to not write to the console in the middle of Karma's status.
				setTimeout( () => {
					console.info( `Coverage report saved in '${ chalk.cyan( coveragePath ) }'.` );
				} );
			} );
		}

		server.start();
	} );
}
