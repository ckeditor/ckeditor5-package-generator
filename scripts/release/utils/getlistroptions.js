/**
 * @license Copyright (c) 2020-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * @param {ReleaseOptions} cliArguments
 * @returns {Object}
 */
export default function getListrOptions( cliArguments ) {
	return {
		renderer: cliArguments.verbose ? 'verbose' : 'default'
	};
}
