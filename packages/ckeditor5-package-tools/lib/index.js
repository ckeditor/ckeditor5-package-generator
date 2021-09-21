/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

'use strict';

module.exports = {
	test( options ) {
		return require( '../lib/tasks/test' )( options );
	},

	start( options ) {
		return require( '../lib/tasks/start' )( options );
	},

	crawler() {
		return require( '../lib/tasks/crawler' );
	},

	'dll:build'( options ) {
		return require( '../lib/tasks/dll-build' )( options );
	}
};
