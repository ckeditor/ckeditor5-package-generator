/**
 * @license Copyright (c) 2020-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* eslint-env node */

/**
 * @param {ReleaseOptions} cliArguments
 * @returns {Object}
 */
export default function getListrOptions( cliArguments ) {
	return {
		renderer: cliArguments.verbose ? 'verbose' : 'default'
	};
}
