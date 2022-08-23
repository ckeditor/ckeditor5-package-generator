/**
 * @license Copyright (c) 2020-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const chalk = require( 'chalk' );

const Logger = require( './utils/logger' );

const chooseProgrammingLanguage = require( './utils/choose-programming-language' );
const copyFiles = require( './utils/copy-files' );
const createDirectory = require( './utils/create-directory' );
const getDependenciesVersions = require( './utils/get-dependencies-versions' );
const getDllConfiguration = require( './utils/get-dll-configuration' );
const initializeGitRepository = require( './utils/initialize-git-repository' );
const installDependencies = require( './utils/install-dependencies' );
const installGitHooks = require( './utils/install-git-hooks' );
const validatePackageName = require( './utils/validate-package-name' );

/**
 * @param {String|undefined} packageName
 * @param {CKeditor5PackageGeneratorOptions} options
 */
module.exports = async function init( packageName, options ) {
	const logger = new Logger( options.verbose );
	const program = options.useNpm ? 'npm' : 'yarn';

	validatePackageName( logger, packageName );
	const { directoryName, directoryPath } = createDirectory( logger, packageName );
	const programmingLanguage = await chooseProgrammingLanguage( logger, options );
	const packageVersions = getDependenciesVersions( logger, { devMode: options.dev } );
	const dllConfiguration = getDllConfiguration( packageName );

	copyFiles( logger, {
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
};

/**
 * @typedef {Object} CKeditor5PackageGeneratorOptions
 *
 * @property {Boolean} [verbose=false]
 *
 * @property {Boolean} [useNpm=false]
 *
 * @property {Boolean} [dev=false]
 */
