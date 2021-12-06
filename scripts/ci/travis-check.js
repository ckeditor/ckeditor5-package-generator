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
const stripAnsiEscapeCodes = require( 'strip-ansi' );

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

logProcess( 'Starting the development servers and verifying the sample builds...' );
Promise.all( [
	startDevelopmentServer( NEW_PACKAGE_DIRECTORY ),
	startDevelopmentServerForDllBuild( NEW_PACKAGE_DIRECTORY )
] )
	.then( optionsList => {
		optionsList.forEach( options => {
			executeCommand( REPOSITORY_DIRECTORY, 'node', [ path.join( 'scripts', 'ci', 'verify-sample.js' ), options.url ] );
		} );

		return optionsList;
	} )
	.then( optionsList => {
		logProcess( 'Stopping the development servers...' );
		return Promise.all( optionsList.map( options => killProcess( options.server ) ) );
	} )
	.then( () => {
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
 * Starts the development server for the DLL build and resolves its process object and URL.
 *
 * @param {String} cwd
 * @return {Promise.<Object>}
 */
function startDevelopmentServerForDllBuild( cwd ) {
	return new Promise( ( resolve, reject ) => {
		const sampleServer = spawn( 'http-server', [ './' ], {
			cwd,
			encoding: 'utf8',
			shell: true
		} );

		// The `http-server` package prints the URL with colors, which have to be removed before searching for the server URL.
		sampleServer.stdout.on( 'data', data => {
			const content = stripAnsiEscapeCodes( data.toString() );
			const urlMatch = content.match( /http:\/\/127.0.0.1:\d+/ );

			if ( urlMatch ) {
				const sampleUrl = `${ urlMatch[ 0 ] }/sample/dll.html`;

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
 * Terminates the process.
 *
 * @param {Object} childProcess The process to terminate.
 * @returns {Promise}
 */
function killProcess( childProcess ) {
	return new Promise( resolve => {
		childProcess.on( 'exit', () => resolve() );

		// On Windows, for unknown reasons, the `childProcess.kill()` does not terminate successfully the development server processes.
		// This in turn made it impossible to remove the created test package directory, because the `EBUSY` error was emitted when trying
		// to remove it. So to unify the method of process termination on different operating systems, the `taskkill` command is used on
		// Windows and `kill` command on other systems.
		//
		// See https://github.com/ckeditor/ckeditor5-package-generator/issues/79.
		if ( process.platform === 'win32' ) {
			// Terminate the process indicated by its id (/pid) and any child processes which were started by it (/t), forcefully (/f).
			spawnSync( 'taskkill', [ '/pid', childProcess.pid, '/t', '/f' ] );
		} else {
			// Terminate the process indicated by its id by sending the `kill` signal that cannot be caught or ignored (-9).
			spawnSync( 'kill', [ '-9', childProcess.pid ] );
		}
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
