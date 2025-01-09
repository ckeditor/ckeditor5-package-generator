/**
 * @license Copyright (c) 2020-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* eslint-env node */

import minimist from 'minimist';

/**
 * @param {Array.<String>} cliArguments
 * @returns {ReleaseOptions} options
 */
export default function parseArguments( cliArguments ) {
	const config = {
		boolean: [
			'verbose',
			'compile-only',
			'ci'
		],

		string: [
			'branch',
			'packages',
			'npm-tag'
		],

		default: {
			packages: null,
			branch: 'master',
			'npm-tag': null,
			ci: false,
			'compile-only': false,
			verbose: false
		}
	};

	const options = minimist( cliArguments, config );

	if ( typeof options.packages === 'string' ) {
		options.packages = options.packages.split( ',' );
	}

	if ( process.env.CI ) {
		options.ci = true;
	}

	options.compileOnly = options[ 'compile-only' ];
	delete options[ 'compile-only' ];

	options.npmTag = options[ 'npm-tag' ];
	delete options[ 'npm-tag' ];

	return options;
}

/**
 * @typedef {Object} ReleaseOptions
 *
 * @property {String|null} [npmTag=null]
 *
 * @property {Array.<String>|null} packages
 *
 * @property {String} [branch='master']
 *
 * @property {Boolean} [compileOnly=false]
 *
 * @property {Boolean} [verbose=false]
 *
 * @property {Boolean} [ci=false]
 */
