/**
 * @license Copyright (c) 2020-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const minimist = require( 'minimist' );

module.exports = args => {
	const config = {
		string: [
			'organization',
			'project'
		],

		boolean: [
			'coverage',
			'open',
			'production',
			'source-map',
			'verbose',
			'watch'
		],

		alias: {
			c: 'coverage',
			w: 'watch',
			v: 'verbose',
			s: 'source-map'
		},

		default: {
			coverage: false,
			open: true,
			language: 'en',
			verbose: false,
			organization: null,
			production: false,
			project: null,
			watch: false,
			'source-map': false
		}
	};

	const options = minimist( args, config );

	// Delete all aliases because we do not want to use them in the code.
	// They are useful when calling a command from CLI point of view.
	for ( const alias of Object.keys( config.alias ) ) {
		delete options[ alias ];
	}

	// "kebab-case" to "camelCase" conversion.
	options.sourceMap = options[ 'source-map' ];
	delete options[ 'source-map' ];

	// Save the current work directory.
	options.cwd = process.cwd();

	// Save the task to execute.
	options.task = options._.shift();

	return options;
};

/**
 * @typedef {Object} Ckeditor5PackageToolsOptions
 *
 * @property {String} cwd An absolute path to the root directory which contains the main `package.json` file.
 *
 * @property {String} task A name of a task to execute.
 *
 * @property {String|null} transifex An end-point API URL to upload/download translations from the Transifex service.
 *
 * @property {Array.<String>} _ Additional modifiers for the executed task that could not be matched with the supported options.
 *
 * @property {Boolean} [coverage=false] When executing tests, this option allows creating a code coverage report.
 *
 * @property {Boolean} [watch=false] When executing tests, this option
 *
 * @property {Boolean} [verbose=false] Whether to display additional logs by tasks.
 *
 * @property {Boolean} [sourceMap=false] When executing tests, it allows creating source maps between built test file, and sources.
 *
 * @property {Boolean} [production=false] Whether to prepare an optimized build.
 *
 * @property {String} [language='en'] Language that will be used to build an editor when starting the development server.
 *
 * @property {Boolean} [open=true] When starting the development server, the default system browser will launch the compiled sample.
 * To disable the mechanism, type `--no-open` when starting the server.
 */
