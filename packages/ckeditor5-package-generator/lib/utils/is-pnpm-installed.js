/**
 * @license Copyright (c) 2020-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { execSync } from 'node:child_process';

/**
 * @returns {Boolean}
 */
export default function isPnpmInstalled() {
	const result = execSync( 'pnpm -v || echo false', { stdio: [ null, 'pipe', null ] } );
	return result.toString().trim() !== 'false';
}
