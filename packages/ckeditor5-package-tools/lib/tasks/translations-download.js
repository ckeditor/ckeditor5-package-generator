/**
 * @license Copyright (c) 2020-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const path = require( 'path' );

module.exports = async options => {
	if ( !options.transifex ) {
		throw new Error( 'The URL to the Transifex API is required. Use --transifex [API end-point] to provide the value.' );
	}

	const getToken = require( '@ckeditor/ckeditor5-dev-env/lib/translations/gettoken' );

	const pkgJson = require( path.join( options.cwd, 'package.json' ) );
	const packageName = pkgJson.name.split( '/' ).pop();

	return require( '@ckeditor/ckeditor5-dev-env' ).downloadTranslations( {
		// Token used for authentication with the Transifex service.
		token: await getToken(),

		// List of packages that will be processed.
		packages: new Map( [
			[ packageName, '.' ]
		] ),

		// End-point API URL to the Transifex service.
		url: options.transifex,

		// An absolute path to the package.
		cwd: options.cwd,

		// Skip CKEditor 5 contribute URL in created `*.po` files.
		simplifyLicenseHeader: true
	} );
};
