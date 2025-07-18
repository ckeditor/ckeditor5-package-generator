/**
 * @license Copyright (c) 2020-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import path from 'path';
import { styles } from '@ckeditor/ckeditor5-dev-utils';
import { getThemePath } from '../../lib/utils/get-path.js';
import * as webpackUtils from '../../lib/utils/webpack-utils.js';

vi.mock( 'path', () => ( {
	default: {
		join: vi.fn( ( ...chunks ) => chunks.join( '/' ) ),
		resolve: vi.fn( ( ...chunks ) => chunks.join( '/' ) )
	}
} ) );
vi.mock( '@ckeditor/ckeditor5-dev-utils' );
vi.mock( '../../lib/utils/get-path.js' );

describe( 'lib/utils/webpack-utils', () => {
	const cwd = '/process/cwd';
	const themePath = cwd + '/node_modules/@ckeditor/ckeditor5-theme/theme/theme.css';

	beforeEach( () => {
		vi.mocked( styles.getPostCssConfig ).mockReturnValue( { foo: true } );
		vi.mocked( getThemePath ).mockReturnValue( themePath );
	} );

	describe( 'loaderDefinitions', () => {
		describe( 'raw()', () => {
			let loader;

			beforeEach( () => {
				loader = webpackUtils.loaderDefinitions.raw();
			} );

			it( 'uses "raw-loader" for providing files', () => {
				expect( loader.loader ).toEqual( 'raw-loader' );
			} );

			it( 'loads paths that end with the ".svg" suffix', () => {
				expect( '/Users/ckeditor/ckeditor5-foo/theme/icons/ckeditor.svg' ).toMatch( loader.test );
				expect( 'C:\\Users\\ckeditor\\ckeditor5-foo\\theme\\icons\\ckeditor.svg' ).toMatch( loader.test );

				expect( '/Users/ckeditor/ckeditor5-foo/theme/icons/ckeditor.css' ).not.toMatch( loader.test );
				expect( 'C:\\Users\\ckeditor\\ckeditor5-foo\\theme\\icons\\ckeditor.css' ).not.toMatch( loader.test );
			} );

			it( 'loads paths that end with the ".txt" suffix', () => {
				expect( '/Users/ckeditor/ckeditor5-foo/assets/ckeditor.txt' ).toMatch( loader.test );
				expect( 'C:\\Users\\ckeditor\\ckeditor5-foo\\assets\\ckeditor.txt' ).toMatch( loader.test );

				expect( '/Users/ckeditor/ckeditor5-foo/theme/icons/ckeditor.css' ).not.toMatch( loader.test );
				expect( 'C:\\Users\\ckeditor\\ckeditor5-foo\\theme\\icons\\ckeditor.css' ).not.toMatch( loader.test );
			} );

			it( 'loads paths that end with the ".html" suffix', () => {
				expect( '/Users/ckeditor/ckeditor5-foo/assets/ckeditor.html' ).toMatch( loader.test );
				expect( 'C:\\Users\\ckeditor\\ckeditor5-foo\\assets\\ckeditor.html' ).toMatch( loader.test );

				expect( '/Users/ckeditor/ckeditor5-foo/theme/icons/ckeditor.css' ).not.toMatch( loader.test );
				expect( 'C:\\Users\\ckeditor\\ckeditor5-foo\\theme\\icons\\ckeditor.css' ).not.toMatch( loader.test );
			} );

			it( 'loads paths that end with the ".rtf" suffix', () => {
				expect( '/Users/ckeditor/ckeditor5-foo/assets/ckeditor.rtf' ).toMatch( loader.test );
				expect( 'C:\\Users\\ckeditor\\ckeditor5-foo\\assets\\ckeditor.rtf' ).toMatch( loader.test );

				expect( '/Users/ckeditor/ckeditor5-foo/theme/icons/ckeditor.css' ).not.toMatch( loader.test );
				expect( 'C:\\Users\\ckeditor\\ckeditor5-foo\\theme\\icons\\ckeditor.css' ).not.toMatch( loader.test );
			} );
		} );

		describe( 'rawWithQuery()', () => {
			let loader;

			beforeEach( () => {
				loader = webpackUtils.loaderDefinitions.rawWithQuery();
			} );

			it( 'uses "raw-loader" for providing files', () => {
				expect( loader.loader ).toEqual( 'raw-loader' );
			} );

			it( 'loads paths that end with the "?raw" suffix', () => {
				expect( '/Users/ckeditor/ckeditor5-foo/assets/ckeditor.css?raw' ).toMatch( loader.resourceQuery );
				expect( 'C:\\Users\\ckeditor\\ckeditor5-foo\\assets\\ckeditor.css?raw' ).toMatch( loader.resourceQuery );

				expect( '/Users/ckeditor/ckeditor5-foo/theme/icons/ckeditor.css' ).not.toMatch( loader.resourceQuery );
				expect( 'C:\\Users\\ckeditor\\ckeditor5-foo\\theme\\icons\\ckeditor.css' ).not.toMatch( loader.resourceQuery );
			} );
		} );

		describe( 'typescript()', () => {
			let loader;

			beforeEach( () => {
				loader = webpackUtils.loaderDefinitions.typescript( cwd );
			} );

			it( 'uses "ts-loader" for providing files', () => {
				expect( loader.loader ).toEqual( 'ts-loader' );
			} );

			it( 'loads paths that end with the ".ts" suffix', () => {
				expect( '/Users/ckeditor/ckeditor5-foo/assets/ckeditor.ts' ).toMatch( loader.test );
				expect( 'C:\\Users\\ckeditor\\ckeditor5-foo\\assets\\ckeditor.ts' ).toMatch( loader.test );

				expect( '/Users/ckeditor/ckeditor5-foo/assets/ckeditor.js' ).not.toMatch( loader.test );
				expect( 'C:\\Users\\ckeditor\\ckeditor5-foo\\assets\\ckeditor.js' ).not.toMatch( loader.test );
			} );

			it( 'passes default values to loader options', () => {
				expect( loader.options ).toBeTypeOf( 'object' );
				expect( loader.options ).toHaveProperty( 'configFile', '/process/cwd/tsconfig.json' );
			} );

			it( 'allows defining custom tsconfig file', () => {
				loader = webpackUtils.loaderDefinitions.typescript( cwd, 'tsconfig.test.json' );

				expect( loader.options ).toBeTypeOf( 'object' );
				expect( loader.options ).toHaveProperty( 'configFile', '/process/cwd/tsconfig.test.json' );
			} );
		} );

		describe( 'styles()', () => {
			let loader;

			beforeEach( () => {
				loader = webpackUtils.loaderDefinitions.styles( cwd );

				expect( loader ).toBeTypeOf( 'object' );
				expect( loader.use ).toHaveLength( 3 );
			} );

			// Webpack processes loaders from the bottom, to the top. Hence, "postcss-loader" will be called as the first one.
			it( 'uses "postcss-loader" for processing CKEditor 5 assets', () => {
				expect( getThemePath ).toHaveBeenCalledTimes( 1 );
				expect( getThemePath ).toHaveBeenCalledWith( '/process/cwd' );

				expect( styles.getPostCssConfig ).toHaveBeenCalledTimes( 1 );
				expect( styles.getPostCssConfig ).toHaveBeenCalledWith( {
					minify: true,
					themeImporter: { themePath }
				} );

				const postcssLoader = loader.use[ 2 ];

				expect( postcssLoader ).toBeTypeOf( 'object' );

				expect( postcssLoader ).toHaveProperty( 'loader' );
				expect( postcssLoader.loader ).toEqual( 'postcss-loader' );

				expect( postcssLoader ).toHaveProperty( 'options' );
				expect( postcssLoader.options ).toEqual( {
					postcssOptions: { foo: true }
				} );
			} );

			it( 'uses "css-loader" to resolve imports from JS files', () => {
				const cssLoader = loader.use[ 1 ];

				expect( cssLoader ).toEqual( 'css-loader' );
			} );

			it( 'uses "style-loader" for injecting processed styles on a page', () => {
				const styleLoader = loader.use[ 0 ];

				expect( styleLoader ).toHaveProperty( 'loader' );
				expect( styleLoader.loader ).toEqual( 'style-loader' );

				expect( styleLoader ).toHaveProperty( 'options' );
				expect( styleLoader.options ).toEqual( {
					injectType: 'singletonStyleTag',
					attributes: {
						'data-cke': true
					}
				} );
			} );

			it( 'loads paths that end with the ".css" suffix', () => {
				expect( '/Users/ckeditor/ckeditor5-foo/theme/icons/ckeditor.css' ).toMatch( loader.test );
				expect( 'C:\\Users\\ckeditor\\ckeditor5-foo\\theme\\icons\\ckeditor.css' ).toMatch( loader.test );

				expect( '/Users/ckeditor/ckeditor5-foo/theme/icons/ckeditor.html' ).not.toMatch( loader.test );
				expect( 'C:\\Users\\ckeditor\\ckeditor5-foo\\theme\\icons\\ckeditor.html' ).not.toMatch( loader.test );
			} );
		} );
	} );

	describe( 'getModuleResolutionPaths()', () => {
		let moduleResolutionPaths;

		beforeEach( () => {
			moduleResolutionPaths = webpackUtils.getModuleResolutionPaths( 'root/directory' );
		} );

		it( 'loads "node_modules" directly', () => {
			expect( moduleResolutionPaths[ 0 ] ).toEqual( 'node_modules' );
		} );

		it( 'loads "node_modules" from root of the "ckeditor5-package-tools" package', () => {
			expect( moduleResolutionPaths[ 1 ] ).toEqual( 'root/directory/node_modules' );

			expect( path.resolve ).toHaveBeenCalledTimes( 1 );
			expect( path.resolve ).toHaveBeenCalledWith( 'root/directory', 'node_modules' );
		} );
	} );
} );
