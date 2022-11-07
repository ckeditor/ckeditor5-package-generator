/**
 * @license Copyright (c) 2020-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const { expect } = require( 'chai' );

describe( 'lib/utils/get-package-name', () => {
	let getPackageName;

	beforeEach( () => {
		getPackageName = require( '../../lib/utils/get-package-name' );
	} );

	it( 'should be a function', () => {
		expect( getPackageName ).to.be.an( 'function' );
	} );

	describe( 'without custom class name', () => {
		it( 'returns correct package names for single word package names', () => {
			const result = getPackageName( '@foo/ckeditor5-bar', {} );

			expect( result ).to.deep.equal( {
				fullScoped: '@foo/ckeditor5-bar',
				pascalCase: 'Bar',
				camelCase: 'bar',
				kebabCase: 'bar',
				lowerCase: 'bar',
				spacedOut: 'Bar'
			} );
		} );

		it( 'returns correct package names for package names with dot', () => {
			const result = getPackageName( '@foo/ckeditor5-bar.baz', {} );

			expect( result ).to.deep.equal( {
				fullScoped: '@foo/ckeditor5-bar.baz',
				pascalCase: 'BarBaz',
				camelCase: 'barBaz',
				kebabCase: 'bar-baz',
				lowerCase: 'barbaz',
				spacedOut: 'Bar baz'
			} );
		} );

		it( 'returns correct package names for package names with dash', () => {
			const result = getPackageName( '@foo/ckeditor5-bar-baz', {} );

			expect( result ).to.deep.equal( {
				fullScoped: '@foo/ckeditor5-bar-baz',
				pascalCase: 'BarBaz',
				camelCase: 'barBaz',
				kebabCase: 'bar-baz',
				lowerCase: 'barbaz',
				spacedOut: 'Bar baz'
			} );
		} );

		it( 'returns correct package names for package names with underscore', () => {
			const result = getPackageName( '@foo/ckeditor5-bar_baz', {} );

			expect( result ).to.deep.equal( {
				fullScoped: '@foo/ckeditor5-bar_baz',
				pascalCase: 'BarBaz',
				camelCase: 'barBaz',
				kebabCase: 'bar-baz',
				lowerCase: 'barbaz',
				spacedOut: 'Bar baz'
			} );
		} );

		it( 'returns correct package names for package names with numbers', () => {
			const result = getPackageName( '@foo/ckeditor5-bar99baz', {} );

			expect( result ).to.deep.equal( {
				fullScoped: '@foo/ckeditor5-bar99baz',
				pascalCase: 'Bar99Baz',
				camelCase: 'bar99Baz',
				kebabCase: 'bar-99-baz',
				lowerCase: 'bar99baz',
				spacedOut: 'Bar 99 baz'
			} );
		} );

		it( 'returns correct package names for package names with complex combinations', () => {
			const result = getPackageName( '@foo/ckeditor5-bar-1.2baz__33baw', {} );

			expect( result ).to.deep.equal( {
				fullScoped: '@foo/ckeditor5-bar-1.2baz__33baw',
				pascalCase: 'Bar12Baz33Baw',
				camelCase: 'bar12Baz33Baw',
				kebabCase: 'bar-1-2-baz-33-baw',
				lowerCase: 'bar12baz33baw',
				spacedOut: 'Bar 1 2 baz 33 baw'
			} );
		} );
	} );

	describe( 'with custom class name', () => {
		it( 'returns correct package names for single word package names', () => {
			const result = getPackageName( '@foo/ckeditor5-xyz', { name: 'Bar' } );

			expect( result ).to.deep.equal( {
				fullScoped: '@foo/ckeditor5-xyz',
				pascalCase: 'Bar',
				camelCase: 'bar',
				kebabCase: 'bar',
				lowerCase: 'bar',
				spacedOut: 'Bar'
			} );
		} );

		it( 'returns correct package names for a two word package name', () => {
			const result = getPackageName( '@foo/ckeditor5-xyz', { name: 'BarBaz' } );

			expect( result ).to.deep.equal( {
				fullScoped: '@foo/ckeditor5-xyz',
				pascalCase: 'BarBaz',
				camelCase: 'barBaz',
				kebabCase: 'bar-baz',
				lowerCase: 'barbaz',
				spacedOut: 'Bar baz'
			} );
		} );

		it( 'returns correct package names for a three word package name', () => {
			const result = getPackageName( '@foo/ckeditor5-xyz', { name: 'BarBazBaw' } );

			expect( result ).to.deep.equal( {
				fullScoped: '@foo/ckeditor5-xyz',
				pascalCase: 'BarBazBaw',
				camelCase: 'barBazBaw',
				kebabCase: 'bar-baz-baw',
				lowerCase: 'barbazbaw',
				spacedOut: 'Bar baz baw'
			} );
		} );

		it( 'returns correct package names for a package name with numbers', () => {
			const result = getPackageName( '@foo/ckeditor5-xyz', { name: 'Bar1baz22Baw' } );

			expect( result ).to.deep.equal( {
				fullScoped: '@foo/ckeditor5-xyz',
				pascalCase: 'Bar1Baz22Baw',
				camelCase: 'bar1Baz22Baw',
				kebabCase: 'bar-1-baz-22-baw',
				lowerCase: 'bar1baz22baw',
				spacedOut: 'Bar 1 baz 22 baw'
			} );
		} );
	} );
} );

