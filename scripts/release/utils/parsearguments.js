/**
 * @license Copyright (c) 2020-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

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
			'ci',
			'dry-run'
		],

		string: [
			'branch',
			'packages',
			'npm-tag',
			'date'
		],

		default: {
			packages: null,
			branch: 'master',
			'npm-tag': null,
			ci: false,
			'compile-only': false,
			verbose: false,
			'dry-run': false
		}
	};

	const options = minimist( cliArguments, config );

	replaceKebabCaseWithCamelCase( options, [
		'npm-tag',
		'compile-only',
		'dry-run'
	] );

	if ( typeof options.packages === 'string' ) {
		options.packages = options.packages.split( ',' );
	}

	if ( process.env.CI ) {
		options.ci = true;
	}

	return options;
}

function replaceKebabCaseWithCamelCase( options, keys ) {
	for ( const key of keys ) {
		const camelCaseKey = toCamelCase( key );

		options[ camelCaseKey ] = options[ key ];
		delete options[ key ];
	}
}

function toCamelCase( value ) {
	return value.split( '-' )
		.map( ( item, index ) => {
			if ( index == 0 ) {
				return item.toLowerCase();
			}

			return item.charAt( 0 ).toUpperCase() + item.slice( 1 ).toLowerCase();
		} )
		.join( '' );
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
 *
 * @property {Boolean} [dryRun=false]
 *
 * @property {String} [date]
 */
