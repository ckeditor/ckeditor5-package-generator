/**
 * @license Copyright (c) 2020-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const path = require( 'path' );
const { getToken, uploadPotFiles } = require( '@ckeditor/ckeditor5-dev-transifex' );

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
	const packageName = pkgJson.name.includes( '/' ) ? pkgJson.name.split( '/' ).pop() : pkgJson.name;

	return uploadPotFiles( {
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
