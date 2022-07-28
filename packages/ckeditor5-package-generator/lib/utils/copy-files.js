/**
 * @license Copyright (c) 2020-2022, CKSource Holding sp. z o.o. All rights reserved.
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

// Npm does not publish the `.gitignore` file even if it's somewhere inside the package.
// Hence, the package generator will create it manually. See: #50.
const GITIGNORE_ENTRIES = [
	'build/',
	'coverage/',
	'node_modules/',
	'tmp/',
	'sample/ckeditor.dist.js'
];

/**
 * If the package name is not valid, prints the error and exits the process.
 *
 * @param {Logger} logger
 * @param {Options} options
 */
module.exports = function copyFiles( logger, options ) {
	logger.process( 'Copying files...' );

	const templateGlobs = [
		'common/**/*',
		`${ options.programmingLanguage }/**/*`
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
			cliSeparator: options.program === 'npm' ? '-- ' : '',
			now: new Date(),
			...options
		};

		copyTemplate( templatePath, options.directoryPath, data );
	}

	// Create the `.gitignore` file. See #50.
	const gitignorePath = path.join( options.directoryPath, '.gitignore' );
	const gitignoreContent = GITIGNORE_ENTRIES.join( '\n' ) + '\n';
	fs.writeFileSync( gitignorePath, gitignoreContent );
};

/**
 * Copies all files into the package directory. If any file has any template placeholders, they are filled.
 *
 * @param {String} templateFile The relative path to the "templates/" directory of the file to copy.
 * @param {String} packagePath The destination directory where the new package is created.
 * @param {Object} [data] The data to fill in the template file.
 */
function copyTemplate( templateFile, packagePath, data ) {
	const rawFile = fs.readFileSync( path.join( TEMPLATE_PATH, templateFile ), 'utf-8' );
	const filledFile = template( rawFile )( data );

	const destinationPath = path.join(
		packagePath,
		// Remove sub-directory inside templates to merge results into one directory.
		templateFile.replace( /^(?:common|js|ts)(?:\\|\/)/, '' )
	);

	// Make sure that the destination directory exists.
	mkdirp.sync( path.dirname( destinationPath ) );
	fs.writeFileSync( destinationPath, filledFile );
}

/**
 * @typedef {Object} Options
 *
 * @property {string} programmingLanguage
 *
 * @property {string} packageName
 *
 * @property {string} program
 *
 * @property {string} directoryPath
 *
 * @property {Object} packageVersions
 *
 * @property {Object} dllConfiguration
 */
