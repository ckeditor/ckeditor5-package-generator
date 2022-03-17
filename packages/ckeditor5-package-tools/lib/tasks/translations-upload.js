/**
 * @license Copyright (c) 2020-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const path = require( 'path' );

module.exports = async options => {
	if ( !options.organization ) {
		throw new Error( 'The URL to the Transifex API is required. Use --organization [organization name] to provide the value.' );
	}

	if ( !options.project ) {
		throw new Error( 'The URL to the Transifex API is required. Use --project [project name] to provide the value.' );
	}

	if ( options.transifex ) {
		throw new Error( 'The -- transifex [API end-point] option is no longer supported. Use `--organization` and `--project` instead.' );
	}

	const getToken = require( '@ckeditor/ckeditor5-dev-env/lib/translations/gettoken' );

	const pkgJson = require( path.join( options.cwd, 'package.json' ) );
	const packageName = pkgJson.name.split( '/' ).pop();

	return require( '@ckeditor/ckeditor5-dev-env' ).uploadPotFiles( {
		// Token used for authentication with the Transifex service.
		token: await getToken(),

		// Transifex project details.
		organizationName: options.organization,
		projectName: options.project,

		// List of packages that will be processed.
		packages: new Map( [
			[ packageName, path.join( 'tmp', '.transifex', packageName ) ]
		] ),

		// An absolute path to the package.
		cwd: options.cwd
	} );
};
