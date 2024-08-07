/**
 * @license Copyright (c) 2020-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

/* eslint-env node */

/**
 * Returns an absolute path to the main file of the `@ckeditor/ckeditor5-theme-lark` package.
 *
 * Used to assist mocking require.resolve() in tests.
 *
 * @param {Function} resolver
 * @return {String}
 */
module.exports = function getThemePath( resolver ) {
	return resolver( '@ckeditor/ckeditor5-theme-lark' );
};
