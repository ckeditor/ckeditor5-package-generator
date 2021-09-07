/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const expect = require( 'chai' ).expect;

describe( 'lib/utils', () => {
	const validatePackageName = require( '../../../create-ckeditor5-plugin/lib/utils/validatePackageName' );

	describe( 'validatePackageName()', () => {
		it( 'should be a function', () => {
			expect( validatePackageName ).to.be.an( 'function' );
		} );

		it( 'work correctly with valid package name', () => {
		// TODO
		} );

		it( 'stop the process if the package name is not valid name for a npm package', () => {
		// TODO
		} );

		it( 'stop the process if the package name does not contain the "ckeditor5-" prefix', () => {
		// TODO
		} );

		it( 'stop the process if the package name contains only the "ckeditor5-" prefix', () => {
		// TODO
		} );
	} );
} );
