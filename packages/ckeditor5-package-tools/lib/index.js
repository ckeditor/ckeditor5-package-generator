#!/usr/bin/env node

/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

'use strict';

const minimist = require( 'minimist' );

const tasks = {
	test( options ) {
		require( './tasks/test' )( options );
	},

	start() {

	}
};

const options = parseArguments( process.argv.slice( 2 ) );

if ( tasks[ options.task ] ) {
	tasks[ options.task ]( options );
} else {
	console.log( 'Unknown task.' );
}

module.exports = tasks;

function parseArguments( args ) {
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

	const parsedOptions = minimist( args, config );

	parsedOptions.task = parsedOptions._[ 0 ];

	return parsedOptions;
}
