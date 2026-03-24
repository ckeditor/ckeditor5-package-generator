/**
 * @license Copyright (c) 2020-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { promptText, showNote } from './prompt.js';

/**
 * If the plugin name is not valid, prints the error and exits the process.
 *
 * @param {String|undefined} pluginName
 * @returns {Promise<String|undefined>}
 */
export default async function validatePluginName( pluginName ) {
	// Custom plugin name is optional.
	if ( !pluginName ) {
		return;
	}

	const validationError = validator( pluginName );

	if ( !validationError ) {
		return pluginName;
	}

	showNote( [
		validationError,
		'',
		'Allowed characters: 0-9 A-Z a-z',
		'Leave the field empty to derive the plugin name from the package name.'
	].join( '\n' ), 'Plugin name' );

	const validatedPluginName = await promptText( {
		message: 'Plugin class name (optional)',
		placeholder: 'MyPlugin',
		initialValue: pluginName,
		validate: value => {
			if ( !value ) {
				return undefined;
			}

			return validator( value ) || undefined;
		}
	} );

	return validatedPluginName || undefined;
}

/**
 * Checks if the plugin name is valid.
 *
 * Returns a string containing the validation error, or `null` if no errors were found.
 *
 * @param {String} pluginName
 * @returns {String|null}
 */
function validator( pluginName ) {
	if ( !/^[0-9A-Za-z]+$/.test( pluginName ) ) {
		return 'The plugin name contains non-allowed characters.';
	}

	if ( /^[0-9]/.test( pluginName ) ) {
		return 'The plugin name can not start with a digit.';
	}

	return null;
}
