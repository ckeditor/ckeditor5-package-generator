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
				package: {
					raw: 'bar',
					spacedOut: 'Bar',
					camelCase: 'bar',
					pascalCase: 'Bar',
					lowerCaseMerged: 'bar'
				},
				plugin: {
					raw: 'bar',
					spacedOut: 'Bar',
					camelCase: 'bar',
					pascalCase: 'Bar',
					lowerCaseMerged: 'bar'
				}
			} );

			expect( result.package ).to.deep.equal( result.plugin );
		} );

		it( 'returns correct package names for package names with dot', () => {
			const result = getPackageNameFormats( '@foo/ckeditor5-bar.baz', undefined );

			expect( result ).to.deep.equal( {
				package: {
					raw: 'bar.baz',
					spacedOut: 'Bar baz',
					camelCase: 'barBaz',
					pascalCase: 'BarBaz',
					lowerCaseMerged: 'barbaz'
				},
				plugin: {
					raw: 'bar.baz',
					spacedOut: 'Bar baz',
					camelCase: 'barBaz',
					pascalCase: 'BarBaz',
					lowerCaseMerged: 'barbaz'
				}
			} );

			expect( result.package ).to.deep.equal( result.plugin );
		} );

		it( 'returns correct package names for package names with dash', () => {
			const result = getPackageNameFormats( '@foo/ckeditor5-bar-baz', undefined );

			expect( result ).to.deep.equal( {
				package: {
					raw: 'bar-baz',
					spacedOut: 'Bar baz',
					camelCase: 'barBaz',
					pascalCase: 'BarBaz',
					lowerCaseMerged: 'barbaz'
				},
				plugin: {
					raw: 'bar-baz',
					spacedOut: 'Bar baz',
					camelCase: 'barBaz',
					pascalCase: 'BarBaz',
					lowerCaseMerged: 'barbaz'
				}
			} );

			expect( result.package ).to.deep.equal( result.plugin );
		} );

		it( 'returns correct package names for package names with underscore', () => {
			const result = getPackageNameFormats( '@foo/ckeditor5-bar_baz', undefined );

			expect( result ).to.deep.equal( {
				package: {
					raw: 'bar_baz',
					spacedOut: 'Bar baz',
					camelCase: 'barBaz',
					pascalCase: 'BarBaz',
					lowerCaseMerged: 'barbaz'
				},
				plugin: {
					raw: 'bar_baz',
					spacedOut: 'Bar baz',
					camelCase: 'barBaz',
					pascalCase: 'BarBaz',
					lowerCaseMerged: 'barbaz'
				}
			} );

			expect( result.package ).to.deep.equal( result.plugin );
		} );

		it( 'returns correct package names for package names with numbers', () => {
			const result = getPackageNameFormats( '@foo/ckeditor5-bar99baz', undefined );

			expect( result ).to.deep.equal( {
				package: {
					raw: 'bar99baz',
					spacedOut: 'Bar 99 baz',
					camelCase: 'bar99Baz',
					pascalCase: 'Bar99Baz',
					lowerCaseMerged: 'bar99baz'
				},
				plugin: {
					raw: 'bar99baz',
					spacedOut: 'Bar 99 baz',
					camelCase: 'bar99Baz',
					pascalCase: 'Bar99Baz',
					lowerCaseMerged: 'bar99baz'
				}
			} );

			expect( result.package ).to.deep.equal( result.plugin );
		} );

		it( 'returns correct package names for package names with complex combinations', () => {
			const result = getPackageNameFormats( '@foo/ckeditor5-bar-1.2baz__33baw', undefined );

			expect( result ).to.deep.equal( {
				package: {
					raw: 'bar-1.2baz__33baw',
					spacedOut: 'Bar 1 2 baz 33 baw',
					camelCase: 'bar12Baz33Baw',
					pascalCase: 'Bar12Baz33Baw',
					lowerCaseMerged: 'bar12baz33baw'
				},
				plugin: {
					raw: 'bar-1.2baz__33baw',
					spacedOut: 'Bar 1 2 baz 33 baw',
					camelCase: 'bar12Baz33Baw',
					pascalCase: 'Bar12Baz33Baw',
					lowerCaseMerged: 'bar12baz33baw'
				}
			} );

			expect( result.package ).to.deep.equal( result.plugin );
		} );
	} );

	describe( 'with custom plugin name', () => {
		it( 'returns correct package names for single word package names', () => {
			const result = getPackageNameFormats( '@foo/ckeditor5-xyz', 'Bar' );

			expect( result ).to.deep.equal( {
				package: {
					raw: 'xyz',
					spacedOut: 'Xyz',
					camelCase: 'xyz',
					pascalCase: 'Xyz',
					lowerCaseMerged: 'xyz'
				},
				plugin: {
					raw: 'Bar',
					spacedOut: 'Bar',
					camelCase: 'bar',
					pascalCase: 'Bar',
					lowerCaseMerged: 'bar'
				}
			} );

			expect( result.package ).to.not.deep.equal( result.plugin );
		} );

		it( 'returns correct package names for a two word package name', () => {
			const result = getPackageNameFormats( '@foo/ckeditor5-xyz', 'BarBaz' );

			expect( result ).to.deep.equal( {
				package: {
					raw: 'xyz',
					spacedOut: 'Xyz',
					camelCase: 'xyz',
					pascalCase: 'Xyz',
					lowerCaseMerged: 'xyz'
				},
				plugin: {
					raw: 'BarBaz',
					spacedOut: 'Bar baz',
					camelCase: 'barBaz',
					pascalCase: 'BarBaz',
					lowerCaseMerged: 'barbaz'
				}
			} );

			expect( result.package ).to.not.deep.equal( result.plugin );
		} );

		it( 'returns correct package names for a three word package name', () => {
			const result = getPackageNameFormats( '@foo/ckeditor5-xyz', 'BarBazBaw' );

			expect( result ).to.deep.equal( {
				package: {
					raw: 'xyz',
					spacedOut: 'Xyz',
					camelCase: 'xyz',
					pascalCase: 'Xyz',
					lowerCaseMerged: 'xyz'
				},
				plugin: {
					raw: 'BarBazBaw',
					spacedOut: 'Bar baz baw',
					camelCase: 'barBazBaw',
					pascalCase: 'BarBazBaw',
					lowerCaseMerged: 'barbazbaw'
				}
			} );

			expect( result.package ).to.not.deep.equal( result.plugin );
		} );

		it( 'returns correct package names for a package name with numbers', () => {
			const result = getPackageNameFormats( '@foo/ckeditor5-xyz', 'Bar1baz22Baw' );

			expect( result ).to.deep.equal( {
				package: {
					raw: 'xyz',
					spacedOut: 'Xyz',
					camelCase: 'xyz',
					pascalCase: 'Xyz',
					lowerCaseMerged: 'xyz'
				},
				plugin: {
					raw: 'Bar1baz22Baw',
					spacedOut: 'Bar 1 baz 22 baw',
					camelCase: 'bar1Baz22Baw',
					pascalCase: 'Bar1Baz22Baw',
					lowerCaseMerged: 'bar1baz22baw'
				}
			} );

			expect( result.package ).to.not.deep.equal( result.plugin );
		} );
	} );
} );

