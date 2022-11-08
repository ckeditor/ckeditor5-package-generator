/**
 * @license Copyright (c) 2020-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const { expect } = require( 'chai' );

describe( 'lib/utils/get-package-name-formats', () => {
	let getPackageNameFormats;

	beforeEach( () => {
		getPackageNameFormats = require( '../../lib/utils/get-package-name-formats' );
	} );

	it( 'should be a function', () => {
		expect( getPackageNameFormats ).to.be.an( 'function' );
	} );

	describe( 'without custom plugin name', () => {
		it( 'returns correct package names for single word package names', () => {
			const result = getPackageNameFormats( '@foo/ckeditor5-bar', undefined );

			expect( result ).to.deep.equal( {
				fullScoped: '@foo/ckeditor5-bar',
				featureName: 'bar',
				pascalCase: 'Bar',
				camelCase: 'bar',
				kebabCase: 'bar',
				lowerCase: 'bar',
				spacedOut: 'Bar'
			} );
		} );

		it( 'returns correct package names for package names with dot', () => {
			const result = getPackageNameFormats( '@foo/ckeditor5-bar.baz', undefined );

			expect( result ).to.deep.equal( {
				fullScoped: '@foo/ckeditor5-bar.baz',
				featureName: 'bar.baz',
				pascalCase: 'BarBaz',
				camelCase: 'barBaz',
				kebabCase: 'bar-baz',
				lowerCase: 'barbaz',
				spacedOut: 'Bar baz'
			} );
		} );

		it( 'returns correct package names for package names with dash', () => {
			const result = getPackageNameFormats( '@foo/ckeditor5-bar-baz', undefined );

			expect( result ).to.deep.equal( {
				fullScoped: '@foo/ckeditor5-bar-baz',
				featureName: 'bar-baz',
				pascalCase: 'BarBaz',
				camelCase: 'barBaz',
				kebabCase: 'bar-baz',
				lowerCase: 'barbaz',
				spacedOut: 'Bar baz'
			} );
		} );

		it( 'returns correct package names for package names with underscore', () => {
			const result = getPackageNameFormats( '@foo/ckeditor5-bar_baz', undefined );

			expect( result ).to.deep.equal( {
				fullScoped: '@foo/ckeditor5-bar_baz',
				featureName: 'bar_baz',
				pascalCase: 'BarBaz',
				camelCase: 'barBaz',
				kebabCase: 'bar-baz',
				lowerCase: 'barbaz',
				spacedOut: 'Bar baz'
			} );
		} );

		it( 'returns correct package names for package names with numbers', () => {
			const result = getPackageNameFormats( '@foo/ckeditor5-bar99baz', undefined );

			expect( result ).to.deep.equal( {
				fullScoped: '@foo/ckeditor5-bar99baz',
				featureName: 'bar99baz',
				pascalCase: 'Bar99Baz',
				camelCase: 'bar99Baz',
				kebabCase: 'bar-99-baz',
				lowerCase: 'bar99baz',
				spacedOut: 'Bar 99 baz'
			} );
		} );

		it( 'returns correct package names for package names with complex combinations', () => {
			const result = getPackageNameFormats( '@foo/ckeditor5-bar-1.2baz__33baw', undefined );

			expect( result ).to.deep.equal( {
				fullScoped: '@foo/ckeditor5-bar-1.2baz__33baw',
				featureName: 'bar-1.2baz__33baw',
				pascalCase: 'Bar12Baz33Baw',
				camelCase: 'bar12Baz33Baw',
				kebabCase: 'bar-1-2-baz-33-baw',
				lowerCase: 'bar12baz33baw',
				spacedOut: 'Bar 1 2 baz 33 baw'
			} );
		} );
	} );

	describe( 'with custom plugin name', () => {
		it( 'returns correct package names for single word package names', () => {
			const result = getPackageNameFormats( '@foo/ckeditor5-xyz', 'Bar' );

			expect( result ).to.deep.equal( {
				fullScoped: '@foo/ckeditor5-xyz',
				featureName: 'xyz',
				pascalCase: 'Bar',
				camelCase: 'bar',
				kebabCase: 'bar',
				lowerCase: 'bar',
				spacedOut: 'Bar'
			} );
		} );

		it( 'returns correct package names for a two word package name', () => {
			const result = getPackageNameFormats( '@foo/ckeditor5-xyz', 'BarBaz' );

			expect( result ).to.deep.equal( {
				fullScoped: '@foo/ckeditor5-xyz',
				featureName: 'xyz',
				pascalCase: 'BarBaz',
				camelCase: 'barBaz',
				kebabCase: 'bar-baz',
				lowerCase: 'barbaz',
				spacedOut: 'Bar baz'
			} );
		} );

		it( 'returns correct package names for a three word package name', () => {
			const result = getPackageNameFormats( '@foo/ckeditor5-xyz', 'BarBazBaw' );

			expect( result ).to.deep.equal( {
				fullScoped: '@foo/ckeditor5-xyz',
				featureName: 'xyz',
				pascalCase: 'BarBazBaw',
				camelCase: 'barBazBaw',
				kebabCase: 'bar-baz-baw',
				lowerCase: 'barbazbaw',
				spacedOut: 'Bar baz baw'
			} );
		} );

		it( 'returns correct package names for a package name with numbers', () => {
			const result = getPackageNameFormats( '@foo/ckeditor5-xyz', 'Bar1baz22Baw' );

			expect( result ).to.deep.equal( {
				fullScoped: '@foo/ckeditor5-xyz',
				featureName: 'xyz',
				pascalCase: 'Bar1Baz22Baw',
				camelCase: 'bar1Baz22Baw',
				kebabCase: 'bar-1-baz-22-baw',
				lowerCase: 'bar1baz22baw',
				spacedOut: 'Bar 1 baz 22 baw'
			} );
		} );
	} );
} );

