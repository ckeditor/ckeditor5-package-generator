/**
 * @license Copyright (c) 2020-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import minimist from 'minimist';

/**
 * @param {Array.<String>} cliArguments
 * @returns {VerificationOptions} options
 */
export default function parseArguments( cliArguments ) {
	const config = {
		string: [
			'language',
			'package-manager',
			'custom-plugin-name',
			'global-name'
		],

		alias: {
			l: 'language',
			p: 'package-manager',
			n: 'custom-plugin-name',
			g: 'global-name'
		},

		default: {
			language: 'js',
			'package-manager': 'yarn',
			'custom-plugin-name': '',
			'global-name': ''
		}
	};

	const options = minimist( cliArguments, config );

	options.packageManager = options[ 'package-manager' ];
	delete options[ 'package-manager' ];

	options.customPluginName = options[ 'custom-plugin-name' ];
	delete options[ 'custom-plugin-name' ];

	options.globalName = options[ 'global-name' ];
	delete options[ 'global-name' ];

	return options;
}

/**
 * @typedef {Object} VerificationOptions
 *
 * @property {String} language
 *
 * @property {String} packageManager
 *
 * @property {String} customPluginName
 *
 * @property {String} globalName
 */
