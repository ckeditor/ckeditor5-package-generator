/**
 * @license Copyright (c) 2020-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const mockery = require( 'mockery' );
const sinon = require( 'sinon' );
const expect = require( 'chai' ).expect;

describe( 'lib/utils/get-webpack-config-dll', () => {
	let getWebpackConfigDll, stubs;

	const cwd = '/process/cwd';

	beforeEach( () => {
		mockery.enable( {
			useCleanCache: true,
			warnOnReplace: false,
			warnOnUnregistered: false
		} );

		stubs = {
			packageJson: {
				name: '@ckeditor/ckeditor5-foo'
			},
			ckeditor5manifest: {
				name: 'CKEditor5.dll',
				content: {}
			},
			fs: {
				existsSync: sinon.stub(),
				readdirSync: sinon.stub()
			},
			path: {
				join: sinon.stub().callsFake( ( ...chunks ) => chunks.join( '/' ) )
			},
			webpack: sinon.stub(),
			dllReferencePlugin: sinon.stub(),
			providePlugin: sinon.stub(),
			devTranslations: {
				CKEditorTranslationsPlugin: sinon.stub()
			},
			webpackUtils: {
				loaderDefinitions: {
					raw: sinon.stub(),
					styles: sinon.stub(),
					typescript: sinon.stub()
				}
			}
		};

		stubs.webpackUtils.loaderDefinitions.raw.returns( 'raw-loader' );
		stubs.webpackUtils.loaderDefinitions.typescript.returns( 'typescript-loader' );
		stubs.webpackUtils.loaderDefinitions.styles.withArgs( cwd ).returns( 'styles-loader' );

		stubs.webpack.DllReferencePlugin = function( ...args ) {
			return stubs.dllReferencePlugin( ...args );
		};
		stubs.webpack.ProvidePlugin = function( ...args ) {
			return stubs.providePlugin( ...args );
		};

		stubs.fs.existsSync.returns( false );
		stubs.fs.readdirSync.withArgs( '/process/cwd/src' ).returns( [
			'index.js',
			'myplugin.js'
		] );

		mockery.registerMock( 'fs', stubs.fs );
		mockery.registerMock( 'path', stubs.path );
		mockery.registerMock( 'webpack', stubs.webpack );
		mockery.registerMock( './webpack-utils', stubs.webpackUtils );
		mockery.registerMock( '@ckeditor/ckeditor5-dev-translations', stubs.devTranslations );

		mockery.registerMock( '/process/cwd/node_modules/ckeditor5/build/ckeditor5-dll.manifest.json', stubs.ckeditor5manifest );
		mockery.registerMock( '/process/cwd/package.json', stubs.packageJson );

		getWebpackConfigDll = require( '../../lib/utils/get-webpack-config-dll' );
	} );

	afterEach( () => {
		sinon.restore();
		mockery.disable();
	} );

	it( 'should be a function', () => {
		expect( getWebpackConfigDll ).to.be.a( 'function' );
	} );

	it( 'uses correct loaders', () => {
		const config = getWebpackConfigDll( { cwd } );

		expect( config.module.rules ).to.deep.equal( [
			'raw-loader',
			'styles-loader',
			'typescript-loader'
		] );
	} );

	it( 'resolves correct file extensions', () => {
		const config = getWebpackConfigDll( { cwd } );

		expect( config.resolve.extensions ).to.deep.equal( [ '.ts', '...' ] );
	} );

	it( 'processes the "index.js" file', () => {
		const config = getWebpackConfigDll( { cwd } );

		expect( config.entry ).to.equal( '/process/cwd/src/index.js' );
		expect( config.output ).to.deep.equal( {
			path: '/process/cwd/build',
			filename: 'foo.js',
			libraryTarget: 'window',
			library: [ 'CKEditor5', 'foo' ]
		} );
	} );

	it( 'processes the "index.ts" file', () => {
		stubs.fs.readdirSync.withArgs( '/process/cwd/src' ).returns( [
			'index.ts',
			'myplugin.ts'
		] );

		const config = getWebpackConfigDll( { cwd } );

		expect( config.entry ).to.equal( '/process/cwd/src/index.ts' );
		expect( config.output ).to.deep.equal( {
			path: '/process/cwd/build',
			filename: 'foo.js',
			libraryTarget: 'window',
			library: [ 'CKEditor5', 'foo' ]
		} );
	} );

	it( 'loads "process" polyfill for webpack 5', () => {
		getWebpackConfigDll( { cwd } );

		expect( stubs.providePlugin.calledOnce ).to.equal( true );
		expect( stubs.providePlugin.firstCall.firstArg ).to.be.an( 'object' );
		expect( stubs.providePlugin.firstCall.firstArg ).to.have.property( 'process', 'process/browser' );
	} );

	it( 'loads "Buffer" polyfill for webpack 5', () => {
		getWebpackConfigDll( { cwd } );

		expect( stubs.providePlugin.calledOnce ).to.equal( true );
		expect( stubs.providePlugin.firstCall.firstArg ).to.be.an( 'object' );
		expect( stubs.providePlugin.firstCall.firstArg ).to.have.property( 'Buffer' );
		expect( stubs.providePlugin.firstCall.firstArg.Buffer ).to.deep.equal( [ 'buffer', 'Buffer' ] );
	} );

	it( 'allows watching source files', () => {
		const config = getWebpackConfigDll( { cwd, watch: true } );

		expect( config.watch ).to.equal( true );
	} );

	it( 'produces translation files based on "*.po" files', () => {
		stubs.fs.existsSync.returns( true );

		getWebpackConfigDll( { cwd } );

		expect( stubs.fs.existsSync.calledOnce ).to.equal( true );
		expect( stubs.fs.existsSync.firstCall.firstArg ).to.equal( '/process/cwd/lang/translations/en.po' );

		expect( stubs.devTranslations.CKEditorTranslationsPlugin.calledOnce ).to.equal( true );
		expect( stubs.devTranslations.CKEditorTranslationsPlugin.firstCall.firstArg ).to.deep.equal( {
			additionalLanguages: 'all',
			language: 'en',
			skipPluralFormFunction: true,
			sourceFilesPattern: /^src[/\\].+\.[jt]s$/
		} );
	} );

	describe( 'verifying exposed DLL names', () => {
		it( 'returns "foo" for a window key and a file name for the "@ckeditor/ckeditor5-foo" package', () => {
			const webpackConfig = getWebpackConfigDll( { cwd } );

			expect( webpackConfig.output.filename ).to.equal( 'foo.js' );
			expect( webpackConfig.output.library ).to.deep.equal( [ 'CKEditor5', 'foo' ] );
		} );

		it( 'returns "fooBar" for a window key and "foo-bar" a file name for the "@ckeditor/ckeditor5-foo-bar" package', () => {
			stubs.packageJson.name = '@ckeditor/ckeditor5-foo-bar';

			const webpackConfig = getWebpackConfigDll( { cwd } );

			expect( webpackConfig.output.filename ).to.equal( 'foo-bar.js' );
			expect( webpackConfig.output.library ).to.deep.equal( [ 'CKEditor5', 'fooBar' ] );
		} );
	} );
} );
