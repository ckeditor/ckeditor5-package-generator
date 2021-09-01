#!/usr/bin/env node

/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

'use strict';

const path = require( 'path' );
const fs = require( 'fs' );
const { execSync, spawnSync } = require( 'child_process' );

const { Command } = require( 'commander' );
const mkdirp = require( 'mkdirp' );
const validateNpmPackageName = require( 'validate-npm-package-name' );
const template = require( 'lodash.template' );
const glob = require( 'glob' );
const chalk = require( 'chalk' );

const packageJson = require( '../package.json' );
const TEMPLATE_PATH = path.join( __dirname, 'templates' );

// Files that need to be filled with data.
const TEMPLATES_TO_FILL = [
	'sample/dll.html',
	'package.json',
	'README.md',
	'webpack.dll.js'
];

new Command( packageJson.name )
	.argument( '<directory>', 'directory where the package should be created' )
	.option( '-v, --verbose', 'output additional logs', false )
	.option( '--use-npm', 'whether use npm to install packages', false )
	.allowUnknownOption()
	.action( ( directory, options ) => init( directory, options ) )
	// .on( '--help', () => {
	// } )
	.parse( process.argv );

/**
 * @param {String} directory
 * @param {Object} options
 */
async function init( directory ) {
	// 1. Validate package name.
	// 2. Create directory.
	// 3. Copy files.
	// 4. Call npm/yarn install.
	// 5. Initialize the git repository.
	// 6. Display an instruction what to do next.
	//
	// * Should we validate Node.js version?
	// * Should we force using Yarn?
	// * Should be Yarn used if found?
	// * Should the developer be able to use npm?
	// * Should create the Git repository by default?
	//
	// TODO: Implement the `--info` flag for reporting issues.
	// Use: https://www.npmjs.com/package/envinfo.

	// (1.)
	console.log( '📍 Verifying the specified package name.' );
	validateDirectory( directory );

	const directoryPath = path.resolve( directory );

	console.log( '📍 Checking whether the specified directory can be created.' );

	if ( fs.existsSync( directoryPath ) ) {
		console.log( chalk.red( 'Error:' ), 'Cannot create a directory as the location is already taken.' );
		console.log( 'Aborting.' );

		process.exit( 1 );
	}

	// (2.)
	console.log( `📍 Creating the directory "${ chalk.cyan( directoryPath ) }".` );
	mkdirp.sync( directoryPath );

	const ckeditor5version = getLatestCKEditor5Version();
	const ckeditor5DevVersion = getLatestCKEditor5DevelopmentUtilsVersion();
	const dllConfiguration = getDllConfiguration( directory );

	const templatesToCopy = glob.sync( '**/*', {
		cwd: TEMPLATE_PATH,
		dot: true,
		nodir: true
	} );

	// (3.)
	console.log( '📍 Copying files...' );

	for ( const templatePath of templatesToCopy ) {
		console.log( `* Copying "${ chalk.gray( templatePath ) }"...` );
		let data;

		if ( TEMPLATES_TO_FILL.includes( templatePath ) ) {
			data = {
				name: directory,
				version: ckeditor5version,
				devToolsVersion: ckeditor5DevVersion,
				dllFileName: dllConfiguration.fileName,
				dllLibrary: dllConfiguration.library
			};
		}

		copyTemplate( templatePath, directoryPath, data );
	}

	// (4.)
	console.log( '📍 Install dependencies...' );
	installPackages( directoryPath );

	// (5.)
	console.log( '📍 Initializing Git repository...' );
	initializeGitRepository( directoryPath );

	// (6.)
	console.log( chalk.green( 'Done!' ) );
}

/**
 * @param {String} directory
 */
