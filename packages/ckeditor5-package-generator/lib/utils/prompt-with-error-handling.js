/**
 * @license Copyright (c) 2020-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import inquirer from 'inquirer';

/**
 * Prompts the user using Inquirer and handles prompt cancellation (SIGINT).
 *
 * If the user aborts the prompt using Ctrl+C, the process exits gracefully.
 * Any other error is rethrown to be handled by the caller.
 *
 * @param {import('inquirer').QuestionCollection} options
 *   Inquirer prompt configuration.
 *
 * @returns {Promise<Record<string, unknown>>}
 *   A promise resolving to the answers object returned by Inquirer.
 *
 * @throws {Error}
 *   Rethrows any error that is not caused by prompt cancellation.
 */
export default async function promptWithErrorHandling( options ) {
	return inquirer.prompt( options ).catch( error => {
		// Ctrl+C or prompt cancellation.
		if ( error.message && error.message.includes( 'SIGINT' ) ) {
			process.exit( 1 );
		} else {
			throw error;
		}
	} );
}
