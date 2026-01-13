/**
 * @license Copyright (c) 2020-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { describe, it, expect } from 'vitest';
import getPackageNameFormats from '../../lib/utils/get-package-name-formats.js';

describe( 'lib/utils/get-package-name-formats', () => {
	it( 'should be a function', () => {
		expect( getPackageNameFormats ).toBeTypeOf( 'function' );
	} );

	describe( 'without custom plugin name', () => {
		it( 'returns correct package names for single word package names', () => {
			const result = getPackageNameFormats( '@foo/ckeditor5-bar', undefined );

			expect( result ).toEqual( {
				package: {
					raw: 'bar',
					fullName: '@foo/ckeditor5-bar',
					spacedOut: 'Bar',
					camelCase: 'bar',
					pascalCase: 'Bar',
					lowerCaseMerged: 'bar'
				},
				plugin: {
					raw: 'bar',
					fullName: '@foo/ckeditor5-bar',
					spacedOut: 'Bar',
					camelCase: 'bar',
					pascalCase: 'Bar',
					lowerCaseMerged: 'bar'
				}
			} );

			expect( result.package ).toEqual( result.plugin );
		} );

		it( 'returns correct package names for package names with dot', () => {
			const result = getPackageNameFormats( '@foo/ckeditor5-bar.baz', undefined );

			expect( result ).toEqual( {
				package: {
					raw: 'bar.baz',
					fullName: '@foo/ckeditor5-bar.baz',
					spacedOut: 'Bar baz',
					camelCase: 'barBaz',
					pascalCase: 'BarBaz',
					lowerCaseMerged: 'barbaz'
				},
				plugin: {
					raw: 'bar.baz',
					fullName: '@foo/ckeditor5-bar.baz',
					spacedOut: 'Bar baz',
					camelCase: 'barBaz',
					pascalCase: 'BarBaz',
					lowerCaseMerged: 'barbaz'
				}
			} );

			expect( result.package ).toEqual( result.plugin );
		} );

		it( 'returns correct package names for package names with dash', () => {
			const result = getPackageNameFormats( '@foo/ckeditor5-bar-baz', undefined );

			expect( result ).toEqual( {
				package: {
					raw: 'bar-baz',
					fullName: '@foo/ckeditor5-bar-baz',
					spacedOut: 'Bar baz',
					camelCase: 'barBaz',
					pascalCase: 'BarBaz',
					lowerCaseMerged: 'barbaz'
				},
				plugin: {
					raw: 'bar-baz',
					fullName: '@foo/ckeditor5-bar-baz',
					spacedOut: 'Bar baz',
					camelCase: 'barBaz',
					pascalCase: 'BarBaz',
					lowerCaseMerged: 'barbaz'
				}
			} );

			expect( result.package ).toEqual( result.plugin );
		} );

		it( 'returns correct package names for package names with underscore', () => {
			const result = getPackageNameFormats( '@foo/ckeditor5-bar_baz', undefined );

			expect( result ).toEqual( {
				package: {
					raw: 'bar_baz',
					fullName: '@foo/ckeditor5-bar_baz',
					spacedOut: 'Bar baz',
					camelCase: 'barBaz',
					pascalCase: 'BarBaz',
					lowerCaseMerged: 'barbaz'
				},
				plugin: {
					raw: 'bar_baz',
					fullName: '@foo/ckeditor5-bar_baz',
					spacedOut: 'Bar baz',
					camelCase: 'barBaz',
					pascalCase: 'BarBaz',
					lowerCaseMerged: 'barbaz'
				}
			} );

			expect( result.package ).toEqual( result.plugin );
		} );

		it( 'returns correct package names for package names with numbers', () => {
			const result = getPackageNameFormats( '@foo/ckeditor5-bar99baz', undefined );

			expect( result ).toEqual( {
				package: {
					raw: 'bar99baz',
					fullName: '@foo/ckeditor5-bar99baz',
					spacedOut: 'Bar 99 baz',
					camelCase: 'bar99Baz',
					pascalCase: 'Bar99Baz',
					lowerCaseMerged: 'bar99baz'
				},
				plugin: {
					raw: 'bar99baz',
					fullName: '@foo/ckeditor5-bar99baz',
					spacedOut: 'Bar 99 baz',
					camelCase: 'bar99Baz',
					pascalCase: 'Bar99Baz',
					lowerCaseMerged: 'bar99baz'
				}
			} );

			expect( result.package ).toEqual( result.plugin );
		} );

		it( 'returns correct package names for package names with complex combinations', () => {
			const result = getPackageNameFormats( '@foo/ckeditor5-bar-1.2baz__33baw', undefined );

			expect( result ).toEqual( {
				package: {
					raw: 'bar-1.2baz__33baw',
					fullName: '@foo/ckeditor5-bar-1.2baz__33baw',
					spacedOut: 'Bar 1 2 baz 33 baw',
					camelCase: 'bar12Baz33Baw',
					pascalCase: 'Bar12Baz33Baw',
					lowerCaseMerged: 'bar12baz33baw'
				},
				plugin: {
					raw: 'bar-1.2baz__33baw',
					fullName: '@foo/ckeditor5-bar-1.2baz__33baw',
					spacedOut: 'Bar 1 2 baz 33 baw',
					camelCase: 'bar12Baz33Baw',
					pascalCase: 'Bar12Baz33Baw',
					lowerCaseMerged: 'bar12baz33baw'
				}
			} );

			expect( result.package ).toEqual( result.plugin );
		} );
	} );

	describe( 'with custom plugin name', () => {
		it( 'returns correct package names for single word package names', () => {
			const result = getPackageNameFormats( '@foo/ckeditor5-xyz', 'Bar' );

			expect( result ).toEqual( {
				package: {
					raw: 'xyz',
					fullName: '@foo/ckeditor5-xyz',
					spacedOut: 'Xyz',
					camelCase: 'xyz',
					pascalCase: 'Xyz',
					lowerCaseMerged: 'xyz'
				},
				plugin: {
					raw: 'Bar',
					fullName: 'Bar',
					spacedOut: 'Bar',
					camelCase: 'bar',
					pascalCase: 'Bar',
					lowerCaseMerged: 'bar'
				}
			} );

			expect( result.package ).not.toEqual( result.plugin );
		} );

		it( 'returns correct package names for a two word package name', () => {
			const result = getPackageNameFormats( '@foo/ckeditor5-xyz', 'BarBaz' );

			expect( result ).toEqual( {
				package: {
					raw: 'xyz',
					fullName: '@foo/ckeditor5-xyz',
					spacedOut: 'Xyz',
					camelCase: 'xyz',
					pascalCase: 'Xyz',
					lowerCaseMerged: 'xyz'
				},
				plugin: {
					raw: 'BarBaz',
					fullName: 'BarBaz',
					spacedOut: 'Bar baz',
					camelCase: 'barBaz',
					pascalCase: 'BarBaz',
					lowerCaseMerged: 'barbaz'
				}
			} );

			expect( result.package ).not.toEqual( result.plugin );
		} );

		it( 'returns correct package names for a three word package name', () => {
			const result = getPackageNameFormats( '@foo/ckeditor5-xyz', 'BarBazBaw' );

			expect( result ).toEqual( {
				package: {
					raw: 'xyz',
					fullName: '@foo/ckeditor5-xyz',
					spacedOut: 'Xyz',
					camelCase: 'xyz',
					pascalCase: 'Xyz',
					lowerCaseMerged: 'xyz'
				},
				plugin: {
					raw: 'BarBazBaw',
					fullName: 'BarBazBaw',
					spacedOut: 'Bar baz baw',
					camelCase: 'barBazBaw',
					pascalCase: 'BarBazBaw',
					lowerCaseMerged: 'barbazbaw'
				}
			} );

			expect( result.package ).not.toEqual( result.plugin );
		} );

		it( 'returns correct package names for a package name with numbers', () => {
			const result = getPackageNameFormats( '@foo/ckeditor5-xyz', 'Bar1baz22Baw' );

			expect( result ).toEqual( {
				package: {
					raw: 'xyz',
					fullName: '@foo/ckeditor5-xyz',
					spacedOut: 'Xyz',
					camelCase: 'xyz',
					pascalCase: 'Xyz',
					lowerCaseMerged: 'xyz'
				},
				plugin: {
					raw: 'Bar1baz22Baw',
					fullName: 'Bar1baz22Baw',
					spacedOut: 'Bar 1 baz 22 baw',
					camelCase: 'bar1Baz22Baw',
					pascalCase: 'Bar1Baz22Baw',
					lowerCaseMerged: 'bar1baz22baw'
				}
			} );

			expect( result.package ).not.toEqual( result.plugin );
		} );
	} );
} );

