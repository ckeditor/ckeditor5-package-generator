#!/usr/bin/env node

/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

'use strict';

const parseArguments = require( '../lib/utils/parse-arguments' );

const availableTasks = {
	test( options ) {
		return require( '../lib/tasks/test' )( options );
	},

	start( options ) {
		return require( '../lib/tasks/start' )( options );
	}
};

const options = parseArguments( process.argv.slice( 2 ) );

if ( availableTasks[ options.task ] ) {
	availableTasks[ options.task ]( options );
} else {
	console.log( 'Unknown task.' );
}

module.exports = availableTasks;
