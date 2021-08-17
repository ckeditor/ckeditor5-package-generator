#!/usr/bin/env node

/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

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

const program = new Command( packageJson.name )
	.argument( '<directory>', 'directory where the package should be created' )
	.option( '-v, --verbose', 'output additional logs', false )
	.option( '--use-npm', 'whether use npm to install packages', false )
	.allowUnknownOption()
	.action( ( directory, options ) => init( directory, options ) )
	.on( '--help', () => {
	} )
	.parse( process.argv );

/**
 * @param {String} directory
 * @param {Object} options
 */
async function init( directory, options ) {
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

	// (1.)
	validateDirectory( directory );

	const directoryPath = path.resolve( directory );

	if ( fs.existsSync( directoryPath ) ) {
		console.log( 'Cannot create a directory as the location is already taken.' );

		process.exit( 1 );
	}

	// (2.)
	mkdirp.sync( directoryPath );

	const ckeditor5version = getLatestCKEditor5Version();
	const templatesToCopy = glob.sync( '**/*', {
		cwd: TEMPLATE_PATH,
		dot: true,
		nodir: true
	} );

	// (3.)
	for ( const templatePath of templatesToCopy ) {
		copyTemplate( templatePath, directoryPath, {
			version: ckeditor5version,
			name: directory
		} );
	}

	// (4.)
	installPackages( directoryPath );

	// (5.)
	initializeGitRepository( directoryPath );

	// (6.)
	// console.log( 'Happy coding.' );
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
	const packageName = directory.startsWith( '@' ) ? directory.split( '/' )[ 1 ] : directory;

	if ( !packageName.match( /^ckeditor5-|-ckeditor5$/ ) ) {
		console.log( 'Provided <directory> should start with the "ckeditor5-" prefix or end with the "-ckeditor5" suffix.' );
		console.log();
		console.log( 'The following examples are considered as valid:' );
		console.log( '  * ckeditor5-example-package' );
		console.log( '  * example-package-ckeditor5' );
		console.log( '  * @scope/ckeditor5-example-package' );
		console.log( '  * @scope/example-package-ckeditor5' );

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
 * @param {String} templateFile A relative path to the "templates/" directory of the file to copy.
 * @param {String} packagePath A destination directory where the new package is created.
 * @param {Object} data Data to fill in the template file.
 */
function copyTemplate( templateFile, packagePath, data ) {
	// Adjust the directory separator based on OS.
	templateFile = templateFile.split( '/' ).join( path.sep );

	const content = fs.readFileSync( path.join( TEMPLATE_PATH, templateFile ), 'utf-8' );

	// `template()` returns a function that requires data to fill the template.
	const newContent = template( content )( data );
	const destinationPath = path.join( packagePath, templateFile );

	// Make sure that the destination directory exists.
	mkdirp.sync( path.dirname( destinationPath ) );
	fs.writeFileSync( destinationPath, newContent );
}

/**
 * @param {String} directoryPath
 */
function installPackages( directoryPath, /* Support for NPM */ ) {
	const arguments = [
		'--cwd',
		directoryPath
	];

	// if ( verbose ) {
	// 	arguments.push( '--verbose' );
	// }

	spawnSync( 'yarnpkg', arguments, {
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
