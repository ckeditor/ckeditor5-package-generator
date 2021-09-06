#!/usr/bin/env node

/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

'use strict';

const path = require( 'path' );
const { execSync } = require( 'child_process' );
const validateNpmPackageName = require( 'validate-npm-package-name' );

module.exports = {
	validateDirectory,
	getPackageVersions
};

/**
 * @param {String} directory
 */
function validateDirectory( directory ) {
	const validateResult = validateNpmPackageName( directory );

	if ( !validateResult.validForNewPackages ) {
		console.log( 'Provided <directory> is not valid name for a npm package.' );

		for ( const error of ( validateResult.errors || [] ) ) {
			console.log( '  * ' + error );
		}

		for ( const warning of ( validateResult.warnings || [] ) ) {
			console.log( '  * ' + warning );
		}

		process.exit( 1 );
	}

	if ( !directory.match( /^ckeditor5-/ ) ) {
		console.log( 'Package name should follow the "ckeditor5-" prefix.' );
		process.exit( 1 );
	}

	if ( directory.length <= 'ckeditor5-'.length ) {
		console.log( 'Package name should contain its name after the "ckeditor5-" prefix.' );
		process.exit( 1 );
	}
}

function getPackageVersions( devMode ) {
	return {
		ckeditor5: getLatestVersionOfPackage( 'ckeditor5' ),
		devUtils: getLatestVersionOfPackage( '@ckeditor/ckeditor5-dev-utils' ),
		packageTools: devMode ?
			// Windows accepts unix-like paths in `package.json`, so let's unify it to avoid errors with paths.
			'file:' + path.resolve( __dirname, '..', '..', 'ckeditor5-package-tools' ).split( path.sep ).join( path.posix.sep ) :
			'^' + getLatestVersionOfPackage( '@ckeditor/ckeditor5-package-tools' )
	};
}

/**
 * @param packageName
 * @return {String}
 */
function getLatestVersionOfPackage( packageName ) {
	return execSync( `npm view ${ packageName } version` ).toString().trim();
}
