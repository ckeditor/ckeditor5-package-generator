/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

'use strict';

const minimist = require( 'minimist' );

module.exports = args => {
	const config = {
		boolean: [
			'coverage',
			'watch',
			'verbose',
			'source-map'
		],

		alias: {
			c: 'coverage',
			w: 'watch',
			v: 'verbose',
			s: 'source-map'
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
