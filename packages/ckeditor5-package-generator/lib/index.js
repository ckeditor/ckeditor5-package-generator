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

// The number of the last lines of the installation output shown when the installation fails.
const MAX_OUTPUT_LINES = 20;

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
		programmingLanguage,
		packageVersions,
		validatedGlobalName
	} );

	let installError = null;

	try {
		await installDependencies( directoryPath, selectedPackageManager, verbose );
	} catch ( error ) {
		installError = error;
	}

	initializeGitRepository( directoryPath );

	if ( installError ) {
		// The installation can fail after the dependencies are installed, for example when the `postprepare` script cannot
		// download the browser for tests. Try to install the git hooks anyway, so retrying the installation is enough.
		await installGitHooks( directoryPath, verbose ).catch( () => {} );

		showInstallationFailure( installError, directoryName, selectedPackageManager );

		return;
	}

	await installGitHooks( directoryPath, verbose );

	showNote( [
		'cd ' + directoryName,
		selectedPackageManager + ' run start',
		selectedPackageManager + ' run test'
	].join( '\n' ), 'Next steps' );

	showOutro( styleText( 'green', 'Done!' ) );
}

/**
 * @param {Error} error
 * @param {String} directoryName
 * @param {'npm'|'yarn'|'pnpm'} packageManager
 */
function showInstallationFailure( error, directoryName, packageManager ) {
	const outputLines = ( error.output || '' ).trim().split( '\n' ).slice( -MAX_OUTPUT_LINES );
	const message = [
		'The package was created, but installing its dependencies failed.',
		'Fix the problem and run the installation again:',
		'',
		'cd ' + directoryName,
		packageManager + ' install'
	];

	if ( outputLines.join( '' ) ) {
		message.unshift( ...outputLines, '' );
	}

	showNote( message.join( '\n' ), 'Installing dependencies failed' );
	showOutro( styleText( 'red', 'Failed.' ) );

	process.exitCode = 1;
}

/**
 * @typedef {Object} CKeditor5PackageGeneratorOptions
 *
 * @property {Boolean} [verbose=false]
 *
 * @property {'npm'|'pnpm'} [packageManager]
 *
 * @property {String} lang
 *
 * @property {String} pluginName
 *
 * @property {String} globalName
 */
