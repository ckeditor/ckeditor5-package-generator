/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const { execSync } = require( 'child_process' );

/**
 * Returns version of the specified package.
 *
 * @param packageName Name of the package to check the version of.
 * @return {String}
 */
module.exports = function getPackageVersion( packageName ) {
	return execSync( `npm view ${ packageName } version` ).toString().trim();
};
