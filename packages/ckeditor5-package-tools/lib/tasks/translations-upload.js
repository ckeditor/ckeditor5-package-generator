/**
 * @license Copyright (c) 2020-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const path = require( 'path' );

module.exports = async options => {
	if ( !options.transifex ) {
		throw new Error( 'The URL to the Transifex API is required. Use --transifex [API end-point] to provide the value.' );
	}

	const getToken = require( '@ckeditor/ckeditor5-dev-env/lib/translations/gettoken' );

	return require( '@ckeditor/ckeditor5-dev-env' ).uploadPotFiles( {
		// Token used for authentication with the Transifex service.
		token: await getToken(),

		// End-point API URL to the Transifex service.
		url: options.transifex,

		// Where to look for the saved translation files.
		translationsDirectory: path.join( options.cwd, 'tmp', '.transifex' )
	} );
};
