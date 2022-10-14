/**
 * @license Copyright (c) 2020-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const { execSync } = require( 'child_process' );

/**
 * @returns {Boolean}
 */
module.exports = function isYarnInstalled() {
	const result = execSync( 'yarn -v || echo false', { stdio: [ null, 'pipe', null ] } );
	return result.toString().trim() !== 'false';
};
