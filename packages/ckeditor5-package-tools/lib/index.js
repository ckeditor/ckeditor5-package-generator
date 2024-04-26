/**
 * @license Copyright (c) 2020-2024, CKSource Holding sp. z o.o. All rights reserved.
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
	},

	'translations:collect'( options ) {
		return require( '../lib/tasks/translations-collect' )( options );
	},

	'translations:upload'( options ) {
		return require( '../lib/tasks/translations-upload' )( options );
	},

	'translations:download'( options ) {
		return require( '../lib/tasks/translations-download' )( options );
	},

	'export-package-as-javascript'( options ) {
		return require( '../lib/tasks/export-package-as-javascript' )( options );
	},

	'export-package-as-typescript'( options ) {
		return require( '../lib/tasks/export-package-as-typescript' )( options );
	}
};
