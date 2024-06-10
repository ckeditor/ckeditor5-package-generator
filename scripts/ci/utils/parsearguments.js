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
			'installation-method'
		],

		alias: {
			l: 'language',
			p: 'package-manager',
			n: 'custom-plugin-name',
			m: 'installation-method'
		},

		default: {
			language: 'js',
			'package-manager': 'yarn',
			'custom-plugin-name': '',
			'installation-method': 'current'
		}
	};

	const options = minimist( cliArguments, config );

	options.packageManager = options[ 'package-manager' ];
	delete options[ 'package-manager' ];

	options.customPluginName = options[ 'custom-plugin-name' ];
	delete options[ 'custom-plugin-name' ];

	console.log( 'options22222', options );

	options.installationMethod = options[ 'installation-method' ];
	delete options[ 'installation-method' ];

	console.log( 'options2', options );

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
 * @property {String} installationMethods
 */
