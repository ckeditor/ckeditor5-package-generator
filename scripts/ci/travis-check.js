#!/usr/bin/env node

/**
 * @license Copyright (c) 2020-2022, CKSource Holding sp. z o.o. All rights reserved.
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

const EXPECTED_PUBLISH_FILES = {
	js: [
		'src/index.js',
		'src/myplugin.js',

		'lang/contexts.json',
		'theme/icons/ckeditor.svg',
		'build/test-package.js',

		'package.json',
		'LICENSE.md',
		'README.md',
		'ckeditor5-metadata.json'
	],
	ts: [
		'src/index.js',
		'src/myplugin.js',
		'src/index.d.ts',
		'src/myplugin.d.ts',

		'lang/contexts.json',
		'theme/icons/ckeditor.svg',
		'build/test-package.js',

		'package.json',
		'LICENSE.md',
		'README.md',
		'ckeditor5-metadata.json'
	]
};

const EXPECTED_SRC_DIR_FILES = {
	js: [
		'index.js',
		'myplugin.js'
	],
	ts: [
		'index.ts',
		'myplugin.ts'
	]
};

// A flag that determines whether any of the executed commands resulted in an error.
let foundError = false;

start();

/**
 * Runs checks and exits with an appropriate exit code.
 */
async function start() {
	await testBuild( 'js' );
	await testBuild( 'ts' );

	if ( foundError ) {
		console.log( '\n' + chalk.red( 'Found errors during the verification. Please, review the log above.' ) );
	}

	process.exit( foundError ? 1 : 0 );
}

/**
 * Build and run scripts for a given language.
 *
 * @param {string} lang
 */
async function testBuild( lang ) {
	logProcess( `Testing build for language: [${ lang }].` );

	logProcess( 'Creating new package: "@ckeditor/ckeditor5-test-package"...' );
	executeCommand( REPOSITORY_DIRECTORY, 'node',
		[ 'packages/ckeditor5-package-generator/bin/index.js', '@ckeditor/ckeditor5-test-package', '--dev', '--verbose', '--lang', lang ]
	);

	logProcess( 'Moving the package to temporary directory...' );
	executeCommand( REPOSITORY_DIRECTORY, 'mv', [ 'ckeditor5-test-package', '..' ] );

	logProcess( 'Executing tests...' );
	executeCommand( NEW_PACKAGE_DIRECTORY, 'yarn', [ 'run', 'test' ] );

	logProcess( 'Executing linters...' );
	executeCommand( NEW_PACKAGE_DIRECTORY, 'yarn', [ 'run', 'lint' ] );
	executeCommand( NEW_PACKAGE_DIRECTORY, 'yarn', [ 'run', 'stylelint' ] );

	logProcess( 'Verifying translations...' );
	executeCommand( NEW_PACKAGE_DIRECTORY, 'yarn', [ 'run', 'translations:collect' ] );

	logProcess( 'Verifying release process...' );
	const { stderr } = executeCommand( NEW_PACKAGE_DIRECTORY, 'npm', [ 'publish', '--dry-run' ], 'pipe' );
	console.log( stderr );
	checkFileList( stderr, lang );

	logProcess( 'Verifying post release cleanup...' );
	verifyPublishCleanup( lang );

	logProcess( 'Starting the development servers and verifying the sample builds...' );
	await Promise.all( [
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
		} );
}

/**
 * Executes the specified program with its modifiers in the specified `cwd` directory.
 *
 * @param {String} cwd
 * @param {String} command Program to execute.
 * @param {Array.<String>} modifiers Program's modifiers.
 * @param {String} stderr Optional alternative output stream for stderr.
 * @return {Object}
 */
function executeCommand( cwd, command, modifiers, stderr ) {
	const fullCommand = [ command, ...modifiers ].join( ' ' );
	console.log( chalk.italic.gray( `Executing: "${ fullCommand }".` ) );

	const newProcess = spawnSync( command, modifiers, {
		cwd,
		encoding: 'utf8',
		shell: true,
		stdio: [
			'inherit',
			'inherit',
			stderr || 'inherit'
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
			const endMatch = /webpack \d+\.\d+\.\d+ compiled successfully in \d+ ms/.test( content );

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

/**
 * Checks whether output of "npm publish" contains correct files.
 *
 * @param {String} output
 * @param {string} lang
 */
function checkFileList( output, lang ) {
	const match = output.match( /Tarball Contents.+\n(?<lines>[\s\S]+)\n.+Tarball Details/ );

	if ( !match ) {
		console.log( chalk.red( 'Command "npm publish" finished with an unexpected output.' ) );

		foundError = true;

		return;
	}

	const files = match.groups.lines.split( '\n' ).map( string => string.trim().split( ' ' ).pop() );

	const missingFiles = compareArrays( EXPECTED_PUBLISH_FILES[ lang ], files );
	const excessFiles = compareArrays( files, EXPECTED_PUBLISH_FILES[ lang ] );

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
 * Returns array of items which are present in array A but missing from array B.
 *
 * @param {Array} arrA
 * @param {Array} arrB
 * @returns {Array}
 */
function compareArrays( arrA, arrB ) {
	return arrA.reduce( ( diff, item ) => {
		if ( !arrB.includes( item ) ) {
			diff.push( item );
		}

		return diff;
	}, [] );
}

/**
 * Checks whether after publishing, the repository is in a correct state:
 *
 * - "main" field in "package.json" should point to the correct language.
 * - There should be no leftover build files in "src" directory.
 *
 * @param {String} lang
 */
function verifyPublishCleanup( lang ) {
	// "package.json" check.
	const pkgJsonPath = path.join( NEW_PACKAGE_DIRECTORY, 'package.json' );
	const pkgJsonRaw = fs.readFileSync( pkgJsonPath, 'utf-8' );
	const pkgJsonContent = JSON.parse( pkgJsonRaw );

	const hasCorrectEntryPoint = pkgJsonContent.main === `src/index.${ lang }`;

	if ( !hasCorrectEntryPoint ) {
		console.log( chalk.red( '"package.json" has incorrect value in "main" field:' ) );
		console.log( chalk.red( pkgJsonContent.main ) );

		foundError = true;
	}

	// "src" directory check.
	const srcDirPath = path.join( NEW_PACKAGE_DIRECTORY, 'src' );
	const srcDirContent = fs.readdirSync( srcDirPath );

	const excessFiles = [];

	for ( const file of srcDirContent ) {
		if ( !EXPECTED_SRC_DIR_FILES[ lang ].includes( file ) ) {
			excessFiles.push( file );
		}
	}

	if ( excessFiles.length ) {
		console.log( chalk.red( 'Excess files after publishing in "src" directory:' ) );
		console.log( chalk.red( excessFiles.map( file => `- ${ file }` ).join( '\n' ) ) );

		foundError = true;
	}

	if ( hasCorrectEntryPoint && !excessFiles.length ) {
		console.log( chalk.green( 'Post release cleanup successful.' ) );
	}
}
