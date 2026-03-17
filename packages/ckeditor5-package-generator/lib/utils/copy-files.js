/**
 * @license Copyright (c) 2020-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import chalk from 'chalk';
import fs from 'node:fs';
import { globSync } from 'glob';
import mkdirp from 'mkdirp';
import upath from 'upath';
import { template } from 'lodash-es';

const TEMPLATE_PATH = upath.join( import.meta.dirname, '..', 'templates' );

/**
 * If the package name is not valid, prints the error and exits the process.
 *
 * @param {Logger} logger
 * @param {Object} options
 * @param {String} options.packageName
 * @param {FormattedNames} options.formattedNames
 * @param {String} options.directoryPath
 * @param {String} options.packageManager
 * @param {String} options.programmingLanguage
 * @param {Object} options.packageVersions
 * @param {String} options.validatedGlobalName
 */
export default function copyFiles( logger, options ) {
	logger.process( 'Copying files...' );

	const templateGlobs = [
		'common/**/*',
		`${ options.programmingLanguage }/**/*`
	];

	const templatesToCopy = templateGlobs
		.flatMap( globPattern => {
			return globSync( globPattern, {
				cwd: TEMPLATE_PATH,
				dot: true,
				nodir: true
			} );
		} )
		.filter( file => options.packageManager !== 'pnpm' ? !file.includes( 'pnpm-workspace.yaml' ) : true );

	for ( const templatePath of templatesToCopy ) {
		logger.verboseInfo( `* Copying "${ chalk.gray( templatePath ) }"...` );

		const data = {
			cliSeparator: options.packageManager === 'npm' ? '-- ' : '',
			now: new Date(),
			...options
		};

		copyTemplate( templatePath, options.directoryPath, data );
	}
}

/**
 * Copies all files into the package directory. If any file has any template placeholders, they are filled.
 *
 * @param {String} templatePath The relative path to the "templates/" directory of the file to copy.
 * @param {String} packagePath The destination directory where the new package is created.
 * @param {Object} data The data to fill in the template file.
 */
function copyTemplate( templatePath, packagePath, data ) {
	const rawFile = fs.readFileSync( upath.join( TEMPLATE_PATH, templatePath ), 'utf-8' );
	const filledFile = template( rawFile )( data );

	const processedTemplatePath = templatePath
		// Remove sub-directory inside templates to merge results into one directory.
		.replace( /^(?:common|js|ts)(?:\\|\/)/, '' )
		// We use the ".txt" file extension to circumvent syntax errors in templates and npm not publishing the ".gitignore" file.
		.replace( /\.txt$/, '' )
		// Replace placeholder filenames with the class name.
		.replace( /_PLACEHOLDER_/, data.formattedNames.plugin.lowerCaseMerged );

	const destinationPath = upath.join( packagePath, processedTemplatePath );

	// Make sure that the destination directory exists.
	mkdirp.sync( upath.dirname( destinationPath ) );
	fs.writeFileSync( destinationPath, filledFile );
}
