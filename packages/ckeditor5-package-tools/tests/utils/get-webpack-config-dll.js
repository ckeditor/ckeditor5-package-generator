/**
 * @license Copyright (c) 2020-2021, CKSource - Frederico Knabben. All rights reserved.
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
				existsSync: sinon.stub()
			},
			path: {
				join: sinon.stub().callsFake( ( ...chunks ) => chunks.join( '/' ) )
			},
			devUtils: {
				styles: {
					getPostCssConfig: sinon.stub()
				}
			},
			getThemePath: sinon.stub(),
			webpack: sinon.stub(),
			dllReferencePlugin: sinon.stub(),
			providePlugin: sinon.stub(),
			devWebpackPlugin: sinon.stub()
		};

		stubs.webpack.DllReferencePlugin = function( ...args ) {
			return stubs.dllReferencePlugin( ...args );
		};
		stubs.webpack.ProvidePlugin = function( ...args ) {
			return stubs.providePlugin( ...args );
		};

		stubs.fs.existsSync.returns( false );

		mockery.registerMock( 'fs', stubs.fs );
		mockery.registerMock( 'path', stubs.path );
		mockery.registerMock( 'webpack', stubs.webpack );
		mockery.registerMock( '@ckeditor/ckeditor5-dev-utils', stubs.devUtils );
		mockery.registerMock( '@ckeditor/ckeditor5-dev-webpack-plugin', stubs.devWebpackPlugin );
		mockery.registerMock( './get-theme-path', stubs.getThemePath );

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

		expect( stubs.devWebpackPlugin.calledOnce ).to.equal( true );
		expect( stubs.devWebpackPlugin.firstCall.firstArg ).to.deep.equal( {
			additionalLanguages: 'all',
			language: 'en',
			skipPluralFormFunction: true,
			sourceFilesPattern: /^src[/\\].+\.js$/
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

	describe( 'loaders', () => {
		let webpackConfig;

		beforeEach( () => {
			stubs.getThemePath.returns( '/process/cwd/node_modules/@ckeditor/ckeditor5-theme/theme/theme.css' );
			stubs.devUtils.styles.getPostCssConfig.returns( { foo: true } );

			webpackConfig = getWebpackConfigDll( { cwd } );
		} );

		describe( '*.svg', () => {
			let loader;

			beforeEach( () => {
				loader = webpackConfig.module.rules.find( loader => loader.test.toString().includes( 'svg' ) );

				expect( loader ).is.an( 'object' );
			} );

			it( 'uses "raw-loader" for providing files', () => {
				expect( loader.use ).to.deep.equal( [ 'raw-loader' ] );
			} );

			it( 'loads paths that end with the ".svg" suffix', () => {
				expect( '/Users/ckeditor/ckeditor5-foo/theme/icons/ckeditor.svg' ).to.match( loader.test );
				expect( 'C:\\Users\\ckeditor\\ckeditor5-foo\\theme\\icons\\ckeditor.svg' ).to.match( loader.test );

				expect( '/Users/ckeditor/ckeditor5-foo/theme/icons/ckeditor.css' ).to.not.match( loader.test );
				expect( 'C:\\Users\\ckeditor\\ckeditor5-foo\\theme\\icons\\ckeditor.css' ).to.not.match( loader.test );
			} );
		} );

		describe( '*.css', () => {
			let loader;

			beforeEach( () => {
				loader = webpackConfig.module.rules.find( loader => loader.test.toString().includes( 'css' ) );

				expect( loader ).is.an( 'object' );
				expect( loader.use ).is.an( 'array' );
				expect( loader.use ).to.lengthOf( 3 );
			} );

			// Webpack processes loaders from the bottom, to the top. Hence, "postcss-loader" will be called as the first one.
			it( 'uses "postcss-loader" for processing CKEditor 5 assets', () => {
				expect( stubs.getThemePath.calledOnce ).to.equal( true );
				expect( stubs.getThemePath.firstCall.args[ 0 ] ).to.equal( '/process/cwd' );

				expect( stubs.devUtils.styles.getPostCssConfig.calledOnce ).to.equal( true );
				expect( stubs.devUtils.styles.getPostCssConfig.firstCall.firstArg ).to.deep.equal( {
					minify: true,
					themeImporter: {
						themePath: '/process/cwd/node_modules/@ckeditor/ckeditor5-theme/theme/theme.css'
					}
				} );

				const postcssLoader = loader.use.slice( -1 ).pop();

				expect( postcssLoader ).to.be.an( 'object' );

				expect( postcssLoader ).to.haveOwnProperty( 'loader' );
				expect( postcssLoader.loader ).to.equal( 'postcss-loader' );

				expect( postcssLoader ).to.haveOwnProperty( 'options' );
				expect( postcssLoader.options ).to.deep.equal( {
					postcssOptions: { foo: true }
				} );
			} );

			it( 'uses "css-loader" to resolve imports from JS files', () => {
				const cssLoader = loader.use.slice( 1, -1 ).pop();

				expect( cssLoader ).to.equal( 'css-loader' );
			} );

			it( 'uses "style-loader" for injecting processed styles on a page', () => {
				const styleLoader = loader.use.slice( 0 ).shift();

				expect( styleLoader ).to.haveOwnProperty( 'loader' );
				expect( styleLoader.loader ).to.equal( 'style-loader' );

				expect( styleLoader ).to.haveOwnProperty( 'options' );
				expect( styleLoader.options ).to.deep.equal( {
					injectType: 'singletonStyleTag',
					attributes: {
						'data-cke': true
					}
				} );
			} );

			it( 'loads paths that end with the ".css" suffix', () => {
				expect( '/Users/ckeditor/ckeditor5-foo/theme/icons/ckeditor.css' ).to.match( loader.test );
				expect( 'C:\\Users\\ckeditor\\ckeditor5-foo\\theme\\icons\\ckeditor.css' ).to.match( loader.test );

				expect( '/Users/ckeditor/ckeditor5-foo/theme/icons/ckeditor.html' ).to.not.match( loader.test );
				expect( 'C:\\Users\\ckeditor\\ckeditor5-foo\\theme\\icons\\ckeditor.html' ).to.not.match( loader.test );
			} );
		} );
	} );
} );
