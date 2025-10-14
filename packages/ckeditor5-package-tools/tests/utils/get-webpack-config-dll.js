/**
 * @license Copyright (c) 2020-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import upath from 'upath';
import fs from 'fs-extra';
import { CKEditorTranslationsPlugin } from '@ckeditor/ckeditor5-dev-translations';
import { loaderDefinitions, getModuleResolutionPaths } from '../../lib/utils/webpack-utils.js';
import getWebpackConfigDll from '../../lib/utils/get-webpack-config-dll.js';

const stubs = vi.hoisted( () => {
	return {
		dllReferencePlugin: vi.fn(),
		providePlugin: vi.fn()
	};
} );

vi.mock( 'upath', async importOriginal => {
	const mod = await importOriginal();

	return {
		...mod,
		default: {
			...mod.default,
			dirname: () => '/packages/ckeditor5-package-tools/lib/utils'
		}
	};
} );
vi.mock( 'webpack', () => ( {
	default: {
		DllReferencePlugin: class {
			constructor( ...args ) {
				stubs.dllReferencePlugin( ...args );
			}
		},
		ProvidePlugin: class {
			constructor( ...args ) {
				stubs.providePlugin( ...args );
			}
		}
	}
} ) );
vi.mock( 'module', () => ( {
	default: {
		createRequire: () => ( { resolve: () => upath.resolve( process.cwd(), 'node_modules/@ckeditor/ckeditor5-core/package.json' ) } )
	}
} ) );
vi.mock( 'fs-extra' );
vi.mock( 'terser-webpack-plugin' );
vi.mock( '@ckeditor/ckeditor5-dev-translations' );
vi.mock( '../../lib/utils/webpack-utils.js' );

describe( 'lib/utils/get-webpack-config-dll', () => {
	const cwd = '/process/cwd';

	beforeEach( () => {
		vi.mocked( fs.readJsonSync ).mockImplementation( filePath => {
			if ( filePath === '/process/cwd/node_modules/ckeditor5/build/ckeditor5-dll.manifest.json' ) {
				return {
					name: 'CKEditor5.dll',
					content: {}
				};
			}

			if ( filePath === '/process/cwd/package.json' ) {
				return {
					name: '@ckeditor/ckeditor5-foo'
				};
			}
		} );

		vi.mocked( fs.readdirSync ).mockImplementation( dirPath => {
			if ( dirPath === '/process/cwd/src' ) {
				return [
					'index.js',
					'myplugin.js'
				];
			}
		} );

		vi.mocked( fs.existsSync ).mockReturnValue( false );

		vi.mocked( loaderDefinitions.raw ).mockReturnValue( 'raw-loader' );
		vi.mocked( loaderDefinitions.rawWithQuery ).mockReturnValue( 'raw-loader?query=true' );
		vi.mocked( loaderDefinitions.typescript ).mockReturnValue( 'typescript-loader' );
		vi.mocked( loaderDefinitions.styles ).mockReturnValue( 'styles-loader' );
		vi.mocked( loaderDefinitions.js ).mockReturnValue( 'js-loader' );

		vi.mocked( getModuleResolutionPaths ).mockReturnValue( 'loader-resolution-paths' );
	} );

	it( 'should be a function', () => {
		expect( getWebpackConfigDll ).toBeTypeOf( 'function' );
	} );

	it( 'uses correct loaders', () => {
		const config = getWebpackConfigDll( { cwd } );

		expect( config.module.rules ).toEqual( expect.arrayContaining( [
			expect.objectContaining( ( {
				oneOf: [
					'raw-loader',
					'raw-loader?query=true',
					'styles-loader',
					'typescript-loader'
				]
			} ) )
		] ) );
	} );

	it( 'adds the ESM JS rule as a separate top-level rule', () => {
		const config = getWebpackConfigDll( { cwd } );

		expect( loaderDefinitions.js ).toHaveBeenCalledTimes( 1 );
		expect( config.module.rules ).toEqual( expect.arrayContaining( [ 'js-loader' ] ) );
	} );

	it( 'passes the "cwd" directory to TypeScript loader', () => {
		getWebpackConfigDll( { cwd } );

		expect( loaderDefinitions.typescript ).toHaveBeenCalledTimes( 1 );
		expect( loaderDefinitions.typescript ).toHaveBeenCalledWith( cwd );
	} );

	it( 'passes the "cwd" directory to Styles loader', () => {
		getWebpackConfigDll( { cwd } );

		expect( loaderDefinitions.styles ).toHaveBeenCalledTimes( 1 );
		expect( loaderDefinitions.styles ).toHaveBeenCalledWith( cwd );
	} );

	it( 'resolves correct file extensions', () => {
		const config = getWebpackConfigDll( { cwd } );

		expect( config.resolve.extensions ).toEqual( [ '.ts', '...' ] );
	} );

	it( 'resolves correct module paths', () => {
		const config = getWebpackConfigDll( { cwd } );

		expect( config.resolve ).toHaveProperty( 'modules', 'loader-resolution-paths' );
	} );

	it( 'resolves correct loader paths', () => {
		const config = getWebpackConfigDll( { cwd } );

		expect( config.resolveLoader ).toHaveProperty( 'modules', 'loader-resolution-paths' );
	} );

	it( 'calls "getModuleResolutionPaths" with correct arguments', () => {
		getWebpackConfigDll( { cwd } );

		expect( getModuleResolutionPaths ).toHaveBeenCalledTimes( 1 );

		const [ firstArgument ] = getModuleResolutionPaths.mock.calls[ 0 ];

		expect( firstArgument.endsWith( '/packages/ckeditor5-package-tools' ) ).toEqual( true );
	} );

	it( 'processes the "index.js" file', () => {
		const config = getWebpackConfigDll( { cwd } );

		expect( config.entry ).toEqual( '/process/cwd/src/index.js' );
		expect( config.output ).toEqual( {
			path: '/process/cwd/build',
			filename: 'foo.js',
			libraryTarget: 'window',
			library: [ 'CKEditor5', 'foo' ]
		} );
	} );

	it( 'processes the "index.ts" file', () => {
		vi.mocked( fs.readdirSync ).mockImplementation( dirPath => {
			if ( dirPath === '/process/cwd/src' ) {
				return [
					'index.ts',
					'myplugin.ts'
				];
			}
		} );

		const config = getWebpackConfigDll( { cwd } );

		expect( config.entry ).toEqual( '/process/cwd/src/index.ts' );
		expect( config.output ).toEqual( {
			path: '/process/cwd/build',
			filename: 'foo.js',
			libraryTarget: 'window',
			library: [ 'CKEditor5', 'foo' ]
		} );
	} );

	it( 'loads "process" polyfill for webpack 5', () => {
		getWebpackConfigDll( { cwd } );

		expect( stubs.providePlugin ).toHaveBeenCalledTimes( 1 );
		expect( stubs.providePlugin ).toHaveBeenCalledWith( expect.objectContaining( {
			process: 'process/browser'
		} ) );
	} );

	it( 'loads "Buffer" polyfill for webpack 5', () => {
		getWebpackConfigDll( { cwd } );

		expect( stubs.providePlugin ).toHaveBeenCalledTimes( 1 );
		expect( stubs.providePlugin ).toHaveBeenCalledWith( expect.objectContaining( {
			Buffer: [ 'buffer', 'Buffer' ]
		} ) );
	} );

	it( 'allows watching source files', () => {
		const config = getWebpackConfigDll( { cwd, watch: true } );

		expect( config.watch ).toEqual( true );
	} );

	it( 'produces translation files based on "*.po" files', () => {
		vi.mocked( fs.existsSync ).mockReturnValue( true );

		getWebpackConfigDll( { cwd } );

		expect( fs.existsSync ).toHaveBeenCalledTimes( 1 );
		expect( fs.existsSync ).toHaveBeenCalledWith( '/process/cwd/lang/translations/en.po' );

		expect( CKEditorTranslationsPlugin ).toHaveBeenCalledTimes( 1 );
		expect( CKEditorTranslationsPlugin ).toHaveBeenCalledWith( {
			additionalLanguages: 'all',
			language: 'en',
			skipPluralFormFunction: true,
			sourceFilesPattern: /^src[/\\].+\.[jt]s$/
		} );
	} );

	describe( 'verifying exposed DLL names', () => {
		it( 'returns "foo" for a window key and a file name for the "ckeditor5-foo" package', () => {
			const readJsonSyncMock = vi.mocked( fs.readJsonSync ).getMockImplementation();

			vi.mocked( fs.readJsonSync ).mockImplementation( filePath => {
				if ( filePath === '/process/cwd/package.json' ) {
					return {
						name: 'ckeditor5-foo'
					};
				}

				return readJsonSyncMock( filePath );
			} );

			const webpackConfig = getWebpackConfigDll( { cwd } );

			expect( webpackConfig.output.filename ).toEqual( 'foo.js' );
			expect( webpackConfig.output.library ).toEqual( [ 'CKEditor5', 'foo' ] );
		} );

		it( 'returns "foo" for a window key and a file name for the "@ckeditor/ckeditor5-foo" package', () => {
			const webpackConfig = getWebpackConfigDll( { cwd } );

			expect( webpackConfig.output.filename ).toEqual( 'foo.js' );
			expect( webpackConfig.output.library ).toEqual( [ 'CKEditor5', 'foo' ] );
		} );

		it( 'returns "fooBar" for a window key and "foo-bar" a file name for the "@ckeditor/ckeditor5-foo-bar" package', () => {
			const readJsonSyncMock = vi.mocked( fs.readJsonSync ).getMockImplementation();

			vi.mocked( fs.readJsonSync ).mockImplementation( filePath => {
				if ( filePath === '/process/cwd/package.json' ) {
					return {
						name: '@ckeditor/ckeditor5-foo-bar'
					};
				}

				return readJsonSyncMock( filePath );
			} );

			const webpackConfig = getWebpackConfigDll( { cwd } );

			expect( webpackConfig.output.filename ).toEqual( 'foo-bar.js' );
			expect( webpackConfig.output.library ).toEqual( [ 'CKEditor5', 'fooBar' ] );
		} );
	} );
} );
