#!/usr/bin/env node

/**
 * @license Copyright (c) 2020-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import fs from 'node:fs';
import upath from 'upath';
import { spawn, spawnSync } from 'node:child_process';
import { stripVTControlCharacters } from 'node:util';
import chalk from 'chalk';
import parseArguments from './utils/parsearguments.js';
import { EXPECTED_PUBLISH_FILES } from './utils/expectedFiles.js';

const REPOSITORY_DIRECTORY = upath.join( import.meta.dirname, '..', '..' );
const NEW_PACKAGE_DIRECTORY = upath.join( REPOSITORY_DIRECTORY, '..', 'ckeditor5-test-package' );

const VERIFICATION_TIMEOUT = 3 * 60 * 1000;

// A flag that determines whether any of the executed commands resulted in an error.
let foundError = false;

start();

/**
 * Runs checks and exits with an appropriate exit code.
 */
async function start() {
	const options = parseArguments( process.argv.slice( 2 ) );

	await withTimeout( verifyBuild( options ), VERIFICATION_TIMEOUT );

	if ( foundError ) {
		console.log( '\n' + chalk.red( 'Found errors during the verification. Please, review the log above.' ) );
	}

	process.exit( foundError ? 1 : 0 );
}

/**
 * Build and run scripts for a given language and packageManager.
 *
 * @param {VerificationOptions} options
 */
async function verifyBuild( { language, packageManager, customPluginName, globalName } ) {
	let testSetupInfoMessage = `Testing build for language: [${ language }] and package manager: [${ packageManager }]`;

	const projectRootName = upath.basename( process.cwd() );
	const packageBuildCommand = [
		'node',
		`${ projectRootName }/packages/ckeditor5-package-generator/bin/index.js`,
		'@ckeditor/ckeditor5-test-package',
		'--dev',
		'--verbose',
		'--lang', language,
		`--use-${ packageManager }`,
		`--global-name ${ globalName }`
	];

	if ( language === 'ts' ) {
		const fileName = customPluginName ? customPluginName.toLowerCase() : 'testpackage';

		EXPECTED_PUBLISH_FILES.ts.push( `dist/${ fileName }.d.ts` );
	}

	const expectedPublishFiles = getExpectedFiles(
		EXPECTED_PUBLISH_FILES,
		language,
		customPluginName
	);

	if ( customPluginName ) {
		testSetupInfoMessage += ` with custom plugin name: [${ customPluginName }]`;
		packageBuildCommand.push( '--plugin-name', customPluginName );
	}

	logProcess( testSetupInfoMessage + '.' );

	logProcess( 'Creating new package: "@ckeditor/ckeditor5-test-package"...' );
	executeCommand( packageBuildCommand, { cwd: upath.join( REPOSITORY_DIRECTORY, '..' ) } );

	logProcess( 'Executing tests...' );
	executeCommand( [ 'npm', 'run', 'test' ], { cwd: NEW_PACKAGE_DIRECTORY } );

	logProcess( 'Executing linters...' );
	executeCommand( [ 'npm', 'run', 'lint' ], { cwd: NEW_PACKAGE_DIRECTORY } );
	executeCommand( [ 'npm', 'run', 'stylelint' ], { cwd: NEW_PACKAGE_DIRECTORY } );

	logProcess( 'Verifying translations...' );
	executeCommand( [ 'npm', 'run', 'translations:validate' ], { cwd: NEW_PACKAGE_DIRECTORY } );

	logProcess( 'Verifying release process...' );
	const { stderr } = executeCommand( [ 'npm', 'publish', '--dry-run' ], { cwd: NEW_PACKAGE_DIRECTORY, pipeStderr: true } );
	console.log( stderr );
	checkFileList( stderr, expectedPublishFiles );

	logProcess( 'Starting the development servers and verifying the sample builds...' );

	const listOfDevelopmentServers = [ startDevelopmentServer( NEW_PACKAGE_DIRECTORY ) ];

	const optionsList = await Promise.all( listOfDevelopmentServers );

	optionsList.forEach( options => {
		executeCommand( [ 'node', upath.join( 'scripts', 'ci', 'verify-sample.js' ), options.url ], { cwd: REPOSITORY_DIRECTORY } );
	} );

	logProcess( 'Stopping the development servers...' );

	await Promise.all( optionsList.map( options => killProcess( options.server ) ) );

	logProcess( 'Removing the created package...' );

	fs.rmSync( NEW_PACKAGE_DIRECTORY, { recursive: true } );
}

