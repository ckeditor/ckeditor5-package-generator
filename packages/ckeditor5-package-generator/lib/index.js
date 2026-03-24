/**
 * @license Copyright (c) 2020-2026, CKSource Holding sp. z o.o. All rights reserved.
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
import { showIntro, showNote, showOutro } from './utils/prompt.js';

/**
 * @param {String|undefined} packageName
 * @param {CKeditor5PackageGeneratorOptions} options
 */
export default async function init( packageName, options ) {
	const {
		verbose,
		useNpm,
		useYarn,
		usePnpm,
		lang,
		pluginName,
		globalName
	} = options;

	const logger = new Logger( verbose );

	showIntro( 'CKEditor 5 package generator' );

	const validatedPackageName = await validatePackageName( logger, packageName );
	const validatedPluginName = await validatePluginName( logger, pluginName );
	const formattedNames = getPackageNameFormats( validatedPackageName, validatedPluginName );
	const packageManager = await choosePackageManager( logger, { useNpm, useYarn, usePnpm } );
	const programmingLanguage = await chooseProgrammingLanguage( logger, lang );
	const validatedGlobalName = await setGlobalName( logger, globalName, 'CK' + formattedNames.plugin.pascalCase );
	const packageVersions = await getDependenciesVersions();
	const { directoryName, directoryPath } = createDirectory( logger, validatedPackageName );

	copyFiles( logger, {
		packageName: validatedPackageName,
		formattedNames,
		directoryPath,
		packageManager,
		npxByPackageManager: packageManager === 'pnpm' ? 'pnpm dlx' : 'npx',
		programmingLanguage,
		packageVersions,
		validatedGlobalName
	} );

	await installDependencies( directoryPath, packageManager, verbose );
	initializeGitRepository( directoryPath );
	await installGitHooks( directoryPath, logger, verbose );

	showNote( [
		chalk.cyan( 'cd ' + directoryName ),
		chalk.gray( packageManager + ' run start' ),
		chalk.gray( packageManager + ' run test' )
	].join( '\n' ), 'Next steps' );

	showOutro( chalk.green( 'Done!' ) );
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
 * @property {String} lang
 *
 * @property {String} pluginName
 *
 * @property {String} globalName
 */
