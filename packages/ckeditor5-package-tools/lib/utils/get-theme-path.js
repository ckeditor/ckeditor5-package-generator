/**
 * @license Copyright (c) 2020-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* eslint-env node */

import fs from 'fs-extra';
import path from 'path';

/**
 * Returns an absolute path to the main file of the `@ckeditor/ckeditor5-theme-lark` package.
 *
 * The function does the same as what does `require.resolve()`. However, there is no option for mocking it in tests,
 * hence the value is obtained manually.
 *
 * @param {String} cwd
 * @return {String}
 */
export default function getThemePath( cwd ) {
	const packagePath = path.join( cwd, 'node_modules', '@ckeditor', 'ckeditor5-theme-lark' );
	const packageJson = fs.readJsonSync( path.join( packagePath, 'package.json' ) );

	return path.join( packagePath, packageJson.main );
}
