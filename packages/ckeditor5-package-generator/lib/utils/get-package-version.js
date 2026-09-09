/**
 * @license Copyright (c) 2020-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import semver from 'semver';

const execAsync = promisify( exec );

/**
 * Returns version of the specified package.
 *
 * With a `versionRange`, this function returns the highest version that matches the range. Use it
 * to pin a dependency to one major line instead of the latest published version.
 *
 * @param {String} packageName Name of the package to check the version of.
 * @param {String} [versionRange] Optional semver range that limits the resolved version.
 * @return {Promise<String>}
 */
export default async function getPackageVersion( packageName, versionRange = null ) {
	const packageIdentifier = versionRange ? `${ packageName }@${ versionRange }` : packageName;

	const { stdout } = await execAsync(
		`npm view "${ packageIdentifier }" version --json`,
		{ encoding: 'utf-8' }
	);

	const versions = JSON.parse( stdout.trim() );

	return Array.isArray( versions ) ? semver.maxSatisfying( versions, versionRange ) : versions;
}
