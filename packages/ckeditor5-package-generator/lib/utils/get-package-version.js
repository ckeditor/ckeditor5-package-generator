/**
 * @license Copyright (c) 2020-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const { spawnSync } = require( 'child_process' );

/**
 * Returns the version of the specified package.
 *
 * @param packageName Name of the package to check the version of.
 * @return {String}
 */
module.exports = function getPackageVersion( packageName ) {
	// See: #39.
	const response = spawnSync( 'npm', [ 'view', packageName, '--json' ], {
		encoding: 'utf8',
		shell: true
	} );

	try {
		return JSON.parse( response.stdout.toString() ).versions.pop();
	} catch ( err ) {
		throw new Error( 'The specified package has not been published on npm yet.' );
	}
};
