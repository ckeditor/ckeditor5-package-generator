#!/usr/bin/env node

/**
 * @license Copyright (c) 2020-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const chalk = require( 'chalk' );
const fs = require( 'fs' );
const path = require( 'path' );
const { Command } = require( 'commander' );

const chooseProgrammingLanguage = require( './utils/choose-programming-language' );
const copyFiles = require( './utils/copy-files' );
const createDirectory = require( './utils/create-directory' );
const getDependenciesVersions = require( './utils/get-dependencies-versions' );
const getDllConfiguration = require( './utils/get-dll-configuration' );
const initializeGitRepository = require( './utils/initialize-git-repository' );
const installDependencies = require( './utils/install-dependencies' );
const installGitHooks = require( './utils/install-git-hooks' );
const validatePackageName = require( './utils/validate-package-name' );

const Logger = require( './utils/logger' );

const packageJson = require( '../package.json' );

new Command( packageJson.name )
	.argument( '[packageName]', 'name of the package (@scope/ckeditor5-*)' )
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
 * @param {String|undefined} packageName
 * @param {CKeditor5PackageGeneratorOptions} options
 */
async function init( packageName, options ) {
	// * Should we validate Node.js version?
	// * Should we force using Yarn?
	// * Should Yarn be used if found?
	// * Should the developer be able to use npm?
	// * Should the Git repository be created by default?
	//
	// TODO: Implement the `--info` flag for reporting issues.
	// Use: https://www.npmjs.com/package/envinfo.
	const logger = new Logger( options.verbose );
	const program = options.useNpm ? 'npm' : 'yarn';

	validatePackageName( logger, packageName );
	const { directoryName, directoryPath } = createDirectory( logger, packageName );
	const programmingLanguage = await chooseProgrammingLanguage();
	const packageVersions = getDependenciesVersions( logger, { devMode: options.dev } );
	const dllConfiguration = getDllConfiguration( packageName );

	await copyFiles( logger, {
		programmingLanguage,
		packageName,
		program,
		directoryPath,
		packageVersions,
		dllConfiguration
	} );

	await installDependencies( directoryPath, options );
	initializeGitRepository( directoryPath, logger );
	await installGitHooks( directoryPath, logger, options );

	logger.info( [
		chalk.green( 'Done!' ),
		'',
		'Execute the "' + chalk.cyan( 'cd ' + directoryName ) + '" command to change the current working directory',
		'to the newly created package. Then, the package offers a few predefined scripts:',
		'',
		'  * ' + chalk.underline( 'start' ) + ' - for creating the HTTP server with the editor sample,',
		'  * ' + chalk.underline( 'test' ) + ' - for executing unit tests of an example plugin,',
		'  * ' + chalk.underline( 'lint' ) + ' - for running a tool for static analyzing JavaScript files,',
		'  * ' + chalk.underline( 'stylelint' ) + ' - for running a tool for static analyzing CSS files.',
		'',
		'Example: ' + chalk.gray( program + ' run start' ),
		''
	].join( '\n' ), { startWithNewLine: true } );
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
