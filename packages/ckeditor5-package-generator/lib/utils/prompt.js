/**
 * @license Copyright (c) 2020-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { cancel, intro, isCancel, note, outro, select, spinner, text } from '@clack/prompts';

/**
 * @param {string} message
 */
export function showIntro( message ) {
	intro( message );
}

/**
 * @param {string} message
 */
export function showOutro( message ) {
	outro( message );
}

/**
 * @param {string} message
 * @param {string} title
 */
export function showNote( message, title ) {
	note( message, title );
}

/**
 * @returns {import( '@clack/prompts' ).SpinnerResult}
 */
export function createSpinner() {
	return spinner();
}

/**
 * @param {import( '@clack/prompts' ).TextOptions} options
 * @returns {Promise<string>}
 */
export async function promptText( options ) {
	return unwrapPromptValue( await text( options ) );
}

/**
 * @template Value
 * @param {import( '@clack/prompts' ).SelectOptions<Value>} options
 * @returns {Promise<Value>}
 */
export async function promptSelect( options ) {
	return unwrapPromptValue( await select( options ) );
}

/**
 * @template Value
 * @param {Value|symbol} value
 * @returns {Value}
 */
function unwrapPromptValue( value ) {
	if ( isCancel( value ) ) {
		cancel( 'Operation cancelled.' );

		throw new Error( 'SIGINT' );
	}

	return value;
}
