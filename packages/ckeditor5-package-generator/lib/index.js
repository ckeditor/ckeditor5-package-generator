/**
 * @license Copyright (c) 2020-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import chalk from 'chalk';
import Logger from './utils/logger.js';
import choosePackageManager from './utils/choose-package-manager.js';
import chooseProgrammingLanguage from './utils/choose-programming-language.js';
import setGlobalName from './utils/set-global-name.js';
import copyFiles from './utils/copy-files.js';
import createDirectory from './utils/create-directory.js';
import getDependenciesVersions from './utils/get-dependencies-versions.js';
import getPackageNameFormats from './utils/get-package-name-formats.js';
import initializeGitRepository from './utils/initialize-git-repository.js';
import installDependencies from './utils/install-dependencies.js';
import installGitHooks from './utils/install-git-hooks.js';
import validatePackageName from './utils/validate-package-name.js';
import validatePluginName from './utils/validate-plugin-name.js';

/**
 * @param {String|undefined} packageName
 * @param {CKeditor5PackageGeneratorOptions} options
 */
export default async function init( packageName, options ) {
	const {
		dev,
		verbose,
		useNpm,
		useYarn,
		usePnpm,
		lang,
		pluginName,
		globalName,
		useReleaseDirectory
	} = options;

	const logger = new Logger( verbose );

	validatePackageName( logger, packageName );
	validatePluginName( logger, pluginName );
	const formattedNames = getPackageNameFormats( packageName, pluginName );
	const { directoryName, directoryPath } = createDirectory( logger, packageName );
	const packageManager = await choosePackageManager( logger, { useNpm, useYarn, usePnpm } );
	const programmingLanguage = await chooseProgrammingLanguage( logger, lang );

	const defaultGlobalName = 'CK' + formattedNames.plugin.pascalCase;
	const validatedGlobalName = await setGlobalName( logger, globalName, defaultGlobalName );

	const packageVersions = getDependenciesVersions( logger, { dev, useReleaseDirectory } );

	const npxByPackageManager = packageManager === 'pnpm' ? 'pnpm dlx' : 'npx';

	copyFiles( logger, {
		packageName,
		formattedNames,
		directoryPath,
		packageManager,
		npxByPackageManager,
		programmingLanguage,
		packageVersions,
		validatedGlobalName
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
}

/**
 * @typedef {Object} CKeditor5PackageGeneratorOptions
 *
 * @property {Boolean} [verbose=false]
 *
 * @property {Boolean} [useNpm=false]
 *
 * @property {Boolean} [useYarn=false]
 *
 * @property {Boolean} [usePnpm=false]
 *
 * @property {Boolean} [dev=false]
 *
 * @property {Boolean} [useReleaseDirectory=false]
 *
 * @property {String} lang
 *
 * @property {String} pluginName
 *
 * @property {String} globalName
 */
