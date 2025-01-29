/**
 * @license Copyright (c) 2020-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'fs-extra';
import getThemePath from '../../lib/utils/get-theme-path.js';

vi.mock( 'path', () => ( {
	default: {
		join: ( ...chunks ) => chunks.join( '/' ).replace( '/./', '/' ),
		resolve: path => {
			const newPath = path.split( '/' );
			newPath.pop();
			return newPath.join( '/' );
		}
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

		vi.mocked( fs.existsSync ).mockImplementation( path => {
			return path.startsWith( '/process/cwd/node_modules' );
		} );
	} );

	it( 'should be a function', () => {
		expect( getThemePath ).toBeTypeOf( 'function' );
	} );

	it( 'returns an absolute path to an entry file of the "@ckeditor/ckeditor5-theme-lark" package', () => {
		expect( getThemePath( '/process/cwd' ) ).toEqual( '/process/cwd/node_modules/@ckeditor/ckeditor5-theme-lark/theme/theme.css' );
	} );

	it( 'traverses the tree to locate an absolute path to an entry file of the "@ckeditor/ckeditor5-theme-lark" package', () => {
		vi.mocked( fs.readJsonSync ).mockImplementation( filePath => {
			if ( filePath === '/monorepo/node_modules/@ckeditor/ckeditor5-theme-lark/package.json' ) {
				return {
					name: '@ckeditor/ckeditor5-theme-lark',
					main: './theme/theme.css'
				};
			}
		} );

		vi.mocked( fs.existsSync ).mockImplementation( path => {
			return path.startsWith( '/monorepo/node_modules' );
		} );

		expect( getThemePath( '/monorepo/process/cwd' ) )
			.toEqual( '/monorepo/node_modules/@ckeditor/ckeditor5-theme-lark/theme/theme.css' );
	} );
} );
