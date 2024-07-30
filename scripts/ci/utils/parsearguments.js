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
			'installation-method',
			'global-name'
		],

		alias: {
			l: 'language',
			p: 'package-manager',
			n: 'custom-plugin-name',
			m: 'installation-method',
			g: 'global-name'
		},

		default: {
			language: 'js',
			'package-manager': 'yarn',
			'custom-plugin-name': '',
			'installation-method': 'current',
			'global-name': ''
		}
	};

	const options = minimist( cliArguments, config );

	options.packageManager = options[ 'package-manager' ];
	delete options[ 'package-manager' ];

	options.customPluginName = options[ 'custom-plugin-name' ];
	delete options[ 'custom-plugin-name' ];

	options.installationMethod = options[ 'installation-method' ];
	delete options[ 'installation-method' ];

	options.globalName = options[ 'global-name' ];
	delete options[ 'global-name' ];

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
