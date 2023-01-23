/**
 * @license Copyright (c) 2020-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const path = require( 'path' );
const { getToken, downloadTranslations } = require( '@ckeditor/ckeditor5-dev-transifex' );

module.exports = async options => {
	if ( !options.organization ) {
		throw new Error( 'The organization name is required. Use --organization [organization name] to provide the value.' );
	}

	if ( !options.project ) {
		throw new Error( 'The project name is required. Use --project [project name] to provide the value.' );
	}

	if ( options.transifex ) {
		throw new Error( 'The --transifex [API end-point] option is no longer supported. Use `--organization` and `--project` instead.' );
	}

	const pkgJson = require( path.join( options.cwd, 'package.json' ) );
	const packageName = pkgJson.name.split( '/' ).pop();

	return downloadTranslations( {
		// Token used for authentication with the Transifex service.
		token: await getToken(),

		// List of packages that will be processed.
		packages: new Map( [
			[ packageName, '.' ]
		] ),

		// Transifex project details.
		organizationName: options.organization,
		projectName: options.project,

		// An absolute path to the package.
		cwd: options.cwd,

		// Skip CKEditor 5 contribute URL in created `*.po` files.
		simplifyLicenseHeader: true
	} );
};
