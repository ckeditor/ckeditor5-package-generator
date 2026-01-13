/**
 * @license Copyright (c) 2020-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { execFileSync } from 'node:child_process';

/**
 * Returns version of the specified package.
 *
 * @param {String} packageName Name of the package to check the version of.
 * @param {String} packageManager Package manager to use.
 * @return {String}
 */
export default function getPackageVersion( packageName, packageManager ) {
	return execFileSync(
		packageManager,
		[ 'view', packageName, 'version' ],
		{ stdio: 'pipe', encoding: 'utf-8' }
	).trim();
}
