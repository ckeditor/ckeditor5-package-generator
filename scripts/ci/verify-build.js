#!/usr/bin/env node

/**
 * @license Copyright (c) 2020-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* eslint-env node */

'use strict';

const { spawn, spawnSync } = require( 'child_process' );
const path = require( 'path' );
const fs = require( 'fs' );
const chalk = require( 'chalk' );
const stripAnsiEscapeCodes = require( 'strip-ansi' );
const parseArguments = require( './utils/parsearguments' );
const { EXPECTED_PUBLISH_FILES, EXPECTED_LEGACY_PUBLISH_FILES, EXPECTED_SRC_DIR_FILES } = require( './utils/expectedFiles' );

const REPOSITORY_DIRECTORY = path.join( __dirname, '..', '..' );
const NEW_PACKAGE_DIRECTORY = path.join( REPOSITORY_DIRECTORY, '..', 'ckeditor5-test-package' );

// A flag that determines whether any of the executed commands resulted in an error.
let foundError = false;

start();

/**
 * Runs checks and exits with an appropriate exit code.
 */
async function start() {
	const options = parseArguments( process.argv.slice( 2 ) );

	await verifyBuild( options );

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
async function verifyBuild( { language, packageManager, customPluginName, withoutLegacyMethods } ) {
	let testSetupInfoMessage = `Testing build for language: [${ language }] and package manager: [${ packageManager }]`;

	const projectRootName = path.basename( process.cwd() );
	const packageBuildCommand = [
		'node', `${ projectRootName }/packages/ckeditor5-package-generator/bin/index.js`, '@ckeditor/ckeditor5-test-package',
		'--dev', '--verbose', '--lang', language, `--use-${ packageManager }`
	];

	if ( language === 'ts' ) {
		const fileName = customPluginName ? customPluginName.toLowerCase() : 'testpackage';
		( withoutLegacyMethods ? EXPECTED_PUBLISH_FILES : EXPECTED_LEGACY_PUBLISH_FILES ).ts.push( `dist/types/${ fileName }.d.ts` );
	}

	const expectedPublishFiles = getExpectedFiles(
		withoutLegacyMethods ? EXPECTED_PUBLISH_FILES : EXPECTED_LEGACY_PUBLISH_FILES,
		language,
		customPluginName
	);
	const expectedSrcDirFiles = getExpectedFiles(
		EXPECTED_SRC_DIR_FILES,
		language,
		customPluginName
	);

	if ( customPluginName ) {
		testSetupInfoMessage += ` with custom plugin name: [${ customPluginName }]`;
		packageBuildCommand.push( '--plugin-name', customPluginName );
	}

	if ( withoutLegacyMethods ) {
		testSetupInfoMessage += ' without use of legacy methods of installations';
		packageBuildCommand.push( '--without-legacy-methods' );
		packageBuildCommand.push( '--use-legacy-methods' );
	}

	logProcess( testSetupInfoMessage + '.' );

	logProcess( 'Creating new package: "@ckeditor/ckeditor5-test-package"...' );
	executeCommand( packageBuildCommand, { cwd: path.join( REPOSITORY_DIRECTORY, '..' ) } );

	logProcess( 'Executing tests...' );
	executeCommand( [ 'yarn', 'run', 'test' ], { cwd: NEW_PACKAGE_DIRECTORY } );

	logProcess( 'Executing linters...' );
	executeCommand( [ 'yarn', 'run', 'lint' ], { cwd: NEW_PACKAGE_DIRECTORY } );
	executeCommand( [ 'yarn', 'run', 'stylelint' ], { cwd: NEW_PACKAGE_DIRECTORY } );

	logProcess( 'Verifying translations...' );
	executeCommand( [ 'yarn', 'run', 'translations:collect' ], { cwd: NEW_PACKAGE_DIRECTORY } );

	logProcess( 'Verifying release process...' );
	const { stderr } = executeCommand( [ 'npm', 'publish', '--dry-run' ], { cwd: NEW_PACKAGE_DIRECTORY, pipeStderr: true } );
	console.log( stderr );
	checkFileList( stderr, expectedPublishFiles );

	logProcess( 'Verifying post release cleanup...' );
	verifyPublishCleanup( language, expectedSrcDirFiles, withoutLegacyMethods );

	logProcess( 'Starting the development servers and verifying the sample builds...' );

	const listOfDevelopmentServers = [ startDevelopmentServer( NEW_PACKAGE_DIRECTORY ) ];

	if ( !withoutLegacyMethods ) {
		listOfDevelopmentServers.push( startDevelopmentServerForDllBuild( NEW_PACKAGE_DIRECTORY ) );
	}

	await Promise.all( listOfDevelopmentServers )
		.then( optionsList => {
			optionsList.forEach( options => {
				executeCommand( [ 'node', path.join( 'scripts', 'ci', 'verify-sample.js' ), options.url ], { cwd: REPOSITORY_DIRECTORY } );
			} );

			return optionsList;
		} )
		.then( optionsList => {
			logProcess( 'Stopping the development servers...' );
			return Promise.all( optionsList.map( options => killProcess( options.server ) ) );
		} )
		.then( () => {
			logProcess( 'Removing the created package...' );
			fs.rmSync( NEW_PACKAGE_DIRECTORY, { recursive: true } );
		} );
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
			const content = stripAnsiEscapeCodes( data.toString() ).slice( 0, -1 );
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
		const sampleServer = spawn( 'npx', [ 'http-server', './' ], {
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
 * @param {Object} expectedPublishFiles
 */
function checkFileList( output, expectedPublishFiles ) {
	const match = output.match( /Tarball Contents.+\n(?<lines>[\s\S]+)\n.+Tarball Details/ );

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
 * Checks whether after publishing, the repository is in a correct state:
 *
 * - "main" field in "package.json" should point to the language corresponding to the package's language (.js or .ts).
 * - There should be no leftover build files in "src" directory.
 *
 * @param {String} lang
 * @param {Object} expectedSrcDirFiles
 */
function verifyPublishCleanup( lang, expectedSrcDirFiles, withoutLegacyMethods ) {
	// "package.json" check.
	const pkgJsonPath = path.join( NEW_PACKAGE_DIRECTORY, 'package.json' );
	const pkgJsonRaw = fs.readFileSync( pkgJsonPath, 'utf-8' );
	const pkgJsonContent = JSON.parse( pkgJsonRaw );

	const hasCorrectEntryPoint = pkgJsonContent.main === `${ withoutLegacyMethods ? 'dist' : 'src' }/index.${ lang }`;

	if ( !hasCorrectEntryPoint ) {
		console.log( chalk.red( '"package.json" has incorrect value in "main" field:' ) );
		console.log( chalk.red( pkgJsonContent.main ) );

		foundError = true;
	}

	// "src" directory check.
	const srcDirPath = path.join( NEW_PACKAGE_DIRECTORY, 'src' );
	const excessFiles = fs.readdirSync( srcDirPath )
		.filter( file => !expectedSrcDirFiles.includes( file ) );

	if ( excessFiles.length ) {
		console.log( chalk.red( 'Excess files after publishing in "src" directory:' ) );
		console.log( chalk.red( excessFiles.map( file => `- ${ file }` ).join( '\n' ) ) );

		foundError = true;
	}

	if ( hasCorrectEntryPoint && !excessFiles.length ) {
		console.log( chalk.green( 'Post release cleanup successful.' ) );
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
