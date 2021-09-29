/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

module.exports = {
	test( options ) {
		return require( '../lib/tasks/test' )( options );
	},

	start( options ) {
		return require( '../lib/tasks/start' )( options );
	},

	'dll:build'( options ) {
		return require( '../lib/tasks/dll-build' )( options );
	}
};
