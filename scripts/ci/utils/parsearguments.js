/**
 * @license Copyright (c) 2020-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* eslint-env node */

'use strict';

const minimist = require( 'minimist' );

/**
 * @param {Array.<String>} cliArguments
 * @returns {VerificationOptions} options
 */
module.exports = function parseArguments( cliArguments ) {
	const config = {
		string: [
			'language',
			'package-manager',
			'custom-plugin-name',
			'use-legacy-methods'
		],

		alias: {
			l: 'language',
			p: 'package-manager',
			n: 'custom-plugin-name',
			m: 'use-legacy-methods'
		},

		default: {
			language: 'js',
			'package-manager': 'yarn',
			'custom-plugin-name': '',
			'use-legacy-methods': false
		}
	};

	const options = minimist( cliArguments, config );

	options.packageManager = options[ 'package-manager' ];
	delete options[ 'package-manager' ];

	options.customPluginName = options[ 'custom-plugin-name' ];
	delete options[ 'custom-plugin-name' ];

	options.useLegacyMethods = typeof options[ 'use-legacy-methods' ] === 'string';
	delete options[ 'use-legacy-methods' ];

	return options;
};

/**
 * @typedef {Object} VerificationOptions
 *
 * @property {String} language
 *
 * @property {String} packageManager
 *
 * @property {String} customPluginName
 *
 * @property {String} useLegacyMethods
 */
