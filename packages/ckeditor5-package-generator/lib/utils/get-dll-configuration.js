/**
 * @license Copyright (c) 2020-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

/**
 * Configuration for output produced by webpack.
 *
 * @param {String} packageName
 * @return {Object}
 */
module.exports = function getDllConfiguration( packageName ) {
	// For the scoped package, webpack exports it as `window.CKEditor5[ packageName ]`.
	[ , packageName ] = packageName.split( '/' );
	const packageNameSlug = getGlobalKeyForPackage( packageName );

	// The `packageName` represents the package name as a slug, and scope starts without the `at` (@) character.
	return {
		library: packageNameSlug,
		fileName: getIndexFileName( packageName )
	};
};

/**
 * Transforms `packageName` to a key for the `window` object.
 *
 * @param {String} packageName
 * @return {String}
 */
function getGlobalKeyForPackage( packageName ) {
	return packageName.replace( /^ckeditor5-/, '' )
		.replace( /-([a-z])/g, ( match, p1 ) => p1.toUpperCase() );
}

/**
 * Extracts the main file name from the package name.
 *
 * @param {String} packageName
 * @returns {String}
 */
function getIndexFileName( packageName ) {
	return packageName.replace( /^ckeditor5-/, '' ) + '.js';
}
