#!/usr/bin/env node

/**
 * @license Copyright (c) 2020-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const path = require( 'path' );
const fs = require( 'fs' );
const { execSync, spawnSync } = require( 'child_process' );

const { Command } = require( 'commander' );
const mkdirp = require( 'mkdirp' );
const template = require( 'lodash.template' );
const glob = require( 'glob' );
const chalk = require( 'chalk' );

const packageJson = require( '../package.json' );
const TEMPLATE_PATH = path.join( __dirname, 'templates' );

const getDependenciesVersions = require( './utils/get-dependencies-versions' );
const validatePackageName = require( './utils/validate-package-name' );

// Files that need to be filled with data.
const TEMPLATES_TO_FILL = [
	'sample/dll.html',
	'package.json',
	'README.md'
];

new Command( packageJson.name )
	.argument( '<packageName>', 'name of the package (@scope/ckeditor5-*)' )
	.option( '-v, --verbose', 'output additional logs', false )
	.option( '--dev', 'execution of the script in the development mode', () => {
		// An absolute path to the repository that tracks the package.
		const rootRepositoryPath = path.join( __dirname, '..', '..', '..' );

		// The assumption here is that if the `--dev` flag was used, the entire repository is cloned.
		// Otherwise, the executable was downloaded from npm, and it can't be executed in dev-mode.
		return fs.existsSync( path.join( rootRepositoryPath, '.git' ) );
	} )
	.option( '--use-npm', 'whether use npm to install packages', false )
	.allowUnknownOption()
	.action( ( packageName, options ) => init( packageName, options ) )
	.parse( process.argv );

/**
 * @param {String} packageName
 * @param {CKeditor5PackageGeneratorOptions} options
 */
async function init( packageName, options ) {
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
	const log = getLogger( options.verbose );
	const program = options.useNpm ? 'npm' : 'yarn';

	// (1.)
	console.log( '📍 Verifying the specified package name.' );
	const validationError = validatePackageName( packageName );

	if ( validationError ) {
		console.log( '\n❗ Found an error while verifying the provided package name.' );
		console.log( chalk.red( validationError ) + '\n' );

		console.log( 'Expected pattern:            ' + chalk.green( '@[scope]/ckeditor5-[feature-name]' ) );
		console.log( 'The provided package name:   ' + chalk.red( packageName ) );
		console.log( 'Allowed characters list:     ' + chalk.blue( '0-9 a-z - . _' ) );

		process.exit( 1 );
	}

	const directoryName = packageName.split( '/' )[ 1 ];
	const directoryPath = path.resolve( directoryName );

	console.log( `📍 Checking whether the "${ chalk.cyan( directoryName ) }" directory can be created.` );

	if ( fs.existsSync( directoryPath ) ) {
		console.log( chalk.red( 'Error:' ), 'Cannot create a directory as the location is already taken.' );
		console.log( 'Aborting.' );

		process.exit( 1 );
	}

	// (2.)
	console.log( `📍 Creating the directory "${ chalk.cyan( directoryPath ) }".` );
	mkdirp.sync( directoryPath );

	const packageVersions = getDependenciesVersions( {
		devMode: options.dev
	} );

	const dllConfiguration = getDllConfiguration( packageName );

	const templatesToCopy = glob.sync( '**/*', {
		cwd: TEMPLATE_PATH,
		dot: true,
		nodir: true
	} );

	// (3.)
	console.log( '📍 Copying files...' );

	for ( const templatePath of templatesToCopy ) {
		log( `* Copying "${ chalk.gray( templatePath ) }"...` );
		let data;

		if ( TEMPLATES_TO_FILL.includes( templatePath ) ) {
			data = {
				name: packageName,
				program,
				ckeditor5Version: packageVersions.ckeditor5,
				devUtilsVersion: packageVersions.devUtils,
				eslintConfigCkeditor5Version: packageVersions.eslintConfigCkeditor5,
				stylelintConfigCkeditor5Version: packageVersions.stylelintConfigCkeditor5,
				packageToolsVersion: packageVersions.packageTools,
				dllFileName: dllConfiguration.fileName,
				dllLibrary: dllConfiguration.library
			};
		}

		copyTemplate( templatePath, directoryPath, data );
	}

	// (4.)
	console.log( '📍 Installing dependencies...' );
	installPackages( directoryPath, {
		useNpm: options.useNpm,
		verbose: options.verbose
	} );

	// (5.)
	console.log( '📍 Initializing Git repository...' );
	initializeGitRepository( directoryPath );

	// (6.)
	console.log();
	console.log( chalk.green( 'Done!' ) );
	console.log();
	console.log( 'Execute the "' + chalk.cyan( 'cd ' + directoryName ) + '" command to change the current working directory' );
	console.log( 'to the newly created package. Then, the package offers a few predefined scripts:' );
	console.log();
	console.log( '  * ' + chalk.underline( 'start' ) + ' - for creating the HTTP server with the editor sample,' );
	console.log( '  * ' + chalk.underline( 'test' ) + ' - for executing unit tests of an example plugin,' );
	console.log( '  * ' + chalk.underline( 'lint' ) + ' - for running a tool for static analyzing JavaScript files,' );
	console.log( '  * ' + chalk.underline( 'stylelint' ) + ' - for running a tool for static analyzing CSS files.' );
	console.log();
	console.log( 'Example: ' + chalk.gray( program + ' run start' ) );
	console.log();
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
 * @param {Object} options
 * @param {Boolean} options.useNpm
 * @param {Boolean} options.verbose
 */
function installPackages( directoryPath, options ) {
	const spawnOptions = {
		encoding: 'utf8',
		shell: true,
		cwd: directoryPath,
		stderr: 'inherit'
	};

	if ( options.verbose ) {
		spawnOptions.stdio = 'inherit';
	}

	if ( options.useNpm ) {
		const npmArguments = [
			'install',
			'--prefix',
			directoryPath
		];

		spawnSync( 'npm', npmArguments, spawnOptions );
	} else {
		const yarnArguments = [
			'--cwd',
			directoryPath
		];

		spawnSync( 'yarnpkg', yarnArguments, spawnOptions );
	}
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
		execSync( 'git commit -m "Initialize the package using CKEditor 5 Package Generator."', options );
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
 * @param {String} packageName
 * @return {Object}
 */
function getDllConfiguration( packageName ) {
	// For the scoped package, webpack exports it as `window.CKEditor5[ packageName ]`.
	[ , packageName ] = packageName.split( '/' );
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

/**
 * @param {Boolean} verbose
 * @return {Function}
 */
function getLogger( verbose ) {
	return message => {
		if ( verbose ) {
			console.log( message );
		}
	};
}

/**
 * @typedef {Object} CKeditor5PackageGeneratorOptions
 *
 * @property {Boolean} [verbose=false]
 *
 * @property {Boolean} [useNpm=false]
 *
 * @property {Boolean} [dev=false]
 */
