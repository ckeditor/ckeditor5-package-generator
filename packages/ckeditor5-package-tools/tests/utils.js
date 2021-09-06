/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const expect = require( 'chai' ).expect;

describe( 'lib/utils', () => {
	let utils, validateDirectory, getPackageVersions;

	beforeEach( () => {
		utils = require( '../../create-ckeditor5-plugin/lib/utils' );
	} );

	it( 'should be an object', () => {
		expect( utils ).to.be.an( 'object' );
	} );

	it( 'should only contain functions', () => {
		for ( const property in utils ) {
			expect( utils[ property ] ).to.be.an( 'function' );
		}
	} );

	describe( 'validateDirectory()', () => {
		beforeEach( () => {
			validateDirectory = utils.validateDirectory;
		} );

		it( 'should be a function', () => {
			expect( validateDirectory ).to.be.an( 'function' );
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

	describe( 'getPackageVersions()', () => {
		beforeEach( () => {
			getPackageVersions = utils.getPackageVersions;
		} );

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

