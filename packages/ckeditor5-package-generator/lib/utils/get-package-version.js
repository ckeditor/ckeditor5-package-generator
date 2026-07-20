/**
 * @license Copyright (c) 2020-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { exec } from 'node:child_process';
import { promisify } from 'node:util';

const execAsync = promisify( exec );

/**
 * Returns version of the specified package.
 *
 * When `versionRange` is provided, the highest version matching the given semver range is returned.
 * This allows pinning a dependency to a specific (e.g. compatible) major line instead of always
 * resolving to the latest published version.
 *
 * @param {String} packageName Name of the package to check the version of.
 * @param {String} [versionRange] Optional semver range used to narrow down the resolved version.
 * @return {Promise<String>}
 */
export default async function getPackageVersion( packageName, versionRange = null ) {
	const packageIdentifier = versionRange ? `${ packageName }@${ versionRange }` : packageName;

	const { stdout } = await execAsync(
		`npm view ${ packageIdentifier } version --json`,
		{ encoding: 'utf-8' }
	);

	const versions = JSON.parse( stdout.trim() );

	// A range matching multiple versions is returned by npm as an array sorted in ascending order,
	// so the last item is the highest matching version. A single match is returned as a string.
	return Array.isArray( versions ) ? versions.at( -1 ) : versions;
}
