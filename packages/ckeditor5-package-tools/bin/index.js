#!/usr/bin/env node

/**
 * @license Copyright (c) 2020-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const { red } = require( 'chalk' );

const parseArguments = require( '../lib/utils/parse-arguments' );
const availableTasks = require( '../lib/index' );

const options = parseArguments( process.argv.slice( 2 ) );

if ( availableTasks[ options.task ] ) {
	availableTasks[ options.task ]( options );
} else {
	const errorMessage = [
		`"${ options.task }" is not one of available tasks. Available tasks:`,
		...Object.keys( availableTasks ).map( taskName => `- ${ taskName }` )
	].join( '\n' );

	console.log( red( errorMessage ) );
}
