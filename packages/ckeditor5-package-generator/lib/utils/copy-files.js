/**
 * @license Copyright (c) 2020-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const chalk = require( 'chalk' );
const fs = require( 'fs' );
const glob = require( 'glob' );
const mkdirp = require( 'mkdirp' );
const path = require( 'path' );
const template = require( 'lodash.template' );

const TEMPLATE_PATH = path.join( __dirname, '..', 'templates' );

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
 * @param {Boolean} options.useLegacyMethods
 */
module.exports = function copyFiles( logger, options ) {
	logger.process( 'Copying files...' );

	const templatePatternToCopy = `${ options.useLegacyMethods ? 'legacy-' : '' }${ options.programmingLanguage }/**/*`;

	const templateGlobs = [
		'common/**/*',
		templatePatternToCopy
	];

	const templatesToCopy = templateGlobs.flatMap( globPattern => {
		return glob.sync( globPattern, {
			cwd: TEMPLATE_PATH,
			dot: true,
			nodir: true
		} );
	} );

	for ( const templatePath of templatesToCopy ) {
		logger.verboseInfo( `* Copying "${ chalk.gray( templatePath ) }"...` );

		const data = {
			cliSeparator: options.packageManager === 'npm' ? '-- ' : '',
			now: new Date(),
			...options
		};

		copyTemplate( templatePath, options.directoryPath, data );
	}
};

/**
 * Copies all files into the package directory. If any file has any template placeholders, they are filled.
 *
 * @param {String} templatePath The relative path to the "templates/" directory of the file to copy.
 * @param {String} packagePath The destination directory where the new package is created.
 * @param {Object} data The data to fill in the template file.
 */
function copyTemplate( templatePath, packagePath, data ) {
	const rawFile = fs.readFileSync( path.join( TEMPLATE_PATH, templatePath ), 'utf-8' );
	const filledFile = template( rawFile )( data );

	const processedTemplatePath = templatePath
		// Remove sub-directory inside templates to merge results into one directory.
		.replace( /^(?:common|js|ts|legacy-js|legacy-ts)(?:\\|\/)/, '' )
		// We use the ".txt" file extension to circumvent syntax errors in templates and npm not publishing the ".gitignore" file.
		.replace( /\.txt$/, '' )
		// Replace placeholder filenames with the class name.
		.replace( /_PLACEHOLDER_/, data.formattedNames.plugin.lowerCaseMerged );

	const destinationPath = path.join( packagePath, processedTemplatePath );

	// Make sure that the destination directory exists.
	mkdirp.sync( path.dirname( destinationPath ) );
	fs.writeFileSync( destinationPath, filledFile );
}
