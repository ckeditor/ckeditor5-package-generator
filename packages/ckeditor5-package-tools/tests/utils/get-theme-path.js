/**
 * @license Copyright (c) 2020-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { describe, it, expect, vi } from 'vitest';
import module from 'module';
import getThemePath from '../../lib/utils/get-theme-path.js';

const MOCK_PATH = '/process/cwd/node_modules/@ckeditor/ckeditor5-theme-lark/theme/theme.css';

describe( 'lib/utils/get-theme-path', () => {
	it( 'should be a function', () => {
		expect( getThemePath ).toBeTypeOf( 'function' );
	} );

	it( 'returns an absolute path to an entry file of the "@ckeditor/ckeditor5-theme-lark" package', () => {
		const resolveSpy = vi.fn().mockReturnValue( MOCK_PATH );

		vi
			.spyOn( module, 'createRequire' )
			.mockImplementationOnce( () => ( {
				resolve: resolveSpy
			} ) );

		const cwd = '/process/cwd';

		expect( getThemePath( cwd ) ).toEqual( MOCK_PATH );
		expect( resolveSpy ).toHaveBeenCalledExactlyOnceWith(
			expect.anything(),
			expect.objectContaining( { paths: [ cwd ] } )
		);
	} );
} );
