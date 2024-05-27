/**
 * @license Copyright (c) 2020-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const chalk = require( 'chalk' );

const Logger = require( './utils/logger' );

const choosePackageManager = require( './utils/choose-package-manager' );
const chooseProgrammingLanguage = require( './utils/choose-programming-language' );
const copyFiles = require( './utils/copy-files' );
const createDirectory = require( './utils/create-directory' );
const getDependenciesVersions = require( './utils/get-dependencies-versions' );
const getPackageNameFormats = require( './utils/get-package-name-formats' );
const initializeGitRepository = require( './utils/initialize-git-repository' );
const installDependencies = require( './utils/install-dependencies' );
const installGitHooks = require( './utils/install-git-hooks' );
const validatePackageName = require( './utils/validate-package-name' );
const validatePluginName = require( './utils/validate-plugin-name' );

/**
 * @param {String|undefined} packageName
 * @param {CKeditor5PackageGeneratorOptions} options
 */
module.exports = async function init( packageName, options ) {
	const { dev, verbose, useNpm, useYarn, withoutLegacyMethods, lang, pluginName } = options;

	const logger = new Logger( verbose );

	validatePackageName( logger, packageName );
	validatePluginName( logger, pluginName );
	const formattedNames = getPackageNameFormats( packageName, pluginName );
	const { directoryName, directoryPath } = createDirectory( logger, packageName );
	const packageManager = await choosePackageManager( useNpm, useYarn );
	const programmingLanguage = await chooseProgrammingLanguage( logger, lang );
	const packageVersions = getDependenciesVersions( logger, dev );

	copyFiles( logger, {
		packageName,
		formattedNames,
		directoryPath,
		packageManager,
		programmingLanguage,
		packageVersions,
		withoutLegacyMethods
	} );

	await installDependencies( directoryPath, packageManager, verbose, dev );
	initializeGitRepository( directoryPath, logger );
	await installGitHooks( directoryPath, logger, verbose );

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
		'Example: ' + chalk.gray( packageManager + ' run start' ),
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
 * @property {Boolean} [useYarn=false]
 *
 * @property {Boolean} [withoutLegacyMethods=false]
 *
 * @property {Boolean} [dev=false]
 *
 * @property {String} lang
 *
 * @property {String} pluginName
 */
