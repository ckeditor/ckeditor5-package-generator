/**
 * @license Copyright (c) 2020-2022, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

/* eslint-env node */

const path = require( 'path' );

/**
 * Returns an absolute path to the main file of the `@ckeditor/ckeditor5-theme-lark` package.
 *
 * The function does the same as what does `require.resolve()`. However, there is no option for mocking it in tests,
 * hence the value is obtained manually.
 *
 * @param {String} cwd
 * @return {String}
 */
module.exports = function getThemePath( cwd ) {
	const packagePath = path.join( cwd, 'node_modules', '@ckeditor', 'ckeditor5-theme-lark' );
	const packageJson = require( path.join( packagePath, 'package.json' ) );

	return path.join( packagePath, packageJson.main );
};
