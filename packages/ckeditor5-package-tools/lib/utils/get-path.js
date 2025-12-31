/**
 * @license Copyright (c) 2020-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import upath from 'upath';
import module from 'node:module';

function getRequire() {
	return module.createRequire( import.meta.url );
}

/**
 * Returns an absolute path to the main file of the `@ckeditor/ckeditor5-theme-lark` package.
 *
 * @param {string} cwd
 * @return {string}
 */
export function getThemePath( cwd ) {
	return getRequire().resolve( '@ckeditor/ckeditor5-theme-lark', { paths: [ cwd ] } );
}

/**
 * Returns relative path to the `@ckeditor/ckeditor5-core` package.
 *
 * @returns {string}
 */
export function getCorePath() {
	return upath.relative(
		process.cwd(),
		upath.dirname( getRequire().resolve( '@ckeditor/ckeditor5-core/package.json' ) )
	);
}
