/**
 * @license Copyright (c) 2020-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import minimist from 'minimist';

export default args => {
	const config = {
		string: [
			'language'
		],

		boolean: [
			'open',
			'production',
			'verbose',
			'watch',
			'validate-only'
		],

		alias: {
			w: 'watch',
			v: 'verbose'
		},

		default: {
			open: true,
			language: 'en',
			verbose: false,
			production: false,
			watch: false,
			'validate-only': false
		}
	};

	const options = minimist( args, config );

	// Convert to camelCase.
	replaceKebabCaseWithCamelCase( options, [ 'validate-only' ] );

	// Delete all aliases because we do not want to use them in the code.
	// They are useful when calling a command from CLI point of view.
	for ( const alias of Object.keys( config.alias ) ) {
		delete options[ alias ];
	}

	// Save the current work directory.
	options.cwd = process.cwd();

	// Save the task to execute.
	options.task = options._.shift();

	return options;
};

function replaceKebabCaseWithCamelCase( options, keys ) {
	for ( const key of keys ) {
		const camelCaseKey = key.replace( /-./g, match => match[ 1 ].toUpperCase() );

		options[ camelCaseKey ] = options[ key ];
		delete options[ key ];
	}
}

/**
 * @typedef {Object} Ckeditor5PackageToolsOptions
 *
 * @property {String} cwd An absolute path to the root directory which contains the main `package.json` file.
 *
 * @property {String} task A name of a task to execute.
 *
 * @property {Array.<String>} _ Additional modifiers for the executed task that could not be matched with the supported options.
 *
 * @property {Boolean} [watch=false] When building the DLL file, it listens to changes in the source.
 *
 * @property {Boolean} [verbose=false] Whether to display additional logs by tasks.
 *
 * @property {Boolean} [production=false] Whether to prepare an optimized build.
 *
 * @property {Boolean} [validateOnly=false] Whether to validate the translations contexts against the source messages only.
 *
 * @property {String} [language='en'] Language that will be used to build an editor when starting the development server.
 *
 * @property {Boolean} [open=true] When starting the development server, the default system browser will launch the compiled sample.
 * To disable the mechanism, type `--no-open` when starting the server.
 */
