/**
 * @license Copyright (c) 2020-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'fs-extra';
import getThemePath from '../../lib/utils/get-theme-path.js';

vi.mock( 'path', () => ( {
	default: {
		join: ( ...chunks ) => chunks.join( '/' ).replace( '/./', '/' )
	}
} ) );
vi.mock( 'fs-extra' );

describe( 'lib/utils/get-theme-path', () => {
	beforeEach( () => {
		vi.mocked( fs.readJsonSync ).mockImplementation( filePath => {
			if ( filePath === '/process/cwd/node_modules/@ckeditor/ckeditor5-theme-lark/package.json' ) {
				return {
					name: '@ckeditor/ckeditor5-theme-lark',
					main: './theme/theme.css'
				};
			}
		} );
	} );

	it( 'should be a function', () => {
		expect( getThemePath ).toBeTypeOf( 'function' );
	} );

	it( 'returns an absolute path to an entry file of the "@ckeditor/ckeditor5-theme-lark" package', () => {
		expect( getThemePath( '/process/cwd' ) ).toEqual( '/process/cwd/node_modules/@ckeditor/ckeditor5-theme-lark/theme/theme.css' );
	} );
} );
