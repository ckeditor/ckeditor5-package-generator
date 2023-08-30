/**
 * @license Copyright (c) 2020-2023, CKSource Holding sp. z o.o. All rights reserved.
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
			'custom-plugin-name'
		],

		alias: {
			l: 'language',
			p: 'package-manager',
			n: 'custom-plugin-name'
		},

		default: {
			language: 'js',
			'package-manager': 'yarn',
			'custom-plugin-name': ''
		}
	};

	const options = minimist( cliArguments, config );

	options.packageManager = options[ 'package-manager' ];
	delete options[ 'package-manager' ];

	options.customPluginName = options[ 'custom-plugin-name' ];
	delete options[ 'custom-plugin-name' ];

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
 */
