/**
 * @license Copyright (c) 2020-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { execFileSync } from 'node:child_process';
import semver from 'semver';

/**
 * Returns version of the specified package.
 *
 * @param packageName Name of the package to check the version of.
 * @param range Optional semver range to limit the queried versions.
 * @return {String}
 */
export default function getPackageVersion( packageName, range ) {
	const packageSpec = range ? `${ packageName }@${ range }` : packageName;

	const output = execFileSync( 'npm', [ 'view', packageSpec, 'version', '--json' ], {
		encoding: 'utf8'
	} ).trim();

	const result = JSON.parse( output );

	if ( !Array.isArray( result ) ) {
		return result;
	}

	const latest = semver.maxSatisfying( result, range || '*' );

	if ( !latest ) {
		throw new Error( `No version of ${ packageName } matches ${ range }` );
	}

	return latest;
}
