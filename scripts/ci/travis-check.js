#!/usr/bin/env node

/**
 * @license Copyright (c) 2020-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* eslint-env node */

'use strict';

const { spawn, spawnSync } = require( 'child_process' );
const path = require( 'path' );
const fs = require( 'fs' );
const chalk = require( 'chalk' );

const REPOSITORY_DIRECTORY = path.join( __dirname, '..', '..' );
const NEW_PACKAGE_DIRECTORY = path.join( REPOSITORY_DIRECTORY, '..', 'ckeditor5-test-package' );

// A flag that determines whether any of the executed commands resulted in an error.
let foundError = false;

logProcess( 'Creating new package: "@ckeditor/ckeditor5-test-package"...' );
executeCommand( REPOSITORY_DIRECTORY, 'node', [ 'packages/ckeditor5-package-generator', '@ckeditor/ckeditor5-test-package', '--dev' ] );

logProcess( 'Moving the package to temporary directory...' );
executeCommand( REPOSITORY_DIRECTORY, 'mv', [ 'ckeditor5-test-package', '..' ] );

logProcess( 'Executing tests...' );
executeCommand( NEW_PACKAGE_DIRECTORY, 'yarn', [ 'run', 'test' ] );

logProcess( 'Executing linters...' );
executeCommand( NEW_PACKAGE_DIRECTORY, 'yarn', [ 'run', 'lint' ] );
executeCommand( NEW_PACKAGE_DIRECTORY, 'yarn', [ 'run', 'stylelint' ] );

logProcess( 'Verifying translations...' );
executeCommand( NEW_PACKAGE_DIRECTORY, 'yarn', [ 'run', 'translations:collect' ] );

logProcess( 'Starting the development server...' );
startDevelopmentServer( NEW_PACKAGE_DIRECTORY )
	.then( options => {
		logProcess( 'Verifying the sample...' );
		executeCommand( REPOSITORY_DIRECTORY, 'node', [ path.join( 'scripts', 'ci', 'verify-sample.js' ), options.url ] );

		options.server.kill();

		logProcess( 'Removing the created package...' );
		fs.rmdirSync( NEW_PACKAGE_DIRECTORY, { recursive: true } );

		if ( foundError ) {
			console.log( '\n' + chalk.red( 'Found errors during the verification. Please, review the log above.' ) );
		}

		process.exit( foundError ? 1 : 0 );
	} );

/**
 * Executes the specified program with its modifiers in the specified `cwd` directory.
 *
 * @param {String} cwd
 * @param {String} command Program to execute.
 * @param {Array.<String>} modifiers Program's modifiers.
 * @return {Object}
 */
function executeCommand( cwd, command, modifiers ) {
	const fullCommand = [ command, ...modifiers ].join( ' ' );
	console.log( chalk.italic.gray( `Executing: "${ fullCommand }".` ) );

	const newProcess = spawnSync( command, modifiers, {
		cwd,
		encoding: 'utf8',
		shell: true,
		stdio: 'inherit',
		stderr: 'inherit'
	} );

	if ( newProcess.status ) {
		foundError = true;
	}

	return newProcess;
}

/**
 * Starts the development server and resolves its process object and URL.
 *
 * @param {String} cwd
 * @return {Promise.<Object>}
 */
function startDevelopmentServer( cwd ) {
	return new Promise( ( resolve, reject ) => {
		const sampleServer = spawn( 'yarn', [ 'run', 'start', '--no-open' ], {
			cwd,
			encoding: 'utf8',
			shell: true
		} );

		let sampleUrl;

		// The `webpack-dev-server` package prints the URL to stderr.
		sampleServer.stderr.on( 'data', data => {
			const content = data.toString().slice( 0, -1 );
			const urlMatch = content.match( /http:\/\/localhost:\d+\// );

			if ( !sampleUrl && urlMatch ) {
				sampleUrl = urlMatch[ 0 ];
			}
		} );

		// Webpack prints the "hidden modules..." string when finished processing the file.
		// Hence, we can assume that the server is live at this stage.
		sampleServer.stdout.on( 'data', data => {
			const content = data.toString().slice( 0, -1 );
			const endMatch = /\+ \d+ hidden modules/.test( content );

			if ( endMatch ) {
				return resolve( {
					server: sampleServer,
					url: sampleUrl
				} );
			}
		} );

		sampleServer.on( 'error', error => {
			return reject( error );
		} );
	} );
}

/**
 * Prints the current executed task specified as `message`.
 *
 * @param {String} message
 */
function logProcess( message ) {
	console.log( '\n🔹 ' + chalk.cyan( message ) );
}
