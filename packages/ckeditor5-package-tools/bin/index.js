#!/usr/bin/env node

/**
 * @license Copyright (c) 2020-2022, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const parseArguments = require( '../lib/utils/parse-arguments' );
const availableTasks = require( '../lib/index' );

const options = parseArguments( process.argv.slice( 2 ) );

if ( availableTasks[ options.task ] ) {
	availableTasks[ options.task ]( options );
} else {
	// TODO: A message when calling a non-existing task could be more precise.
	console.log( 'Unknown task.' );
}
