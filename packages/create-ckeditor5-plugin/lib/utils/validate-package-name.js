#!/usr/bin/env node

/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

'use strict';

const validateNpmPackageName = require( 'validate-npm-package-name' );

/**
  * @param {String} packageName
  */
module.exports = function validatePackageName( packageName ) {
	const errorLogs = [];

	const validateResult = validateNpmPackageName( packageName );

	if ( !validateResult.validForNewPackages ) {
		errorLogs.push( 'Provided <packageName> is not valid name for a npm package:' );

		for ( const error of ( validateResult.errors || [] ) ) {
			errorLogs.push( '  * ' + error );
		}

		for ( const warning of ( validateResult.warnings || [] ) ) {
			errorLogs.push( '  * ' + warning );
		}
	}

	const [ scope, name ] = packageName.split( '/' );

	if ( !scope || !scope.match( /^@./ ) ) {
		errorLogs.push( 'Provided <packageName> should start with the "@scope".' );
	}

	if ( !packageName.includes( '/' ) ) {
		errorLogs.push( 'Scope and the package name should be separated by "/".' );
	}

	if ( !name || !name.match( /^ckeditor5-./ ) ) {
		errorLogs.push( 'Package name should contain the "ckeditor5-" prefix followed by the package name.' );
	}

	return errorLogs;
};
