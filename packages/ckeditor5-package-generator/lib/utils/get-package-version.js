/**
 * @license Copyright (c) 2020-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { execSync } from 'child_process';

/**
 * Returns version of the specified package.
 *
 * @param packageName Name of the package to check the version of.
 * @return {String}
 */
export default function getPackageVersion( packageName ) {
	return execSync( `npm view ${ packageName } version` ).toString().trim();
}
