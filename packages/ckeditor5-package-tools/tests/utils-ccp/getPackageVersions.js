/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const expect = require( 'chai' ).expect;

describe( 'lib/utils', () => {
	const getPackageVersions = require( '../../../create-ckeditor5-plugin/lib/utils/getPackageVersions' );

	describe( 'getPackageVersions()', () => {
		it( 'should be a function', () => {
			expect( getPackageVersions ).to.be.an( 'function' );
		} );

		it( 'should return an object containing proper attributes', () => {
			// TODO
		} );

		it( 'should behave correctly with the devMode set to true', () => {
			// TODO
		} );

		it( 'should behave correctly with the devMode set to false', () => {
			// TODO
		} );
	} );
} );
