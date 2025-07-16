/**
 * @license Copyright (c) 2020-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import module from 'module';

/**
 * Returns an absolute path to the main file of the `@ckeditor/ckeditor5-theme-lark` package.
 *
 * @param {String} cwd
 * @return {String}
 */
export default function getThemePath( cwd ) {
	return module
		.createRequire( import.meta.url )
		.resolve( '@ckeditor/ckeditor5-theme-lark', { paths: [ cwd ] } );
}
