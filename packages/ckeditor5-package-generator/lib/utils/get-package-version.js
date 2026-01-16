/**
 * @license Copyright (c) 2020-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify( execFile );

/**
 * Returns version of the specified package.
 *
 * @param {String} packageName Name of the package to check the version of.
 * @return {Promise<String>}
 */
export default async function getPackageVersion( packageName ) {
	const { stdout } = await execFileAsync(
		'npm',
		[ 'view', packageName, 'version' ],
		{ stdio: 'pipe', encoding: 'utf-8' }
	);

	return stdout.trim();
}