/**
 * Executes the specified program with its modifiers in the specified `cwd` directory.
 *
 * @param {Array.<String>} command Program to execute along with all its arguments.
 * @param {Object} options
 * @param {String} options.cwd
 * @param {Boolean} [options.pipeStderr=false] Stores error output in returned object instead of logging it to the console.
 * @returns {Object} Process
 */
function executeCommand( command, options ) {
	console.log( chalk.italic.gray( `Executing: "${ command.join( ' ' ) }".` ) );

	const newProcess = spawnSync( command.shift(), command, {
		cwd: options.cwd,
		encoding: 'utf8',
		shell: true,
		stdio: [
			'inherit',
			'inherit',
			options.pipeStderr ? 'pipe' : 'inherit'
		]
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
		const sampleServer = spawn( 'npm', [ 'run', 'start' ], {
			cwd,
			encoding: 'utf8',
			shell: true,
			detached: true
		} );

		sampleServer.stdout.on( 'data', data => {
			const content = stripVTControlCharacters( data.toString() ).slice( 0, -1 );
			const serverUrl = content.match( /http:\/\/(.*):\d+\// )?.[ 0 ];

			if ( serverUrl ) {
				return resolve( {
					server: sampleServer,
					url: serverUrl
				} );
			}
		} );

		sampleServer.on( 'error', error => {
			return reject( error );
		} );

		setTimeout( () => {
			return reject( new Error( 'Starting the development server timed out.' ) );
		}, 5000 );
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
		let resolved = false;

		const resolveOnce = () => {
			if ( resolved ) {
				return;
			}

			resolved = true;
			resolve();
		};

		childProcess.once( 'exit', resolveOnce );
		childProcess.once( 'close', resolveOnce );

		if ( process.platform === 'win32' ) {
			spawnSync( 'taskkill', [ '/pid', childProcess.pid, '/t', '/f' ] );
		} else {
			process.kill( -childProcess.pid, 'SIGTERM' );
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

/**
 * Checks whether output of "npm publish" contains correct files.
 *
 * @param {String} output
 * @param {Object} expectedPublishFiles
 */
function checkFileList( output, expectedPublishFiles ) {
	const match = output.match( /Tarball Contents.*\n(?<lines>[\s\S]+)\n.*Tarball Details/ );

	if ( !match ) {
		console.log( chalk.red( 'Command "npm publish" finished with an unexpected output.' ) );

		foundError = true;

		return;
	}

	const files = match.groups.lines.split( '\n' ).map( string => string.trim().split( ' ' ).pop() );

	const missingFiles	= expectedPublishFiles.filter( item => !files.includes( item ) );
	const excessFiles	= files.filter( item => !expectedPublishFiles.includes( item ) );

	if ( !missingFiles.length && !excessFiles.length ) {
		console.log( chalk.green( 'Files staged for publishing verified successfully.' ) );

		return;
	}

	foundError = true;

	if ( missingFiles.length ) {
		console.log( chalk.red( 'Files missing from publish:' ) );
		console.log( chalk.red( missingFiles.map( file => `- ${ file }` ).join( '\n' ) ) );
	}

	if ( excessFiles.length ) {
		console.log( chalk.red( 'Excess files included in publish:' ) );
		console.log( chalk.red( excessFiles.map( file => `- ${ file }` ).join( '\n' ) ) );
	}
}

/**
 * Returns an array of expected files for a given language.
 * Custom plugin name is also accounted for, if its specified.
 *
 * @param {Object} expectedFilesObject
 * @param {String} lang
 * @param {String|undefined} customPluginName
 * @returns {Array<String>}
 */
function getExpectedFiles( expectedFilesObject, lang, customPluginName ) {
	if ( !customPluginName ) {
		return expectedFilesObject[ lang ];
	}

	return expectedFilesObject[ lang ].map( filename => filename.replace( 'testpackage', customPluginName.toLowerCase() ) );
}

/**
 * Ensures that waiting for a promise will take no longer than the specified timeout.
 *
 * @param {Promise} promise Promise to wait for.
 * @param {Number} timeout Maximum time to wait in milliseconds.
 * @returns {Promise}
 */
function withTimeout( promise, timeout ) {
	const timeoutPromise = new Promise( ( _, reject ) => {
		setTimeout( () => {
			reject( new Error( `Timeout after ${ timeout / 60 / 1000 } min, aborting.` ) );
		}, timeout );
	} );

	return Promise.race( [ promise, timeoutPromise ] );
}
