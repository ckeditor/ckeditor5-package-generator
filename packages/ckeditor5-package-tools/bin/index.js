#!/usr/bin/env node

/**
 * @license Copyright (c) 2020-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import chalk from 'chalk';

import parseArguments from '../lib/utils/parse-arguments.js';
import availableTasks from '../lib/index.js';

const options = parseArguments( process.argv.slice( 2 ) );

if ( availableTasks[ options.task ] ) {
	availableTasks[ options.task ]( options );
} else {
	const errorMessage = [
		`"${ options.task }" is not one of available tasks. Available tasks:`,
		...Object.keys( availableTasks ).map( taskName => `- ${ taskName }` )
	].join( '\n' );

	console.log( chalk.red( errorMessage ) );
}
