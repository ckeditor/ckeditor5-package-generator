/**
 * @license Copyright (c) 2020-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { execSync } from 'child_process';

/**
 * @returns {Boolean}
 */
export default function isYarnInstalled() {
	const result = execSync( 'yarn -v || echo false', { stdio: [ null, 'pipe', null ] } );
	return result.toString().trim() !== 'false';
}
