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
const { EOL } = require( 'os' );

const TEMPLATE_PATH = path.join( __dirname, '..', 'templates' );

// Files that need to be filled with data.
const TEMPLATES_TO_FILL = [
	'sample/dll.html',
	'package.json',
	'LICENSE.md',
	'README.md'
];

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
module.exports = async function copyFiles( logger, options ) {
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

		let data;

		const shouldFillTemplate = TEMPLATES_TO_FILL.some( TEMPLATE_TO_FILL => templatePath.endsWith( TEMPLATE_TO_FILL ) );

		if ( shouldFillTemplate ) {
			data = {
				name: options.packageName,
				now: new Date(),
				program: options.program,
				packageVersions: options.packageVersions,
				dll: options.dllConfiguration,
				cliSeparator: options.program === 'npm' ? '-- ' : ''
			};
		}

		copyTemplate( templatePath, options.directoryPath, data );
	}

	// Create the `.gitignore` file. See #50.
	fs.writeFileSync( path.join( options.directoryPath, '.gitignore' ), GITIGNORE_ENTRIES.join( EOL ) + EOL );
};

/**
 * @param {String} templateFile The relative path to the "templates/" directory of the file to copy.
 * @param {String} packagePath The destination directory where the new package is created.
 * @param {Object} [data] The data to fill in the template file.
 */
function copyTemplate( templateFile, packagePath, data ) {
	// Adjust the directory separator based on OS.
	templateFile = templateFile.split( '/' ).join( path.sep );

	let content = fs.readFileSync( path.join( TEMPLATE_PATH, templateFile ), 'utf-8' );

	if ( data ) {
		// `template()` returns a function that requires data to fill the template.
		content = template( content )( data );
	}

	const destinationPath = path.join(
		packagePath,
		// Remove sub-directory inside templates to merge results into one directory.
		templateFile.replace( /^(?:common|js|ts)\\/, '' )
	);

	// Make sure that the destination directory exists.
	mkdirp.sync( path.dirname( destinationPath ) );
	fs.writeFileSync( destinationPath, content );
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
