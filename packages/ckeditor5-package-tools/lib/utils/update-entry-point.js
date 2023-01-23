/**
 * @license Copyright (c) 2020-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const path = require( 'path' );
const { updateJSONFile } = require( '@ckeditor/ckeditor5-dev-utils' ).tools;

module.exports = ( options, lang ) => {
	const pkgJsonPath = path.join( options.cwd, 'package.json' );

	updateJSONFile( pkgJsonPath, json => {
		json.main = json.main.replace( /(?<=\.)[tj]s$/, lang );

		return json;
	} );
};
