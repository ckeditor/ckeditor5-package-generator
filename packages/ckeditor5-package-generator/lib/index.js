/**
 * @license Copyright (c) 2020-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { styleText } from 'node:util';
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
		packageManager,
		lang,
		pluginName,
		globalName
	} = options;

	const logger = new Logger( verbose );

	showIntro( 'CKEditor 5 package generator' );

	const validatedPackageName = await validatePackageName( packageName );
	const validatedPluginName = await validatePluginName( pluginName );
	const formattedNames = getPackageNameFormats( validatedPackageName, validatedPluginName );
	const selectedPackageManager = await choosePackageManager( logger, packageManager );
	const programmingLanguage = await chooseProgrammingLanguage( logger, lang );
	const validatedGlobalName = await setGlobalName( globalName, 'CK' + formattedNames.plugin.pascalCase );
	const packageVersions = await getDependenciesVersions();
	const { directoryName, directoryPath } = createDirectory( logger, validatedPackageName );

	copyFiles( logger, {
		packageName: validatedPackageName,
		formattedNames,
		directoryPath,
		packageManager: selectedPackageManager,
		npxByPackageManager: selectedPackageManager === 'pnpm' ? 'pnpm dlx' : 'npx',
		programmingLanguage,
		packageVersions,
		validatedGlobalName
	} );

	await installDependencies( directoryPath, selectedPackageManager, verbose );
	initializeGitRepository( directoryPath );
	await installGitHooks( directoryPath, verbose );

	showNote( [
		'cd ' + directoryName,
		selectedPackageManager + ' run start',
		selectedPackageManager + ' run test'
	].join( '\n' ), 'Next steps' );

	showOutro( styleText( 'green', 'Done!' ) );
}

/**
 * @typedef {Object} CKeditor5PackageGeneratorOptions
 *
 * @property {Boolean} [verbose=false]
 *
 * @property {'npm'|'yarn'|'pnpm'} [packageManager]
 *
 * @property {String} lang
 *
 * @property {String} pluginName
 *
 * @property {String} globalName
 */