function validateDirectory( directory ) {
	const validateResult = validateNpmPackageName( directory );

	if ( !validateResult.validForNewPackages ) {
		console.log( 'Provided <directory> is not valid name for a npm package.' );

		for ( const error of ( validateResult.errors || [] ) ) {
			console.log( '  * ' + error );
		}

		for ( const warning of ( validateResult.warnings || [] ) ) {
			console.log( '  * ' + warning );
		}

		process.exit( 1 );
	}

	// Extract the package name from the scoped directory.
	const [ , packageName ] = directory.split( '/' );

	if ( !packageName || !packageName.match( /^ckeditor5/ ) ) {
		console.log( 'Provided <directory> should start with the "@scope", and the package name should follow the "ckeditor5-" prefix.' );

		process.exit( 1 );
	}
}

/**
 * @return {String}
 */
function getLatestCKEditor5Version() {
	return execSync( 'npm view ckeditor5 version' ).toString().trim();
}

/**
 * @return {String}
 */
function getLatestCKEditor5DevelopmentUtilsVersion() {
	return execSync( 'npm view @ckeditor/ckeditor5-dev-utils version' ).toString().trim();
}

/**
 * @param {String} templateFile A relative path to the "templates/" directory of the file to copy.
 * @param {String} packagePath A destination directory where the new package is created.
 * @param {Object} [data] Data to fill in the template file.
 */
function copyTemplate( templateFile, packagePath, data ) {
	// Adjust the directory separator based on OS.
	templateFile = templateFile.split( '/' ).join( path.sep );

	let content = fs.readFileSync( path.join( TEMPLATE_PATH, templateFile ), 'utf-8' );

	if ( data ) {
		// `template()` returns a function that requires data to fill the template.
		content = template( content )( data );
	}

	const destinationPath = path.join( packagePath, templateFile );

	// Make sure that the destination directory exists.
	mkdirp.sync( path.dirname( destinationPath ) );
	fs.writeFileSync( destinationPath, content );
}

/**
 * @param {String} directoryPath
 */
function installPackages( directoryPath /* Support for NPM */ ) {
	const yarnArguments = [
		'--cwd',
		directoryPath
	];

	// if ( verbose ) {
	// 	yarnArguments.push( '--verbose' );
	// }

	spawnSync( 'yarnpkg', yarnArguments, {
		encoding: 'utf8',
		shell: true,
		cwd: directoryPath,
		stdio: 'inherit',
		stderr: 'inherit'
	} );
}

/**
 * @param {String} directoryPath
 */
function initializeGitRepository( directoryPath ) {
	const options = {
		stdio: 'ignore',
		cwd: directoryPath
	};

	execSync( 'git init', options );

	try {
		execSync( 'git add -A', options );
		execSync( 'git commit -m "Initialize the package using Create CKEditor 5 Plugin."', options );
	} catch ( error ) {
		// Remove the `.git` directory in case of an error. It may happen that the developer didn't configure Git yet.
		// The error could be resolved by ourselves.
		// See: https://github.com/ember-cli/ember-cli/blob/3192a441e13ec7e88c71d480778971d81bfa436c/lib/tasks/git-init.js#L49-L66.
		fs.removeSync( path.join( directoryPath, '.git' ) );
	}
}

/**
 * Configuration for output produces by webpack.
 *
 * @param {String} directory
 * @return {Object}
 */
function getDllConfiguration( directory ) {
	// For the scoped package, webpack exports it as `window.CKEditor5[ packageName ]`.
	const [ , packageName ] = directory.split( '/' );
	const packageNameSlug = getGlobalKeyForPackage( packageName );

	// The `packageName` represents the package name as a slug, and scope starts without the `at` (@) character.
	return {
		library: packageNameSlug,
		fileName: getIndexFileName( packageName )
	};
}

/**
 * Transforms `packageName` to a key for the `window` object.
 *
 * @param {String} packageName
 * @return {String}
 */
function getGlobalKeyForPackage( packageName ) {
	return packageName.replace( /^ckeditor5-/, '' )
		.replace( /-([a-z])/g, ( match, p1 ) => p1.toUpperCase() );
}

/**
 * Extracts the main file name from the package name.
 *
 * @param {String} packageName
 * @returns {String}
 */
function getIndexFileName( packageName ) {
	return packageName.replace( /^ckeditor5-/, '' ) + '.js';
}
