/**
 * @license Copyright (c) 2020-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'fs';
import { CKEditorTranslationsPlugin } from '@ckeditor/ckeditor5-dev-translations';
import { loaderDefinitions, getModuleResolutionPaths } from '../../lib/utils/webpack-utils.js';
import getWebpackConfigServer from '../../lib/utils/get-webpack-config-server.js';

const stubs = vi.hoisted( () => {
	return {
		definePlugin: vi.fn(),
		providePlugin: vi.fn()
	};
} );

vi.mock( 'path', () => ( {
	default: {
		dirname: () => '/packages/ckeditor5-package-tools/lib/utils',
		join: ( ...chunks ) => chunks.join( '/' )
	}
} ) );
vi.mock( 'webpack', () => ( {
	default: {
		DefinePlugin: class {
			constructor( ...args ) {
				stubs.definePlugin( ...args );
			}
		},
		ProvidePlugin: class {
			constructor( ...args ) {
				stubs.providePlugin( ...args );
			}
		}
	}
} ) );
vi.mock( 'fs' );
vi.mock( '@ckeditor/ckeditor5-dev-translations' );
vi.mock( '../../lib/utils/webpack-utils.js' );

describe( 'lib/utils/get-webpack-config-server', () => {
	const cwd = '/process/cwd';

	beforeEach( () => {
		vi.mocked( fs.readdirSync ).mockImplementation( dirPath => {
			if ( dirPath === '/process/cwd/sample' ) {
				return [
					'ckeditor.js',
					'dll.html',
					'index.html'
				];
			}
		} );

		vi.mocked( loaderDefinitions.raw ).mockReturnValue( 'raw-loader' );
		vi.mocked( loaderDefinitions.typescript ).mockReturnValue( 'typescript-loader' );
		vi.mocked( loaderDefinitions.styles ).mockReturnValue( 'styles-loader' );

		vi.mocked( getModuleResolutionPaths ).mockReturnValue( 'loader-resolution-paths' );
	} );

	it( 'should be a function', () => {
		expect( getWebpackConfigServer ).toBeTypeOf( 'function' );
	} );

	it( 'uses correct loaders', () => {
		const config = getWebpackConfigServer( { cwd } );

		expect( config.module.rules ).toEqual( [
			'raw-loader',
			'styles-loader',
			'typescript-loader'
		] );
	} );

	it( 'passes the "cwd" directory to TypeScript loader', () => {
		getWebpackConfigServer( { cwd } );

		expect( loaderDefinitions.typescript ).toHaveBeenCalledTimes( 1 );
		expect( loaderDefinitions.typescript ).toHaveBeenCalledWith( cwd );
	} );

	it( 'passes the "cwd" directory to Styles loader', () => {
		getWebpackConfigServer( { cwd } );

		expect( loaderDefinitions.styles ).toHaveBeenCalledTimes( 1 );
		expect( loaderDefinitions.styles ).toHaveBeenCalledWith( cwd );
	} );

	it( 'resolves correct file extensions', () => {
		const config = getWebpackConfigServer( { cwd } );

		expect( config.resolve.extensions ).toEqual( [ '.ts', '...' ] );
	} );

	it( 'resolves correct module paths', () => {
		const config = getWebpackConfigServer( { cwd } );

		expect( config.resolve ).toHaveProperty( 'modules', 'loader-resolution-paths' );
	} );

	it( 'resolves correct loader paths', () => {
		const config = getWebpackConfigServer( { cwd } );

		expect( config.resolveLoader ).toHaveProperty( 'modules', 'loader-resolution-paths' );
	} );

	it( 'calls "getModuleResolutionPaths" with correct arguments', () => {
		getWebpackConfigServer( { cwd } );

		expect( getModuleResolutionPaths ).toHaveBeenCalledTimes( 1 );

		const [ firstArgument ] = getModuleResolutionPaths.mock.calls[ 0 ];

		expect( firstArgument.endsWith( '/packages/ckeditor5-package-tools/lib/utils/../..' ) ).toEqual( true );
	} );

	it( 'processes the "ckeditor.js" file', () => {
		const config = getWebpackConfigServer( { cwd } );

		expect( config.entry ).toEqual( '/process/cwd/sample/ckeditor.js' );
		expect( config.output ).toEqual( {
			filename: 'ckeditor.dist.js',
			path: '/process/cwd/sample'
		} );
	} );

	it( 'processes the "ckeditor.ts" file', () => {
		vi.mocked( fs.readdirSync ).mockImplementation( dirPath => {
			if ( dirPath === '/process/cwd/sample' ) {
				return [
					'ckeditor.ts',
					'dll.html',
					'index.html'
				];
			}
		} );

		const config = getWebpackConfigServer( { cwd } );

		expect( config.entry ).toEqual( '/process/cwd/sample/ckeditor.ts' );
		expect( config.output ).toEqual( {
			filename: 'ckeditor.dist.js',
			path: '/process/cwd/sample'
		} );
	} );

	it( 'loads "process" polyfill for webpack 5', () => {
		getWebpackConfigServer( { cwd } );

		expect( stubs.providePlugin ).toHaveBeenCalledTimes( 1 );
		expect( stubs.providePlugin ).toHaveBeenCalledWith( expect.objectContaining( {
			process: 'process/browser'
		} ) );
	} );

	it( 'loads "Buffer" polyfill for webpack 5', () => {
		getWebpackConfigServer( { cwd } );

		expect( stubs.providePlugin ).toHaveBeenCalledTimes( 1 );
		expect( stubs.providePlugin ).toHaveBeenCalledWith( expect.objectContaining( {
			Buffer: [ 'buffer', 'Buffer' ]
		} ) );
	} );

	it( 'defines the configuration for an HTTP server', () => {
		const config = getWebpackConfigServer( { cwd } );

		expect( config.devServer ).toEqual( {
			static: {
				directory: '/process/cwd/sample'
			},
			compress: true
		} );
	} );

	it( 'defines the development mode by default for an HTTP server', () => {
		const config = getWebpackConfigServer( { cwd } );

		expect( config.mode ).toEqual( 'development' );
	} );

	it( 'defines the production mode for an HTTP server', () => {
		const config = getWebpackConfigServer( { cwd, production: true } );

		expect( config.mode ).toEqual( 'production' );
	} );

	describe( 'sample language', () => {
		it( 'passes the specified language directly to source file', () => {
			getWebpackConfigServer( { cwd, language: 'en' } );

			expect( stubs.definePlugin ).toHaveBeenCalledTimes( 1 );
			expect( stubs.definePlugin ).toHaveBeenCalledWith( {
				EDITOR_LANGUAGE: '"en"'
			} );
		} );

		it( 'enables producing translations for non-English editors', () => {
			getWebpackConfigServer( { cwd, language: 'pl' } );

			expect( stubs.definePlugin ).toHaveBeenCalledTimes( 1 );
			expect( stubs.definePlugin ).toHaveBeenCalledWith( {
				EDITOR_LANGUAGE: '"pl"'
			} );

			expect( CKEditorTranslationsPlugin ).toHaveBeenCalledTimes( 1 );
			expect( CKEditorTranslationsPlugin ).toHaveBeenCalledWith( {
				language: 'pl',
				sourceFilesPattern: /src[/\\].+\.[jt]s$/
			} );
		} );
	} );
} );
