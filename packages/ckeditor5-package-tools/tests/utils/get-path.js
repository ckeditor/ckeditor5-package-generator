/**
 * @license Copyright (c) 2020-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { describe, it, expect, vi } from 'vitest';
import module from 'node:module';
import { getThemePath, getCorePath, getMainManifestPath } from '../../lib/utils/get-path.js';

describe( 'lib/utils/get-path', () => {
	describe( 'getThemePath', () => {
		it( 'should be a function', () => {
			expect( getThemePath ).toBeTypeOf( 'function' );
		} );

		it( 'returns an absolute path to an entry file of the "@ckeditor/ckeditor5-theme-lark" package', () => {
			const mockPath = '/process/cwd/node_modules/@ckeditor/ckeditor5-theme-lark/theme/theme.css';
			const resolveSpy = vi.fn().mockReturnValue( mockPath );

			vi
				.spyOn( module, 'createRequire' )
				.mockImplementationOnce( () => ( {
					resolve: resolveSpy
				} ) );

			const cwd = '/process/cwd';

			expect( getThemePath( cwd ) ).toEqual( mockPath );
			expect( resolveSpy ).toHaveBeenCalledExactlyOnceWith(
				expect.anything(),
				expect.objectContaining( { paths: [ cwd ] } )
			);
		} );
	} );

	describe( 'getCorePath', () => {
		it( 'should be a function', () => {
			expect( getCorePath ).toBeTypeOf( 'function' );
		} );

		it( 'returns relative path to the `@ckeditor/ckeditor5-core` package.', () => {
			vi
				.spyOn( module, 'createRequire' )
				.mockImplementationOnce( () => ( {
					resolve: () => 'node_modules/@ckeditor/ckeditor5-core/package.json'
				} ) );

			expect( getCorePath() ).toEqual( 'node_modules/@ckeditor/ckeditor5-core' );
		} );
	} );

	describe( 'getMainManifestPath', () => {
		it( 'should be a function', () => {
			expect( getMainManifestPath ).toBeTypeOf( 'function' );
		} );

		it( 'returns relative path to the `@ckeditor/ckeditor5-core` package.', () => {
			const mockPath = 'ckeditor5/build/ckeditor5-dll.manifest.json';

			vi
				.spyOn( module, 'createRequire' )
				.mockImplementationOnce( () => ( {
					resolve: () => mockPath
				} ) );

			expect( getMainManifestPath() ).toEqual( mockPath );
		} );
	} );
} );
